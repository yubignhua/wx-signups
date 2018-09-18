Page({
  data: {
    
  },

  onLoad: function (options) {

    wx.navigateToMiniProgram({
      appId: 'wx83a9ce8d856cd8ca',
      path: 'page/index/index',
      extraData: {},
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log(res,';;;;;')
      },
      fail(res){
        console.log(res, ';;;;;')
      }
    })

  },
  onShow() {

  },
})