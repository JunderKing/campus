Page({
    data:{
        gridId: 0
    },

    onLoad: function(options){
        this.setData({
            gridId: parseInt(options.gridId)
        })
    },

    formSubmit: function(e){
        console.log('form submit')
        console.log(e)
        var formData = e.detail.value
        var isCorrect = this.checkForm(formData)
        if (!isCorrect) { return }
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/speedup/addCard',
            method: 'POST',
            data: {
                gridId: this.data.gridId,
                title: formData.title,
                assumption: formData.assumption,
                formId: e.detail.formId
            },
            success: function(res){
                console.log('addCard=>')
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
    },

    checkForm: function(data){
        if (!data.title) {
            wx.showToast({title: '请填写实验标题!'})
        } else if (!data.assumption) {
            wx.showToast({title: '请填写实验假设!'})
        } else {
            return true
        }
    }
})
