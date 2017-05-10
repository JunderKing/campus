Page({
  data: {
    projid: 0,
    stepid: 0,
    content: ''
  },
  onLoad: function(options){
    this.setData(options)
  },
  formSubmit: function(e){
    var formData = e.detail.value
    formData.projid = this.data.projid
    formData.stepid = this.data.stepid
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/project/updateProgContent',
      method: 'POST',
      data: formData,
      success: function(res){
        console.log(res)
        wx.navigateBack()
      }
    })
  }
})
