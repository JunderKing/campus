Page({
  data:{
    projId: 0,
    recId: 0,
    date: '',
    content: '',
    type: 0
  },

  onLoad: function(options){
    if (options.recId) {
      return this.setData({
        recId: options.recId,
        date: options.date,
        content: options.content,
        type: 2
      })
    }
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    var day = date.getDate()
    if (day < 10) {
      day = '0' + day
    }
    var dateStr = year + '-' + month + '-' + day
    this.setData({
      projId: options.projId,
      date: dateStr,
      type: 1
    })
  },

  onDateChange: function(e){
    this.setData({
      date: e.detail.value
    })
  },

  formSubmit: function(e){
    var content = e.detail.value.content
    if (!content) {
      return wx.showToast({
        title: '周报内容不能为空',
        icon: 'loading'
      })
    }
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    if (this.data.type === 1) {
      this.addRecord(content)
    } else if (this.data.type === 2){
      this.updateRecord(content)
    }
  },

  addRecord: function(content){
    var timestamp = Date.parse(new Date(this.data.date))
    var date = timestamp / 1000
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/addRecord',
      method: 'POST',
      data: {
        projId: this.data.projId,
        date: date,
        content: content
      },
      success: function(res){
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.showToast({
          title: '提交成功'
        })
        wx.navigateBack();
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })
  },

  updateRecord: function(content){
    var timestamp = Date.parse(new Date(this.data.date))
    var date = timestamp / 1000
    console.log('Date')
    console.log(date)
    wx.request({
      url: 'https://www.kingco.tech/api/speedup/updRecInfo',
      method: 'POST',
      data: {
        recId: this.data.recId,
        date: date,
        content: content
      },
      success: function(res){
        wx.hideToast()
        if (res.statusCode !== 200 || res.data.errcode !== 0) {
          return getApp().showError(3)
        }
        wx.showToast({
          title: '提交成功'
        })
        wx.navigateBack();
      },
      fail: function(){
        wx.hideToast()
        return getApp().showError(2)
      }
    })

  },
})
