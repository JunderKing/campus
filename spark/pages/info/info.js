Page({
  data: {
    avatar: '',
    nickName: 'JunderKing',
    role: '开始创业者'
  },

  onShow: function(){
    var that = this
    getApp().updateUserInfo(function(){
      that.setData({
        cpRole: getApp().globalData.cpRole
      })
    })
    var role = '开始创业者'
    var appData = getApp().globalData
    if (appData.sfRole === 2) {
      role = '管理员'
    } else if (appData.sfRole === 1) {
      role = "组织者"
    } else if (appData.isMentor === 1) {
      role = '创业导师'
    } else if (appData.isCaptain === 1) {
      role = 'CEO'
    }
    this.setData({
      avatar: appData.avatar,
      nickName: appData.nickName,
      role: role,
      cpRole: appData.cpRole
    })
  },

  onShareAppMessage: function(){
    return {
      title: '火种节小程序',
      path: '/pages/project/project'
    }
  },

  toOrgerAdd: function(){
    wx.showLoading({
      title: '请稍后……',
      mask: true
    })
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/getQrcode',
      method: 'POST',
      data: {
        path: '/pages/include/start?role=4',
        name: 'orger'
      },
      success: function(res){
        wx.hideLoading();
        if (res.data) {
          wx.navigateTo({
            url: '/pages/include/qrcode?role=4'
          })
        }
      }
    })
  },
  getWxcode: function(){
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/getWxcode',
      method: 'POST',
      data: {
        path: '/pages/include/start',
        name: 'wxcode'
      },
      success: function(res){
        if (res.data) {
          wx.downloadFile({
            url: 'https://www.kingco.tech/static/qrcode/wxcode.png',
            success: function(res){
              wx.hideLoading();
              if (res.tempFilePath) {
                wx.previewImage({
                  urls: [res.tempFilePath],
                  success: function(){
                    wx.showToast({
                      title: '分享给好友吧！',
                      icon: 'success'
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})
