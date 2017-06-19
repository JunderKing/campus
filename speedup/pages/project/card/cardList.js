Page({
  data:{
    projId: 0,
    isUser: 0
  },
  onLoad: function(options){
    this.setData({
      projId: parseInt(options.projId),
      isUser: parseInt(options.isUser)
    })
  },
  onShow: function(){
    this.updateCardList()
  },
  updateCardList: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/speedup/getProjCardList',
      method: 'GET',
      data: {
        projId: this.data.projId
      },
      success: function(res){
        console.log('projCardList=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData({
          cardList: res.data.cardList
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})
