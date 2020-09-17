// components/collPhoto/collPhoto.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    text:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlecall(){
      // console.log(this.data.text)
      // 拨打电话
      wx.makePhoneCall({
        phoneNumber: this.data.text //仅为示例，并非真实的电话号码
      })
    }
  }
})
