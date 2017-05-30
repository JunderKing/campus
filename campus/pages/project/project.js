Page({
  data:{
    title: '项目标题',
    intro: '项目简介',
    comments: [{
      avatar: '../../img/icon/spark_cur.png',
      nickName: 'Jun.K',
      content: '评论',
      ctime: '20150606',
      replies: [{
        nickName: 'HelloWorld',
        content: '回复'
      }]
    }],
  },
  onLoad: function(options){
  }
})
