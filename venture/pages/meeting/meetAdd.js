Page({
  data: {
    meetId: 0,
    addr: '',
    logo: '/img/icon/add.png'
  },

  onLoad: function(options){
    this.setData({
      meetId: options.meetId
    })
  },

  onPickerChange: function(e) {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    this.setData({
      [key]: value
    })
  },

  formSubmit: function(e) {
    var formData = e.detail.value
    console.log(formData)
    var isCorrect = this.checkForm(formData)
    if (!isCorrect) {
      return
    }
    var that = this
    wx.showToast({
      title: '提交中……',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    wx.uploadFile({
      url: "http://www.campus.com/api/venture/addInvor",
      filePath: this.data.logo,
      name: 'meetLogo',
      formData: {
        userId: getApp().gdata.userId,
        meetId: that.data.meetId,
        name: formData.name,
        intro: formData.intro,
        company: formData.company,
        position: formData.position,
        addr: formData.addr
      },
      success: function(res){
        wx.hideToast()
        console.log('addInvor=>')
        console.log(res)
        res.data = JSON.parse(res.data)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.navigateBack();
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  checkForm: function(data){
    if (!data.name) {
      wx.showToast({title: '请填写创投会标题!'})
    } else if (!data.sponsor) {
      wx.showToast({title: '请填写主办方名称!'})
    } else if (!this.data.logo) {
      wx.showToast({title: '请选择主办方logo!'})
    } else if (data.startDate === '请选择日期') {
      wx.showToast({title: '请选择创投会开始日期!'})
    } else if (data.startTime === '请选择时间') {
      wx.showToast({title: '请选择创投会开始时间!'})
    } else if (data.endDate === '请选择日期') {
      wx.showToast({title: '请选择创投会结束日期!'})
    } else if (data.endTime === '请选择时间') {
      wx.showToast({title: '请选择创投会结束时间!'})
    } else if (!data.addr) {
      wx.showToast({title: '请输入创投会地址!'})
    } else if (!data.intro) {
      wx.showToast({title: '请填写创投会简介!'})
    } else {
      return true
    }
  },

  chooseLogo: function(e) {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function(res){
        console.log(res)
        that.setData({
          logo: res.tempFilePaths[0],
        })
      }
    })
  },

  chooseAddr: function(e) {
    wx.navigateTo({
      url: "/pages/include/map"
    })
  }
})
