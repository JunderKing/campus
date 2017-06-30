Page({
    data:{
        campId: 0,
        projList: []
    },

    onLoad: function(options){
        this.setData({
            campId: options.campId,
            projList: getApp().gdata.avlProjList
        })
    },

    addCampProject: function(e){
        var that = this
        var projId = e.currentTarget.dataset.projid
        wx.request({
            url: 'https://www.kingco.tech/api/speedup/addCampProject',
            method: 'POST',
            data: {
                userId: getApp().gdata.userId,
                campId: this.data.campId,
                projId: projId
            },
            success: function(res){
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                wx.navigateBack()
                wx.showToast({
                    title: '成功加入火种节!',
                    icon: 'success'
                })
            },
            fail: function(){
                return getApp().showError(2)
            }
        })
    },

    toProjAdd: function(){
        wx.switchTab({
            url: '/pages/project/project',
            success: function(){
                wx.navigateTo({
                    url: '/pages/project/projAdd?campId=' + this.data.campId
                })
            }
        })
    }
})
