Page({
    data:{
        //url: '../../img/icon/qrloading.png'
    },
    onLoad: function(options){
        console.log('onLoad')
        this.setData({
            url: options.url
        })
    }
})
