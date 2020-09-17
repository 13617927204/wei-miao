// miniprogram/pages/user/personalDetails/location/location.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1Checked:true
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
      this.setData({
        switch1Checked:res.data.isLocation
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
  /////////////////////////
  switch1Change(ev){
    console.log(ev.detail.value)
    db.collection("users").doc(app.userInfo._id).update({
      data:{
        isLocation:ev.detail.value
      }
    }).then(res=>{
      // console.log(res)
    })
  }
})