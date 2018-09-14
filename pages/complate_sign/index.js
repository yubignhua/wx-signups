let app = getApp()
let base_url = require("../../utils/urls.js")
let teamUrl = base_url.baseUrl + '/group/list'


Page({
  data: {
    teamName: '',
    teamId: '',
    memberName: '',
    memberNum: 0,
    teamNum: 0
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
  toEmpower() {
    wx.navigateTo({
      url: `../empower/index?name=${this.data.teamName}&id=${this.data.teamId}`
    })
  }


})
