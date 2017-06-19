Page({
    data: {
        projId: 0,
        scroll: 0,
        cur: 0,
        stepTitle: ['组队','理解', '定义', '发散', '决定', '原型', '验证'],
        stepText: [
            '通过演讲和投票选出来最好的主意来进行组队',
            '全方位发散地去理解用户所面临的所有问题',
            '在所有问题中，定义什么是我们真正要去解决的那一个问题',
            '用极速脑暴的方式，为解决该问题，想出来各种可能的主意',
            '用沉默投票的方式，来解决该问题，来决定采用哪个主意',
            '为『对的主意』，用最短的时间，去做一个产品原型',
            '找五个用户来，让他们体验原型过程中发声思考，进行验证'
        ],
        progInfo: [
            { stepNum: 1, title: "组队", imageUrl: "", content: "" },
            { stepNum: 2, title: "理解", imageUrl: "", content: "" },
            { stepNum: 3, title: "定义", imageUrl: "", content: "" },
            { stepNum: 4, title: "发散", imageUrl: "", content: "" },
            { stepNum: 5, title: "决定", imageUrl: "", content: "" },
            { stepNum: 6, title: "原型", imageUrl: "", content: "" },
            { stepNum: 7, title: "验证", imageUrl: "", content: "" }
        ]
    },

    onLoad: function(options){
        this.setData({
            projId: options.projId
        })
    },

    onShow: function(){
        this.getProgInfo()
    },

    getProgInfo: function(){
        console.log('getProgInfo')
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/spark/getProgInfo',
            method: 'GET',
            data: {
                projId: this.data.projId
            },
            success: function(res){
                console.log('getProgInfo=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                res.data.progInfo.forEach(function(item){
                    var index = item.stepNum -1
                    var progInfo = that.data.progInfo
                    progInfo[index].imageUrl = item.imageUrl
                    progInfo[index].content = item.content
                    that.setData({
                        progInfo: progInfo
                    })
                })
            }
        })
    },

    toStep: function(e){
        this.setData({
            scroll:e.currentTarget.dataset.stepid,
        })
    },

    chooseImage: function(e){
        var stepNum = e.currentTarget.dataset.stepid
        var projId = this.data.projId
        var index = stepNum - 1
        var that = this
        wx.chooseImage({
            count: 1,
            success: function(res){
                var url = res.tempFilePaths[0]
                wx.showToast({
                    title: '图片上传中……',
                    icon: 'loading'
                })
                wx.uploadFile({
                    url: 'http://www.campus.com/api/spark/updProgImage',
                    filePath: url,
                    name: 'progImage',
                    formData: {
                        projId: that.data.projId,
                        stepNum: stepNum
                    },
                    success: function(res){
                        console.log('updProgImage=>')
                        console.log(res)
                        wx.hideToast()
                        res.data = JSON.parse(res.data)
                        if (res.statusCode !== 200 || res.data.errcode !== 0) {
                            return getApp().showError(3)
                        }
                        wx.showToast({
                            title: '图片上传成功!'
                        })
                        that.getProgInfo()
                    },
                    fail: function(res){
                        console.log('fail')
                        console.log(res)
                        wx.showToast({
                            title: '图片上传失败，请重试!',
                            icon: 'loading'
                        })
                    }
                })
            }
        })
    },

    preview: function(e){
        var url = e.currentTarget.dataset.url
        wx.previewImage({
            urls: [url],
            success: function(res){
                console.log("success")
            }
        })
    },

    onScroll: function(e) {
        var areaHeight = e.detail.scrollHeight / 7
        var top = e.detail.scrollTop
        if (this.data.scroll !== top / areaHeight) {
            this.setData({
                cur: top / areaHeight
            })
        }
    }
})
