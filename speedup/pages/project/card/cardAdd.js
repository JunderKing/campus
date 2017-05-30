Page({
  data:{
    gridId: 0
  },

  onLoad: function(options){
    this.setData({
      gridId: parseInt(options.gridId)
    })
  },

  formSubmit: function(e){
    var formData = e.detail.value
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/speedup/addCard',
      method: 'POST',
      data: {
        gridId: this.data.gridId,
        title: formData.title,
        assumption: formData.assumption
      },
      success: function(res){
        console.log('addCard=>')
        console.log(res)
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
