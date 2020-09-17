// miniprogram/pages/user/personalDetails/head/head.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    isShow:false//用户是否上传了头像
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
    this.setData({
      img:app.userInfo.userPhoto
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

  // 选择头像
  handleImg(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=> {
        // console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        // console.log(tempFilePaths)
        this.setData({
          img:tempFilePaths,
          isShow:true
        })
      }
    })
  },
  // 自定义上传头像
  handleBtn(){
    // 判断用户是否上传了头像，如果没有上传头像，提示用户上传头像
    if(!this.data.isShow){
      wx.showToast({
        title: '请先上传头像',
      })
      return
    }
    wx.showLoading({
      title: '上传中',
    })
    wx.cloud.uploadFile({
      cloudPath: "user/"+ app.userInfo.username + Date.now() + '.jpg', // 上传至云端的路径
      filePath: this.data.img, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        // console.log(res.fileID)
        this.setData({
          img:res.fileID,
          isShow:false
        })
        db.collection("users").doc(app.userInfo._id).update({
          data:{
            userPhoto:res.fileID
          }
        }).then(res=>{
          app.userInfo.userPhoto = this.data.img
          console.log(app.userInfo.userPhoto)
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
          })
        })
      },
      fail: console.error
    })
  },
  // 使用微信头像
  bindGetUserInfo(ev){
    wx.showLoading({
      title: '上传中',
    })
    let userInfo = ev.detail.userInfo
    this.setData({
      img:userInfo.avatarUrl
    })
    db.collection("users").doc(app.userInfo._id).update({
      data:{
        userPhoto:userInfo.avatarUrl
      }
    }).then(res=>{
      app.userInfo.userPhoto =userInfo.avatarUrl
      wx.hideLoading()
      wx.showToast({
        title: '上传成功',
      })
    })
  }
})