let app = getApp()
let base_url = require("../../utils/urls.js")
let teamUrl = base_url.baseUrl + '/group/list'
let competitionUrl = base_url.baseUrl + '/match/info'
let orderUrl = base_url.baseUrl + '/order/getDetail'
var loginUrl = base_url.baseUrl + '/wx/getopenid/'

Page({
    data: {
      teamList: [{
        groupid: 0,
        newName: '请选择大队',
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
      teamNames: ''
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
                        that.getOrder( res.data.data.openid )
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
    if (this.data.signState){
      this.setData({
        signButton: true,
        team: 0,
        showModel: true,
        signType: 0
      })
    }
    if (!this.data.signState && !this.data.signedType) {
      this.setData({
        signButton: true,
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
        this.setData({
          showModel: event.target.dataset.visible,
          signType: 1
        })
      }
    }
  },

  changeModel(){
    this.setData({
      showModel: false
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
  }
})

