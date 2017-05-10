Page({
  data: {
    projid: 0,
    cmntid: 0,
    tscore: 0,
    ascore: 0,
    bscore: 0,
    cscore: 0,
    content: '',
  },

  onLoad: function(options){
    this.setData({
      projid: parseInt(options.projid),
    })
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    this.getMentorCmnt()
  },

  getMentorCmnt: function(){
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/comment/getMentorCmnt',
      method: 'POST',
      data: {
        uid: getApp().globalData.uid,
        projid: this.data.projid
      },
      success: function(res){
        if (res.data) {
          that.setData({
            cmntid: res.data.cmntid,
            content: res.data.content,
            tscore: res.data.tscore,
            ascore: res.data.ascore,
            bscore: res.data.bscore,
            cscore: res.data.cscore
          })
        }
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  },

  setScore: function(e){
    var field = e.currentTarget.dataset.name
    var score = parseInt(e.currentTarget.dataset.score)
    this.setData({
      [field]: score
    })
  },

  formSubmit: function(e){
    var formData = e.detail.value
    var reqData = {
      projid: this.data.projid,
      cmntid: this.data.cmntid,
      uid: getApp().globalData.uid,
      content: formData.content,
      tscore: this.data.tscore,
      ascore: this.data.ascore,
      bscore: this.data.bscore,
      cscore: this.data.cscore
    }
    if (!reqData.content) {
      wx.showToast({
        title: '评论不可为空',
        icon: 'loading'
      })
      return
    }
    if (!(reqData.tscore&&reqData.ascore&&reqData.bscore&&reqData.cscore)) {
      wx.showToast({
        title: '请打分',
        icon: 'loading'
      })
      return
    }
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/comment/addMentorCmnt',
      method: 'POST',
      data: reqData,
      success: function(res){
        console.log(res)
        wx.navigateBack()
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
      }
    })
  }
})
