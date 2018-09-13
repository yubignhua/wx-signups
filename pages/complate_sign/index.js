let app = getApp()
let base_url = require("../../utils/urls.js")


Page({
  data: {
    teamName: '',
    teamId: '',
    memberName: '',
    memberNum: 0
  },

  onLoad(options) {
    let racer = app.globalData.signUpData.detail.racer_info;
    let suixing_info = app.globalData.signUpData.detail.suixing_info;
    this.setData({
      teamName: app.globalData.signUpData.group_name || '散客',
      teamId: app.globalData.signUpData.group_id,
      memberName: racer[0].name,
      memberNum: racer.length + suixing_info.length
    })
  },


  toOrder () {
    wx.switchTab({
      url: "../order/index"
    })
  },
  toEmpower() {
    wx.navigateTo({
      url: `../empower/index?name=${this.data.teamName}&id=${this.data.teamId}`
    })
  }

})
