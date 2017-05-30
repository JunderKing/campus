Page({
  data:{
    projId: 0,
    title: '项目标题',
    intro: '项目简介',
    isHidden: true,
    comments: [{
      avatar: '../../img/icon/spark_cur.png',
      nickName: 'Jun.K',
      content: '评论',
      ctime: '20150606',
      replies: [{
        nickName: 'HelloWorld',
        content: '回复'
      }]
    }],
  },
  onLoad: function(options){
    this.setData({
      projId: options.projId
    })
  },

  onShow: function(options){
    this.updProjInfo()
  },

  updProjInfo: function(){
    var that = this
    if (getApp().gdata.curProjId !== this.data.projId) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 10000
      })
    }
    wx.request({
      url: 'http://www.campus.com/api/venture/getProjInfo',
      method: 'GET',
      data: {
        projId: this.data.projId
      },
      success: function(res){
        console.log('getProjInfo=>')
        console.log(res)
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var cityCode = parseInt(res.data.projInfo.province)
        res.data.projInfo.province = getApp().getCityStr(cityCode)
        that.setData(res.data.projInfo)
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  }
})


