Page({
  data:{
    isUser: 0,
    cardId: 0
  },
  onLoad: function(options){
    this.setData({
      cardId: parseInt(options.cardId),
      isUser: parseInt(options.isUser)
    })
  },
  onShow: function(){
    this.getCardInfo()
  },
  getCardInfo: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/speedup/getCardInfo',
      method: 'GET',
      data: {
        cardId: this.data.cardId
      },
      success: function(res){
        console.log('cardInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData(res.data.cardInfo)
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },
  delCard: function(){
    var that = this
    wx.showToast({
      title: '处理中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/speedup/delCard',
      method: 'GET',
      data: {
        cardId: this.data.cardId
      },
      success: function(res){
        console.log('gridCardList=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.navigateBack();
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})
