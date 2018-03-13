Page({
    data: {
        logo: ''
    },

    formSubmit: function(e) {
        console.log(e.detail.value)
        var userId = getApp().gdata.userId
        var formData = e.detail.value
        var isCorrect = this.checkForm(formData)
        if (!isCorrect) { return }
        var that = this
        wx.showToast({
            title: '提交中……',
            icon: 'loading',
            duration: 10000
        })
        wx.uploadFile({
            url: "https://www.kingco.tech/api/speedup/addCamp",
            filePath: this.data.logo,
            name: 'campLogo',
            formData: {
                userId: getApp().gdata.userId,
                name: formData.name,
                sponsor: formData.sponsor,
                intro: formData.intro,
                formId: e.detail.formId
            },
            success: function(res){
                wx.hideToast()
                console.log('addCamp=>')
                console.log(res)
                res.data = JSON.parse(res.data)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.navigateBack();
                wx.showToast({
                    title: '创建成功'
                })
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    checkForm: function(data){
        if (!data.name) {
            wx.showToast({title: '请填写加速营标题!'})
        } else if (!data.sponsor) {
            wx.showToast({title: '请填写加速营主办方!'})
        } else if (!data.intro) {
            wx.showToast({title: '请填写加速营简介!'})
        } else if (!this.data.logo) {
            wx.showToast({title: '请选择主办方logo!'})
        } else {
            return true
        }
    },

    chooseLogo: function(e) {
        var that = this
        wx.chooseImage({
            count: 1,
            success: function(res){
                that.setData({
                    logo: res.tempFilePaths[0],
                })
            }
        })
    }
})
