Page({
  data:{
    projId: 0,
    title: '项目标题',
    intro: '项目简介',
    isHidden: true,
    comments: [{
      avatar: '../../img/icon/spark_cur.png',
      nickName: 'Jun.K',
      content: '评论',
      ctime: '20150606',
      replies: [{
        nickName: 'HelloWorld',
        content: '回复'
      }]
    }],
  },

  onShow: function(options){
    this.updProjInfo()
    this.getProjList()
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
      url: 'http://www.campus.com/api/speedup/getUserProjInfo',
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

  getProjList: function(){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/speedup/getUserProjList',
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
      url: 'http://www.campus.com/api/speedup/chgCurProject',
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
        that.updProjInfo()
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
      url: 'http://www.campus.com/api/common/getQrcode',
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

  toMemberDel: function(){
    var isHidden = this.data.isHidden
    if (isHidden) {
      this.setData({isHidden: false})
    } else {
      this.setData({isHidden: true})
    }
  },

  delMember: function(e){
    var projId = this.data.projId
    var userid = e.currentTarget.dataset.userid
    console.log('delMember')
    console.log(userid)
    var that = this
    wx.request({
      url: 'http://www.campus.com/spark/user/deleteMemberByProj',
      method: 'POST',
      data: {
        projId: projId,
        userid: userid
      },
      success: function(res) {
        console.log(res)
        that.updateProjInfo()
      }
    })
  },

  scanCode: function(){
    var projPointer = this
    getApp().qrScan(function(){
      projPointer.updProjInfo()
    })
  },
})
