// miniprogram/pages/user/user.js
// 取出全局变量
const app = getApp()

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    username:"沈安",
    userPhoto:"../../images/user/user-unlogin.png",
    isShow:false,
    disabled:true // 是否禁用按钮
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
    // 获取经纬度的函数应写在页面渲染的生命周期函数当中
    this.getLocation()
    // 判断用户是否已经登录过
    wx.cloud.callFunction({
      name:"login",
      data:{}
    }).then(res=>{
      // console.log(res.result)

      // 利用获取的openid查询数据库，判断是否登陆过
      db.collection("users").where({
        _openid:res.result.openid
      }).get().then(res=>{
        if(res.data.length){// 数据库里面查询到了数据
          // console.log(res.data[0])
          // 拷贝res.data的数据存储到全局状态中
          app.userInfo = Object.assign(app.userInfo,res.data[0])
          // 重新定位当前用户的经纬度，更新数据库中的数据
          this.getLocation()
          db.collection("users").doc(app.userInfo._id).update({
            data:{
              longitude:this.longitude,//当前位置经度
              latitude:this.latitude,//当前位置纬度
              location: db.Geo.Point(this.longitude , this.latitude),// 位置索引
            }
          }).then(res=>{

          })
          this.setData({
            isShow:true,
            userPhoto:app.userInfo.userPhoto,
            username: app.userInfo.username,
            userId:app.userInfo._id
          })
          this.monitor()
        }else{// 数据库里面未查询到了数据
          this.setData({
            disabled:false
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      username:app.userInfo.username,
      userPhoto:app.userInfo.userPhoto
    })
    // console.log(app.userInfo)
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

  /////////////////////////////////// 获取用户数据
  bindGetUserInfo(ev){
    // console.log(ev.detail.userInfo)
   
    let userInfo = ev.detail.userInfo
    if(!this.data.isShow && userInfo){
      
      db.collection("users").add({
       data:{
        username:userInfo.nickName,
        userPhoto:userInfo.avatarUrl,
        signature:"",
        phoneNumber:"",
        weixinNumber:"",
        link:0,
        time:new Date(),
        isLocation:true,
        longitude:this.longitude,//当前位置经度
        latitude:this.latitude,//当前位置纬度
        location: db.Geo.Point(this.longitude , this.latitude),// 位置索引
        firendList:[]
       }
      }).then((res)=>{
        // console.log(res._id)
        db.collection("users").doc(res._id).get().then((res)=>{
          // console.log(res.data)
          // 拷贝res.data的数据存储到全局状态中
          app.userInfo = Object.assign(app.userInfo, res.data)
          // console.log(app.userInfo)
          this.setData({
            isShow:true,
            userPhoto:app.userInfo.userPhoto,
            username: app.userInfo.username,
            disabled:true
          })
          this.monitor()
        })
      }).catch((err)=>{
        console.log(err)
      })
    }
  },
  ///建立数据监听
  monitor(){
    const watcher = db.collection('messages').where({
      userId:app.userInfo._id
    }).watch({
      onChange: function(snapshot) {
        if(snapshot.docChanges.length){
          let list = snapshot.docChanges[0].doc.list
          // console.log(list)
          if(list.length){//有好友申请未处理
            wx.showTabBarRedDot({
              index: 2,
            })
            // 将未读数据存储到全局状态中
            app.userMessage = list
          }else{
            wx.hideTabBarRedDot({
              index: 2,
            })
            app.userMessage = list
          }
        }else{

        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
    // 获取当前经纬度,
    getLocation(){
      wx.getLocation({
        type: 'gcj02',
        success: (res)=> {
           this.latitude = res.latitude
           this.longitude = res.longitude
        }
       })
    }
})