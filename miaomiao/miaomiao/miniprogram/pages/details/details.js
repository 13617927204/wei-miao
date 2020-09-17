// miniprogram/pages/details/details.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    isFirend:false,
    isMe:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.userId
    //判断是否是本人进入自己的详情页
      if(id===app.userInfo._id){
        this.setData({
          isFirend:true,
          isMe:true
        })
      }
        // 判断是否为好友
      db.collection("users").doc(app.userInfo._id).field({
        firendList:true
      }).get().then(res=>{
        console.log(res.data.firendList)
        let list = res.data.firendList
        if(list.length){
          for(var i =0;i<list.length;i++){
            if(list[i]===id){
              this.setData({
                isFirend:true
              })
            }
          }
        }
      })
    // 取出该用户的信息
    db.collection("users").doc(id).get().then(res=>{
      this.setData({
        data:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(app.userInfo)

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

  //添加好友
  handleAdd(ev){
    // console.log(ev.target.id)
    // 判断用户是否登录
    if(app.userInfo._id){// 已登录
      let id = ev.target.id
      // 检验数据库中是否有该用户的记录
      db.collection("messages").where({
        userId:id
      }).get().then(res=>{
        if(res.data.length){//更新
          // console.log(res.data)
          // 判断是否已经发送过好友申请
          var isShow = false // 假设没有发送过好友申请
          for(var i =0;i<res.data[0].list.length;i++){
            if(res.data[0].list[i]===app.userInfo._id){
              isShow = true;//检测到已经发送过好友信息了
              break
            }
          }
          if(isShow){//已发送过添加信息
            wx.showToast({
              title: '已发送申请!',
            })
          }else{//未发送过添加信息
            wx.cloud.callFunction({
              name:"update",
              data:{
                collection:"messages",
                where:{// 查询条件
                  userId:id
                },
                data:`{list:_.unshift(['${app.userInfo._id}'])}`
              }
            }).then(res=>{
              // console.log(res)
              wx.showToast({
                title: '已发送申请~',
              })
            })
          }
        }else{// 创建
          db.collection("messages").add({
            data:{
              userId:ev.target.id,
              list:[app.userInfo._id]
            }
          }).then(res=>{
            // console.log(res)
            wx.showToast({
              title: '已发送申请.',
            })
          })
        }
      })
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
  }
})