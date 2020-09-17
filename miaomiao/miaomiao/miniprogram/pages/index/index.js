// miniprogram/pages/index/index.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper:[
      "../../images/swiper/swiper1.jpg",
      "../../images/swiper/swiper2.jpg",
      "../../images/swiper/swiper3.jpg"
    ],
    datalist:[],
    choice:'link',
    isShow:true,
    isLink:false
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
    this.shuju()
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

  // 取出数据库数据函数
  shuju(){
    db.collection("users").field({
      userPhoto:true,
      username:true,
      _id:true,
      link:true
    }).orderBy(this.data.choice, 'desc').get().then(res=>{
      var newlist = []
      for(var i=0;i<res.data.length;i++){
        
        newlist[i] = {
          ...res.data[i],
          isLink:false // 在每个列表数据里面插入一个属性inLink,用来表示是否点赞
        }
      }
      this.setData({
        datalist:newlist
      })
      // console.log(this.data.datalist)
    })
  },
  //点赞功能 
  handleLink(ev){
    if(app.userInfo._id){// 判断是否登录
      // console.log(ev.target.dataset.index)
      let index = ev.target.dataset.index
      let id = ev.target.id
      var newdatalist  = this.data.datalist
      this.setData({
        isLink:newdatalist[index].isLink
      })
      console.log(this.data.isLink)
      newdatalist[index].isLink= !newdatalist[index].isLink
      // 判断之后是否已经点赞过，如果没有，则点赞数增加，反之点赞数减少
      if(!this.data.isLink){
        newdatalist[index].link= ++newdatalist[index].link
      }else{
        newdatalist[index].link= --newdatalist[index].link
      }
      this.setData({
        datalist:newdatalist
      })
      wx.cloud.callFunction({
        name: 'update',
        data: {
          collection:"users",
          doc:id,
          data: this.data.isLink ? "{link:_.inc(-1)}" :"{link:_.inc(1)}"
        }
      }).then(res=>{})
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

  // 切换顶部导航栏
  handleNarbar(ev){
    // console.log(ev.target.dataset.choice)
    let choice = ev.target.dataset.choice
    this.setData({
      choice
    },()=>{
      this.shuju()
    })
  },

  // 打开详情页
  handleDetails(ev){
    console.log(ev.target.id)
    let id = ev.target.id
    if(app.userInfo._id){
      wx.navigateTo({
        url: '../details/details?userId='+ id,
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../user/user',
        })
      },1000)
    }
  }
})