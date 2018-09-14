let app = getApp()
let base_url = require("../../utils/urls.js")
let teamUrl = base_url.baseUrl + '/group/list'


Page({
  data: {
    teamName: '',
    teamId: '',
    memberName: '',
    memberNum: 0,
    teamNum: 0,
    visible: false,
    identifyState: true,
    phone: '',
    second: 60
  },


  onLoad(options) {
    let racer = app.globalData.signUpData.detail.racer_info;
    let suixing_info = app.globalData.signUpData.detail.suixing_info;
    this.setData({
      teamName: app.globalData.signUpData.group_name || '个人',
      teamId: app.globalData.signUpData.group_id,
      memberName: racer[0].name,
      memberNum: suixing_info.length
    },()=>{
      this.getTeamList()
    })
  },
  /**
   * 获取大队信息
   */
  getTeamList() {
    wx.pro.request({
      url: teamUrl,
      method: 'POST',
    }).then((res) => {
      let team = res.data.data && res.data.data.length ?
      res.data.data.find((item, index) => { return item.groupid === this.data.teamId }) : null;
     this.setData({
       teamNum: team.num
     })
    })
  },



  toOrder () {
    wx.switchTab({
      url: "../order/index"
    })
  },
  /**
   * 授权
   */
  empower() {
    if (this.data.teamNum === 0 && this.data.teamName === '个人') {
      this.setData({
        visible: true
      })
    } else if (this.data.teamNum !== 0 && this.data.teamName !== '个人'){
        wx.showModal({
          content: `授权后不可撤回，确认授权给${this.data.teamName}吗？`,
          cancelText: '再想想',
          confirmText: '确定',
          confirmColor: '#000000',
          success: function (res) {
            if (res.confirm) {
              this.submitEmpower()
            }
          }
        })
    } else if (this.data.teamNum == 0 && this.data.teamName !== '个人'){
      wx.showModal({
        content: `名额已满`,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#000000'
      })
    }
  },

  /**
     * 确定授权给个人
     */
  continueSign() {

    if (!this.data.mData[`phone`]) {
      wx.showModal({
        title: '提示',
        content: '请填写手机号'
      })
      return;
    }

    if (!this.data.mData[`identify-code`]) {
      wx.showModal({
        title: '提示',
        content: '请填写验证码'
      })
      return;
    }
    this.setData({
      visible: false
    }, () => {
      wx.showModal({
        title: '提示',
        content: `授权后不可撤回，确定授权给手机号${this.data.mData.phone}吗？`,
        success: function (res) {
          if (res.confirm) {
            this.submitEmpower()
          }
        }
      })
    })
  },
  /**
   * 提交表单
   */
  formSubmit(e) {
    this.setData({
      mData: e.detail.value
    })
  },
  /**
   * 获取电话号码
   */
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  getIdentifyCode() {
    if(this.data.identifyState){
      wx.pro.request({
        url: '',
        method: 'POST',
        data: {phone: this.data.phone}
      }).then(()=>{
        this.countdown();
        wx.showToast({
          title: '已发送',
          icon: 'success',
          duration: 3000
        })
        this.setState({
          identifyState: false
        })
      })
    }
  },
  /**
   * 倒计时
    */
  countdown(){
    if(!this.data.second){
      this.setState({
        identifyState: true,
        second: 60
      })
      clearTimeout(this.timmer)
      return
    }
    this.setData({
      second: this.data.second--
    })
    this.timmer = setTimeout(()=>{
      this.countdown()
    },1000)
  },

  /**
   * 提交授权
   */
  submitEmpower(params) {

  },

  onShareAppMessage: function () {

    return {

      title: '阿拉善英雄会',
      desc: '阿拉善英雄会2018官方报名',
      path: 'pages/index/index'

    }
  },
  share(){
    
    wx.showShareMenu({
      success:()=>{
        console.log('chenggong')
      }
    })
  }
})
