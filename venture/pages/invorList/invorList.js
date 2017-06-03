Page({
  data:{
    invorList: []
  },

  onShow: function(){
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/venture/getMeetInvorList',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId
      },
      success: function(res){
        wx.hideToast()
        console.log('getMeetInvorList=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData({
          invorList: res.data.invorList
        })
      }
    })
  }
})
