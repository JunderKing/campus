Page({
  data:{
    projId: 0,
    recId: 0,
    date: 0,
    isUser: 0
  },

  onLoad: function(options){
    this.setData({
      projId: parseInt(options.projId),
      recId: parseInt(options.recId),
      isUser: parseInt(options.isUser)
    })
  },

  onShow: function(){
    this.updateRecInfo()
  },

  updateRecInfo: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/getRecInfo',
      method: 'GET',
      data: {
        recId: this.data.recId
      },
      success: function(res){
        console.log('getRecInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var timestamp = res.data.recInfo.date * 1000
        var date = new Date()
        date.setTime(timestamp)
        res.data.recInfo.date = date.toLocaleDateString()
        that.setData(res.data.recInfo)
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  delRecord: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/delRecord',
      method: 'GET',
      data: {
        recId: this.data.recId
      },
      success: function(res){
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.navigateBack()
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})
