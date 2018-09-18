var base_url = require("./utils/urls.js").baseUrl
let loginUrl = base_url + '/wx/getopenid'
var LOGIN_URL = base_url + '/wx/getopenid/'
var STATUS_URL = base_url + "/cooperation/wap/wx_mini_update_user_login_status/"
var param = require('./utils/utils').param
require('./utils/wx_promise.js') //request promise
App({
  //设置全局状态
  globalData: {
    sessionid: "",
    orderid: '',
    signUpData:{
      charge: 0,//总费用
      mid: '',//赛事 id
      entry_info: {
        openid: '',
        mobile: ''
      },//报名人信息
      group_id: "", //大队id
      group_name: "", //大队姓名
      detail: {
        racer_info: [], //参赛人员信息
        suixing_info: [], //随行人员信息
        goods: {
          gift: [
            {
              id: 0,//礼品 id
              num: 0, //礼品购买数量
            }
          ],
          insur: []
        }, //商品信息
      },
    }
  },



  /**
   * App登录方法
   */
  login() {
    var that = this
    var session_id = that.globalData.sessionid || wx.getStorageSync('sessionid')
    wx.checkSession({ //校验用户当前session_key是否有效
      success: function (res) {//未过期
        if (session_id) {
          that.globalData.sessionid = session_id
          //that.sendOnlineStatus(1)
        } else {
          that.weixinLogin()//登录可重新获取 session_key

        }
      },
      fail: function () {//已过期
        that.weixinLogin()
      }
    })
  },
  

  /**
   * 获取用户信息
   */
  getUserInfo(code) {
    let that = this;
    wx.getUserInfo({ //获取用户信息
      success: function (res) {
        let data = {
          from_wx_mini: 1,
          code: code,
          encryptedData: res.encryptedData,
          iv: res.iv,
        }
        this.getUserKey(data)

      },
      fail: function () {
        wx.openSetting();
        wx.showToast({
          title: "获取用户信息失败",
          icon: "loading"
        })
      }
    })
  },


  /**
   * 获取用户 sessionid
   */
  getUserKey(data) {
    wx.request({
      url: loginUr,
      method: 'POST',
      data: data,
      success: function (data) {
        data = data.data
        if (data.sessionid) {
          that.globalData.sessionid = 'sessionid=' + data.sessionid
          wx.setStorageSync('sessionid', 'sessionid=' + data.sessionid)
          //that.sendOnlineStatus(1)
        } else {
          wx.showToast({
            title: "登录失败",
            icon: "loading"
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "登录失败",
          icon: "loading"
        })
      }
    })
  },



  sendOnlineStatus(status) {
    var that = this
    var data = {
      from_wx_mini: 1,
      login_status: status,
      partner: 'chunyu_wap_mini'
    }
    var session_id = wx.getStorageSync('sessionid')
    wx.request({
      url: STATUS_URL,
      header: {
        'Content-Type': 'application/json',
        'Cookie': session_id
      },
      data: param(data),
      method: 'POST',
      success: function (res) {
        res = res.data
        if (res.error != 0) {
          console.log(res)
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  onShow(option) {
    var that = this
    // that.sendOnlineStatus(1)
  },
  onHide() {
    var that = this
    //that.sendOnlineStatus(0)
  },
  onLaunch() {
    var that = this
  },
  
})