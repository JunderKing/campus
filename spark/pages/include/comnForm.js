Page({
    data: {
        type: '',
        holder: '',
        content: ''
    },
    onLoad: function(options){
        this.setData(options)
        switch (options.type) {
            case 'progress':
                this.setData({
                    projId: parseInt(options.projId),
                    stepNum: parseInt(options.stepNum),
                    holder: '请填写图片描述'
                })
                break;
            case 'addComnt':
                this.setData({
                    projId: parseInt(options.projId),
                    holder: '评论一下...'
                })
                break;
            case 'addReply':
                this.setData({
                    comntId: parseInt(options.comntId),
                    holder: '请写下您的看法...'
                })
                break;
        }
    },

    formSubmit: function(e){
        var content = e.detail.value.content
        if (!content) {
            return wx.showToast({
                title: '内容不可为空',
                icon: 'loading'
            })
        }
        wx.showToast({
            title: '提交中...',
            icon: 'loading',
            duration: 10000
        })
        switch (this.data.type) {
            case 'progress':
                this.updProgContent(content)
                break;
            case 'addComnt':
                this.addComnt(content)
                break;
            case 'addReply':
                this.addReply(content)
                break;
        }
    },

    updProgContent: function(content){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/spark/updProgContent',
            method: 'POST',
            data: {
                projId: this.data.projId,
                stepNum: this.data.stepNum,
                content: content
            },
            success: function(res){
                console.log('updProgContent=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.navigateBack()
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    addComnt: function(content){
        wx.request({
            url: 'https://www.kingco.tech/api/campus/addComnt',
            method: 'POST',
            data: {
                tarType: 11,
                tarId: this.data.projId,
                userId: getApp().gdata.userId,
                content: content
            },
            success: function(res){
                console.log('addComnt=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.navigateBack()
                wx.showToast({
                    title: '评论成功!'
                })
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    addReply: function(content){
        wx.request({
            url: 'https://www.kingco.tech/api/campus/addReply',
            method: 'POST',
            data: {
                userId: getApp().gdata.userId,
                comntId: this.data.comntId,
                content: content
            },
            success: function(res){
                console.log('addReply=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.navigateBack()
                wx.showToast({
                    title: '回复成功!'
                })
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    }
})

