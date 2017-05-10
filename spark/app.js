App({
  login: function (options) {
    var that = this
    wx.login({
      success: function (res) {
        if (!res.code) {
          console.log("Login Refused!:" + res.errMsg)
          return
        }
        var loginData = {}
        loginData.code = res.code
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            loginData.iv = res.iv
            loginData.rawData = res.encryptedData
            that.getUserInfo(loginData, options)
          }
        })
      },
      fail: function(res){
        console.log("Login Failed!")
      }
    })
  },

  getUserInfo: function (loginData, options) {
    var that = this;
    console.log('loginData')
    console.log(loginData)
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/login',
      method: 'POST',
      data: loginData,
      success: function (res) {
        console.log('UserInfo=>')
        console.log(res)
        that.globalData = res.data;
        if (options.role) {
          that.checkOption(options, true)
        } else {
          wx.switchTab({
            url: '/pages/project/project'
          })
        }
      }
    })
  },

  updateUserInfo: function(callback){
    var that = this;
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/getUserInfo',
      method: 'POST',
      data: {
        uid: that.globalData.uid,
      },
      success: function(res){
        console.log('updateUserinfo=>')
        console.log(res.data)
        that.globalData = res.data;
        if (callback) { callback() }
      }
    })
  },

  checkOption: function(options, isLoading, callback){
    options.role = parseInt(options.role)
    options.festid = parseInt(options.festid)
    options.projid = parseInt(options.projid)
    console.log(options)
    if (options.role === 4) {
      this.beOrganizer(isLoading, callback)
    } else if (options.role === 3 && options.festid > 0) {
      this.beMentor(options.festid, isLoading, callback)
    } else if (options.role === 2 && options.festid > 0) {
      this.beCaptain(options.festid, isLoading, callback)
    } else if (options.role === 1 && options.projid > 0) {
      this.beMember(options.projid, isLoading, callback)
    } else {
      wx.switchTab({
        url: '/pages/project/project'
      })
    }
  },

  beOrganizer: function(isLoading, callback){
    var uid = this.globalData.uid
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/addOrganizer',
      method: 'POST',
      data: {uid: uid},
      success: function(res){
        //that.updateUserInfo()
        if (res.data) {
          console.log('Become organizer')
          that.globalData.sfRole = 1
          if (callback) {
            callback()
          }
          wx.switchTab({
            url: '/pages/festival/festival'
          })
          wx.showToast({
            title: '成功成为组织者!',
            icon: 'success'
          })
        }
      }
    })
  },

  beMentor: function(festid, isLoading, callback){
    var reqData = {
      festid: festid,
      uid: this.globalData.uid
    }
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/addMentor',
      method: 'POST',
      data: reqData,
      success: function(res){
        //that.updateUserInfo()
        if (res.data) {
          console.log('Become Mentor!')
          that.globalData.isMentor = 1
          if (callback) {
            callback()
          }
          if (isLoading) {
            wx.switchTab({
              url: '/pages/project/project'
            })
          }
          wx.showToast({
            title: '恭喜您成为火种节导师!',
            icon: 'success'
          })
        }
      }

    })
  },

  beCaptain: function(festid, isLoading, callback){
    var reqData = {
      festid: festid,
      uid: this.globalData.uid
    }
    console.log('beCaptain')
    console.log(reqData)
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/addCaptain',
      method: 'POST',
      data: reqData,
      success: function(res){
        //that.updateUserInfo()
        if (res.data) {
          console.log('Become Captain!')
          console.log(res)
          that.globalData.isCaptain = 1
          that.globalData.curFestid = festid
          if (callback) {
            callback()
          }
          if (isLoading) {
            wx.switchTab({
              url: '/pages/project/project'
            })
          }
          wx.navigateTo({
            url: '/pages/project/newProj'
          })
          wx.showToast({
            title: '恭喜您成为项目负责人!',
            icon: 'success'
          })
        }
      }
    })
  },

  beMember: function(projid, isLoading, callback){
    var reqData = {
      uid: this.globalData.uid,
      projid: projid
    }
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/user/addMember',
      method: 'POST',
      data: reqData,
      success: function(res){
        console.log('beMember=>')
        console.log(res)
        if (res.data.festid) {
          console.log('Become Member!')
          that.globalData.curFestid = res.data.festid
          if (callback) {
            callback()
          }
          if (isLoading) {
            wx.switchTab({
              url: '/pages/project/project'
            })
          }
          wx.showToast({
            title: '成功加入项目!',
            icon: 'success'
          })
        }
      }
    })
  },

  qrScan: function(callback){
    var that = this
    wx.scanCode({
      success: function(res){
        wx.showLoading({
          title: '数据处理中...',
          mask: true
        })
        var data = that.queryString(res.path)
        that.checkOption(data, false, callback)
      }
    })
  },

  queryString: function (url) {
    var urlObject = {}
    if (/\?/.test(url)) {
      var urlString = url.substring(url.indexOf('?') + 1)
      var urlArray = urlString.split('&')
      for (var i = 0, len = urlArray.length; i < len; i++) {
        var urlItem = urlArray[i]
        var item = urlItem.split('=')
        urlObject[item[0]] = item[1]
      }
      return urlObject
    }
  },

  globalData: {
    uid: 0,
    avatar: '',
    nickName: '',
    cpRole: 0,
    sfRole: 0,
    curFestid: 0,
    isCaptain: 0,
    isMentor: 0
  }
})
