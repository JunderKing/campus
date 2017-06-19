Page({
    data: {
        meetId: 0,
        invors: [],
        projList: [],
        delHidden: false,
    },

    onLoad: function(options){
        this.setData({
            meetId: options.meetId,
            role: getApp().gdata.role
        })
    },

    onShow: function(){
        this.getMeetInfo()
    },

    getMeetInfo: function(){
        var that = this
        wx.showToast({
            title: '数据加载中……',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'http://www.campus.com/api/venture/getMeetInfo',
            method: 'POST',
            data: {
                meetId: this.data.meetId
            },
            success: function(res){
                console.log('getMeetInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                that.setData(res.data.meetInfo)
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    toInvorAdd: function(){
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        var fileName = 'venture_meet_invor_' + this.data.meetId
        wx.request({
            url: 'http://www.campus.com/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 3,
                name: fileName,
                path: '/pages/include/start?role=3&meetId=' + this.data.meetId
            },
            success: function(res){
                console.log('getQrcode=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                var url = 'http://www.campus.com/static/qrcode/' + fileName + '.png'
                wx.navigateTo({
                    url: '/pages/include/qrpage?url=' + url
                })
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    toProjAdd: function(){
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        var fileName = 'venture_meet_proj_' + this.data.meetId
        wx.request({
            url: 'http://www.campus.com/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 3,
                name: fileName,
                path: '/pages/include/start?role=2&meetId=' + this.data.meetId
            },
            success: function(res){
                console.log('getQrcode=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                var url = 'http://www.campus.com/static/qrcode/' + fileName + '.png'
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

    delInvor: function(e){
        var userId = e.currentTarget.dataset.userid
        wx.showToast({
            title: '处理中...',
            icon: 'loading',
            duration: 10000
        })
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/venture/delMeetInvor',
            method: 'POST',
            data: {
                userId: userId,
                meetId: this.data.meetId
            },
            success: function(res){
                console.log('delMeetInvor=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.showToast({
                    title: '导师已删除!'
                })
                that.getMeetInfo()
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    delProject: function(e){
        var that = this
        var projId = e.currentTarget.dataset.projid
        wx.showModal({
            title: '确定删除项目？',
            content: '删除后无法恢复',
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
                    url: 'http://www.campus.com/api/venture/delMeetProject',
                    method: 'POST',
                    data: {
                        projId: projId,
                        meetId: that.data.meetId
                    },
                    success: function(res){
                        console.log('delMeetProject=>')
                        console.log(res)
                        if (res.statusCode !== 200 || res.data.errcode !== 0) {
                            return getApp().showError(3)
                        }
                        wx.showToast({
                            title: '项目已删除!'
                        })
                        that.getMeetInfo()
                    },
                    fail: function(){
                        getApp().showError(2)
                    }
                })
            }
        })
    },

    delMeetival: function(e){
        var that = this
        wx.showModal({
            title: '确定删除火种节？',
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
                    url: 'http://www.campus.com/api/venture/delMeetival',
                    method: 'POST',
                    data: {
                        meetId: that.data.meetId
                    },
                    success: function(res){
                        console.log('delMeetival=>')
                        console.log(res)
                        if (res.statusCode !== 200 || res.data.errcode !== 0) {
                            return getApp().showError(3)
                        }
                        wx.navigateBack()
                        wx.showToast({
                            title: '火种节已删除!'
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
