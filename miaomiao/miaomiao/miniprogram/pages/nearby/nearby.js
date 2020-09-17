// miniprogram/pages/nearby/nearby.js
const db = wx.cloud.database()
const app=getApp()
const _ =db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[],
    latitude:'',//纬度
    longitude:''// 经度
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
    this.isLogin()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.isLogin()
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
  // 获取当前经纬度,
  getLocation(){
    wx.getLocation({
      type: 'gcj02',
      success: (res)=> {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(latitude)
        console.log(longitude)
        this.setData({
          latitude:latitude,
          longitude:longitude
        })
        this.getUser()
      }
     })
  },
  //获取附近用户的位置
  getUser(){
    db.collection("users").where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000,
      }),
      isLocation:true
    }).field({
      latitude:true,
      longitude:true,
      userPhoto:true
    }).get().then(res=>{
      // console.log(res.data)
      let message = res.data.map(item=>{
        return {
          iconPath: item.userPhoto,
          id: item._id,
          latitude: item.latitude,
          longitude: item.longitude,
          width: 30,
          height: 30
        }
      })
      this.setData({
        markers:message
      })
    })
  },
  // 跳转详情页
  markertap(ev){
    // console.log(ev.markerId)
    wx.navigateTo({
      url: '../details/details?userId=' + ev.markerId,
    })
  },
  // 判断是否已经登录
  isLogin(){
    if(!app.userInfo._id){
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../user/user',
        })
      },1000)
    }else{
       this.getLocation()
    }
  }
})