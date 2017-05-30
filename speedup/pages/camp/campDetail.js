Page({
  data: {
    campId: 0,
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
      campId: options.campId
    })
    this.updateCampDetail()
  },

  updateCampDetail: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/speedup/getCampInfo',
      method: 'GET',
      data: {
        campId: this.data.campId
      },
      success: function(res){
        console.log('getCampInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData(res.data.campInfo)
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
    var fileName = 'speedup_camp_proj_' + this.data.campId
    wx.request({
      url: 'http://www.campus.com/api/common/getQrcode',
      method: 'GET',
      data: {
        type: 2,
        name: fileName,
        path: '/pages/include/start?role=2&campId=' + this.data.campId
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
    var fileName = 'speedup_camp_mentor_' + this.data.campId
    wx.request({
      url: 'http://www.campus.com/api/common/getQrcode',
      method: 'GET',
      data: {
        type: 2,
        name: fileName,
        path: '/pages/include/start?role=3&campId=' + this.data.campId
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
