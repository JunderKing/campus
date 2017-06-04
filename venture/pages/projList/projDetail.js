Page({
  data:{
    projId: 0,
    title: '',
    intro: '',
    isHidden: true
  },
  onLoad: function(options){
    this.setData({
      projId: options.projId
    })
  },

  onShow: function(options){
    this.updProjInfo()
    this.getProjComnt()
  },

  updProjInfo: function(){
    var that = this
    if (getApp().gdata.curProjId !== this.data.projId) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 10000
      })
    }
    wx.request({
      url: 'http://localhost/campusvc/public/api/venture/getProjInfo',
      method: 'GET',
      data: {
        projId: this.data.projId
      },
      success: function(res){
        console.log('getProjInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var cityCode = parseInt(res.data.projInfo.province)
        res.data.projInfo.province = getApp().getCityStr(cityCode)
        that.setData(res.data.projInfo)
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },
  
  getProjComnt: function(){
    var that = this
    wx.request({
      url: 'http://localhost/campusvc/public/api/venture/getProjComnt',
      method: 'POST',
      data: {
        projId: this.data.projId
      },
      success: function(res){
        wx.hideToast()
        console.log('getProjComnt=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData({
          comnts: res.data.comnts,
          scores: res.data.scores
        })
      }
    })
  },

  showComntMenu: function(e){
    var comntId = e.currentTarget.dataset.comntid
    var comntorId = e.currentTarget.dataset.comntorid
    var userId = getApp().gdata.userId
    var that = this
    if (userId === comntorId) {
      wx.showActionSheet({
        itemList: ['删除该评论'],
        success: function(res){
          if (res.tapIndex === 0) {
            that.delComnt(comntId)
          }
        }
      })
    }
  },

  delComnt: function(comntId) {
    var that = this
    wx.request({
      url: 'http://localhost/campusvc/public/api/venture/delComnt',
      method: 'POST',
      data: {
        comntId: comntId
      },
      success: function(res){
        if (res.data) {
          wx.showToast({
            title: '评论已删除',
            icon: 'success'
          })
          that.updProjInfo()
        }
      }
    })
  },
})


