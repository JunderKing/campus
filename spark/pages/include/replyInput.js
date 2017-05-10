Page({
  data: {
    projid: 0,
    cmntid: 0,
    content: ''
  },
  onLoad: function(options){
    this.setData(options)
  },
  formSubmit: function(e){
    var formData = e.detail.value
    formData.uid = getApp().globalData.uid
    if (this.data.projid) {
      formData.projid = this.data.projid
      wx.request({
        url: 'https://www.kingco.tech/index.php?s=/comment/addCmnt',
        method: 'POST',
        data: formData,
        success: function(res){
          console.log(res)
          wx.navigateBack
        }
      })
    } else if (this.data.cmntid) {
      formData.cmntid = this.data.cmntid
      wx.request({
        url: 'https://www.kingco.tech/index.php?s=/comment/addReply',
        method: 'POST',
        data: formData,
        success: function(res){
          console.log(res)
          wx.navigateBack
        }
      })
    }
  }
})
