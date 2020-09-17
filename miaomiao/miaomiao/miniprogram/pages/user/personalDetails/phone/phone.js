// miniprogram/pages/user/personalDetails/phone/phone.js
const db = wx.cloud.database()
const app = getApp()
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
    // 取出数据库的相应数据，渲染到页面
    db.collection("users").doc(app.userInfo._id).get().then(res=>{
      // console.log(res.data.phoneNumber)
      this.setData({
        value:res.data.phoneNumber
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

  // 修改手机号
  submit(ev){
    wx.showLoading({
      title: '更新中',
    })
    // console.log(ev.detail.value.phone)
    this.setData({
      value:ev.detail.value.phone
    })
    db.collection("users").doc(app.userInfo._id).update({
      data:{
        phoneNumber:this.data.value
      }
    }).then(res=>{
      wx.hideLoading()
      wx.showToast({
        title: '更新完成',
      })
      // setTimeout(()=>{
      //   wx.navigateTo({
      //     url: '../personalDetails',
      //   })
      // },1000)
      // console.log(res)
    })
  }
})