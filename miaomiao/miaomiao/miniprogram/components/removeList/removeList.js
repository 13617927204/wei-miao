// components/removeList/removeList.js
const db =wx.cloud.database()
const app =getApp()
const _ = db.command
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //删除消息
    handleRemove(){
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '提示',
        content: '确定删除消息？',
        success: (res)=> {
          if (res.confirm) {
            // console.log('用户点击确定')
            this.remove()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 同意好友申请
    handleAgree(){
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '提示',
        content: '确定通过好友申请？',
        success: (res)=> {
          if (res.confirm) {
            // 向用户自己的数据库中插入好友消息
            db.collection("users").doc(app.userInfo._id).update({
              data:{
                firendList:_.unshift([this.data.messageId])
              }
            }).then(res=>{
              // console.log(res)
              // 向用户好友数据库插入用户的消息
              wx.cloud.callFunction({
                name:"update",
                data:{
                  collection:"users",
                  doc:this.data.messageId,
                  data:`{firendList:_.unshift(['${app.userInfo._id}'])}`
                }
              }).then(res=>{
                // console.log(res)
                this.remove()
              })
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 删除好友申请
    remove(){
      db.collection("messages").where({
        userId:app.userInfo._id
      }).get().then(res=>{
        // console.log(res.data[0].list)
        let message = res.data[0].list
        message = message.filter((item)=>{
          return item != this.data.messageId
        })
        wx.cloud.callFunction({
          name:"update",
          data:{
            collection:"messages",
            where:{
              userId:app.userInfo._id
            },
            data:{
              list:message
            }
          }
        }).then(res=>{
          // 触发事件
          this.triggerEvent('myremove',message )
        })
      })
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      db.collection("users").doc(this.data.messageId).field({
        userPhoto:true,
        username:true
      }).get().then(res=>{
        this.setData({
          userMessage:res.data
        })
      })
    }
  }
})
