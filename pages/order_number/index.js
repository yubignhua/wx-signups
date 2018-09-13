let app = getApp()
let base_url = require("../../utils/urls.js")
let orderUrl = base_url.baseUrl + '/order/getDetail'


Page({
    data: {
      orderList: [{
        orderid: 12345,
        qrurl: '',
        groupname: '北京大队',
        teamId: 2,
        authoname: '北京大队',
        racer_info: {
          price: 120,
          info: [{
            name: '金晓然',
            idcard: '142223199305062345'
          }, {
            name: '金晓然',
            idcard: '142223199305062345'
          }, {
            name: '金晓然',
            idcard: '142223199305062345'
          }]
        },
        suixing_info: {
          price: 120,
          info: [{
            name: '金晓然',
            idcard: '142223199305062345'
          }, {
            name: '金晓然',
            idcard: '142223199305062345'
          }, {
            name: '金晓然',
            idcard: '142223199305062345'
          }]
        },
        goods: {
          allNum: 4,
          gift: [{
            num: 2,
            name: '赛程必备'
          }, {
            num: 2,
            name: '赛程必备'
          }],
          sticker: {
            num: 4,
            name: '赛程必备'
          }
        },
        total: 900,
        signPeople: 30
      }]
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
      let gift = res.data[0].goods.length && res.data[0].goods[0];
      let giftNum = 0;
      if (gift.length) {
        gift.map((item, index) => {
          giftNum += item.num
        })
      }
      res.data[0].goods.allNum = giftNum;
      this.setData({
        orderList: res.data
      })
    }).catch((res)=>{
      console.log(res)
      wx.showModal({
        title: '提示',
        content: '没有查询到相关内容，请核对您的订单号或身份证号',
        showCancel: false,
        confirmText: '知道了',
        success: ()=>{
          wx.redirectTo({
            url: '../order/index',
          })
        },
        fail:()=>{
          wx.redirectTo({
            url: '../order/index',
          })
        }
      })
    })
  }
})