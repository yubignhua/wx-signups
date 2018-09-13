/**
 * Created by zongkelong on 2016/10/26.
 */
module.exports = {
    param:function (a) {
        var s = []
        var key
        var add = function (key, valueOrFunction) {
                var value = typeof valueOrFunction === 'function' ? valueOrFunction() : valueOrFunction;
            s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value == null ? "" : value )
        }
        for(key in a){
            add(key,a[key])
        }
        return s.join('&')
    },
    timeCountDown(code,_this){
        if(code=="iscode"){
        _this.setData({
            btnSelected:"btn--selected",
            disabled:"disabled"
        })
        }
        var count = 60;
        var timer = setInterval(function(){ 
        count = count-1;
        if(count<=0){
            _this.setData({
            disabled:"",
            btnSelected:"",
            btn_text:"获取验证码",
            })
            clearInterval(timer);
        }else{
            _this.setData({
            btn_text:count+"s后再获取",
            })
        }
        },1000)
    }
}