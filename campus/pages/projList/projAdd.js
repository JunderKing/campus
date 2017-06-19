Page({
    data: {
        festId: 0,
        logo: '',
        provinceList: ['北京市','天津市','上海市','重庆市','河北省','山西省','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','海南省','四川省','贵州省','云南省','陕西省','甘肃省','青海省','台湾省','内蒙古自治区','广西壮族自治区','西藏自治区','宁夏回族自治区','新疆维吾尔自治区','香港特别行政区','澳门特别行政区'],
        province: '',
        provinceId: 0,
    },

    onLoad: function(options){
        if (!options.festId) {
            return
        }
        this.setData({
            festId: options.festId
        })
    },

    onPickerChange: function(e) {
        var index = e.detail.value;
        this.setData({
            provinceId: index,
            province: this.data.provinceList[index]
        })
    },  

    formSubmit: function(e) {
        var formData = e.detail.value
        var isCorrect = this.checkForm(formData)
        if (!isCorrect) { return }
        var that = this
        wx.showToast({
            title: '提交中……',
            icon: 'loading',
            duration: 10000
        })
        if (isCorrect === 1) {
            wx.request({
                url: 'http://www.campus.com/api/campus/addProject',
                method: 'POST',
                data: {
                    appType: 1,
                    actId: this.data.festId,
                    userId: getApp().gdata.userId,
                    name: formData.name,
                    province: this.data.provinceId,
                    tag: formData.tag,
                    intro: formData.intro
                },
                success: function(res){
                    wx.hideToast()
                    console.log('addProject=>')
                    console.log(res)
                    if (res.statusCode !== 200 || res.data.errcode !== 0) {
                        return getApp().showError(3)
                    }
                    wx.switchTab({
                        url: '/pages/projList/projList',
                        success: function(){
                            wx.showToast({
                                title: '项目创建成功!'
                            })
                        }
                    })
                },
                fail: function(res){
                    wx.hideToast()
                    getApp().showError(2)
                }
            })
        } else if (isCorrect === 2){
            wx.uploadFile({
                url: "http://www.campus.com/api/campus/addProject",
                filePath: this.data.logo,
                name: 'projLogo',
                formData: {
                    appType: 1,
                    actId: this.data.festId,
                    userId: getApp().gdata.userId,
                    name: formData.name,
                    province: this.data.provinceId,
                    tag: formData.tag,
                    intro: formData.intro
                },
                success: function(res){
                    wx.hideToast()
                    console.log('addProject=>')
                    console.log(res)
                    res.data = JSON.parse(res.data)
                    if (res.statusCode !== 200 || res.data.errcode !== 0) {
                        return getApp().showError(3)
                    }
                    wx.switchTab({
                        url: '/pages/projList/projList',
                        success: function(){
                            wx.showToast({
                                title: '项目创建成功!'
                            })
                        }
                    })
                },
                fail: function(res){
                    wx.hideToast()
                    getApp().showError(2)
                }
            })
        }
    },

    checkForm: function(data){
        if (!data.name) {
            wx.showToast({title: '请填写项目标题!'})
        } else if (this.data.provinceId === false) {
            wx.showToast({title: '请选择项目省份!'})
        } else if (!data.tag) {
            wx.showToast({title: '请填写项目标签!'})
        } else if (!data.intro) {
            wx.showToast({title: '请填写项目简介!'})
        } else if (!this.data.logo) {
            return 1
        } else {
            return 2
        }
    },

    chooseLogo: function(e) {
        var that = this
        wx.chooseImage({
            count: 1,
            success: function(res){
                console.log(res)
                that.setData({
                    logo: res.tempFilePaths[0]
                })
            }
        })
    }
})

