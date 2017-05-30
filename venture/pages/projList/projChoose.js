Page({
  data:{
    meetId: 0,
    projList: []
  },

  onLoad: function(options){
    this.data.meetId = options.meetId
    this.getProjList()
  },

  getProjList: function(){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/venture/getUserProjList',
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

  addMeetProject: function(e){
    console.log('addMeetProject=>')
    console.log(e)
    var projId = e.currentTarget.dataset.projid
    wx.request({
      url: 'http://www.campus.com/api/venture/addMeetProject',
      method: 'POST',
      data: {
        userId: getApp().gdata.userId,
        meetId: this.data.meetId,
        projId: projId
      },
      success: function(res){
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return that.showError(3)
        }
        wx.navigateBack()
        wx.showToast({
          title: '成功加入加速营!',
          icon: 'success'
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})
