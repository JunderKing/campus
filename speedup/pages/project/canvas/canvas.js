Page({
    data:{
        projId: 0,
        cardNum: [0,0,0,0,0,0,0,0]
    },

    onLoad: function(options){
        this.setData({
            projId: parseInt(options.projId),
            isUser: parseInt(options.isUser)
        })
    },

    onShow: function(){
        this.getCanvasInfo()
    },

    getCanvasInfo: function(){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/speedup/getCanvasInfo',
            method: 'GET',
            data: {
                projId: this.data.projId
            },
            success: function(res){
                console.log('getCanvasInfo=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData(res.data.canvasInfo)
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    }
})
