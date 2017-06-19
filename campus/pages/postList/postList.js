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
            url: 'http://www.campus.com/api/campus/getPostList',
            method: 'GET',
            data: {
                userId: getApp().gdata.userId
            },
            success: function(res){
                console.log('getPostList=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
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
