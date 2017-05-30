Page({
  data: {
    meetId: 0,
    title: '',
    mentors: [],
    leaders: [],
    members: [],
    mentorHide: true,
    captainHide: true,
    memberHide: true
  },
  onLoad: function(options){
    this.setData({
      meetId: options.meetId
    })
    this.updateMeetDetail()
  },

  updateMeetDetail: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/venture/getMeetInfo',
      method: 'GET',
      data: {
        meetId: this.data.meetId
      },
      success: function(res){
        console.log('getMeetInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData(res.data.meetInfo)
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
      url: 'http://www.campus.com/api/common/getQrcode',
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
        var url = 'http://www.campus.com/static/qrcode/' + fileName + '.png'
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

  toMentorAdd: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    var fileName = 'venture_meet_mentor_' + this.data.meetId
    wx.request({
      url: 'http://www.campus.com/api/common/getQrcode',
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
        var url = 'http://www.campus.com/static/qrcode/' + fileName + '.png'
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

