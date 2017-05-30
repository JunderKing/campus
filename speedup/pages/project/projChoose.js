Page({
  data:{
    campId: 0,
    projList: []
  },

  onLoad: function(options){
    this.data.campId = options.campId
    this.getProjList()
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

  addCampProject: function(e){
    console.log('addCampProject=>')
    console.log(e)
    var projId = e.currentTarget.dataset.projid
    wx.request({
      url: 'http://www.campus.com/api/speedup/addCampProject',
      method: 'POST',
      data: {
        userId: getApp().gdata.userId,
        campId: this.data.campId,
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
