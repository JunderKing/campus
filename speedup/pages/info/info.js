Page({
  data:{
    avatarUrl: '',
    nickName: '',
    role: '创业者'
  },
  onLoad: function(options){
    this.setData({
      avatarUrl: getApp().gdata.avatarUrl,
      nickName: getApp().gdata.nickName
    })
  },
  getWxCode: function(e){
    var type = parseInt(e.currentTarget.dataset.type)
    var fileName = 'wxcode' + type
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/common/getWxcode',
      method: 'GET',
      data: {
        type: type,
        name: fileName,
        path: '/pages/include/start'
      },
      success: function(res){
        console.log('getWxcode=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var url = 'http://www.campus.com/static/wxcode/' + fileName + '.png'
        wx.previewImage({
          urls: [url]
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },
})
