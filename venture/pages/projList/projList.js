Page({
    data:{
        projList: []
    },

    onShow: function(){
        var that = this
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/campus/getActProjList',
            method: 'POST',
            data: {
                appType: 3,
                userId: getApp().gdata.userId
            },
            success: function(res){
                wx.hideToast()
                console.log('getMeetProjList=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
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
                return getApp().showError(2)
            }
        })
    },

    scanCode: function(){
        getApp().qrScan()
    },
})
