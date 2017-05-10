Page({
  data: {
    projid: 0,
    field: '',
    content: ''
  },
  onLoad: function(options){
    this.setData(options)
  },
  formSubmit: function(e){
    var formData = e.detail.value
    if (!formData.content) {
      wx.showToast({
        title: '内容不可为空',
        icon: 'Loading'
      })
      return
    }
    var reqData = {
      projid: this.data.projid,
      field: this.data.field,
      content: formData.content
    }
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/project/updateProjInfo',
      method: 'POST',
      data: reqData,
      success: function(res){
        console.log(res)
        wx.navigateBack()
      }
    })
  }
})
