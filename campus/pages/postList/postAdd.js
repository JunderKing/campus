Page({
    data:{
        imageNum: 0,
        imageUrls: []
    },

    onShow: function(){
        this.setData({
            imageNum: 0
        })
    },

    formSubmit: function(e) {
        var formData = e.detail.value
        var isCorrect = this.checkForm(formData)
        if (!isCorrect) { return }
        var that = this
        wx.showToast({
            title: '提交中……',
            icon: 'loading',
            duration: 10000
        })
        var timeId = parseInt(new Date().getTime()/1000);
        if (this.data.imageUrls.length === 0) {
            return this.addPost(timeId, formData.content)
        }
        this.data.imageUrls.forEach(function(item, index){
            that.uploadFile(index, item, timeId, formData.content)
        })
    },

    addPost: function(timeId, content){
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/addPost',
            method: 'POST',
            data: {
                userId: getApp().gdata.userId,
                timeId: timeId,
                imageNum: 0,
                content: content
            },
            success: function(res){
                wx.hideToast()
                console.log('addPost=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.switchTab({
                    url: '/pages/postList/postList',
                    success: function(){
                        wx.showToast({
                            title: '资源发布成功!'
                        })
                    }
                })
            }
        })
    },

    uploadFile: function(index, imageUrl, timeId, content){
        var that = this
        wx.uploadFile({
            url: "http://www.campus.com/api/campus/addPost",
            filePath: imageUrl,
            name: 'postImage',
            formData: {
                userId: getApp().gdata.userId,
                timeId: timeId,
                imageNum: index + 1,
                content: content
            },
            success: function(res){
                console.log('addPost=>')
                console.log(res)
                res.data = JSON.parse(res.data)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData({
                    imageNum: that.data.imageNum + 1
                })
                if (that.data.imageNum === that.data.imageUrls.length) {
                    wx.switchTab({
                        url: '/pages/postList/postList',
                        success: function(){
                            wx.showToast({
                                title: '资源发布成功!'
                            })
                        }
                    })
                }
            },
            fail: function(res){
                wx.hideToast()
                getApp().showError(2)
            }
        })
    },

    checkForm: function(data){
        if (!data.content) {
            wx.showToast({title: '请填写资源内容'})
        } else {
            return true
        }
    },

    chooseImage: function(e) {
        var that = this
        var imageArr = this.data.imageUrls
        var imageNum = imageArr.length
        wx.chooseImage({
            count: 9 - imageNum,
            success: function(res){
                console.log(res)
                var imageUrls = imageArr.concat(res.tempFilePaths)
                that.setData({
                    imageUrls: imageUrls
                })
            }
        })
    }
})
