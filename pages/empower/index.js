let app = getApp()
let base_url = require("../../utils/urls.js")

Page({
    data: {
      teamName:'',
      teamId: 0,
      visible: false,
      mData: {},
      phone: '',
      second: 60,
      identifyState: true
  
    },
    
    onLoad(options) {
        this.setData({
          teamName: options.name || '散客',
          //teamId: options.id
        })
    },
    

    

  /**
   * 点击授权
   */
  empower(e) {
    if( e.target.dataset.type ){
      this.setData({
        visible: true
      })
    }else{
      this.data.teamName !== '散客'?
      wx.showModal({
        content: `授权后不可撤回，确认授权给${this.data.teamName}吗？`,
        cancelText: '再想想',
        confirmText: '确定',
        confirmColor: '#000000',
        success: function(res){
          if (res.confirm) {
            this.submitEmpower()
          }
        }
      }):
      wx.showToast({
        title: '不可授权给散客',
      })
    }
  },

  changeModel(){
    this.setData({
      visible: false
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
    },()=>{
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
   * 提交授权
   */
  submitEmpower( params ) {

  },
  getPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  getIdentifyCode() {
    if (this.data.identifyState) {
      this.countdown();
      wx.showToast({
        title: '已发送',
        icon: 'success',
        duration: 3000
      })
      this.setData({
        identifyState: false
      })
      // wx.pro.request({
      //   url: '',
      //   method: 'POST',
      //   data: { phone: this.data.phone }
      // }).then(() => {
      //   this.countdown();
      //   wx.showToast({
      //     title: '已发送',
      //     icon: 'success',
      //     duration: 3000
      //   })
      //   this.setState({
      //     identifyState: false
      //   })
      // })
    }
  },

  /**
   * 倒计时
    */
  countdown() {
    console.log(this.data.second,'00000000')
    if (!this.data.second) {
      this.setData({
        identifyState: true,
        second: 60
      })
      clearTimeout(this.timmer)
      return
    }
    this.setData({
      second: this.data.second-1
    })
    this.timmer = setTimeout(() => {
      this.countdown()
    }, 1000)
  }
})

