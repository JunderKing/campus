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
    }
})
