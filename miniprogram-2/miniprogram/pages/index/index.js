//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    books: [],
    pageNum: 0,
    pageSize: 3,
    isFinish: false,
  },
  onPullDownRefresh() {
    console.log("refresh")
    this.getBooks(true)
   },
  onReachBottom() {
    console.log("加载更多")
    if (this.data.isFinish) {
      return
    }
    this.setData({
      pageNum: this.data.pageNum + 1
    }, () => {
      this.getBooks()
    })
  },
  getBooks(isInit) {
    if(isInit){
      this.setData({
        pageNum: 0
      })
    }
    wx.showLoading({
      title: '"加载中"',
    })
    let data = db.collection("douban_books")
      .orderBy('createTime', 'desc');
    if (this.data.pageNum > 0) {
      data = data.skip(this.data.pageNum * this.data.pageSize)
    }

    data.limit(this.data.pageSize).get({
      success: (res) => {
        console.log(res.data, res.data.length)
        if (res.data.length != this.data.pageSize) {
          this.setData({
            isFinish: true
          })
        }

        if (!isInit) {
          this.setData({
            books: [...this.data.books, ...res.data]
          })
        } else {
          this.setData({
            books: res.data
          })
        }
      },
      complete: (res) => {
        wx.hideLoading()
      }
    })
  },
  onLoad: function () {
    this.getBooks(true)
  },

})
