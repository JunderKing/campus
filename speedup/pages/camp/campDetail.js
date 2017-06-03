Page({
  data: {
    campId: 0,
    mentors: [],
    projList: [],
    delHidden: false,
  },

  onLoad: function(options){
    this.setData({
      campId: options.campId,
      role: getApp().gdata.role
    })
  },

  onShow: function(){
    this.getCampInfo()
  },

  getCampInfo: function(){
    var that = this
    wx.showToast({
      title: '数据加载中……',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/getCampInfo',
      method: 'POST',
      data: {
        campId: this.data.campId
      },
      success: function(res){
        wx.hideToast()
        console.log('getCampInfo=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }        
        that.setData(res.data.campInfo)
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
    var fileName = 'speedup_camp_mentor_' + this.data.campId
    wx.request({
      url: 'https://www.kingco.tech/api/common/getQrcode',
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
        var url = 'https://www.kingco.tech/static/qrcode/' + fileName + '.png'
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
    var fileName = 'speedup_camp_proj_' + this.data.campId
    wx.request({
      url: 'https://www.kingco.tech/api/common/getQrcode',
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
        var url = 'https://www.kingco.tech/static/qrcode/' + fileName + '.png'
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

  delMentor: function(e){
    var userId = e.currentTarget.dataset.userid
    wx.showToast({
      title: '处理中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/delCampMentor',
      method: 'POST',
      data: {
        userId: userId,
        campId: this.data.campId
      },
      success: function(res){
        console.log('delCampMentor=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.showToast({
          title: '删除成功!'
        })
        that.getCampInfo()
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
          url: 'https://www.kingco.tech/api/speedup/delCampProject',
          method: 'POST',
          data: {
            projId: projId,
            campId: that.data.campId
          },
          success: function(res){
            console.log('delCampProject=>')
            console.log(res)
            if (res.statusCode !== 200 || res.data.errcode !== 0) {
              return getApp().showError(3)
            }
            wx.showToast({
              title: '删除成功!'
            })
            that.getCampInfo()
          },
          fail: function(){
            getApp().showError(2)
          }
        })
      }
    })
  },

  delCamp: function(e){
    var that = this
    wx.showModal({
      title: '确定删除加速营？',
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
          url: 'https://www.kingco.tech/api/speedup/delCamp',
          method: 'POST',
          data: {
            campId: that.data.campId
          },
          success: function(res){
            console.log('delCampProject=>')
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

