Page({
  data: {
    festId: 0,
    mentors: [],
    projList: [],
    delHidden: false,
  },

  onLoad: function(options){
    this.setData({
      festId: options.festId
    })
  },

  onShow: function(){
    this.getFestInfo()
  },

  getFestInfo: function(){
    var that = this
    wx.showToast({
      title: '数据加载中……',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://www.campus.com/api/spark/getFestInfo',
      method: 'POST',
      data: {
        festId: this.data.festId
      },
      success: function(res){
        wx.hideToast()
        console.log('getFestInfo=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }        
        that.setData(res.data.festInfo)
      },
      fail: function(){
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
    var fileName = 'spark_fest_mentor_' + this.data.festId
    wx.request({
      url: 'http://www.campus.com/api/common/getQrcode',
      method: 'GET',
      data: {
        type: 1,
        name: fileName,
        path: '/pages/include/start?role=3&festId=' + this.data.festId
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

  toProjAdd: function(){
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    var fileName = 'spark_fest_proj_' + this.data.festId
    wx.request({
      url: 'http://www.campus.com/api/common/getQrcode',
      method: 'GET',
      data: {
        type: 1,
        name: fileName,
        path: '/pages/include/start?role=2&festId=' + this.data.festId
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

  delMentor: function(e){
    var userId = e.currentTarget.dataset.userid
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/spark/delFestMentor',
      method: 'POST',
      data: {
        userId: userId,
        festId: this.data.festId
      },
      success: function(res){
        getApp().updateUserInfo()
        that.getFestInfo()
      }
    })
  },

  delProject: function(e){
    var cancel = false
    var that = this
    var projId = e.currentTarget.dataset.projid
    var festId = getApp().gdata.curfestId
    wx.showModal({
      title: '确定删除队长？',
      content: '如果删除队长，则与队长相关的项目以及项目成员都将将同时删除，并且无法撤回',
      success: function(res){
        if (res.confirm) {
          wx.request({
            url: 'http://www.campus.com/api/spark/delFestProject',
            method: 'POST',
            data: {
              projId: projId,
              festId: that.data.festId
            },
            success: function(res){
              console.log('delFestProject=>')
              console.log(res)
              that.getFestInfo()
            }
          })
        }
      }
    })
  }
})
