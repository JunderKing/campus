Page({
  data:{
    projList: []
  },

  onLoad: function(options){
  },

  onShow: function(){
    var that = this
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/venture/getMeetProjList',
      method: 'POST',
      data: {
        userId: getApp().gdata.userId
      },
      success: function(res){
        wx.hideToast()
        console.log('getMeetProjList=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData({
          projList: res.data.projList
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  scanCode: function(){
    getApp().qrScan()
  },
})
