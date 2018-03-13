Page({
    data: {
        title: '',
        projId: 0,
        gridId: 0,
        gridNum: 0,
        isUser: 0,
        content: '',
        cardList: []
    },

    onLoad: function(options){
        this.setData({
            projId: parseInt(options.projId),
            gridNum: parseInt(options.gridNum),
            isUser: parseInt(options.isUser)
        })
        this.setTitle()
    },

    onShow: function(){
        this.updateGridInfo()
        this.updateCardList()
    },

    setTitle: function(){
        var title = '画格'
        switch (this.data.gridNum) {
            case 1:
                title = '为什么有用户和需求'
                break;
            case 2:
                title = '凭什么是我和我的团队'
                break;
            case 3:
                title = '核心产品是什么'
                break;
            case 4:
                title = '到现在发展怎样了'
                break;
            case 5:
                title = '下一步将如何发展'
                break;
            case 6:
                title = '计划融资多少'
                break;
            //case 7:
                //title = '渠道通路'
                //break;
            //case 8:
                //title = '增长引擎'
                //break;
        }
        this.setData({
            title: title
        })
    },

    updateGridInfo: function(){
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/speedup/getGridInfo',
            method: 'GET',
            data: {
                projId: this.data.projId,
                gridNum: this.data.gridNum
            },
            success: function(res){
                console.log('gridInfo=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData(res.data.gridInfo)
            },
            fail: function(){
                getApp().showError(2)
            }
        })
    },

    updateCardList: function(){
        var that = this
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://www.kingco.tech/api/speedup/getGridCardList',
            method: 'GET',
            data: {
                projId: this.data.projId,
                gridNum: this.data.gridNum
            },
            success: function(res){
                console.log('gridCardList=>')
                console.log(res)
                wx.hideToast()
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }
                that.setData({
                    cardList: res.data.cardList
                })
            },
            fail: function(){
                wx.hideToast()
                return getApp().showError(2)
            }
        })
    }
})
