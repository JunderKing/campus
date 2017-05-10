Page({
  data: {
    uid: 0,
    orgerid: 0,
    cpRole: 0,
    sfRole: 0,
    festid: 0,
    title: '',
    intro: '',
    stime: '',
    etime: '',
    addr: '',
    logos: [],
    fests: [{
      title: 'test1'
    },{
      title: 'test2'
    }]
  },
  onLoad: function(){
    console.log('Festonload!')
  },

  onShow: function(){
    this.setData({
      uid: getApp().globalData.uid,
      cpRole: getApp().globalData.cpRole,
      sfRole: getApp().globalData.sfRole
    })
    this.updateFestInfo()
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/festival/getAllFestInfo',
      method: 'POST',
      success: function(res){
        console.log('getAllFestInfo=>')
        console.log(res.data)
        that.setData({fests: res.data})
      }
    })
  },

  onShareAppMessage: function(){
    return {
      title: '火种节小程序',
      path: '/pages/project/project'
    }
  },

  updateFestInfo: function(){
    var uid = getApp().globalData.uid
    var curFestid = getApp().globalData.curFestid
    if (curFestid === 0) { return }
    if (curFestid !== this.data.festid) {
      this.setData({festid: curFestid})
      wx.showLoading({
        title: '数据加载中...',
        mask: true
      })
    }
    var reqData = {
      festid: curFestid,
      uid: uid
    }
    console.log(reqData)
    var that = this
    wx.request({
      url: "https://www.kingco.tech/index.php?s=/spark/festival/getFestInfo",
      method: 'POST',
      data: reqData,
      success: function(res){
        console.log('getFestInfo=>')
        console.log(res.data)
        if (!res.data) {
          return
        }
        var stime = new Date(res.data.stime * 1000).toLocaleString()
        var etime = new Date(res.data.etime * 1000).toLocaleString()
        that.setData({
          title: res.data.title,
          intro: res.data.intro,
          orgerid: res.data.orgerid,
          stime: stime,
          etime: etime,
          addr: res.data.addr,
          logos: res.data.logos
        })
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  },
  showMap: function(){
    wx.navigateTo({
      url: "/pages/include/map"
    })
  },
  onFestChange: function(e){
    var index = e.detail.value
    var festid = this.data.fests[index].festid
    if (festid === this.data.festid) { return }
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    var pointer = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/changeCurFest',
      method: 'POST',
      data: {
        festid: festid,
        uid: getApp().globalData.uid
      },
      success: function(res){
        console.log('changeCurFest=>')
        console.log(res.data)
        getApp().updateUserInfo(function(){
          pointer.updateFestInfo()
        })
      }
    })
  }
})
