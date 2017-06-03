App({
  onLaunch: function (options) {
    console.log('AppOnLaunch')
    console.log(options)
  },

  login: function (options) {
    var that = this
    wx.login({
      success: function (res) {
        if (!res.code) {
          return that.showError(1)
        }
        var loginData = {}
        loginData.code = res.code
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            loginData.iv = res.iv
            loginData.rawData = res.encryptedData
            loginData.type = 1
            that.getUserInfo(loginData, options)
          }
        })
      },
      fail: function(res){
        return that.showError(2)
      }
    })
  },

  getUserInfo: function (loginData, options) {
    var that = this;
    console.log('loginData')
    console.log(loginData)
    wx.request({
      url: 'https://www.kingco.tech/api/spark/login',
      method: 'POST',
      data: loginData,
      success: function (res) {
        console.log('UserInfo=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return that.showError(3)
        }
        that.gdata = res.data.userInfo
        if (options.role) {
          that.checkOption(options, true)
        } else {
          wx.switchTab({
            url: '/pages/project/project'
          })
        }
      },
      fail: function(){
        return that.showError(2)
      }
    })
  },

  showError: function(errcode){
    var errmsg = ''
    switch (errcode) {
      case 1:
        errmsg = '获取授权失败，请重试'
        break;
      case 2:
        errmsg = '接口调用失败，请重试'
        break;
      case 3:
        errmsg = '网络错误，请重试'
        break;
      case 4:
        errmsg = '数据错误，请重试'
        break;
      default:
        errmsg = '未知错误'
    }
    wx.showToast({
      title: errmsg,
      icon: 'loading'
    })
  },

  updateUserInfo: function(callback){
    var that = this;
    wx.request({
      url: 'https://www.kingco.tech/api/spark/getUserInfo',
      method: 'POST',
      data: {
        userId: this.gdata.userId,
      },
      success: function(res){
        console.log('getUserInfo=>')
        console.log(res.data)
        that.gdata = res.data.userInfo;
        if (callback) { callback() }
      }
    })
  },

  checkOption: function(options, isLoading, callback){
    options.role = parseInt(options.role)
    options.festId = parseInt(options.festId)
    options.projId = parseInt(options.projId)
    if (options.role === 4) {
      this.addOrger(isLoading, callback)
    } else if (options.role === 3 && options.festId > 0) {
      this.addMentor(options.festId, isLoading, callback)
    } else if (options.role === 2 && options.festId > 0) {
      this.addProject(options.festId, isLoading, callback)
    } else if (options.role === 1 && options.projId > 0) {
      this.addMember(options.projId, isLoading, callback)
    } else {
      wx.switchTab({
        url: '/pages/project/project'
      })
    }
  },

  addOrger: function(isLoading, callback){
    wx.showToast({
      title: '数据处理中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/spark/addOrger',
      method: 'GET',
      data: {
        userId: this.gdata.userId
      },
      success: function(res){
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return that.showError(3)
        }
        that.gdata.festRole = 1
        if (callback) {
          callback()
        }
        wx.switchTab({
          url: '/pages/project/project',
          success: function(){
            wx.showToast({
              title: '恭喜您成为组织者!',
              icon: 'success'
            })
          }
        })
      }
    })
  },

  addMentor: function(festId, isLoading, callback){
    console.log('addMentor')
    wx.showToast({
      title: '数据处理中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/spark/addFestMentor',
      method: 'POST',
      data: {
        userId: this.gdata.userId,
        festId: festId
      },
      success: function(res){
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return that.showError(3)
        }
        that.gdata.isMentor = 1
        wx.switchTab({
          url: '/pages/project/project',
          success: function(){
            wx.showToast({
              title: '恭喜您成为火种节导师!'
            })
          }
        })
      }
    })
  },

  addProject: function(festId, isLoading, callback){
    wx.showToast({
      title: '数据处理中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/spark/getAvlProjList',
      method: 'GET',
      data: {
        userId: getApp().gdata.userId,
        festId: festId
      },
      success: function(res){
        console.log('getUserProjList=>')
        console.log(res)
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        var projList = res.data.projList
        wx.switchTab({
          url: '/pages/project/project',
          success: function(){
            if (projList.length === 0) {
              wx.navigateTo({
                url: '/pages/project/projAdd?festId=' + festId
              })
            } else {
              that.gdata.avlProjList = projList
              wx.navigateTo({
                url: '/pages/project/projChoose?festId=' + festId
              })
            }
          }
        })
      },
      fail: function(){
        return getApp().showError(2)
      }
    })
  },

  addMember: function(projId, isLoading, callback){
    wx.showToast({
      title: '数据处理中...',
      icon: 'loading',
      duration: 10000
    })
    var reqData = {
      userId: this.gdata.userId,
      projId: projId
    }
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/api/spark/addProjMember',
      method: 'POST',
      data: reqData,
      success: function(res){
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return that.showError(3)
        }
        if (callback) {
          callback()
        }
        wx.switchTab({
          url: '/pages/project/project',
          success: function(){
            wx.showToast({
              title: '成功加入项目!',
              icon: 'success'
            })
          }
        })
      }
    })
  },

  qrScan: function(callback){
    console.log('qrScan')
    var that = this
    wx.scanCode({
      success: function(res){
        wx.showToast({
          title: '数据处理中...',
          icon: 'loading',
          duration: 10000
        })
        var data = that.queryString(res.path)
        console.log('qrScan=>')
        console.log(data)
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

  getCityStr: function(index){
    var provinceList = ['北京市','天津市','上海市','重庆市','河北省','山西省','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','海南省','四川省','贵州省','云南省','陕西省','甘肃省','青海省','台湾省','内蒙古自治区','广西壮族自治区','西藏自治区','宁夏回族自治区','新疆维吾尔自治区','香港特别行政区','澳门特别行政区']
    return provinceList[index]
  },

  gdata: {
    userId: 1,
    avatarUrl: '',
    nickName: '',
    role: 0,
    festRole: 0,
    curFestId: 0,
    curProjId: 0,
    isMentor: 0,
    avlProjList: []
  }
})

