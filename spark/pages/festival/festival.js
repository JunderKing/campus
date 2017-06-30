Page({
    data: {
        userId: 0,
        orgerId: 0,
        role: 0,
        schlId: 0,
        festId: 0,
        name: '',
        intro: '',
        startTime: '',
        endTime: '',
        addr: '',
        logo: '',
        festList: []
    },

    onShareAppMessage: function(){
        return {
            title: '火种节小程序',
            path: '/pages/project/project'
        }
    },

    onLoad: function(){
        console.log('Festonload!')
    },

    onShow: function(){
        this.setData({
            userId: getApp().gdata.userId,
            role: getApp().gdata.role,
            schlId: getApp().gdata.schlId
        })
        this.getFestInfo()
        //this.getAllFestList()
    },

    getFestInfo: function(){
        var userId = getApp().gdata.userId
        var curFestId = getApp().gdata.curFestId
        if (curFestId !== this.data.festId) {
            this.setData({
                festId: curFestId
            })
            wx.showToast({
                title: '数据加载中...',
                icon: 'loading',
                duration: 10000
            })
        }
        var that = this
        wx.request({
            url: "https://www.kingco.tech/api/spark/getUserFestInfo",
            method: 'POST',
            data: {
                userId: getApp().gdata.userId
            },
            success: function(res){
                wx.hideToast()
                console.log('getUserFestInfo=>')
                console.log(res.data)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }        
                res.data.festInfo.startTime = new Date(res.data.festInfo.startTime * 1000).toLocaleString()
                res.data.festInfo.endTime = new Date(res.data.festInfo.endTime * 1000).toLocaleString()
                res.data.festInfo.projList.map(function(item){
                    item.tag = item.tag.split(' ')
                    return item
                })
                that.setData(res.data.festInfo)
                getApp().gdata.curFestId = res.data.festInfo.festId
                //getApp().gdata.isMentor = res.data.festInfo.isMentor
            },
            fail: function(){
                wx.hideToast()
            }
        })
    },

    getAllFestList: function(){
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/spark/getAllFestList',
            method: 'GET',
            success: function(res){
                console.log('getAllFestList=>')
                console.log(res.data)
                that.setData({
                    festList: res.data.festList
                })
            }
        })
    },

    showMap: function(){
        wx.navigateTo({
            url: "/pages/include/map"
        })
    },

    onFestChange: function(e){
        var index = e.detail.value
        var festId = this.data.festList[index].festId
        if (festId === this.data.festId) { return }
        wx.showToast({
            title: '数据加载中...',
            icon: 'loading'
        })
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/api/spark/chgCurFestival',
            method: 'GET',
            data: {
                userId: getApp().gdata.userId,
                festId: festId
            },
            success: function(res){
                console.log('chgCurFestival=>')
                console.log(res)
                if (res.statusCode !== 200 || res.data.errcode !== 0) {
                    return getApp().showError(3)
                }        
                getApp().gdata.isMentor = res.data.isMentor
                getApp().gdata.curFestId = festId
                if (res.data.curProjId) {
                    getApp().gdata.curProjId = res.data.curProjId
                }
                that.getFestInfo();
            }
        })
    }
})
