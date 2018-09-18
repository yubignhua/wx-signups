let app = getApp()
let base_url = require("../../utils/urls.js")
let identifyUrl = base_url.baseUrl + '/club/addContact'

Page({
  data: {
    toView: 'red',
    scrollTop: 100,
    CarsList: [{ name: '', idcard: '', mobile: '', eid: '' }],//控制表单数量的状态
    flagList: [false],
    indicatorDots: false,
    current:0,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    state0:0,
    mData:{},//当前表单数据
    dataList: [],//车辆数据列表
    nameState: true,
    idState: true,
    phoneState: true,
    lastData:{},
    nextFlag:true

  },
	
	onLoad: function () {
		wx.pro.removeStorage("SIGNUP_CARLIST")
		wx.pro.removeStorage("SIGNUP_FLAGLIST")
  	
  	
  	wx.pro.getStorage("SIGNUP_CARLIST").then(res =>{
		  if(res && res.data && res.data.length>0){
		  	this.setData({
				  CarsList:res.data
		  		})
		  }
	  });
		
   	wx.pro.getStorage("SIGNUP_FLAGLIST").then(res =>{
		  if(res && res.data && res.data.length>0){
		  	this.setData({
				  flagList:res.data
		  		})
		  }
	  })
  
  },


  /**
   * 表单提交
   */
  formSubmit (e) {
    console.log(e.detail.value,'=======')
    this.setData({
      mData: e.detail.value
    })
  },

  /**
   * 删除车辆
   */
  deleteCar(event){
  	
    let index = event.currentTarget.dataset['index'];
    this.data.dataList.splice(index, 1);
    this.data.CarsList.splice(index, 1);
    this.data.flagList.splice(index, 1);
    //this.data.CarsList[this.data.CarsList.length-1] = this.data.lastData;
    let curState = 0;
    if(index === 0)
      curState = index;
    else
      curState = index - 1;
    this.setData({
      dataList: this.data.dataList,
      CarsList: this.data.CarsList,
      flagList: this.data.flagList,
      current: curState,
    })
	  //本地缓存汽车列表
	  wx.pro.setStorage("SIGNUP_CARLIST",this.data.CarsList);
	  wx.pro.setStorage("SIGNUP_FLAGLIST",this.data.flagList);
	  
	  console.log('detet----.CarsList',this.data.CarsList)
	
  },
  /**
   * 校验表单
   */
  checkInput: function (mData){
    const pattrnName = /^([a-zA-Z\u4e00-\u9fa5\·]{1,10})$/,
          pattrnId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          pattrnPhone = /(^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$)/;
    let nameState, idState, phoneState;      
    if (!pattrnName.test(mData[`name`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的用户名',
        showCancel: false,
        confirmColor: "#000000"
      });
      nameState = false
    }else{
      nameState = true
    }

    if (!pattrnId.test(mData[`idcard`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的身份证号码',
        showCancel:false,
        confirmColor:"#000000"
      })
      idState = false
    }else{
      idState = true
    }

    if (!pattrnPhone.test(mData[`mobile`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号码',
        showCancel: false,
        confirmColor: "#000000"
      })
      phoneState = false
    }else{
      phoneState = true
    }
    this.setData({
      nameState: nameState,
      idState: idState,
      phoneState: phoneState
    })
  },
	
	/**
	 * 判断报名是否重复
	 * @param id
	 */
	judgeRepeat(id){
		let {CarsList} = this.data;
		console.log("id::::",id);
		console.log("CarsList::::",CarsList);
		if(CarsList.length<=1) return;
		let isRepeat = CarsList.some((item)=>{
			if(item.idcard === id){
				return true;
			}
		});
		if(isRepeat){
			wx.showToast({
				title: "不能重复购买保险",
				icon: "none"
			});
		}
		return isRepeat;
	},
	
	/**
   * 新增车辆
   */
  addCar(e){
    // this.checkInput(this.data.mData);
    // if (!this.data.nameState || !this.data.idState || !this.data.phoneState){
    //   return
    // }
		let flag = this.judgeRepeat(this.data.mData.idcard);
    if(flag) return;
    this.checkPerson(this.data.mData,res=>{
      //将新添加的 车辆数据 插入到数组的倒数第二位
      this.data.CarsList.splice(this.data.CarsList.length - 1, 0, this.data.mData);
	    this.data.flagList.splice(this.data.flagList.length - 1, 0, true);
	    this.data.dataList.push(this.data.mData);
      this.setData({
        CarsList: this.data.CarsList,
        current: this.data.CarsList.length - 1,
        flagList: this.data.flagList,
        dataList: this.data.dataList,
        lastData: {}
      });
      //本地缓存汽车列表
	    wx.pro.setStorage("SIGNUP_CARLIST",this.data.CarsList);
	    wx.pro.setStorage("SIGNUP_FLAGLIST",this.data.flagList);
	    
	    console.log("add carList",this.data.CarsList)
    },res=>{
      if(res.data.code == 1008){
        wx.showToast({
          title: "不能重复报名",
          icon: "none"
        })
      }else{
        wx.showToast({
          title: "实名认证失败",
          icon: "none"
        })
      }
      
    })
  },


  /**
   * 验证身份
   */

  checkPerson(map={},callback,error){
  	callback()
    wx.pro.request({
      url: identifyUrl,
      method: "POST",
      data: map
    }).then((res) => {
      if(res.data.code == 1000){
        callback(res);
      } else if (res.data.code == 1007){
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }else{
        error(res);
      }
    })
  },
  change1(e){
    this.data.lastData.name = e.detail.value;
  },
  change2(e) {
    this.data.lastData.idcard = e.detail.value;
  },
  change3(e) {
    this.data.lastData.mobile = e.detail.value;
  },
  change4(e) {
    this.data.lastData.eid = e.detail.value;
  },

  /**
   * 点击下一步提交所有数据
   */
  submitAllData(){
  //	console.log("lastData.idcard::",this.data.lastData.idcard)
	  let flag = this.judgeRepeat(this.data.lastData.idcard);
	  if (!this.data.nextFlag) return;
    let {CarsList,lastData} = this.data;
    app.globalData.signUpData.entry_info.mobile = CarsList[0].mobile;
    if(CarsList.length == 1){
	    this.checkInput(lastData);
	    if (!this.data.nameState || !this.data.idState || !this.data.phoneState) {
		    return
	    }
	    if(flag){
		    return;
	    }
	    this.setData({
		    nextFlag: false
	    });
	    this.checkPerson(lastData,res => {
		    this.data.dataList.push(lastData);
		    app.globalData.signUpData.detail.racer_info = this.data.dataList;
        console.log(this.data.dataList)
		    this.setData({
			    nextFlag: true,
			    lastData:{}
		    });
		    //页面跳转
		    wx.navigateTo({
			    url: '../adding_accompany/index'
		    })
	    },res=>{
		    //验证失败
		    if(res.data.code == 1008){
			    wx.showToast({
				    title: "不能重复报名",
				    icon: 'none'
			    })
		    }else{
			    wx.showToast({
				    title: "实名认证失败",
				    icon: 'none'
			    })
		    }
		    this.setData({
			    nextFlag: true
		    })
	    })
    }else{
      if(!lastData.name || !lastData.mobile || !lastData.idcard){
	      wx.showModal({
		      title: '提示',
		      content: `由于车辆${CarsList.length}填写的信息不全,添加车辆${CarsList.length}将不会生效,是否继续?`,
		      confirmColor:"#000000",
		      success:res=>{
		        if(res.confirm){
			        app.globalData.signUpData.detail.racer_info = this.data.dataList;
              wx.navigateTo({
				        url: '../adding_accompany/index'
			        })
            }
          }
	      })
      }
	    if(lastData.name && lastData.mobile && lastData.idcard){
		    this.checkInput(lastData);
		    if (!this.data.nameState || !this.data.idState || !this.data.phoneState) {
			    return
		    }
		    if(flag){
			    return;
		    }
		    this.setData({
			    nextFlag: false
		    });
		    this.checkPerson(lastData,res => {
			    this.data.dataList.push(lastData);
			    app.globalData.signUpData.detail.racer_info = this.data.dataList;
			    this.setData({
				    nextFlag: true,
				    lastData:{}
			    });
			    //页面跳转
          wx.navigateTo({
				    url: '../adding_accompany/index'
			    })
		    },res=>{
			    //验证失败
			    if(res.data.code == 1008){
				    wx.showToast({
					    title: "不能重复报名",
					    icon: 'none'
				    })
			    }else{
				    wx.showToast({
					    title: "实名认证失败",
					    icon: 'none'
				    })
			    }
			    this.setData({
				    nextFlag: true
			    })
		    })
	    }
    }
  }
})