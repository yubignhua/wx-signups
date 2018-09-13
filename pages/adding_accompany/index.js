let app = getApp()
let base_url = require("../../utils/urls.js")
let identifyUrl = base_url.baseUrl + '/club/addContact'
let orderUrl = base_url.baseUrl + '/order/save'

Page({

  data: {
    carList: [],
    accompanyingPerson:[],
    carIndex: 0,
    visible: false,
    visible2: false,
    mData: {},
    idcard: 0,//身份证号码
    name: "",//名字
    goodNum: 0,//购买物品数量
    allCost: 0,//总消费
    nameState: true,
    idState: true,
    phoneState: true,

  },

  onLoad: function (options) {
    //获取车辆信息并添加随行人员字段
    let raceInfo = app.globalData.signUpData.detail.racer_info;
    for (let i = 0; i < raceInfo.length; i++) {
      raceInfo[i].personInsurance = [];
    }
    this.setData({
      carList: raceInfo,
      allCost: raceInfo.length * 120
    })

  },

  /**
   * 计算总花费
   */
  calAllCost() {
    var carCost = this.data.carList.length * 120;
    var personCost = 0;
    var datalist = this.data.carList;
    for (var i = 0; i < datalist.length; i++) {
      personCost += datalist[i].personInsurance.length * 120
    }
    var goodCost = this.data.goodNum * 60;

    console.log("carCost::", carCost);
    console.log("personCost::", personCost);
    console.log("goodCost::", goodCost);
    var all = goodCost + carCost + personCost;
    this.setData({
      allCost: all
    })

  },

  /**
   * 展示订单
   */
  showOrder() {
    console.log(this.data.visible2)
    this.setData({
      visible2: !this.data.visible2
    })

  },

  /**
   * 获取车辆信息
   */
  getCarList() {
    wx.pro.request({
      url: ''
    }).then((res) => {
      res.data && res.data.length ?
        res.data.map((item, index) => {
          item.personInsurance = []
        }) : null;
      this.data.carList = res.data;
    })
  },
  changeCar(e) {
    this.setData({
      carIndex: e.target.dataset.imgindex
    })
    console.log("carIndex:::", this.data.carIndex)
  },
  showPersonModel() {
    this.setData({
      visible: true
    })
  },
  changeModel() {
    this.setData({
      visible: false
    })
  },

  /**
   * 验证身份
   */

  checkPerson(map = {}, callback, error) {
    wx.pro.request({
      url: identifyUrl,
      method: "POST",
      data: map
    }).then((res) => {
      if (res.data.code == 1000) {
        callback(res);
      } else {
        error();
      }
    })
  },



  /**
   * 表单验证
   */
  checkInput: function (mData) {
    const pattrnName = /^([a-zA-Z\u4e00-\u9fa5\·]{1,10})$/,
      pattrnId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      pattrnPhone = /(^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$)/;
    let nameState, idState, phoneState;
    if (!pattrnName.test(mData[`name`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的用户名',
        showCancel: false,
        confirmColor: "#000000"


      })
      nameState = false
    } else {
      nameState = true
    }

    if (!pattrnId.test(mData[`idcard`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的身份证号码',
        showCancel: false,
        confirmColor: "#000000"


      })
      idState = false
    } else {
      idState = true
    }

    this.setData({
      nameState: nameState,
      idState: idState,
    })
  },






  /**
   * 增加随行人员保险
   */
  continueSign() {
    this.checkInput(this.data.mData);
    if (!this.data.nameState || !this.data.idState) {
      return
    }
    this.checkPerson(this.data.mData,res=>{
      this.changeModel();
      this.data.carList[this.data.carIndex].personInsurance.push(this.data.mData);
      this.setData({
        carList: this.data.carList
      });
      this.calAllCost();
      this.getAccompanyingPerson();
      console.log('this.data.carList', this.data.carList)
    },res =>{
      wx.showToast({
        title: "实名验证失败"
      })

    })




    

  },
  /**
  * 表单提交
  */
  formSubmit(e) {
    this.data.mData = e.detail.value;
  },
  /**
   * 删除随行人员
   */
  deletPerson(e) {
    let index = e.target.dataset.index;
    this.data.carList[this.data.carIndex].personInsurance.splice(index, 1);
    this.setData({
      carList: this.data.carList
    })
    this.calAllCost();
    this.getAccompanyingPerson;
    console.log('this.data.carList', this.data.carList)

  },

  /**
   * 加
   */
  delete() {
    var curGoodNum = this.data.goodNum;
    if (curGoodNum <= 0) {
      curGoodNum = 0
    } else {
      curGoodNum--
    }
    this.setData({
      goodNum: curGoodNum
    })
    this.calAllCost()

  },

  //减
  plug() {
    var curGoodNum = this.data.goodNum;
    this.setData({
      goodNum: ++curGoodNum
    })
    this.calAllCost()

  },

 


  /**
   * 获取随行人员数据并存储
   */
  getAccompanyingPerson() {
    var carList = this.data.carList;
    if (carList.length <= 0) return;
    let arr = [];
    for (var i = 0; i < carList.length; i++) {
      // arr = [carList[i].personInsurance,...arr]
      arr = arr.concat(carList[i].personInsurance)
    }
    getApp().globalData.signUpData.detail.suixing_info = arr;
    this.setData({
      accompanyingPerson:arr.length
    })
  },

  /**
   * 获取物品信息并存储
   */

  /**
   * 立即支付(提交订单)
   */
  submitAllData() {
    this.getAccompanyingPerson();
    app.globalData.signUpData.detail.goods.gift[0].num = this.data.goodNum;
    app.globalData.signUpData.charge = this.data.allCost;
    var insur = app.globalData.signUpData.detail.goods.insur;
    let pSize = app.globalData.signUpData.detail.suixing_info.length;
    for (var i = 0; i < insur.length;i++){
      app.globalData.signUpData.detail.goods.insur[i].num = pSize;
    }


    console.log("app.globalData.signUpData:::", app.globalData.signUpData)
    wx.pro.request({
      url: orderUrl,
      method: "POST",
      // contentType:'text/html;charset=utf-8',
      data: app.globalData.signUpData,
    }).then((res) => {
      console.log("res::::",res);
      let mData = res.data;
      //调起原生支付
      if (mData.code === "1000"){
        wx.requestPayment(
          {
            'timeStamp': mData.data.timeStamp,
            'nonceStr': mData.data.nonceStr,
            'package': mData.data.package,
            'signType': mData.data.signType,
            'paySign': mData.data.package,
            'success': function (res) {
              console.log("支付成功", res)
              wx.redirectTo({
                url: '../complate_sign/index',
              })
              app.globalData.orderid = mData.orderid
             },
            'fail': function (res) { 
              console.log("支付失败", res)
              wx.redirectTo({
                url: '../complate_sign/index',
              })
              app.globalData.orderid = mData.data.orderid
            },
          })
        

        


      }else{
        wx.showToast({
          title: res.msg || "提交订单失败"
        })

      }

    }).catch(res => {
      wx.showToast({
        title: "网络错误"
      })

    })
    //console.log('++++++',app.globalData.signUpData)


  },



  toNextPage: function () {
    wx.navigateTo({
      url: "../adding_vehicles/index"
    })
  }
})

