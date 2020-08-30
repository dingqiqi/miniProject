// pages/me/me.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userInfo') || {}
  },
  addBook(bookInfo) {
    db.collection("douban_books").add({
      data: bookInfo
    }).then(res => {
      console.log(res)
      if (res._id) {
        wx.showModal({
          title: '系统提示',
          content: `<${bookInfo.title}>` + "添加成功",
          showCancel: false
        })
      }
    })
  },
  searchBook(isbn) {
    wx.cloud.callFunction({
      name: "getBook",
      data: {
        isbn: isbn
      },
      complete: (res) => {
        console.log(res.result)
        if (res.result.title) {
          this.addBook(res.result)
        } else {
          wx.showToast({
            title: '"图书查找失败"',
            icon: 'warn',
            duration: 1000
          })
        }
      }
    })
  },
  scanBook() {
    // this.addBook(9787040432022)
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        console.log(res.result)
        this.searchBook(res.result)
      },
      fail: (res) => {
        wx.showToast({
          title: '"扫码失败"',
          icon: 'warn',
          duration: 1000
        })
      }
    })
  },
  onUserInfo(event) {
    console.log(event)
    this.data.userInfo = event.detail.userInfo
    wx.cloud.callFunction({
      name: "login",
      complete: res => {
        console.log(res.result)
        this.data.userInfo.openid = res.result.openid
        console.log(this.data.userInfo)
        this.setData(this.data)
        wx.setStorageSync('userInfo', this.data.userInfo)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})