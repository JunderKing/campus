Page({
    data:{
        projId: 0,
        isUser: 0,
        title: '',
        intro: '',
        hidden: 1,
    },

    onLoad: function(options){
        this.setData({
            projId: parseInt(options.projId),
            isUser: parseInt(options.isMember),
            hidden: parseInt(options.hidden)
        })
    },

    onShow: function(options){
        this.updProjInfo()
    },

    updProjInfo: function(){
        var that = this
        if (getApp().gdata.curProjId !== this.data.projId) {
            wx.showToast({
                title: '数据加载中',
                icon: 'loading',
                duration: 10000
            })
        }
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getProjInfo',
            method: 'GET',
            data: {
                appType: 2,
                projId: this.data.projId
            },
            success: function(res){
                console.log('getProjInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.hideToast()
                var cityCode = parseInt(res.data.projInfo.province)
                res.data.projInfo.province = getApp().getCityStr(cityCode)
                that.setData(res.data.projInfo)
            },
            fail: function(){
                wx.hideToast()
                return getApp().showError(2)
            }
        })
    }
})

