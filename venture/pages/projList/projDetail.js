Page({
    data: {
        title: "",
        intro: "",
        projId: 0,
        meetId: 0,
        isInvor: 0,
        isMember: 0,
        members: [],
        comnts: []
    },

    onLoad: function(options) {
        this.setData({
            userId: getApp().gdata.userId,
            projId: parseInt(options.projId),
            isInvor: parseInt(options.isInvor),
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
                appType: 3,
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

    getComnt: function(){
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/getComnt',
            method: 'POST',
            data: {
                tarType: 31,
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
    },

    toMemberAdd: function(){
        var projId = this.data.projId
        var fileName = 'venture_proj_member_' + projId
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'http://www.campus.com/api/campus/getQrcode',
            method: 'GET',
            data: {
                appType: 3,
                name: fileName,
                path: '/pages/include/start?role=1&projId=' + projId
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

    showDel: function(){
        var delHidden = this.data.delHidden
        if (delHidden) {
            this.setData({delHidden: false})
        } else {
            this.setData({delHidden: true})
        }
    },

    delMember: function(e){
        var projId = this.data.projId
        var userId = e.currentTarget.dataset.userid
        console.log('delMember')
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'http://www.campus.com/api/campus/delProjMember',
            method: 'GET',
            data: {
                appType: 3,
                projId: projId,
                userId: userId
            },
            success: function(res){
                console.log('delProjMember=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.showToast({
                    title: '成功删除组员!',
                    icon: 'success'
                })
                that.updateProjInfo()
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    }
})


