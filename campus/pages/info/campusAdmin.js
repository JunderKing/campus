Page({
    data: {
        role: 0,
        delHidden: false,
        delHidden: false,
        delHidden: false,
    },

    onLoad: function(options){
        this.setData({
            role: getApp().gdata.role
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
            url: 'http://www.campus.com/api/campus/getOrgerInfo',
            method: 'POST',
            data: {
                userId: getApp().gdata.userId
            },
            success: function(res){
                console.log('getFestInfo=>')
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

    toOrgerAdd: function(e){
        console.log('toOrgerAdd')
        console.log(e)
        var appType = parseInt(e.currentTarget.dataset.type)
        var that = this
        var name = 'orger' + appType
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'http://www.campus.com/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: appType,
                name: name,
                path: '/pages/include/start?role=4&schoolId=' + getApp().gdata.userId
            },
            success: function(res){
                console.log('getQrcode=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                var url = 'http://www.campus.com/static/qrcode/' + name + '.png'
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

    delOrger: function(e){
        var userId = e.currentTarget.dataset.userid
        return console.log(e)
        wx.showToast({
            title: '处理中...',
            icon: 'loading',
            duration: 10000
        })
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/delOrger',
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
    }
})
