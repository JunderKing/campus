Page({
  data: {
    userId: 0,
    orgerId: 0,
    role: 0,
    meetRole: 0,
    meetId: 0,
    name: '',
    intro: '',
    startTime: '',
    endTime: '',
    addr: '',
    logo: '',
    meetList: []
  },

  onShareAppMessage: function(){
    return {
      title: '创投会小程序',
      path: '/pages/projList/projList'
    }
  },

  onLoad: function(){
    console.log('meetonload!')
  },

  onShow: function(){
    this.setData({
      userId: getApp().gdata.userId,
      role: getApp().gdata.role,
      meetRole: getApp().gdata.meetRole
    })
    this.getMeetInfo()
    //this.getAllMeetList()
  },

  getMeetInfo: function(){
    var userId = getApp().gdata.userId
    var curMeetId = getApp().gdata.curMeetId
    if (curMeetId !== this.data.meetId) {
      this.setData({
        meetId: curMeetId
      })
      wx.showToast({
        title: '数据加载中...',
        icon: 'loading',
        duration: 10000
      })
    }
    var that = this
    wx.request({
      url: "https://www.kingco.tech/api/venture/getUserMeetInfo",
      method: 'POST',
      data: {
        userId: getApp().gdata.userId
      },
      success: function(res){
        wx.hideToast()
        console.log('getUserMeetInfo=>')
        console.log(res.data)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }        
        res.data.meetInfo.startTime = new Date(res.data.meetInfo.startTime * 1000).toLocaleString()
        res.data.meetInfo.endTime = new Date(res.data.meetInfo.endTime * 1000).toLocaleString()
        //res.data.meetInfo.projList.map(function(item){
          //item.tag = item.tag.split(' ')
          //return item
        //})
        that.setData(res.data.meetInfo)
        getApp().gdata.curMeetId = res.data.meetInfo.meetId
        //getApp().gdata.isInvor = res.data.meetInfo.isInvor
      },
      fail: function(){
        wx.hideToast()
      }
    })
  },

  getAllMeetList: function(){
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/venture/getAllMeetList',
      method: 'GET',
      success: function(res){
        console.log('getAllMeetList=>')
        console.log(res.data)
        that.setData({
          meetList: res.data.meetList
        })
      }
    })
  },

  showMap: function(){
    wx.navigateTo({
      url: "/pages/include/map"
    })
  },

  onMeetChange: function(e){
    var index = e.detail.value
    var meetId = this.data.meetList[index].meetId
    if (meetId === this.data.meetId) { return }
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading'
    })
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/venture/chgCurMeeting',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId,
        meetId: meetId
      },
      success: function(res){
        console.log('chgCurMeeting=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }        
        getApp().gdata.isInvor = res.data.isInvor
        getApp().gdata.curMeetId = meetId
        if (res.data.curProjId) {
          getApp().gdata.curProjId = res.data.curProjId
        }
        that.getMeetInfo();
      }
    })
  }
})

