Page({
  data: {
    meetId: 0,
    invors: [],
    projList: [],
    delHidden: false,
  },

  onLoad: function(options){
    this.setData({
      meetId: options.meetId,
      role: getApp().gdata.role
    })
  },

  onShow: function(){
    this.getMeetInfo()
  },

  getMeetInfo: function(){
    var that = this
    wx.showToast({
      title: '数据加载中……',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://localhost/campusvc/public/api/venture/getMeetInfo',
      method: 'POST',
      data: {
        meetId: this.data.meetId
      },
      success: function(res){
        wx.hideToast()
        console.log('getMeetInfo=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData(res.data.meetInfo)
      },
      fail: function(){
        return getApp().showError(2)
      }
    })
  },

  toInvorAdd: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    var fileName = 'venture_meet_invor_' + this.data.meetId
    wx.request({
      url: 'http://localhost/campusvc/public/api/common/getQrcode',
      method: 'GET',
      data: {
        type: 3,
        name: fileName,
        path: '/pages/include/start?role=3&meetId=' + this.data.meetId
      },
      success: function(res){
        console.log('getQrcode=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var url = 'http://localhost/campusvc/public/static/qrcode/' + fileName + '.png'
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

  toProjAdd: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    var fileName = 'venture_meet_proj_' + this.data.meetId
    wx.request({
      url: 'http://localhost/campusvc/public/api/common/getQrcode',
      method: 'GET',
      data: {
        type: 3,
        name: fileName,
        path: '/pages/include/start?role=2&meetId=' + this.data.meetId
      },
      success: function(res){
        console.log('getQrcode=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var url = 'http://localhost/campusvc/public/static/qrcode/' + fileName + '.png'
        wx.previewImage({
          urls: [url]
        })
      },
      fail: function(){
        getApp().showError(2)
      }
    })
  },

  showDel: function(e){
    var delHidden = this.data.delHidden;
    if (delHidden) {
      this.setData({
        delHidden: false
      })
    } else {
      this.setData({
        delHidden: true
      })
    }
  },

  delInvor: function(e){
    var userId = e.currentTarget.dataset.userid
    wx.showToast({
      title: '处理中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    wx.request({
      url: 'http://localhost/campusvc/public/api/venture/delMeetInvor',
      method: 'POST',
      data: {
        userId: userId,
        meetId: this.data.meetId
      },
      success: function(res){
        console.log('delMeetInvor=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.showToast({
          title: '删除成功!'
        })
        that.getMeetInfo()
      },
      fail: function(){
        getApp().showError(2)
      }
    })
  },

  delProject: function(e){
    var that = this
    var projId = e.currentTarget.dataset.projid
    wx.showModal({
      title: '确定删除项目？',
      content: '删除后无法恢复',
      success: function(res){
        if (!res.confirm) {
          return
        }
        wx.showToast({
          title: '处理中...',
          icon: 'loading',
          duration: 10000
        })
        wx.request({
          url: 'http://localhost/campusvc/public/api/venture/delMeetProject',
          method: 'POST',
          data: {
            projId: projId,
            meetId: that.data.meetId
          },
          success: function(res){
            console.log('delMeetProject=>')
            console.log(res)
            if (res.statusCode !== 200 || res.data.errcode !== 0) {
              return getApp().showError(3)
            }
            wx.showToast({
              title: '删除成功!'
            })
            that.getMeetInfo()
          },
          fail: function(){
            getApp().showError(2)
          }
        })
      }
    })
  },

  delMeeting: function(e){
    var that = this
    wx.showModal({
      title: '确定删除创投会？',
      content: '删除后相关数据将丢失!',
      success: function(res){
        if (!res.confirm) {
          return
        }
        wx.showToast({
          title: '处理中...',
          icon: 'loading',
          duration: 10000
        })
        wx.request({
          url: 'http://localhost/campusvc/public/api/venture/delMeeting',
          method: 'POST',
          data: {
            meetId: that.data.meetId
          },
          success: function(res){
            console.log('delMeetProject=>')
            console.log(res)
            if (res.statusCode !== 200 || res.data.errcode !== 0) {
              return getApp().showError(3)
            }
            wx.navigateBack()
            wx.showToast({
              title: '删除成功!'
            })
          },
          fail: function(){
            getApp().showError(2)
          }
        })
      }
    })
  }
})
