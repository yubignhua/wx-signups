let app = getApp()
let base_url = require("../../utils/urls.js")
let identifyUrl = base_url.baseUrl + '/club/addContact'

Page({
  data: {
    toView: 'red',
    scrollTop: 100,
    CarsList: [{ name: '', iden: '', phone: '', e_id:''}],//控制表单数量的状态
    flagList: [false],
    indicatorDots: false,
    current:0,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    state0:0,
    mData:{},//当前表单数据
    dataList: [],//车辆数据列表
    nameState: true,
    idState: true,
    phoneState: true,
    lastData:{},
    nextFlag:true

  },
  onLoad(options) {

  },
  onShow() {
  
  },
  /**
   * 表单提交
   */
  formSubmit (e) {
    this.data.mData = e.detail.value;

  },


  /**
   * 删除车辆
   */
  deleteCar(event){
    var index = event.currentTarget.dataset['index'];
    console.log('index:::',index)
    this.data.dataList.splice(index, 1);
    this.data.CarsList.splice(index, 1);
    this.data.flagList.splice(index, 1);
    let curState = 0;
    if(index === 0)
      curState = index;
    else
      curState = index - 1
    this.setData({
      dataList: this.data.dataList,
      CarsList: this.data.CarsList,
      flagList: this.data.flagList,
      current: curState,
    })
  },

  checkInput: function (mData){
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
    }else{
      nameState = true
    }

    if (!pattrnId.test(mData[`idcard`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的身份证号码',
        showCancel:false,
        confirmColor:"#000000"
      })
      idState = false
    }else{
      idState = true
    }

    if (!pattrnPhone.test(mData[`mobile`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号码',
        showCancel: false,
        confirmColor: "#000000"


      })
      phoneState = false
    }else{
      phoneState = true
    }
    this.setData({
      nameState: nameState,
      idState: idState,
      phoneState: phoneState
    })
  },

  /**
   * 新增车辆
   */
  addCar(e){
    this.checkInput(this.data.mData);
    if (!this.data.nameState || !this.data.idState || !this.data.phoneState){
      return
    }

    this.checkPerson(this.data.mData,res=>{
      
      //this.data.CarsList[this.data.current] = this.data.mData;
      this.data.CarsList.splice(this.data.CarsList.length - 1, 0, this.data.mData)
      this.data.dataList.push(this.data.mData);
      // this.data.flagList.push(false)
      // this.data.flagList[this.data.flagList.length - 2] = true;
      this.data.flagList.splice(this.data.flagList.length - 1, 0, true)

      this.setData({
        CarsList: this.data.CarsList,
        current: this.data.CarsList.length - 1,
        flagList: this.data.flagList,
        dataList: this.data.dataList,
        lastData: {}
      })
      console.log(res,'resres')
    },res=>{
      wx.showToast({
        title: "实名认证失败"
      })
    })

    
   

  },


  /**
   * 验证身份
   */

  checkPerson(map={},callback,error){
    wx.pro.request({
      url: identifyUrl,
      method: "POST",
      data: map
    }).then((res) => {
      if(res.data.code == 1000){
        callback(res);
      }else{
        error();
      }
    })
  },





  change1(e){
    this.data.lastData.name = e.detail.value;
  },
  change2(e) {
    this.data.lastData.idcard = e.detail.value;
  },
  change3(e) {
    this.data.lastData.mobile = e.detail.value;
  },
  change4(e) {
    this.data.lastData.eid = e.detail.value;
  },

  /**
   * 点击下一步提交所有数据
   */
  submitAllData(){
    if (!this.data.nextFlag) return;
    this.checkInput(this.data.lastData);
    if (!this.data.nameState || !this.data.idState || !this.data.phoneState) {
      return
    }

    this.checkPerson(this.data.lastData,res => {
      this.data.dataList.push(this.data.lastData);
      app.globalData.signUpData.detail.racer_info = this.data.dataList;
      this.data.nextFlag = false;
      //页面跳转
      wx.navigateTo({
        url: "../adding_accompany/index"
      })
    },res=>{
      //验证失败
      this.data.nextFlag = true;
      wx.showToast({
        title: "实名认证失败"
      })

    })


    // this.data.dataList.push(this.data.lastData);
    // app.globalData.detail.racer_info = this.data.dataList;
    // this.data.nextFlag = false;
    // wx.navigateTo({
    //   url: "../adding_accompany/index"
    // })

   
  }
})