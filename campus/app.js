App({
    onLaunch: function (options) {
        console.log('AppOnLaunch')
    },

    login: function (options) {
        var that = this
        wx.login({
            success: function (res) {
                if (!res.code) {
                    return that.showError(1)
                }
                var loginData = {
                    code: res.code
                }
                wx.getUserInfo({
                    withCredentials: true,
                    success: function (res) {
                        loginData.iv = res.iv
                        loginData.rawData = res.encryptedData
                        loginData.appType = 4
                        that.getUserInfo(loginData, options)
                    }
                })
            },
            fail: function(res){
                that.showError(2)
            }
        })
    },

    getUserInfo: function (loginData, options) {
        var that = this;
        console.log('loginData=>')
        console.log(loginData)
        wx.request({
            url: 'https://www.kingco.tech/api/campus/login',
            method: 'POST',
            data: loginData,
            success: function (res) {
                console.log('login=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return that.showError(3)
                }
                that.gdata = res.data.userInfo
                if (options.role) {
                    that.checkOption(options, true)
                } else {
                    wx.switchTab({
                        url: '/pages/projList/projList'
                    })
                }
            },
            fail: function(){
                that.showError(2)
            }
        })
    },

    updateUserInfo: function(callback){
        var that = this;
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getUserInfo',
            method: 'GET',
            data: {
                appType: 4,
                userId: this.gdata.userId
            },
            success: function(res){
                console.log('getUserInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return that.showError(3)
                }
                that.gdata = res.data.userInfo;
                if (callback) {
                    callback()
                }
            }
        })
    },

    checkOption: function(options, isLoading, callback){
        options.role = parseInt(options.role)
        options.schlId = parseInt(options.schlId)
        options.adminId = parseInt(options.adminId)
        if (options.role === 7 && options.adminId > 0) {
            this.addAdmin(options.adminId, isLoading, callback)
        } else if (options.role === 6 && options.adminId > 0) {
            this.addSchool(options.adminId, isLoading, callback)
        } else if (options.role === 5 && options.schlId > 0) {
            this.addSchlAdmin(options.schlId, isLoading, callback)
        } else {
            wx.switchTab({
                url: '/pages/projList/projList'
            })
        }
    },

    addAdmin: function(adminId, isLoading, callback){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/addAdmin',
            method: 'GET',
            data: {
                adminId: adminId,
                userId: this.gdata.userId
            },
            success: function(res){
                console.log('addAdmin=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return that.showError(3)
                }
                that.gdata.role = 1
                if (callback) {
                    callback()
                }
                if (isLoading) {
                    wx.switchTab({
                        url: '/pages/projList/projList',
                        success: function(){
                            wx.showToast({
                                title: '恭喜您成为管理员!'
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '恭喜您成为管理员!'
                    })
                }
            }
        })
    },

    addSchool: function(adminId, isLoading, callback){
        wx.switchTab({
            url: '/pages/info/info',
            success: function(){
                wx.showToast({
                    title: '数据加载中...',
                    icon: 'loading'
                })
                wx.navigateTo({
                    url: '/pages/info/schlAdd?adminId=' + adminId
                })
            }
        })
    },

    addSchlAdmin: function(schlId, isLoading, callback){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/addSchlAdmin',
            method: 'GET',
            data: {
                schlId: schlId,
                userId: this.gdata.userId
            },
            success: function(res){
                console.log('addSchlAdmin=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return that.showError(3)
                }
                that.gdata.schlRole = 1
                if (callback) {
                    callback()
                }
                if (isLoading) {
                    wx.switchTab({
                        url: '/pages/projList/projList',
                        success: function(){
                            wx.showToast({
                                title: '恭喜您成为学校管理员!'
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '恭喜您成为学校管理员!'
                    })
                }
            }
        })
    },

    qrScan: function(callback){
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

    gdata: {
        userId: 1,
        avatarUrl: '',
        nickName: '',
        role: 0,
        schlId: 0,
        isMentor: 0,
        avlProjList: []
    }
})
