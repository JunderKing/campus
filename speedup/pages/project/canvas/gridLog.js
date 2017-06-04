Page({
  data:{
    logoList: [{
      content: 'history',
      utime: '20160512'
    }]
  },
  onLoad: function(options){
    this.setData({
      gridId: parseInt(options.gridId)
    })
  },
  onShow: function(){
    this.updateLogList()
  },
  updateLogList: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://localhost/campusvc/public/api/speedup/getGridLog',
      method: 'GET',
      data: {
        gridId: this.data.gridId
      },
      success: function(res){
        console.log('getGridLog=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData({
          logList: res.data.logList
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})
