Page({
  data: {
    avatarUrl: '',
    nickName: '',
    roleStr: '',
    role: 0
  },

  onShow: function(){
    var gdata = getApp().gdata
    var roleStr = '创业者'
    if (gdata.role === 1) {
      roleStr = '管理员'
    } else if (gdata.campRole === 1){
      roleStr = '组织者'
    } else if (gdata.isMentor === 1) {
      roleStr = '创业导师'
    }
    this.setData({
      avatarUrl: gdata.avatarUrl,
      nickName: gdata.nickName,
      roleStr: roleStr,
      role: gdata.role
    })
  },

  onShareAppMessage: function(){
    return {
      title: '加速营小程序',
      path: '/pages/project/project'
    }
  },

  toOrgerAdd: function(){
    var that = this
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://localhost/campusvc/public/api/common/getQrcode',
      method: 'GET',
      data: {
        type: 2,
        name: 'speedup_orger',
        path: '/pages/include/start?role=4'
      },
      success: function(res){
        console.log('getQrcode=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var url = 'http://localhost/campusvc/public/static/qrcode/speedup_orger.png'
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
      url: 'http://localhost/campusvc/public/api/common/getWxcode',
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
        var url = 'http://localhost/campusvc/public/static/wxcode/' + fileName + '.png'
        var title = '小程序'
        if (type === 2) {
          title = '加速营小程序'
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

