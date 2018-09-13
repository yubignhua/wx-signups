let app = getApp()
let base_url = require("../../utils/urls.js")
let loginUrl = base_url.baseUrl + '/wx/getopenid'
let teamUrl = base_url.baseUrl + '/group/list'
let competitionUrl = base_url.baseUrl + '/match/info'

Page({
    data: {
      teamList: [{
        groupid: 0,
        newName: '请选择俱乐部',
        num: 10
      }],
      competitionList:null,
      team: 0,
      teamButton: false,
      personButton: false,
      signButton: false,
      showModel: false,
      agree: false,
      count: 0
    },
    
    onLoad(options) {
        this.getCompetition();
        this.getTeamList();

        //this.getCount();
      
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
   * 获取报名人数
   */
  getCount(){
    wx.pro.request({
      url: ''
    }).then((res) => {
      this.data.count = res.data;
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
      teamButton: selectedValue == 0 ? false : true,
      signButton: selectedValue == 0 ? false : true,
      personButton: false
    })
   
    if ( teamList.length && !teamList[selectedValue].num ) {
      wx.showModal({
        content: '该板块容量已达上限,可能无法如愿在营地扎营，请联系版主',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#000000',
        success: () => {
          this.setData({
            teamButton: false,
            signButton: false 
          }) }
      })
    }
    
  },

  /**
   * 选择散客
   */
  clickPerson() {
    this.setData({
      teamButton: false,
      personButton: true,
      signButton: true,
      team: 0
    })
  },

  /**
   * 报名须知
   */
  changeModel(event) {
    this.data.signButton?
      this.setData({
        showModel: event.target.dataset.visible
      }):null;
  },

  continueSign(){
    this.setData({
      showModel: false
    })
    app.globalData.signUpData.group_id = this.data.teamButton?this.data.teamList[this.data.team].groupid:0;
    app.globalData.signUpData.group_name = this.data.teamButton?this.data.teamList[this.data.team].name:'';
    wx.navigateTo({
      url: "../adding_vehicles/index"
    })
    
  },

  countSignUp() {
    wx.showModal({
      content: `当前报名人数：${this.data.count}`,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#000000'
    })
  },

  /**
   * 获取手机号并跳转
   */
  toNextPage(e) {
    // if (e.detail.errMsg ==='getPhoneNumber:ok'){
    //   wx.pro.request({
    //     url: '',
    //     method: 'POST',
    //     data: {
    //       code: app.globalData.code,
    //       encryptedData: e.detail.encryptedData,
    //       iv: e.detail.iv
    //     }
    //   }).then((res) => {
    //     app.globalData.entry_info.mobile = res.phoneNumber;
    //     wx.redirectTo({
    //       url: "../adding_vehicles/index"
    //     })
    //   })
    // }
    wx.navigateTo({
        url: "../adding_vehicles/index"
    })
  }
})

