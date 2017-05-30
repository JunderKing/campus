Page({
  data: {
    orgerid: 1,
    campId: 0,
    title: '',
    intro: '',
    logo: '',
    campList: []
  },

  onShow: function(){
    this.updateCampInfo()
    //this.updateCampList()
  },

  updateCampInfo: function(){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/speedup/getUserCampInfo',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId
      },
      success: function(res){
        console.log('getUserCampInfo =>')
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

  updateCampList: function(){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/speedup/getAllCampList',
      method: 'GET',
      success: function(res){
        console.log('getAllCampList =>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData({
          campList: res.data.campList
        })
      },
      fail: function(){
        return getApp().showError(2)
      }
    })
  },

  onCampChange: function(e){
    var index = e.detail.value
    var campId = this.data.campList[index].campId
    if (campId === this.data.campId) { return }
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/speedup/chgCurCamp',
      method: 'POST',
      data: {
        userId: getApp().gdata.userId,
        campId: campId
      },
      success: function(res){
        wx.hideToast()
        console.log('chgCurCamp=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        if (res.data.projId) {
          getApp().gdata.curProjId = res.data.projId
        }
        that.updateCampInfo()
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})
