Page({
  data: {
    userId: 0,
    orgerId: 0,
    role: 0,
    campRole: 0,
    campId: 0,
    name: '',
    intro: '',
    logo: '',
    campList: [],
    projList:[]
  },

  onShareAppMessage: function(){
    return {
      title: '加速营小程序',
      path: '/pages/project/project'
    }
  },

  onLoad: function(){
    console.log('Camponload!')
  },

  onShow: function(){
    this.setData({
      userId: getApp().gdata.userId,
      role: getApp().gdata.role,
      campRole: getApp().gdata.campRole
    })
    this.getCampInfo()
  },

  getCampInfo: function(){
    var userId = getApp().gdata.userId
    var curCampId = getApp().gdata.curCampId
    if (curCampId !== this.data.campId) {
      this.setData({
        campId: curCampId
      })
      wx.showToast({
        title: '数据加载中...',
        icon: 'loading',
        duration: 10000
      })
    }
    var that = this
    wx.request({
      url: "https://www.kingco.tech/api/speedup/getUserCampInfo",
      method: 'POST',
      data: {
        userId: getApp().gdata.userId
      },
      success: function(res){
        wx.hideToast()
        console.log('getUserCampInfo=>')
        console.log(res.data)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        res.data.campInfo.projList.map(function(item){
          item.tag = item.tag.split(' ')
          return item
        })
        that.setData(res.data.campInfo)
        getApp().gdata.curCampId = res.data.campInfo.campId
        //getApp().gdata.isMentor = res.data.campInfo.isMentor
      },
      fail: function(){
        wx.hideToast()
      }
    })
  },

  onCampChange: function(e){
    var index = e.detail.value
    var campId = this.data.campList[index].campId
    if (campId === this.data.campId) { return }
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading'
    })
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/chgCurCamp',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId,
        campId: campId
      },
      success: function(res){
        console.log('chgCurCamp=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        getApp().gdata.isMentor = res.data.isMentor
        getApp().gdata.curCampId = campId
        if (res.data.curProjId) {
          getApp().gdata.curProjId = res.data.curProjId
        }
        that.getCampInfo();
      }
    })
  }
})
