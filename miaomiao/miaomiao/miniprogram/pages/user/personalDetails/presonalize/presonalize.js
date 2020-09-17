// miniprogram/pages/user/personalDetails/presonalize/presonalize.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:''
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
    db.collection("users").doc(app.userInfo._id).get().then(res=>{
      // console.log(res.data.signature)
      this.setData({
        value:res.data.signature
      })
    })
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

  },

  // 确认修改个性签名
  submit(ev){
    wx.showLoading({
      title: '更新中',
    })
    this.setData({
      value:ev.detail.value.presonalize
    })
    // console.log(ev.detail.value.presonalize)
    db.collection("users").doc(app.userInfo._id).update({
      data:{
        signature:this.data.value
      }
    }).then(res=>{
      app.userInfo.signature = this.data.value
      // console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '更新完成',
      })
      // setTimeout(()=>{
      //   wx.navigateTo({
      //     url: '../personalDetails',
      //   })
      // },1000)
    })
  }
})