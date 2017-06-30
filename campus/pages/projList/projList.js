Page({
    data:{
        appType: 0,
    },

    onShow: function(){
        this.getProjList(0)
    },

    chgProjList: function(e){
        var appType = parseInt(e.currentTarget.dataset.type)
        if (appType === this.data.appType) {
            return 
        }
        this.setData({
            appType: appType
        })
        this.getProjList()
    },

    getProjList: function() {
        var that = this
        wx.request({
            url: "https://www.kingco.tech/api/campus/getAppProjList",
            method: 'POST',
            data: {
                appType: this.data.appType
            },
            success: function(res){
                console.log('getAppProjList=>')
                console.log(res.data)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }        
                wx.hideToast()
                res.data.projList.map(function(item){
                    item.tag = item.tag.split(' ')
                    return item
                })
                that.setData({
                    projList: res.data.projList
                })
            },
            fail: function(){
                wx.hideToast()
            }
        })
    },

    scanCode: function(){
        var projPointer = this
        getApp().qrScan()
    },
})

