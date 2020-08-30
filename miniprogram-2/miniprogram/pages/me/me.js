// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },
  onUserInfo(event){
    console.log(event)
    this.data.userInfo = event.detail.userInfo
    wx.cloud.callFunction({
      name:"login",
      complete:res=>{
        console.log(res.result)
        this.data.userInfo.openid = res.result.openid
        console.log(this.data.userInfo)
        this.setData(this.data)
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