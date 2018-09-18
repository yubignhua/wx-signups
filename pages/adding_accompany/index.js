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
    plusState: true,
    payState: true
  },

  onLoad: function (options) {
    //获取车辆信息并添加随行人员字段
	  //app.globalData.signUpData.detail.racer_info =  [{ name: '', idcard: '', mobile: '', eid: '' }]
    let raceInfo = app.globalData.signUpData.detail.racer_info;
    
    console.log('raceInfo:::',raceInfo)
    
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
    var goodCost = this.data.goodNum * 80;

    var all = goodCost + carCost + personCost;
    this.setData({
      allCost: all
    })

  },

  /**
   * 展示订单
   */
  showOrder() {
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
    });
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
        error(res);
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
	 * 判断报名是否重复
	 * @param id
	 */
	judgeRepeat(id){
		this.getAccompanyingPerson();
		let suixing_info = app.globalData.signUpData.detail.suixing_info,
			raceInfo = app.globalData.signUpData.detail.racer_info;
		let newArr = [...suixing_info,...raceInfo];
		let isRepeat = newArr.some((item,index)=>{
			if(item.idcard === id){
				return true;
			}
		});
		if(isRepeat){
			wx.showToast({
				title: "不能重复购买保险",
				icon: "none"
			});
		}
		return isRepeat;
	},
	
	
	
	
	
	
	
	/**
   * 增加随行人员保险
   */
  continueSign() {
    this.checkInput(this.data.mData);
    if (!this.data.nameState || !this.data.idState) {
      return
    }
		let flag = this.judgeRepeat(this.data.mData.idcard);
		if(flag) return;
    this.checkPerson(this.data.mData,res=>{
      this.changeModel();
      this.data.carList[this.data.carIndex].personInsurance.push(this.data.mData);
      this.setData({
        carList: this.data.carList
      });
      this.calAllCost();
      this.getAccompanyingPerson();
    },res =>{
      if (res.data.code == 1008) {
        wx.showToast({
          title: "不能重复报名",
          icon: "none"
        })
      }else{
        wx.showToast({
          title: "实名验证失败",
          icon: "none"
        })
      }
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
    if (curGoodNum >= app.globalData.signUpData.detail.racer_info.length) {
      this.setData({
        plusState: false
      },()=>{
        wx.showToast({
          title: `每位报名人仅享受一份优惠手礼`,
          icon: 'none'
        })
      })
      return
    }
    this.setData({
      goodNum: ++curGoodNum
    })
    this.calAllCost()

  },

 


  /**
   * 获取随行人员数据并存储
   */
  getAccompanyingPerson() {
    let {carList} = this.data;
    if (carList.length <= 0) return;
    let arr = [];
    carList.map((item,index)=>{
	    arr =  [...carList[index].personInsurance,...arr]
    });
    //
    // for (let i = 0; i < carList.length; i++) {
    //   arr =  [...carList[i].personInsurance,...arr]
    //   //arr = arr.concat(carList[i].personInsurance)
    // }
    app.globalData.signUpData.detail.suixing_info = arr;
    this.setData({
      accompanyingPerson:arr.length
    })
  },


  /**
   * 立即支付(提交订单)
   */
  submitAllData() {
    let that = this;
    this.getAccompanyingPerson();
    app.globalData.signUpData.entry_info.mobile = app.globalData.signUpData.detail.racer_info[0].mobile;
    app.globalData.signUpData.detail.goods.gift[0].num = this.data.goodNum;
    app.globalData.signUpData.charge = this.data.allCost;
    var insur = app.globalData.signUpData.detail.goods.insur;
    let pSize = app.globalData.signUpData.detail.suixing_info.length;
    for (var i = 0; i < insur.length;i++){
      app.globalData.signUpData.detail.goods.insur[i].num = pSize;
    }

    wx.pro.request({
      url: orderUrl,
      method: "POST",
      // contentType:'text/html;charset=utf-8',
      data: { ...app.globalData.signUpData, times: new Date().getTime()}
    }).then((res) => {
      this.setData({
        payState: false
      })
      let mData = res.data;
      if (mData.code == "1105"){

      }
      //调起原生支付
      if (mData.code == "1000"){
        app.globalData.orderid = mData.data.orderid
        wx.requestPayment(
          {
            'appId': mData.data.appId,
            'timeStamp': mData.data.timeStamp,
            'nonceStr': mData.data.nonceStr,
            'package': mData.data.package,
            'signType': mData.data.signType,
            'paySign': mData.data.paySign,
            'success': function (res) {
              //支付成功删除本地缓存
	            wx.pro.removeStorage("SIGNUP_CARLIST");
	            wx.pro.removeStorage("SIGNUP_FLAGLIST");
	            wx.redirectTo({
                url: '../complate_sign/index',
              })
             },
            'fail': function (res) { 
              that.setData({
                payState: true
              })
            },
          })
      }else{
        if(res.data.code == "1105"){
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        wx.showToast({
          title: res.msg || "提交订单失败",
          icon: "none"
        })
        that.setData({
          payState: true
        })
      }

    }).catch(res => {
      wx.showToast({
        title: "网络错误",
        icon: "none"
      })
    })
  },



  toNextPage: function () {
    wx.redirectTo({
      url: "../adding_vehicles/index"
    })
  }
})

