// components/search/search.js
const db = wx.cloud.database()
const app = getApp()
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isBtn:false,
    isFocus:false,
    historyList:[],
    value:'',
    searchList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 输入框获取焦点
    handleFocus(){
      this.setData({
        isBtn:true,
        isFocus:true
      })
      // 取出本地存储中的搜索历史记录
      wx.getStorage({
        key: 'historySearch',
        success: (res)=> {
          // console.log(res.data)
          this.setData({
            isBtn:true,
            isFocus:true,
            historyList:res.data
          })
        }
      })
    },
    //返回
    handleCancel(){
      this.setData({
        isBtn:false,
        isFocus:false,
        value:'',
        searchList:[]
      })

    },
    //按下确认建
    confirm(ev){
      // console.log(ev.detail.value)
      let value = ev.detail.value
      if(value){
        let newHistoryList = [...this.data.historyList]
        newHistoryList.unshift(value)
         // 使用new Set()方法给数组去重
        newHistoryList = [...new Set(newHistoryList)]
        wx.setStorage({
          key:"historySearch",
          data:newHistoryList
        })
        this.setData({
          historyList:newHistoryList
        })
        this.changeSearch(value)
      }else{
        this.setData({
          searchList:[]
        })
      }
    },
    // 清除搜索的历史记录
    handleDelete(){
      wx.removeStorage({
        key: 'historySearch',
        success: (res)=> {
          // console.log(res)
          this.setData({
            historyList:[]
          })
        }
      })
    },
    // 搜索数据集数据
    changeSearch(value){
      db.collection("users").where({
        username: db.RegExp({
          regexp: value,
          options: 'i',
        })
      }).field({
        username:true,
        userPhoto:true,
      }).get().then(res=>{
        // console.log(res.data)
        this.setData({
          searchList:res.data
        })
      })
    },
    // 历史记录的使用
    handleHistory(ev){
      console.log(ev.target.dataset.text)
      let value = ev.target.dataset.text
      this.setData({
        value
      })
      this.changeSearch(value)
    },

    //跳转详情页
    handleNav(ev){
      let id = ev.currentTarget.id
      // console.log(ev.currentTarget.id)
      if(!app.userInfo._id){
        wx.showToast({
          title: '请先登录',
          icon:"none"
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '../../pages/user/user',
          })
        },1000)
      }else{
        wx.navigateTo({
          url: '../../pages/details/details?userId='+ id,
        })
      }
    }
  }
})
