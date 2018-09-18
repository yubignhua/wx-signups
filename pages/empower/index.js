let app = getApp()
let base_url = require("../../utils/urls.js")
let empowerUrl = base_url.baseUrl + '/group/autho'
let getEmpowerNum = base_url.baseUrl + '/group/autho_list'
let getCode = base_url.baseUrl + '/wx/code'

Page({
  data: {
    teamName: '',
    teamId: 0,
    visible: false,
    mData: {},
    phone: '',
    second: 60,
    identifyState: true,
    empowerType: true,
    empowerTeam: null,
    code: ''
  },

  onLoad(options) {
    let team_id = options.id
    console.log(team_id)

    this.setData({
      teamId: team_id
      //teamId: '100052'
    }, () => {
      this.getEmpowerNum(this.data.teamId)
      
    })
  },

  /**
   * 获取授权数量
   */
  getEmpowerNum(params) {
    wx.pro.request({
      url: getEmpowerNum,
      method: 'POST'
    }).then((res) => {
      let empowerTeam = 
        res.data.data.find((selectName) => {
          return selectName.groupid == params
        })
      this.setData({
        empowerTeam: empowerTeam ? empowerTeam : null
      },()=>{
        console.log(this.data.empowerTeam)
      })
      
    })
  },


  /**
   * 点击授权
   */
  empower(e) {
    let that = this;
    let team = this.data.empowerTeam;
    if (e.target.dataset.type) {
      this.setData({
        visible: true
      })
    } else {
      if (team) {
        if (team.num == 0) {
          wx.showToast({
            title: '名额已满',
            icon: 'none'
          })
        } else {
          wx.showModal({
            content: `授权后不可撤回，确认授权给${this.data.empowerTeam.name}吗？`,
            cancelText: '再想想',
            confirmText: '确定',
            confirmColor: '#000000',
            success: function(res) {
              if (res.confirm) {
                that.submitEmpower(that.data.empowerTeam.groupid, '', '')
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: '请授权给个人',
          icon: 'none'
        })
      }
    }



  },

  changeModel() {
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
    var that = this;
    if (!this.data.mData[`phone`]) {
      wx.showModal({
        title: '提示',
        content: '请填写手机号'
      })
      return;
    }

    if (!this.data.mData[`identify-code`] || this.data.code != this.data.mData[`identify-code`]) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的验证码'
      })
      return;
    }
    this.setData({
      visible: false
    }, () => {
      wx.showModal({
        title: '提示',
        content: `授权后不可撤回，确定授权给手机号${this.data.mData.phone}吗？`,
        success: function(res) {
          if (res.confirm) {
            that.submitEmpower("", that.data.code, that.data.mData[`phone`])
          }
        }
      })
    })
  },

  /**
   * 提交授权
   */
  submitEmpower(params, code, tel) {
    wx.pro.request({
      url: empowerUrl,
      method: 'POST',
      data: {
        openid: app.globalData.signUpData.entry_info.openid,
        groupid: params,
        verity: code,
        tel: tel
      }
    }).then((res) => {
      if (res.data.code == '1000') {
        wx.showToast({
          title: '授权成功'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../order/index',
          })
        })
      }
    })
  },
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  getIdentifyCode() {
    if (this.data.identifyState) {
      wx.pro.request({
        url: getCode,
        method: 'POST',
        data: {
          tel: this.data.phone
        }
      }).then((res) => {
        if (res.data.code == 1001 || res.data.code == 1002) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        if (res.data.code == 1000) {
          this.setData({
            code: res.data.data.verity,
            identifyState: false
          }, () => {
            this.countdown();
            wx.showToast({
              title: '已发送',
              icon: 'success',
              duration: 2000
            })
          })

        }


      })
    }
  },

  /**
   * 倒计时
   */
  countdown() {
    if (!this.data.second) {
      this.setData({
        identifyState: true,
        second: 60
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
  }
})