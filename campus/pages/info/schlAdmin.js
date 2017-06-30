Page({
    data: {
        mentors: [],
        projList: [],
        delHidden: false,
    },

    onLoad: function(options){
        this.setData({
            festId: options.festId,
            role: getApp().gdata.role
        })
    },

    onShow: function(){
        this.getSchlInfo()
    },

    getSchlInfo: function(){
        var that = this
        wx.showToast({
            title: '数据加载中……',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getSchlList',
            method: 'POST',
            data: {
                userId: getApp().gdata.userId
            },
            success: function(res){
                console.log('getSchlList=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }        
                wx.hideToast()
                that.setData(res.data.adminInfo)
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    toAdminAdd: function(){
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        var fileName = 'campusvc-admin-' + getApp().gdata.userId
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 4,
                name: fileName,
                path: '/pages/include/start?role=7&adminId=' + getApp().gdata.userId
            },
            success: function(res){
                console.log('getQrcode=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                var url = 'https://www.kingco.tech/static/qrcode/' + fileName + '.png'
                wx.navigateTo({
                    url: '/pages/include/qrpage?url=' + url
                })
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    toSchlAdd: function(){
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        var fileName = 'school_add-' + getApp().gdata.userId
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 4,
                name: fileName,
                path: '/pages/include/start?role=6&adminId=' + getApp().gdata.userId
            },
            success: function(res){
                console.log('getQrcode=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                var url = 'https://www.kingco.tech/static/qrcode/' + fileName + '.png'
                console.log(url)
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

    delAdmin: function(e){
        var userId = e.currentTarget.dataset.userid
        wx.showToast({
            title: '处理中...',
            icon: 'loading',
            duration: 10000
        })
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/delAdmin',
            method: 'POST',
            data: {
                adminId: getApp().gdata.userId,
                userId: userId
            },
            success: function(res){
                console.log('delAdmin=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                wx.showToast({
                    title: '管理员已删除!'
                })
                that.getSchlInfo()
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    }
})
