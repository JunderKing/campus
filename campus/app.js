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
                return that.showError(2)
            }
        })
    },

    getUserInfo: function (loginData, options) {
        var that = this;
        console.log('loginData')
        console.log(loginData)
        wx.request({
            url: 'http://www.campus.com/api/campus/login',
            method: 'POST',
            data: loginData,
            success: function (res) {
                console.log('login=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return that.showError(3)
                }
                that.gdata = res.data.userInfo
                wx.switchTab({
                    url: '/pages/projList/projList'
                })
            },
            fail: function(){
                that.showError(2)
            }
        })
    },

    updateUserInfo: function(callback){
        var that = this;
        wx.request({
            url: 'http://www.campus.com/api/campus/getUserInfo',
            method: 'POST',
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
        schoolId: 0,
        isMentor: 0,
        avlProjList: []
    }
})
