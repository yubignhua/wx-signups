let app = getApp()
let base_url = require("../../utils/urls.js")
let orderUrl = base_url.baseUrl + '/order/getDetail'


Page({
    data: {
      orderList: {},
      checkState: false,
      modelState: false,
      scrollState: true,
      mData: null,
      showCode: false,
      orderNumber: false
    },
    
    onLoad: function (options) {
      
    },
    onShow(){
      this.getOrder()
    },

    /**
     * 获取订单数据
     */
    getOrder () {
      wx.pro.request({
        url: orderUrl,
        data: { 
          openid: app.globalData.signUpData.entry_info.openid,
          //orderid: app.globalData.orderid ? app.globalData.orderid:''
        },
        contentType: 'application/json;charset=utf-8',
        method: 'POST'
      }).then(( res )=>{
        if(res.data.code != 1000){
          this.setData({
            orderNumber: false
          })
        }
        if(res.data.code == "1000"){
          let gift = res.data.data && res.data.data.goods.gift;
          let giftNum = 0;
          if (gift && gift.length) {
            gift.map((item, index) => {
              giftNum = Number(giftNum) + Number(item.num)
            })
          }
          res.data.data.goods.allNum = giftNum;
          this.setData({
            orderList: res.data.data,
            orderNumber: true
          })
        }
      })
    },

    /**
     * 展示二维码
     */
  changeCodeModel(e){
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
  formSubmit (e) {
    this.setData({
      mData: e.detail.value
    })
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
    this.setData({
      modelState: false
    },()=>{
      this.toNextPage(this.data.mData[`number`])
    })
    
    
    
  },

  toNextPage( params ) {
    wx.navigateTo({
      url: `../order_number/index?number=${params}`
    })
  },

  toEmpower(){
    if (!this.data.orderList.authoname){
      wx.navigateTo({
        url: `../empower/index?id=${this.data.orderList.groupid}`
        //url: `../empower/index?id=100052`
      })
    }else{
      wx.showToast({
        title: '已授权',
      })
    }
    
  },
  showTip() {
    wx.showToast({
      title: '暂时无法授权',
      icon: 'none'
    })
  }
})

