let app = getApp()
let base_url = require("../../utils/urls.js")
let empowerUrl = base_url.baseUrl + '/group/autho_list'


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
   * 获取授权数量
   */
  getTeamList() {
    wx.pro.request({
      url: empowerUrl,
      method: 'POST',
    }).then((res) => {
      let team = res.data.data && res.data.data.length ?
      res.data.data.find((item, index) => { return item.groupid == this.data.teamId }) : null;
     this.setData({
       empowerTeam: team ? team : null
     })
    })
  },


  toEmpower(){
    let teamName = app.globalData.signUpData.group_name
    wx.navigateTo({
      url: `../empower/index?id=${teamId} `,
    })
  },
  toOrder () {
    wx.switchTab({
      url: "../order/index"
    })
  },
  

  onShareAppMessage: function () {

    return {

      title: '阿拉善英雄会',
      desc: '阿拉善英雄会2018官方报名',
      path: 'pages/index/index'

    }
  }
})
