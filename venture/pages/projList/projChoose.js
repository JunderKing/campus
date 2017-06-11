Page({
  data:{
    meetId: 0,
    projList: []
  },

  onLoad: function(options){
    this.setData({
      meetId: options.meetId,
      projList: getApp().gdata.avlProjList
    })
  },

  addMeetProject: function(e){
    var that = this
    var projId = e.currentTarget.dataset.projid
    wx.request({
      url: 'https://www.kingco.tech/api/venture/addMeetProject',
      method: 'POST',
      data: {
        userId: getApp().gdata.userId,
        meetId: this.data.meetId,
        projId: projId
      },
      success: function(res){
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.navigateBack()
        wx.showToast({
          title: '成功加入创投会!',
          icon: 'success'
        })
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  toProjAdd: function(){
    wx.switchTab({
      url: '/pages/projList/projList',
      success: function(){
        wx.navigateTo({
          url: '/pages/projList/projAdd?meetId=' + this.data.meetId
        })
      }
    })
  }
})

