let app = getApp()
let base_url = require("../../utils/urls.js")
let teamUrl = base_url.baseUrl + '/group/list'
let competitionUrl = base_url.baseUrl + '/match/info'
let orderUrl = base_url.baseUrl + '/order/getDetail'
var loginUrl = base_url.baseUrl + '/wx/getopenid/'
let identifyUrl = base_url.baseUrl + '/club/addContact'
let getInfoUrl = base_url.baseUrl + '/user/userinfo'
let postInfoUrl = base_url.baseUrl + '/user/adduserinfo'

Page({
    data: {
      teamList: [{
        groupid: 0,
        name: '请选择大队',
        num: 10
      }],
      competitionList:null,
      team: 0,
      signButton: false,
      showModel: false,
      agree: false,
      count: 0,
      signType: 0,
      signState: true,
      teamName: '',
      signedType: true,
      teamId: 0,
      teamNames: '',
      visible: false,
      nameState: true,
      idState: true,
      mobileState: true,
      mData: null,
      second: 5,
      continueButtonState: false
    },
    
    onLoad(options) {
        
        this.getCompetition();
        this.getTeamList();
    },
  onShow(option) {
    this.weixinLogin();
  },

    /**
     * 微信登录
     */
    weixinLogin() {
        var that = this;
        wx.login({ //调用接口wx.login() 获取临时登录凭证（code）
            success: function (res) {
                if (res.code) {

                    //发起网络请求
                    wx.pro.request({
                        url: loginUrl,
                        method: 'POST',
                        data: {
                            code: res.code
                        }
                    }).then((res) => {
                        app.globalData.signUpData.entry_info.openid = res.data.data.openid;
                        that.getOrder( res.data.data.openid );
                        //that.getInfo()
                    })
                } else {
                    wx.showToast({
                        title: "登录失败",
                        icon: "loading"
                    })
                }
            }
        })
    },

  /**
   * 倒计时
   */
  countdown() {
    if (this.data.second<=1) {
      this.setData({
        continueButtonState: true
      })
      clearTimeout(this.timmer)
      return
    }
    this.setData({
      second: this.data.second - 1
    })
    this.timmer = setTimeout(() => {
      this.countdown()
    }, 1000)
  },

  /**
     * 获取订单信息
     */
    getOrder( openid ){
      wx.pro.request({
          url: orderUrl,
          method: 'POST',
          data: {
              openid: openid,
              orderid: ''
          }
      }).then((res)=>{
        // this.setData({
        //   signButton: true,
        //   showModel: false,
        //   signState: false,
        //   teamName: '请选择大队',
        //   signedType: false,
        //   teamId: '0',
        //   teamNames: '散客'
        // })
        if(res.data.code == 1000){
          if (Object.keys(res.data.data.racer_info).length) {
            this.setData({
              signButton: true,
              showModel: false,
              signState: false,
              teamName: res.data.data.groupname == '散客' ? '请选择大队' : res.data.data.groupname,
              signedType: res.data.data.groupname == '散客' ? false : true,
              teamId: res.data.data.groupid || '100052',
              teamNames: res.data.data.groupname
            })
          }
        }
          
      })
    },

  /**
   * 获取管理员信息
   */
  getInfo(){
    wx.pro.request({
      url: '',
      method: 'POST',
      data: {
        openid: openid,
        orderid: ''
      }
    })
  },


  /**
  * 获取比赛信息
  */
  getCompetition() {
    wx.pro.request({
      url: competitionUrl,
      method: 'POST'
    }).then((res) => {
      this.setData({
        competitionList: res.data.data
      })
      app.globalData.signUpData.mid = Number(res.data.data.mid);
      app.globalData.signUpData.detail.goods.gift[0].id = res.data.data.goods.gift[0].id;
      app.globalData.signUpData.detail.goods.insur = res.data.data.goods.insur;
    })
  },
    /**
     * 获取大队俱乐部数据
     */
    getTeamList() {
      wx.pro.request({
        url: teamUrl,
        method: 'POST',
      }).then(( res )=>{

        res.data.data && res.data.data.length?
        res.data.data.map(( item, index )=>{
          item.remain === 0?
          item.newName = item.name + '车位已达上限':
            item.newName = item.name + `(空余${item.num}席)` 
        }):null;
        this.setData({
          teamList: this.data.teamList.concat(res.data.data)
        })
      })
    },

  /**
   * 选择俱乐部Picker
   */
  bindTeamChange (e) {
    let selectedValue = e.detail.value,
        teamList = this.data.teamList;
    this.setData({
      team: selectedValue,
      signButton: selectedValue == 0 ? false : true
    })
   
    if ( teamList.length && !teamList[selectedValue].num ) {
      wx.showModal({
        content: '该板块容量已达上限,可能无法如愿在营地扎营，请联系版主',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#000000',
        success: () => {
          this.setData({
            signButton: false 
          }) }
      })
    }
    
  },

  /**
   * 选择散客
   */
  clickPerson() {
    console.log(this.data.signState, this.data.signedType)
    this.countdown();
    if (this.data.signState){
      this.setData({
        signButton: false,
        team: 0,
        showModel: true,
        signType: 0
      })
    }
    if (!this.data.signState && !this.data.signedType) {
      this.setData({
        signButton: false,
        team: 0,
        showModel: true,
        signType: 0
      })
    }
    if (!this.data.signState && this.data.signedType){
      wx.showModal({
        content: '请选择大队入口报名',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#000000'
      })
    }
  },
  /**
   * 已经报名不可选大队
   */
  signTip(){
    if(!this.data.signState && this.data.signedType){
      wx.showModal({
        content: '已选过大队，请直接报名',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#000000'
      })
    }
  },
  /**
   * 选择大队
   */
  selectTeam(event) {

    if (this.data.signState){
      if (this.data.signButton){
        this.countdown();
        this.setData({
          showModel: event.target.dataset.visible,
          signType: 1
        })
      }else{
        wx.showModal({
          content: '请选择加入的大队',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#000000'
        })
      }
    }else{
      if (!this.data.signedType){
        wx.showModal({
          content: '请选择散客入口',
          confirmText: '确定',
          showCancel: false,
          confirmColor: '#000000'
        })
      }else{
        this.countdown();
        this.setData({
          showModel: event.target.dataset.visible,
          signType: 1
        })
      }
    }
  },

  changeModel(){
    this.setData({
      showModel: false,
      second: 5,
      
    })

    clearTimeout(this.timmer)
  },

  /**
   * 表单验证
   */
  checkInput: function (mData) {
    const pattrnName = /^([a-zA-Z\u4e00-\u9fa5\·]{1,10})$/,
      pattrnId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      pattrnPhone = /(^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$)/;
    let nameState, idState, mobileState;
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
    if (!pattrnPhone.test(mData[`mobile`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号',
        showCancel: false,
        confirmColor: "#000000"
      })
      mobileState = false
    } else {
      mobileState = true
    }

    this.setData({
      nameState: nameState,
      idState: idState,
      mobileState: mobileState
    })
  },

  continueSign(){

    this.setData({
      showModel: false
    })
    let team_id,
        team_name;
    if (this.data.signType){
      if(this.data.signState){
        team_id = this.data.teamList[this.data.team].groupid
        team_name = this.data.teamList[this.data.team].name
      }else{
        team_id = this.data.teamId || '100052'
        team_name = this.data.teamNames
      }
    }else{
      team_id = 0
      team_name = ''
    }
    app.globalData.signUpData.group_id = team_id;
    app.globalData.signUpData.group_name = team_name;
    wx.redirectTo({
      url: "../adding_vehicles/index"
    })
  },
  /**
   * 表单提交
   */
  formSubmit(e) {
    this.setData({
      mData: e.detail.value
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
   * 添加订单联系人
   */
  addInfo(){

    this.setData({
      showModel: false,
      visible: true
    })
  },
  closeInfo(){
    this.setData({
      showModel: false,
      visible: false
    })
  },
  /**
   * 校验信息
   */
  checkInfo(){
    this.checkInput(this.data.mData);
    if (!this.data.nameState || !this.data.idState || !this.data.mobileState) {
      return
    }
    // this.checkPerson(this.data.mData,res=>{
    //   wx.pro.request({
    //     url: postInfoUrl,
    //     method: "POST",
    //     data: {...this.data.mData,openid:app.globalData.signUpData.entry_info.openid}
    //   }).then((res)=>{
    //     console.log(res,'---------')
    //     if(res.data.code == 1000){
    //       this.continueSign()
    //     }else{
    //       wx.showToast({
    //         title: "订单管理员信息保存失败",
    //         icon: "none"
    //       })
    //     }
    //   })
    //   //this.continueSign()
    // },res =>{
    //   if (res.data.code == 1008) {
    //     wx.showToast({
    //       title: "不能重复报名",
    //       icon: "none"
    //     })
    //   }else{
    //     wx.showToast({
    //       title: "实名验证失败",
    //       icon: "none"
    //     })
    //   }
    // })
    wx.pro.request({
      url: postInfoUrl,
      method: "POST",
      data: {...this.data.mData,openid:app.globalData.signUpData.entry_info.openid}
    }).then((res)=>{
      if(res.data.code == 1000){
        this.continueSign()
      } else if (res.data.code == 1007){
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }else{
        wx.showToast({
          title: "订单管理员信息保存失败",
          icon: "none"
        })
      }
    })
  }
})

