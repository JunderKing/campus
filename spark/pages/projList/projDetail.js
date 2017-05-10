Page({
  data: {
    title: "",
    intro: "",
    projid: 0,
    festid: 0,
    isMentor: 0,
    members: [],
    comments: [{
        avatar: '',
        nickName: '',
        content: '',
        ctime: ''
      }],
  },
  
  onLoad: function(options) {
    this.setData({
      festid: getApp().globalData.curFestid,
      projid: parseInt(options.projid),
      isMentor: getApp().globalData.isMentor,
      cpRole: getApp().globalData.cpRole
    })
  },

  onShow: function(){
    this.updateProjInfo()
  },

  updateProjInfo: function(){
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/project/getProjInfo',
      method: 'POST',
      data: {
        projid: that.data.projid
      },
      success: function(res){
        console.log('getProjInfo=>')
          res.data.members.map(function(item){
            if (item.nickName.length >= 4) {
              item.nickName = item.nickName.substr(0, 4)
            }
            return item
          })
        console.log(res.data)
        that.setData(res.data)
      }
    })
  },

  preview: function(e){
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      success: function(res){
        console.log("success")
      }
    })
  },

    showCmntMenu: function(e){
    var cmntid = e.currentTarget.dataset.cmntid
    var cmntorid = e.currentTarget.dataset.cmntorid
    var uid = getApp().globalData.uid
    var that = this
    if (uid === cmntorid) {
      wx.showActionSheet({
        itemList: ['删除该评论'],
        success: function(res){
          if (res.tapIndex === 0) {
            that.delCmnt(cmntid)
          }
        }
      })
    }
  },

  delCmnt: function(cmntid) {
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/comment/delCmnt',
      method: 'POST',
      data: {cmntid: cmntid},
      success: function(res){
        if (res.data) {
          wx.showToast({
            title: '评论已删除',
            icon: 'success'
          })
          that.updateProjInfo()
        }
      }
    })
  }
})

