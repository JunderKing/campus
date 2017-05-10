Page({
  data: {
    festid: 0,
    projects: []
  },

  onShow: function(){
    this.updateProjList()
  },

  onShareAppMessage: function(){
    return {
      title: '火种节小程序',
      path: '/pages/project/project'
    }
  },

  updateProjList: function(){
    var festid = getApp().globalData.curFestid
    if (this.data.festid !== festid) {
      this.setData({festid: festid})
      wx.showLoading({
        title: '数据加载中...',
        mask: true
      })
    }
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/festival/getFestProjInfo',
      method: 'POST',
      data: {
        festid: festid
      },
      success: function(res){
        console.log('getFestProjInfo=>')
        console.log(res.data)
        that.setData({projects: res.data})
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  }
})
