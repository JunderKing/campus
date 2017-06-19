Page({
    data: {
        title: "",
        intro: "",
        projId: 0,
        festId: 0,
        isMentor: 0,
        isMember: 0,
        members: [],
        comnts: []
    },

    onLoad: function(options) {
        this.setData({
            projId: parseInt(options.projId),
            isMentor: parseInt(options.isMentor),
            isMember: parseInt(options.isMember),
            role: getApp().gdata.role
        })
    },

    onShow: function(){
        this.updateProjInfo()
        this.getComnt()
    },

    updateProjInfo: function(){
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/getProjInfo',
            method: 'POST',
            data: {
                appType: 1,
                projId: that.data.projId
            },
            success: function(res){
                console.log('getProjInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                var cityCode = parseInt(res.data.projInfo.province)
                res.data.projInfo.province = getApp().getCityStr(cityCode)
                that.setData(res.data.projInfo)
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    delProject: function(){
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/delProject',
            method: 'GET',
            data: {
                projId: this.data.projId
            },
            success: function(res){
                console.log('getProjInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.navigateBack()
                wx.showToast({
                    title: '删除成功'
                })
            }
        })
    },

    getComnt: function(){
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/getComnt',
            method: 'POST',
            data: {
                tarType: 41,
                tarId: this.data.projId
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
            url: 'http://www.campus.com/api/campus/delComnt',
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


