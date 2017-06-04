Page({
  data: {
    invorId: 0,
    scoreId: 0,
    score: 0,
    content: '',
  },

  onLoad: function(options){
    this.setData({
      invorId: parseInt(options.invorId),
    })
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading'
    })
    this.getInvorScore()
  },

  getInvorScore: function(){
    var that = this
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://localhost/campusvc/public/api/venture/getInvorScore',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId,
        invorId: this.data.invorId
      },
      success: function(res){
        console.log('getInvorScore=>')
        console.log(res.data)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }        
        wx.hideToast()
        that.setData(res.data.invorScore)
      },
      fail: function(){
        wx.hideToast()
      }
    })
  },

  setScore: function(e){
    var field = e.currentTarget.dataset.name
    console.log('field' + field)
    var score = parseInt(e.currentTarget.dataset.score)
    this.setData({
      [field]: score
    })
  },

  formSubmit: function(e){
    var formData = e.detail.value
    var isCorrect = this.checkForm(formData)
    if (!isCorrect) { return }
    wx.showToast({
      title: '提交中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: "http://localhost/campusvc/public/api/venture/updInvorScore",
      method: 'POST',
      data: {
        invorId: this.data.invorId,
        userId: getApp().gdata.userId,
        scoreId: this.data.scoreId,
        content: formData.content,
        score: this.data.score
      },
      success: function(res){
        console.log('addInvorScore=>')
        console.log(res.data)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }        
        wx.navigateBack()
        wx.showToast({
          title: '提交成功'
        })
      },
      fail: function(){
        return getApp().showError(2)
      }
    })
  },

  checkForm: function(data){
    if (!data.content) {
      wx.showToast({title: '评论不可为空'})
    } else if (!this.data.score) {
      wx.showToast({title: '请打分'})
    } else {
      return true
    }
  },
})

