let app = getApp()
let base_url = require("../../utils/urls.js")
let orderUrl = base_url.baseUrl + '/order/getDetail'


Page({
    data: {
      orderList: {
        orderid: 12345,
        qrurl:'',
        groupname: '北京大队',
        teamId: 2,
        authoname: '',
        racer_info: {
          price: 120,
          info:[{
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
          info: []
        },
        goods:{
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
      },
      checkState: false,
      modelState: false,
      scrollState: true,
      mData: null,
      showCode: false
    },
    
    onLoad: function (options) {
      let openId = app.globalData.signUpData.entry_info.openid;
      console.log(openId,'=========')
      if (openId ){
        this.getOrder(openId)
      }
    },

    /**
     * 获取订单数据
     */
    getOrder (params) {
      console.log('1111111')
      wx.pro.request({
        url: orderUrl,
        data: { openid: params, orderid: '' },
        contentType:'text/html;charset=utf-8',
        method: 'POST'
      }).then(( res )=>{
        console.log(res)
        if(res.data.code === 1000){
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
        }
      })
    },

    /**
     * 展示二维码
     */
  changeCodeModel(e){
    console.log(e)
    if ( !this.data.orderList.authoname ){
      this.setData({
        showCode: e.target.dataset.visible
      })
    }
  },

  /**
   * 点击查订单 显示订单详情
   */
  checkOrder() {
    this.setData({
      checkState: true
    })
  },

  /**
   * 查订单弹框
   */
  changeModel(e){
    this.setData({
      modelState: e.target.dataset.visible,
      scrollState: !e.target.dataset.visible
    })
  },
  /**
   * 表单提交
   */
  formSubmit(e) {
    console.log(e)
    this.data.mData = e.detail.value;
  },

  /**
   * 确定查询
   */
  continueSign() {

    if (!this.data.mData[`number`]) {
      wx.showModal({
        title: '提示',
        content: '请填写订单号或身份证号'
      })
      return;
    }
    this.toNextPage( this.data.mData[`number`] )
  },

  toNextPage( params ) {
    wx.navigateTo({
      url: `../order_number/index?number=${params}`
    })
  },

  toEmpower(){
    if (!this.data.orderList.authoname){
      wx.navigateTo({
        url: `../empower/index?name=${this.data.orderList.groupname}&id=${this.data.orderList.teamId}`
      })
    }else{
      wx.showToast({
        title: '已授权',
      })
    }
    
  }
})

