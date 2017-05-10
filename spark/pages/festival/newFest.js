Page({
  data: {
    sdate: '请选择日期',
    stime: '请选择时间',
    edate: '请选择日期',
    etime: '请选择时间',
    addr: '',
    logos: [],
    hasLogo: false
  },

  onPickerChange: function(e) {
    console.log(e)
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    if (key==='sdate') {this.setData({sdate: value})}
    if (key==='stime') {this.setData({stime: value})}
    if (key==='edate') {this.setData({edate: value})}
    if (key==='etime') {this.setData({etime: value})}
  },

  formSubmit: function(e) {
    console.log(e.detail.value)
    var uid = getApp().globalData.uid
    var formData = e.detail.value
    var isCorrect = this.checkForm(formData)
    if (!isCorrect) {
      return
    }
    var sTimeStr = formData.sdate + ' ' + formData.stime
    var stime = Date.parse(new Date(sTimeStr))/1000
    var eTimeStr = formData.edate + ' ' + formData.etime
    var etime = Date.parse(new Date(eTimeStr))/1000
    var reqData = {
      uid: uid,
      title: formData.title,
      intro: formData.intro,
      stime: stime,
      etime: etime,
      addr: formData.addr
    }
    console.log(reqData)
    var that = this
    wx.showLoading({
      title: '提交中……',
    })
    wx.uploadFile({
      url: "https://www.kingco.tech/index.php?s=/spark/festival/addFest",
      filePath: this.data.logos[0],
      name: 'file',
      formData: reqData,
      success: function(res){
        console.log(res)
        var festid = res.data
        getApp().globalData.curFestid = festid
        getApp().updateUserInfo()
        wx.navigateBack();
      },
      complete: function(res){
        wx.hideLoading()
      }
    })
  },
  
  checkForm: function(data){
    if (!data.title) {
      wx.showToast({title: '请填写火种节标题!'})
    } else if (!data.intro) {
      wx.showToast({title: '请填写火种节简介!'})
    } else if (!data.sdate) {
      wx.showToast({title: '请选择火种节开始日期!'})
    } else if (!data.stime) {
      wx.showToast({title: '请选择火种节开始时间!'})
    } else if (!data.edate) {
      wx.showToast({title: '请选择火种节结束日期!'})
    } else if (!data.etime) {
      wx.showToast({title: '请选择火种节结束时间!'})
    } else if (!data.addr) {
      wx.showToast({title: '请输入火种节地址!'})
    }else if (this.data.logos.length === 0) {
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
        console.log(res)
        that.setData({
          logos: res.tempFilePaths,
        })
        if (res.tempFilePaths.length > 0) {
          that.setData({
            hasLogo: true
          })
        } else {
          that.setData({
            hasLogo: false
          })
        }
      }
    })
  },

  chooseAddr: function(e) {
    wx.navigateTo({
      url: "/pages/include/map"
    })
  }
})
