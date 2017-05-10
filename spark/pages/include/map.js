Page({
  data: {
    map: ''
  },
  onLoad: function(){
    var that = this;
    wx.getLocation({
      success: function(res){
        console.log(res);
        that.setData({
          map: res
        })
      }
    })
  }
})
