let app = getApp()
let base_url = require("../../utils/urls.js")
let orderUrl = base_url.baseUrl + '/order/getDetail'


Page({
    data: {
      orderList: []
    },
    
    onLoad: function (options) {
      console.log(options.number)
        this.getOrder(options.number);
    },


  /**
   * 获取订单数据
   */
  getOrder(params) {
    wx.pro.request({
      url: orderUrl,
      data: { orderid: params },
      method: 'POST'
    }).then((res) => {
      let gift = res.data.goods && res.data.goods.length && res.data.goods;
      let giftNum = 0;
      if (gift && gift.length) {
        gift.map((item, index) => {
          giftNum += item.num
        })
      }
      res.data.allNum = giftNum;
      this.setData({
        orderList: res.data
      })
      console.log(Boolean(!res.data.racer_info || !res.data.racer_info.length))
      if (!res.data.racer_info || !res.data.racer_info.length){
        wx.showModal({
          title: '提示',
          content: '没有查询到相关内容，请核对您的订单号或身份证号',
          showCancel: false,
          confirmText: '知道了',
          success: () => {
            wx.switchTab({
              url: '../order/index',
            })
          }
        })
        
      }
    }).catch((res)=>{
      wx.showModal({
        title: '提示',
        content: '没有查询到相关内容，请核对您的订单号或身份证号',
        showCancel: false,
        confirmText: '知道了',
        success: ()=>{
          console.log(this,'---------')
          wx.redirectTo({
            url: '../order/index',
          })
        }
      })
    })
  }
})