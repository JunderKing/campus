Page({
  data: {
    name: 'Loading',
    str: '使用火种节小程序',
    url: ''
  },
  onLoad: function(options){
    var name = ''
    var str = ''
    var url = '/pages/include/start?'
    if (options.role === '4') {
      name = 'orger'
      str = '成为火种节主办方!'
      url += 'role=4'
    } else if (options.role === '3' && options.festid > 0) {
      name = 'mentor' + options.festid
      str = '成为火种节导师!'
      url += 'role=3&festid=' + options.festid
    } else if (options.role === '2' && options.festid > 0) {
      name = 'captain' + options.festid
      str = '成为CEO!'
      url += 'role=2&festid=' + options.festid
    } else if (options.role === '1' && options.projid > 0) {
      name = 'member' + options.projid
      str = '加入我的项目'
      url += 'role=1&projid=' + options.projid
    } 
    console.log(name)
    this.setData({
      name: name,
      str: str,
      url: url
    })
  },
  
  onShareAppMessage: function(){
    return {
      title: this.data.str,
      path: this.data.url
    }
  }
})
