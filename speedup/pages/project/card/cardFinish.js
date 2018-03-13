Page({
    data:{
        cardId: 0,
        result: '',
        status: 0,
    },

    onLoad: function(options){
        this.setData({
            cardId: options.cardId,
            result: options.result,
            status: options.status
        })
    },

    formSubmit: function(e){
        var formData = e.detail.value
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/speedup/updCardInfo',
            method: 'POST',
            data: {
                cardId: this.data.cardId,
                cardInfo: {
                    result: formData.result,
                    status: parseInt(formData.status)
                },
                formId: e.detail.formId
            },
            success: function(res){
                console.log('gridCardList=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.navigateBack()
            },
            fail: function(){
                wx.hideToast()
                return getApp().showError(2)
            }
        })
    }
})
