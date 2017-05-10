Page({
  data: {
    projid: 0,
    scroll: 0,
    cur: 0,
    stepTitle: ['组队','理解', '定义', '发散', '决定', '原型', '验证'],
    stepText: [
      '通过演讲和投票选出来最好的主意来进行组队',
      '全方位发散地去理解用户所面临的所有问题',
      '在所有问题中，定义什么是我们真正要去解决的那一个问题',
      '用极速脑暴的方式，为解决该问题，想出来各种可能的主意',
      '用沉默投票的方式，来解决该问题，来决定采用哪个主意',
      '为『对的主意』，用最短的时间，去做一个产品原型',
      '找五个用户来，让他们体验原型过程中发声思考，进行验证'
    ],
    stepInfo: [{
      id: 1,
      title: "组队",
      url: "",
      desc: ""
    },{
      id: 2,
      title: "理解",
      url: "",
      desc: ""
    },{
      id: 3,
      title: "定义",
      url: "",
      desc: ""
    },{
      id: 4,
      title: "发散",
      url: "",
      desc: ""
    },{
      id: 5,
      title: "决定",
      url: "",
      desc: ""
    },{
      id: 6,
      title: "原型",
      url: "",
      desc: ""
    },{
      id: 7,
      title: "验证",
      url: "",
      desc: ""
    }]
  },
  onLoad: function(options){
    this.setData({
      projid: options.projid
    })
  },
  onShow: function(){
    this.updateData()
  },
  updateData: function(){
    var projid = this.data.projid
    var reqData = {
      projid: projid
    }
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/index.php?s=/spark/project/getProgInfo',
      method: 'POST',
      data: reqData,
      success: function(res){
        console.log(res)
        that.setData({
          stepInfo: res.data
        })
      }
    })
  },
  toStep: function(e){
    this.setData({
      scroll:e.currentTarget.dataset.stepid,
    })
  },
  chooseImage: function(e){
    var stepid = e.currentTarget.dataset.stepid
    var projid = this.data.projid
    var index = stepid - 1
    var that = this
    var reqData = {
      projid: projid,
      stepid: stepid
    }
    wx.chooseImage({
      count: 1,
      success: function(res){
        var url = res.tempFilePaths[0]
        wx.showLoading({
          title: '图片上传中……',
          mask: true
        })
        wx.uploadFile({
          url: 'https://www.kingco.tech/index.php?s=/spark/project/uploadProgImage',
          filePath: url,
          name: 'file',
          formData: reqData,
          success: function(res){
            console.log('success')
            console.log(res)
            if (res.data > 0) {
              wx.showToast({
                title: '图片上传成功!',
                icon: 'success'
              })
              that.updateData()
            } else {
              wx.showToast({
                title: '图片上传失败，请重试!',
                icon: 'loading'
              })
            }
          },
          fail: function(res){
            console.log('fail')
            console.log(res)
            wx.showToast({
                title: '图片上传失败，请重试!',
                icon: 'loading'
              })
          },
          complete: function(res){
            console.log('complete')
            console.log(res)
            wx.hideLoading()
          }
        })
      }
    })
  },
  preview: function(e){
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      success: function(res){
        console.log("success")
      }
    })
  },
  onScroll: function(e) {
    console.log(e)
    var areaHeight = e.detail.scrollHeight / 7
    var top = e.detail.scrollTop
    if (this.data.scroll !== top / areaHeight) {
      this.setData({
        cur: top / areaHeight
      })
    }
  }
})
