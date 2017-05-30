Page({
  data:{
    projId: 0
  },
  onLoad: function(options){
    this.setData({
      projId: parseInt(options.projId),
      isUser: parseInt(options.isUser)
    })
  }
})
