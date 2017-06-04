Page({
  data: {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    logo: ''
  },

  onPickerChange: function(e) {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    this.setData({
      [key]: value
    })
  },

  formSubmit: function(e) {
    console.log(e.detail.value)
    var userId = getApp().gdata.userId
    var formData = e.detail.value
    var isCorrect = this.checkForm(formData)
    if (!isCorrect) { return }
    var startTimeStr = this.data.startDate + ' ' + this.data.startTime
    var startTime = Date.parse(new Date(startTimeStr))/1000
    var endTimeStr = this.data.endDate + ' ' + this.data.endTime
    var endTime = Date.parse(new Date(endTimeStr))/1000
    var that = this
    wx.showToast({
      title: '提交中……',
      icon: 'loading',
      duration: 10000
    })
    wx.uploadFile({
      url: "http://www.campus.com/api/spark/addFestival",
      filePath: this.data.logo,
      name: 'festLogo',
      formData: {
        userId: getApp().gdata.userId,
        name: formData.name,
        sponsor: formData.sponsor,
        startTime: startTime,
        endTime: endTime,
        addr: formData.addr,
        intro: formData.intro
      },
      success: function(res){
        wx.hideToast()
        console.log('addFestival=>')
        console.log(res)
        res.data = JSON.parse(res.data)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }        
        wx.navigateBack();
        wx.showToast({
          title: '创建成功'
        })
      },
      fail: function(){
        wx.hideToast()
      }
    })
  },

  checkForm: function(data){
    if (!data.name) {
      wx.showToast({title: '请填写火种节标题!'})
    } else if (!data.sponsor) {
      wx.showToast({title: '请填写火种节主办方!'})
    } else if (!data.intro) {
      wx.showToast({title: '请填写火种节简介!'})
    } else if (!this.data.startDate) {
      wx.showToast({title: '请选择火种节开始日期!'})
    } else if (!this.data.startTime) {
      wx.showToast({title: '请选择火种节开始时间!'})
    } else if (!this.data.endDate) {
      wx.showToast({title: '请选择火种节结束日期!'})
    } else if (!this.data.endTime) {
      wx.showToast({title: '请选择火种节结束时间!'})
    } else if (!data.addr) {
      wx.showToast({title: '请输入火种节地址!'})
    }else if (!this.data.logo) {
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
