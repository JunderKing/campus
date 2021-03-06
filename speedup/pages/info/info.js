Page({
    data: {
        avatarUrl: '',
        nickName: '',
        roleStr: '',
        role: 0
    },

    onShow: function(){
        getApp().updateUserInfo()
        var gdata = getApp().gdata
        var roleStr = '创业者'
        if (gdata.role === 1) {
            roleStr = '管理员'
        } else if (gdata.campId === 1){
            roleStr = '组织者'
        } else if (gdata.isMentor === 1) {
            roleStr = '创业导师'
        }
        this.setData({
            avatarUrl: gdata.avatarUrl,
            nickName: gdata.nickName,
            stage: gdata.stage,
            campStage: gdata.campStage,
            campStage: gdata.campStage,
            meetStage: gdata.meetStage,
            roleStr: roleStr,
            role: gdata.role
        })
    },

    onShareAppMessage: function(){
        return {
            title: '火种节小程序',
            path: '/pages/include/start'
        }
    },

    toOrgerAdd: function(){
        var that = this
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 2,
                name: 'spark_orger',
                path: '/pages/include/start?role=4'
            },
            success: function(res){
                console.log('getQrcode=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                var url = 'https://www.kingco.tech/static/qrcode/spark_orger.png'
                wx.previewImage({
                    urls: [url]
                })
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    toWxcode: function(e){
        var appType = parseInt(e.currentTarget.dataset.type)
        var fileName = 'wxcode' + appType
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getWxcode',
            method: 'GET',
            data: {
                appType: appType,
                name: fileName,
                path: '/pages/include/start'
            },
            success: function(res){
                console.log('getWxcode=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                var url = 'https://www.kingco.tech/static/wxcode/' + fileName + '.png'
                var title = '小程序'
                if (appType === 1) {
                    title = '火种节小程序'
                } else if (appType === 2) {
                    title = '加速营小程序'
                } else {
                    title = '创投会小程序'
                }
                wx.showModal({
                    title: title,
                    content: '页面跳转后，长按或点击右上角菜单，选择『识别图中小程序码』即可打开小程序',
                    showCancel: false,
                    success: function(){
                        wx.previewImage({
                            urls: [url]
                        })
                    }
                })
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    }
})
