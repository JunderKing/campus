Page({
  data: {
    avatarUrl: '',
    nickName: '',
    role: '开始创业者'
  },

  onLoad: function(){
    this.setData({
      avatarUrl: getApp().gdata.avatarUrl,
      nickName: getApp().gdata.nickName
    })
  },

  onShareAppMessage: function(){
    return {
      title: '火种节小程序',
      path: '/pages/project/project'
    }
  },

  toOrgerAdd: function(){
    wx.showToast({
      title: '请稍后……',
      icon: 'loading'
    })
    wx.request({
      url: 'http://www.campus.com/api/spark/getQrcode',
      method: 'POST',
      data: {
        path: '/pages/include/start?role=4',
        name: 'orger'
      },
      success: function(res){
        wx.hideToast();
        if (res.data) {
          wx.navigateTo({
            url: '/pages/include/qrcode?role=4'
          })
        }
      }
    })
  },

  toWxcode: function(e){
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
        var title = '小程序'
        if (type === 1) {
          title = '火种节小程序'
        } else if (type === 2) {
          title = '加速营小程序'
        } else {
          title = '创投会小程序'
        }
        wx.showModal({
          title: title,
          content: '页面跳转后，点击右上角菜单，选择『识别图中二维码』即可打开小程序',
          showCancel: false,
          success: function(){
            wx.previewImage({
              urls: [url]
            })
          }
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})
