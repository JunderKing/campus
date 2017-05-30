Page({
  data:{
    avatar: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIGuXhUHpOhmA7hv4yM9vjiahS46d5prr9z2uXAjWOiciaURAr1knHWNjYxd8oIJAkaNBiaq7vA3iapc9g/0",
    nickName: 'JunK',
    role: '创业者'
  },
  onLoad: function(options){
    this.setData({
      avatar: getApp().gdata.avatar,
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
      url: 'http://www.campus.com/api/campus/getWxCode',
      method: 'GET',
      data: {
        type: type,
        name: fileName,
        path: '/pages/include/start'
      },
      success: function(res){
        console.log('getQrcode=>')
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
