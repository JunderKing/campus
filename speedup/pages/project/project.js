Page({
    data:{
        userId: 0,
        projId: 0,
        title: '项目标题',
        intro: '项目简介',
        delHidden: true,
        comnts: []
    },

    onLoad: function(){
        this.setData({
            userId: getApp().gdata.userId
        })
    },

    onShow: function(options){
        this.getProjInfo()
        this.getProjList()
    },

    getProjInfo: function(){
        var that = this
        if (getApp().gdata.curProjId !== this.data.projId) {
            wx.showToast({
                title: '数据加载中...',
                icon: 'loading',
                duration: 10000
            })
        }
        wx.request({
            url: 'http://www.campus.com/api/campus/getUserProjInfo',
            method: 'GET',
            data: {
                appType: 2,
                userId: getApp().gdata.userId
            },
            success: function(res){
                console.log('getUserProjInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                var cityCode = parseInt(res.data.projInfo.province)
                res.data.projInfo.province = getApp().getCityStr(cityCode)
                that.setData(res.data.projInfo)
                getApp().gdata.curProjId = res.data.projInfo.projId
                that.getComnt()
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    getComnt: function(){
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/getComnt',
            method: 'GET',
            data: {
                tarType: 21,
                tarId: this.data.projId
            },
            success: function(res){
                console.log('getComnt=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData({
                    comnts: res.data.comnts
                })
            }
        })
    },

    getProjList: function(){
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/getUserProjList',
            method: 'GET',
            data: {
                appType: 2,
                userId: getApp().gdata.userId
            },
            success: function(res){
                console.log('getUserProjList=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData({
                    projList: res.data.projList
                })
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    onProjChange: function(e){
        var index = e.detail.value
        var projId = this.data.projList[index].projId
        if (projId === this.data.projId) {
            return
        }
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading',
            duration: 10000
        })
        var that = this
        wx.request({
            url: 'http://www.campus.com/api/campus/chgCurProject',
            method: 'POST',
            data: {
                userId: getApp().gdata.userId,
                projId: projId
            },
            success: function(res){
                wx.hideToast()
                console.log('chgCurProject=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                getApp().gdata.curProjId = projId
                that.getProjInfo()
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    toMemberAdd: function(){
        var projId = this.data.projId
        var fileName = 'spark_proj_member_' + projId
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
                appType: 2,
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
                appType: 2,
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
                that.getProjInfo()
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    scanCode: function(){
        var projPointer = this
        getApp().qrScan(function(){
            projPointer.getProjInfo()
            projPointer.getProjList()
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
})
