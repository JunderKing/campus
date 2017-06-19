Page({
    data: {
        festId: 0,
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
        this.getFestInfo()
    },

    getFestInfo: function(){
        var that = this
        wx.showToast({
            title: '数据加载中……',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'http://www.campus.com/api/spark/getFestInfo',
            method: 'POST',
            data: {
                festId: this.data.festId
            },
            success: function(res){
                console.log('getFestInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }        
                wx.hideToast()
                that.setData(res.data.festInfo)
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    toMentorAdd: function(){
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        var fileName = 'spark_fest_mentor_' + this.data.festId
        wx.request({
            url: 'http://www.campus.com/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 1,
                name: fileName,
                path: '/pages/include/start?role=3&festId=' + this.data.festId
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
        var fileName = 'spark_fest_proj_' + this.data.festId
        wx.request({
            url: 'http://www.campus.com/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 1,
                name: fileName,
                path: '/pages/include/start?role=2&festId=' + this.data.festId
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

    delMentor: function(e){
        var userId = e.currentTarget.dataset.userid
        wx.showToast({
            title: '处理中...',
            icon: 'loading',
            duration: 10000
        })
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/spark/delFestMentor',
            method: 'POST',
            data: {
                userId: userId,
                festId: this.data.festId
            },
            success: function(res){
                console.log('delFestMentor=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.showToast({
                    title: '导师已删除!'
                })
                that.getFestInfo()
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
                    url: 'http://www.campus.com/api/spark/delFestProject',
                    method: 'POST',
                    data: {
                        projId: projId,
                        festId: that.data.festId
                    },
                    success: function(res){
                        console.log('delFestProject=>')
                        console.log(res)
                        if (res.statusCode !== 200 || res.data.errcode !== 0) {
                            return getApp().showError(3)
                        }
                        wx.showToast({
                            title: '项目已删除!'
                        })
                        that.getFestInfo()
                    },
                    fail: function(){
                        getApp().showError(2)
                    }
                })
            }
        })
    },

    delFestival: function(e){
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
                    url: 'http://www.campus.com/api/spark/delFestival',
                    method: 'POST',
                    data: {
                        festId: that.data.festId
                    },
                    success: function(res){
                        console.log('delFestival=>')
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
