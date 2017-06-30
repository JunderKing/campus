Page({
    data:{
        postId: 0
    },

    onLoad: function(options){
        this.setData({
            postId: options.postId
        })
    },

    onShow: function(){
        this.getPostInfo()
        this.getComnt()
    },

    getPostInfo: function(){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getPostInfo',
            method: 'POST',
            data: {
                postId: this.data.postId
            },
            success: function(res){
                wx.hideToast()
                console.log('getPostInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData(res.data.postInfo)
            }
        })
    },

    delPost: function(){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/delPost',
            method: 'POST',
            data: {
                postId: this.data.postId
            },
            success: function(res){
                wx.hideToast()
                console.log('delPost=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.navigateBack()
                wx.showToast({
                    title: '资源删除成功！'
                })
            }
        })
    },

    preview: function(e){
        var cur = e.currentTarget.dataset.cur
        var urls = e.currentTarget.dataset.urls
        wx.previewImage({
            current: cur,
            urls: urls,
            success: function(res){
                console.log("success")
            }
        })
    },

    getComnt: function(){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getComnt',
            method: 'POST',
            data: {
                tarType: 42,
                tarId: this.data.postId
            },
            success: function(res){
                wx.hideToast()
                console.log('getComnt=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData({comnts: res.data.comnts})
            }
        })
    },

    showComntMenu: function(e){
        var comntId = e.currentTarget.dataset.comntid
        var comntorId = e.currentTarget.dataset.comntorid
        var userId = getApp().gdata.userId
        var that = this
        if (userId === comntorId) {
            wx.showActionSheet({
                itemList: ['删除该评论'],
                success: function(res){
                    if (res.tapIndex === 0) {
                        that.delComnt(comntId)
                    }
                }
            })
        }
    },

    delComnt: function(comntId) {
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/delComnt',
            method: 'GET',
            data: {
                comntId: comntId
            },
            success: function(res){
                console.log('delComnt=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.showToast({
                    title: '评论已删除',
                    icon: 'success'
                })
                that.getComnt()
            }
        })
    }
})
