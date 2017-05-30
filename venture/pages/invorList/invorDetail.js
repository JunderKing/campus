Page({
  data:{
    invorId: 0
  },
  onLoad: function(options){
    this.setData({
      invorId: options.invorId
    })
  },
  onShow: function(){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/venture/getInvorInfo',
      method: 'GET',
      data: {
        invorId: this.data.invorId
      },
      success: function(res){
        console.log('getInvorInfo=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData(res.data.invorInfo)
      }
    })
  }
})
