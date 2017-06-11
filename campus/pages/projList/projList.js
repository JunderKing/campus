Page({
  data:{
    type: 0,
  },

  onLoad: function(options){
  },

  onShow: function(){
    this.getProjList(0)
  },

  chgProjList: function(e){
    var type = parseInt(e.currentTarget.dataset.type)
    this.setData({
      type: type
    })
    this.getProjList(type)
  },

  getProjList: function(type) {
    var that = this
    wx.request({
      url: "https://www.kingco.tech/api/campus/getProjList",
      method: 'POST',
      data: {
        type: type
      },
      success: function(res){
        wx.hideToast()
        console.log('getProjList=>')
        console.log(res.data)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }        
        res.data.projList.map(function(item){
          item.tag = item.tag.split(' ')
          return item
        })
        that.setData({
          projList: res.data.projList
        })
        //getApp().gdata.isMentor = res.data.festInfo.isMentor
      },
      fail: function(){
        wx.hideToast()
      }
    })
  }
})

