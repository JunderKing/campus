Page({
  data: {
    logo: '/img/icon/add2.png'
  },

  formSubmit: function(e) {
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
    wx.uploadFile({
      url: "http://www.campus.com/api/speedup/addCamp",
      filePath: this.data.logo,
      name: 'campLogo',
      formData: {
        userId: userId,
        name: formData.name,
        intro: formData.intro,
        sponsor: formData.sponsor
      },
      success: function(res){
        console.log('addCamp=>')
        console.log(res)
        wx.hideToast()
        res.data = JSON.parse(res.data)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        getApp().gdata.curCampId = res.data.campId
        wx.switchTab({
          url: '/pages/camp/camp'
        })
      },
      fail: function(){
        wx.hideToast()
        getApp().showError(2)
      }
    })
  },
  
  checkForm: function(data){
    if (!data.name) {
      wx.showToast({title: '请填写火种节标题!'})
    } else if (!data.intro) {
      wx.showToast({title: '请填写火种节简介!'})
    } else if (!data.sponsor) {
      wx.showToast({title: '请输入主办方名称!'})
    } else if (!this.data.logo) {
      wx.showToast({title: '请选择主办方logo!'})
    } else {
      return true
    }
  },

  chooseLogo: function(e) {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function(res){
        that.setData({
          logo: res.tempFilePaths[0]
        })
      }
    })
  }
})
