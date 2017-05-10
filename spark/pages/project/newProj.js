Page({
  formSubmit: function(e){
    var formData = e.detail.value
    if (!formData.title) {
      wx.showToast({
        title: '请填写项目标题',
        icon: 'loading'
      })
      return
    }
    if (!formData.intro) {
      wx.showToast({
        title: '请填写项目简介',
        icon: 'loading'
      })
      return
    }
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    formData.festid = getApp().globalData.curFestid
    formData.uid = getApp().globalData.uid
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/project/addProj',
      method: 'POST',
      data: formData,
      success: function(res){
        console.log(res)
        wx.switchTab({
          url: '/pages/project/project'
        })
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  }
})
