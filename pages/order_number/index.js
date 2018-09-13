let app = getApp()
let base_url = require("../../utils/urls.js")
let orderUrl = base_url.baseUrl + '/order/getDetail'


Page({
    data: {
      orderList: {}
    },
    
    onLoad: function (options) {
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
      let gift = res.data.data && res.data.data.goods.gift;
      let giftNum = 0;
      if (gift && gift.length) {
        gift.map((item, index) => {
          giftNum += item.num
        })
      }
      res.data.data.goods.allNum = giftNum;
      this.setData({
        orderList: res.data.data
      })
      if (!res.data.data.racer_info || !res.data.data.racer_info.info.length){
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
          wx.switchTab({
            url: '../order/index',
          })
        }
      })
    })
  }
})