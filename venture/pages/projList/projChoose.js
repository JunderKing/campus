Page({
  data:{
    festId: 0,
    projList: []
  },

  onLoad: function(options){
    this.setData({
      festId: options.festId,
      projList: getApp().gdata.avlProjList
    })
  },

  addFestProject: function(e){
    var that = this
    var projId = e.currentTarget.dataset.projid
    wx.request({
      url: 'http://www.campus.com/api/spark/addFestProject',
      method: 'POST',
      data: {
        userId: getApp().gdata.userId,
        festId: this.data.festId,
        projId: projId
      },
      success: function(res){
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.navigateBack()
        wx.showToast({
          title: '成功加入火种节!',
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
      url: '/pages/project/project',
      success: function(){
        wx.navigateTo({
          url: '/pages/project/projAdd?festId=' + this.data.festId
        })
      }
    })
  }
})

