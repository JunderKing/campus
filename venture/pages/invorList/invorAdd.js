Page({
  data:{
    meetId: 0
  },

  onLoad: function(options){
    console.log('meeadd onload=>')
    console.log(options)
    this.setData({
      meetId: parseInt(options.meetId)
    })
  },

  formSubmit: function(e) {
    console.log('formSubmit=>')
    console.log(e)
    var userId = getApp().gdata.userId
    var formData = e.detail.value
    var isCorrect = this.checkForm(formData)
    if (!isCorrect) { return }
    var that = this
    wx.showToast({
      title: '提交中……',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: "https://www.kingco.tech/api/venture/addInvor",
      method: 'POST',
      data: {
        userId: userId,
        realName: formData.realName,
        company: formData.company,
        position: formData.position,
        intro: formData.intro,
        meetId: this.data.meetId
      },
      success: function(res){
        wx.hideToast()
        console.log('addInvor=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.switchTab({
          url: '/pages/invorList/invorList',
          success: function(){
            wx.showToast({
              title: '创建成功!'
            })
          }
        })
      },
      fail: function(res){
        getApp().showError(2)
      }
    })
  },

  checkForm: function(data){
    if (!data.realName) {
      wx.showToast({title: '请填写姓名!'})
    } else if (!data.company) {
      wx.showToast({title: '请填写所在公司名称!'})
    } else if (!data.position) {
      wx.showToast({title: '请填写职位名称!'})
    } else if (!data.intro) {
      wx.showToast({title: '请填写项目简介!'})
    } else {
      return true
    }
  }
})
