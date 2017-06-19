Page({
    data: {
        projId: 0,
        scoreId: 0,
        tScore: 0,
        aScore: 0,
        bScore: 0,
        cScore: 0,
        content: '',
    },

    onLoad: function(options){
        this.setData({
            projId: parseInt(options.projId),
        })
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading'
        })
        this.getProjScore()
    },

    getProjScore: function(){
        var that = this
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'http://www.campus.com/api/campus/getComntScore',
            method: 'GET',
            data: {
                userId: getApp().gdata.userId,
                tarType: 11,
                tarId: this.data.projId
            },
            success: function(res){
                console.log('getProjScore=>')
                console.log(res.data)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }        
                wx.hideToast()
                that.setData(res.data.projScore)
            },
            fail: function(){
                wx.hideToast()
            }
        })
    },

    setScore: function(e){
        var field = e.currentTarget.dataset.name
        var score = parseInt(e.currentTarget.dataset.score)
        this.setData({
            [field]: score
        })
    },

    formSubmit: function(e){
        var formData = e.detail.value
        var isCorrect = this.checkForm(formData)
        if (!isCorrect) { return }
        wx.showToast({
            title: '提交中...',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: "http://www.campus.com/api/campus/upsComntScore",
            method: 'POST',
            data: {
                tarType: 11,
                tarId: this.data.projId,
                userId: getApp().gdata.userId,
                content: formData.content,
                scores: {
                    tScore: this.data.tScore,
                    aScore: this.data.aScore,
                    bScore: this.data.bScore,
                    cScore: this.data.cScore
                }
            },
            success: function(res){
                console.log('upsComntScore=>')
                console.log(res.data)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }        
                wx.navigateBack()
                wx.showToast({
                    title: '提交成功'
                })
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    checkForm: function(data){
        if (!data.content) {
            wx.showToast({title: '评论不可为空'})
        } else if (!(this.data.tScore&&this.data.aScore&&this.data.bScore&&this.data.cScore)) {
            wx.showToast({title: '请打分'})
        } else {
            return true
        }
    },
})
