Page({
  data:{
    userId: 0,
    leaderId: 0,
    projId: 0,
    title: '项目标题',
    intro: '项目简介',
    delHidden: true,
    comnts: []
  },

  onLoad: function(){
    this.setData({
      userId: getApp().gdata.userId
    })
  },

  onShow: function(options){
    this.getProjInfo()
    this.getProjList()
  },

  getProjInfo: function(){
    var that = this
    if (getApp().gdata.curProjId !== this.data.projId) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 10000
      })
    }
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/getUserProjInfo',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId
      },
      success: function(res){
        console.log('getUserProjInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        if (res.data.projInfo.projId === 0) {
          return that.setData({
            projId: 0
          })
        }
        var cityCode = parseInt(res.data.projInfo.province)
        res.data.projInfo.province = getApp().getCityStr(cityCode)
        that.setData(res.data.projInfo)
        getApp().gdata.curProjId = res.data.projInfo.projId
        that.getComnt()
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  getComnt: function(){
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/getComnt',
      method: 'POST',
      data: {
        tarType: 0,
        tarId: this.data.projId
      },
      success: function(res){
        wx.hideToast()
        console.log('getComnt=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData({
          comnts: res.data.comnts
        })
      }
    })
  },

  getProjList: function(){
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/getUserProjList',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId
      },
      success: function(res){
        console.log('getUserProjList=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData({
          projList: res.data.projList
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  onProjChange: function(e){
    var index = e.detail.value
    var projId = this.data.projList[index].projId
    if (projId === this.data.projId) { return }
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/chgCurProject',
      method: 'POST',
      data: {
        userId: getApp().gdata.userId,
        projId: projId
      },
      success: function(res){
        wx.hideToast()
        console.log('chgCurProject=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        getApp().gdata.curProjId = projId
        that.getProjInfo()
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  toMemberAdd: function(){
    var projId = this.data.projId
    if (projId === 0) {
      return wx.showToast({
        title: '没有项目',
        icon: 'loading'
      })
    }
    var fileName = 'speedup_proj_member_' + projId
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'https://www.kingco.tech/api/common/getQrcode',
      method: 'GET',
      data: {
        type: 2,
        name: fileName,
        path: '/pages/include/start?role=1&projId=' + projId
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

  showDel: function(){
    var delHidden = this.data.delHidden
    if (delHidden) {
      this.setData({delHidden: false})
    } else {
      this.setData({delHidden: true})
    }
  },

  delMember: function(e){
    var projId = this.data.projId
    var userId = e.currentTarget.dataset.userid
    console.log('delMember')
    var that = this
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/delProjMember',
      method: 'GET',
      data: {
        projId: projId,
        userId: userId
      },
      success: function(res){
        console.log('delProjMember=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.getProjInfo()
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  scanCode: function(){
    var projPointer = this
    getApp().qrScan(function(){
      projPointer.getProjInfo()
      projPointer.getProjList()
    })
  },
})
