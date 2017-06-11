Page({
    data:{
        postList: []
    },

    onShow: function(){
        this.getPostList()
    },

    getPostList: function(){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getPostList',
            method: 'POST',
            data: {
                userId: getApp().gdata.userId
            },
            success: function(res){
                wx.hideToast()
                console.log('getPostList=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData({
                    'postList': res.data.postList
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
