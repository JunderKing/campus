Page({
  data: {
    title: '',
    mentors: [],
    captains: [],
    members: [],
    mentorHide: true,
    captainHide: true,
    memberHide: true
  },
  onLoad: function(options){
    this.setData({title: options.title})
  },
  onShow: function(){
    this.updatePage()
  },
  updatePage: function(){
    var that = this
    var reqData = {
      festid: getApp().globalData.curFestid
    }
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/getFestMemberInfo',
      method: 'POST',
      data: reqData,
      success: function(res){
        res.data.mentors.map(function(item){
          if (item.nickName.length >= 4) {
            item.nickName = item.nickName.substr(0, 4)
          }
          return item
        })
        res.data.captains.map(function(item){
          if (item.nickName.length >= 4) {
            item.nickName = item.nickName.substr(0, 4)
          }
          return item
        })
        res.data.members.map(function(item){
          if (item.nickName.length >= 4) {
            item.nickName = item.nickName.substr(0, 4)
          }
          return item
        })
        console.log(res)
        that.setData(res.data)
      }
    })
  },
  toMentorAdd: function(){
    var festid = getApp().globalData.curFestid
    wx.showLoading({
      title: '请稍后……',
      mask: true
    })
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/getQrcode',
      method: 'POST',
      data: {
        path: '/pages/include/start?role=3&festid=' + festid,
        name: 'mentor' + festid
      },
      success: function(res){
        wx.hideLoading();
        if (res.data) {
          wx.navigateTo({
            url: '/pages/include/qrcode?role=3&festid=' + festid,
          })
        }
      }
    })
  },
  toCaptainAdd: function(){
    var festid = getApp().globalData.curFestid
    wx.showLoading({
      title: '请稍后……',
      mask: true
    })
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/getQrcode',
      method: 'POST',
      data: {
        path: '/pages/include/start?role=2&festid=' + festid,
        name: 'captain' + festid
      },
      success: function(res){
        wx.hideLoading();
        if (res.data) {
          wx.navigateTo({
            url: '/pages/include/qrcode?role=2&festid=' + festid,
          })
        }
      }
    })
  },
  showDel: function(e){
    console.log(e)
    var key = e.currentTarget.dataset.key
    var field = key + 'Hide'
    var value = this.data[field]
    this.setData({
      mentorHide: true,
      captainHide: true,
      memberHide: true,
    })
    if (value) {
      var obj = {}
      obj[field]=false
      this.setData(obj)
    }
  },
  delMentor: function(e){
    var uid = e.currentTarget.dataset.uid
    var festid = getApp().globalData.curFestid
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/deleteMentor',
      method: 'POST',
      data: {
        uid: uid,
        festid: festid
      },
      success: function(res){
        getApp().updateUserInfo()
        that.updatePage()
      }
    })
  },
  delCaptain: function(e){
    var cancel = false
    var that = this
    var uid = e.currentTarget.dataset.uid
    var festid = getApp().globalData.curFestid
    wx.showModal({
      title: '确定删除队长？',
      content: '如果删除队长，则与队长相关的项目以及项目成员都将将同时删除，并且无法撤回',
      success: function(res){
        if (res.confirm) {
          wx.request({
            url: 'https://www.kingco.tech/index.php?s=/spark/user/deleteCaptain',
            method: 'POST',
            data: {
              uid: uid,
              festid: festid
            },
            success: function(res){
              getApp().updateUserInfo()
              that.updatePage()
            }
          })
        }
      }
    })
  },
  delMember: function(e){
    var uid = e.currentTarget.dataset.uid
    var festid = getApp().globalData.curFestid
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/deleteMember',
      method: 'POST',
      data: {
        uid: uid,
        festid: festid
      },
      success: function(res){
        getApp().updateUserInfo()
        that.updatePage()
      }
    })
  }
})
