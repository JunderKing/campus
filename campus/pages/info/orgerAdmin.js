Page({
    data: {
        role: 0,
        delHidden: false,
    },

    onLoad: function(options){
        this.setData({
            role: getApp().gdata.role,
            schlId: parseInt(options.schlId)
        })
    },

    onShow: function(){
        this.getOrgerInfo()
    },

    getOrgerInfo: function(){
        var that = this
        wx.showToast({
            title: '数据加载中……',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getOrgerInfo',
            method: 'POST',
            data: {
                userId: getApp().gdata.userId,
                schlId: this.data.schlId
            },
            success: function(res){
                console.log('getOrgerInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }        
                wx.hideToast()
                that.setData(res.data.orgerInfo)
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    toSchlAdminAdd: function(e){
        console.log('toSchlAdminAdd->')
        console.log(e)
        var appType = parseInt(e.currentTarget.dataset.type)
        var that = this
        var name ='school-admin-' + getApp().gdata.schlId
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 4,
                name: name,
                path: '/pages/include/start?role=5&schlId=' + getApp().gdata.schlId
            },
            success: function(res){
                console.log('getQrcode=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                var url = 'https://www.kingco.tech/static/qrcode/' + name + '.png'
                wx.navigateTo({
                    url: '/pages/include/qrpage?url=' + url
                })
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    toOrgerAdd: function(e){
        console.log('toOrgerAdd')
        console.log(e)
        var appType = parseInt(e.currentTarget.dataset.type)
        var that = this
        var name ='school-orger-' + appType + '-' + getApp().gdata.schlId
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: appType,
                name: name,
                path: '/pages/include/start?role=4&schlId=' + getApp().gdata.schlId
            },
            success: function(res){
                console.log('getQrcode=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                var url = 'https://www.kingco.tech/static/qrcode/' + name + '.png'
                wx.navigateTo({
                    url: '/pages/include/qrpage?url=' + url
                })
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    showDel: function(e){
        var delHidden = this.data.delHidden;
        if (delHidden) {
            this.setData({
                delHidden: false
            })
        } else {
            this.setData({
                delHidden: true
            })
        }
    },

    delSchlAdmin: function(e){
        var userId = e.currentTarget.dataset.userid
        wx.showToast({
            title: '处理中...',
            icon: 'loading',
            duration: 10000
        })
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/delSchlAdmin',
            method: 'POST',
            data: {
                userId: userId,
                schlId: this.data.schlId
            },
            success: function(res){
                console.log('delSchlAdmin=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.showToast({
                    title: '学校管理员已删除!'
                })
                that.getFestInfo()
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    delOrger: function(e){
        var userId = e.currentTarget.dataset.userid
        var appType = parseInt(e.currentTarget.dataset.type)
        wx.showToast({
            title: '处理中...',
            icon: 'loading',
            duration: 10000
        })
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/delOrger',
            method: 'POST',
            data: {
                appType: appType,
                userId: userId
            },
            success: function(res){
                console.log('delFestMentor=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.showToast({
                    title: '组织者已删除!'
                })
                that.getFestInfo()
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    delSchool: function(e){
        var that = this
        wx.showModal({
            title: '确定删除学校？',
            content: '删除后相关数据将丢失!',
            success: function(res){
                if (!res.confirm) {
                    return
                }
                wx.showToast({
                    title: '处理中...',
                    icon: 'loading',
                    duration: 10000
                })
                wx.request({
                    url: 'https://www.kingco.tech/api/campus/delSchool',
                    method: 'POST',
                    data: {
                        schlId: that.data.schlId
                    },
                    success: function(res){
                        console.log('delSchool=>')
                        console.log(res)
                        if (res.statusCode !== 200 || res.data.errcode !== 0) {
                            return getApp().showError(3)
                        }
                        wx.navigateBack()
                        wx.showToast({
                            title: '学校已删除!'
                        })
                    },
                    fail: function(){
                        getApp().showError(2)
                    }
                })
            }
        })
    }
})
