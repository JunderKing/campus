Page({
  data: {
    type: '',
    holder: '',
    content: ''
  },
  onLoad: function(options){
    this.setData(options)
    switch (options.type) {
      case 'grid':
        this.setData({
          gridId: parseInt(options.gridId),
          holder: '请填写画格内容',
          content: options.content
        })
        break;
    }
  },

  formSubmit: function(e){
    var content = e.detail.value.content
    if (!content) {
      return wx.showToast({
        title: '内容不可为空',
        icon: 'loading'
      })
    }
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    switch (this.data.type) {
      case 'grid':
        this.updateGridInfo(content)
        break;
      case 'canvas':
        this.updateCanvas()
        break;
      case 'canvas':
        this.updateCanvas()
        break;
      case 'canvas':
        this.updateCanvas()
        break;
      case 'canvas':
        this.updateCanvas()
        break;
      case 'canvas':
        this.updateCanvas()
        break;
      case 'canvas':
        this.updateCanvas()
        break;
      default:
    }
  },

  updateGridInfo: function(content){
    var that = this
    wx.request({
      url: 'http://www.campus.com/api/speedup/updGridInfo',
      method: 'POST',
      data: {
        gridId: this.data.gridId,
        content: content
      },
      success: function(res){
        console.log('gridInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.navigateBack()
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  addCmnt: function(formData){
    formData.projid = this.data.projid
    wx.request({
      url: 'http://www.campus.com/spark/comment/addCmnt',
      method: 'POST',
      data: formData,
      success: function(res){
        console.log(res)
        wx.navigateBack()
      }
    })
  },

  addReply: function(formData){
    formData.cmntid = this.data.cmntid
    wx.request({
      url: 'http://www.campus.com/spark/comment/addReply',
      method: 'POST',
      data: formData,
      success: function(res){
        console.log(res)
        wx.navigateBack()
      }
    })
  }
})

