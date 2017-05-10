Page({
  data: {
    title: "",
    intro: "",
    projid: 0,
    festid: 0,
    isCaptain: 0,
    members: [],
    isHidden: true
  },

  onShow: function(){
    var that = this
    getApp().updateUserInfo(function(){
      that.setData({
        isCaptain: getApp().globalData.isCaptain
      })
    })
    this.updateProjInfo()
  },

  onShareAppMessage: function(){
    return {
      title: '火种节小程序',
      path: '/pages/project/project'
    }
  },

  updateProjInfo: function(){
    console.log('updateProjInfo')
    this.setData({
      isCaptain: getApp().globalData.isCaptain
    })
    var uid = getApp().globalData.uid
    var festid = getApp().globalData.curFestid
    if (festid === 0) return
    if (this.data.festid !== festid) {
      this.setData({festid: festid})
      //wx.showLoading({
        //title: '数据加载中...',
        //mask: true
      //})
    }
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/project/getMyProjInfo',
      method: 'POST',
      data: {
        uid: uid,
        festid: festid
      },
      success: function(res){
        console.log('getMyProjInfo=>')
        console.log(res.data)
        if (res.data.errcode === 1) {
          that.setData({projid: 0})
        } else {
          res.data.members.map(function(item){
            if (item.nickName.length >= 4) {
              item.nickName = item.nickName.substr(0, 4)
            }
            return item
          })
          that.setData({
            projid: res.data.projid,
            title: res.data.title,
            intro: res.data.intro,
            members: res.data.members,
            comments: res.data.comments,
            captainid: res.data.captainid,
            uid: getApp().globalData.uid
          })
        }
      }
      //complete: function(){
        //wx.hideLoading()
      //}
    })
  },

  toMemberAdd: function(){
    var projid = this.data.projid
    wx.showLoading({
      title: '请稍后……',
      mask: true
    })
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/getQrcode',
      method: 'POST',
      data: {
        path: '/pages/include/start?role=1&projid=' + projid,
        name: 'member' + projid
      },
      success: function(res){
        wx.hideLoading();
        if (res.data) {
          wx.navigateTo({
            url: '/pages/include/qrcode?role=1&projid=' + projid,
          })
        }
      }
    })
  },

  toMemberDel: function(){
    var isHidden = this.data.isHidden
    if (isHidden) {
      this.setData({isHidden: false})
    } else {
      this.setData({isHidden: true})
    }
  },

  delMember: function(e){
    var projid = this.data.projid
    var uid = e.currentTarget.dataset.uid
    console.log('delMember')
    console.log(uid)
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/deleteMemberByProj',
      method: 'POST',
      data: {
        projid: projid,
        uid: uid
      },
      success: function(res) {
        console.log(res)
        that.updateProjInfo()
      }
    })
  },

  scanCode: function(){
    var projPointer = this
    getApp().qrScan(function(){
      projPointer.updateProjInfo()
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
