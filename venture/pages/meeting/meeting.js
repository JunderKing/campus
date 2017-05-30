Page({
  data: {
    userId: 0,
    orgerid: 1,
    role: 1,
    meetRole: 1,
    meetId: 1,
    name: 'title',
    intro: 'intro',
    startTime: 'stime',
    endTime: 'etime',
    addr: 'addr',
    logoUrl: '../../img/icon/speed_cur.png',
    meetList: []
  },

  onLoad: function(){
    this.setData({
      userId: getApp().gdata.userId,
      role: getApp().gdata.role
    })
  },

  onShow: function(){
    this.updateMeetInfo()
  },

  updateMeetInfo: function(){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/venture/getUserMeetInfo',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId
      },
      success: function(res){
        console.log('getUserMeetInfo =>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.setData(res.data.meetInfo)
      },
      fail: function(){
        return getApp().showError(2)
      }
    })
  },

  onMeetChange: function(e){
    var index = e.detail.value
    var meetId = this.data.meetList[index].meetId
    if (meetId === this.data.meetId) { return }
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/venture/chgCurMeeting',
      method: 'POST',
      data: {
        userId: getApp().gdata.userId,
        meetId: meetId
      },
      success: function(res){
        wx.hideToast()
        console.log('chgCurMeeting=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        that.updateMeetInfo()
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})
