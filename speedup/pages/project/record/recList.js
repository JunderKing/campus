Page({
  data: {
    isUser: 0,
    projId: 0,
    recList: []
  },

  onLoad: function(options){
    this.setData({
      projId: parseInt(options.projId),
      isUser: parseInt(options.isUser)
    })
  },

  onShow: function(){
    this.updateRecList();
  },

  updateRecList: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/getRecList',
      method: 'GET',
      data: {
        projId: this.data.projId
      },
      success: function(res){
        console.log('getRecList=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        res.data.recList.map(function(item){
          var timestamp = item.date * 1000
          var date = new Date()
          date.setTime(timestamp)
          item.date = date.toLocaleDateString()
          return item
        })
        that.setData({
          recList: res.data.recList
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  addRecord: function(){
    wx.navigateTo({
      url: "/pages/project/record/recForm?projId=" + this.data.projId
    })
  }
})
