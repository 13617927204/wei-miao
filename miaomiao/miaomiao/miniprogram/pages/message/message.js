// miniprogram/pages/message/message.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr : [],
    isShow:false,
    isLogin:false
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
    // console.log(app.userMessage)
    if(app.userInfo._id){// 判断是否登录
      this.setData({
        dataArr:app.userMessage,
        isLogin:true
      })
      if(app.userMessage.length){
        this.setData({
          isShow:false,
        })
      }else{
        this.setData({
          isShow:true
        })
      }
    }else{
      // 未登录，跳转登录页面
      wx.showToast({
        title: '请先登录',
        icon:"none",
        success:()=>{
          setTimeout(()=>{
            wx.switchTab({
              url: '../user/user',
            })
          },1000)
        }
      })
    }

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
  handleMyremove(ev){
    // console.log(ev.detail) // 自定义组件触发事件时提供的detail对象
    this.setData({
      dataArr:[]
    },()=>{
      this.setData({
        dataArr:ev.detail
      })
      if(!this.data.dataArr.length){
        this.setData({
          isShow:true
        })
      }
    })
  }
})