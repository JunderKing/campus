Page({
  data:{
    projId: 0,
    isUser: 0,
    title: '',
    intro: '',
    hidden: 1,
  },

  onLoad: function(options){
    this.setData({
      projId: parseInt(options.projId),
      isUser: parseInt(options.isMember),
      hidden: parseInt(options.hidden)
    })
  },

  onShow: function(options){
    this.updProjInfo()
  },

  updProjInfo: function(){
    var that = this
    if (getApp().gdata.curProjId !== this.data.projId) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 10000
      })
    }
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/getProjInfo',
      method: 'GET',
      data: {
        projId: this.data.projId
      },
      success: function(res){
        console.log('getUserProjInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var cityCode = parseInt(res.data.projInfo.province)
        res.data.projInfo.province = getApp().getCityStr(cityCode)
        that.setData(res.data.projInfo)
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})

