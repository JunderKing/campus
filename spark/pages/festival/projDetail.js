Page({
  data: {
    title: "",
    intro: "",
    projId: 0,
    festId: 0,
    isMentor: 0,
    members: [],
    comnts: [],
  },

  onLoad: function(options) {
    this.setData({
      projId: parseInt(options.projId),
      isMentor: getApp().gdata.isMentor,
      role: getApp().gdata.role
    })
  },

  onShow: function(){
    this.updateProjInfo()
    this.getComnt()
  },

  updateProjInfo: function(){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/spark/getProjInfo',
      method: 'POST',
      data: {
        projId: that.data.projId
      },
      success: function(res){
        console.log('getProjInfo=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var cityCode = parseInt(res.data.projInfo.province)
        res.data.projInfo.province = getApp().getCityStr(cityCode)
        that.setData(res.data.projInfo)
      },
      fail: function(){
        return getApp().showError(2)
      }
    })
  },

  getComnt: function(){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/spark/getComnt',
      method: 'POST',
      data: {
        projId: this.data.projId
      },
      success: function(res){
        wx.hideToast()
        console.log('getComnt=>')
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
    var comntId = e.currentTarget.dataset.comntId
    var comntorId = e.currentTarget.dataset.comntorId
    var userId = getApp().gdata.userId
    var that = this
    if (userId === cmntorid) {
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
      url: 'http://www.campus.com/api/spark/delComnt',
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
          that.updateProjInfo()
        }
      }
    })
  },

  toProgress: function(){
    if (getApp().gdata.projId === this.data.projId) {
      wx.navigateTo({
        url: "/pages/project/projProgress?projId=" + getApp().gdata.projId
      })
    } else {
      wx.navigateTo({
        url: "/pages/festival/projDetailProg?projId=" + this.data.projId
      })
    }
  }
})

