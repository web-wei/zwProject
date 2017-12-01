//公用方法
//获取url参数
var common = {
    // 请求数据地址
    registerDomain: 'http://game.tigerz.nz/',
    //支付方面请求地址
    payDomain: 'http://game.tigerz.nz',
    //图片地址
    imgDomain: 'http://img.tigerz.nz/',
    params: {
        common: {
          wechatService: '微信客服：laotie-678',
          wechatPublic: '微信公众号：老铁地方棋牌',
          androidSckema: "dayugm://game1000/mpath?",
          iosSckema: "laotieshulanmajiang://ma168/mpath?"
        },
        jilin:{
            iconImgUrl: './data/img/icon_jilin.png',
            wechatService: '微信客服：laotie-678',
            wechatPublic: '微信公众号：老铁地方棋牌',
            androidDownloadUrl: 'http://game.tigerz.nz/download/android/android_laotie_jilin.apk',
            androidDownloadUrl1: 'http://www.tigerz.cn/download/android/android_laotie_jilin.apk',
            iosDownloadUrl: "itms-services://?action=download-manifest&url=https://www.laotie678.com/download/ios/jilin/jilin/manifest.plist",
            download:{ // 分享下载页面
                pageTitle:"老铁吉林棋牌",
                pageDesc:"老铁吉林棋牌，最正宗的吉林当地棋牌游戏。游戏快速稳定无外挂，吉林人自己的网上棋牌室，快和朋友一起来玩牌吧~"
            },
            share:{ // 微信邀请好友
                androidSckema: "dayugm://game1000/mpath?",
                iosSckema: "laotieshulanmajiang://ma168/mpath?",
                pageTitle: '正在进入房间：',
                pageDesc: '如果启动应用失败，有可能您还没有安装老铁吉林棋牌，或者您的浏览器不支持启动应用。苹果用户请用safari浏览器打开。没有下载的用户点击底部下载按钮进行下载。'
            }
        },
        shulan:{
            iconImgUrl: './data/img/icon_shulan.png',
            wechatService: '微信客服：laotie-678',
            wechatPublic: '微信公众号：老铁地方棋牌',
            androidDownloadUrl: 'http://game.tigerz.nz/download/android/android_laotie_shulan.apk',
            androidDownloadUrl1: 'http://www.tigerz.cn/download/android/android_laotie_shulan.apk',
            iosDownloadUrl: "itms-services://?action=download-manifest&url=https://www.laotie678.com/download/ios/jilin/shulan/manifest.plist",
            download:{ // 分享下载页面
                pageTitle:"老铁舒兰棋牌",
                pageDesc:"老铁舒兰棋牌，最正宗的舒兰当地棋牌游戏。游戏快速稳定无外挂，舒兰人自己的网上棋牌室，快和朋友一起来玩牌吧~"
            },
            share:{ // 微信邀请好友
                androidSckema: "dayugm://game1000/mpath?",
                iosSckema: "laotieshulanmajiang://ma168/mpath?",
                pageTitle: '正在进入房间：',
                pageDesc: '如果启动应用失败，有可能您还没有安装老铁舒兰棋牌，或者您的浏览器不支持启动应用。苹果用户请用safari浏览器打开。没有下载的用户点击底部下载按钮进行下载。'
            }
        },
        siping:{
            iconImgUrl: './data/img/icon_siping.png',
            wechatService: '微信客服：laotie-678',
            wechatPublic: '微信公众号：老铁地方棋牌',
            androidDownloadUrl: 'http://game.tigerz.nz/download/android/android_laotie_siping.apk',
            androidDownloadUrl1: 'http://www.tigerz.cn/download/android/android_laotie_siping.apk',
            iosDownloadUrl: "itms-services://?action=download-manifest&url=https://www.laotie678.com/download/ios/jilin/siping/manifest.plist",
            download:{ // 分享下载页面
                pageTitle:"老铁四平棋牌",
                pageDesc:"老铁四平棋牌，最正宗的四平当地棋牌游戏。游戏快速稳定无外挂，四平人自己的网上棋牌室，快和朋友一起来玩牌吧~"
            },
            share:{ // 微信邀请好友
                androidSckema: "dayugm://game1000/mpath?",
                iosSckema: "laotieshulanmajiang://ma168/mpath?",
                pageTitle: '正在进入房间：',
                pageDesc: '如果启动应用失败，有可能您还没有安装老铁四平棋牌，或者您的浏览器不支持启动应用。苹果用户请用safari浏览器打开。没有下载的用户点击底部下载按钮进行下载。'
            }
        }
    },
    //判断访问终端 
    versions: function() {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            iPod: u.indexOf('iPod') > -1, //是否iPod
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    },
    //url获取参数
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURIComponent(window.location.search).substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return name;
    },
    //===================== 通过role判断角色 ==========================
    getRole: function() {
        var role = common.getQueryString('role');
        if (role && Number(role) == 4) {
            return '玩家';
        } else {
            return '代理';
        }
    },
    //==================== 返回用户省份 ============================
    getArea: function(area) {
        switch(area) {
            case 'henan':
                return '河南';
                break;
            case 'jilin':
                return '吉林';
                break;
            case 'shulan':
                return '舒兰';
            default:
                return '吉林';
                break;
        }
    },
    //==================== 返回通过从url获取的信息集合 ================
    getUserInfo: function() {
        var userInfo = {};
        //获取url
        urlData = location.search.slice(1).split('&');
        // userInfo.role = common.getQueryString('role');
        // userInfo.id = common.getQueryString('id');
        // userInfo.mobile = common.getQueryString('mobile');
        // userInfo.nickName = common.getQueryString('nickName');
        // userInfo.nickname = common.getQueryString('nickname');
        // userInfo.card = common.getQueryString('card');
        // userInfo.area = common.getQueryString('area');
        // userInfo.referruid = common.getQueryString('referruid');
        // userInfo.wxOpenId = common.getQueryString('wxOpenId');
        // userInfo.wxUnionId = common.getQueryString('wxUnionId');
        // userInfo.dayu_sign = common.getQueryString('dayu_sign');
        // userInfo.type = common.getQueryString('type');
        // userInfo.order_code = common.getQueryString('order_code');
        // userInfo.total_fee = common.getQueryString('total_fee');
        // userInfo.commodity_name = common.getQueryString('commodity_name');
        // userInfo.forward = common.getQueryString('forward');
        // userInfo.room_id = common.getQueryString('room_id');
        // userInfo.cmdid = common.getQueryString('cmdid');
        // userInfo.app_id = common.getQueryString('app_id');

        //循环放入userInfo对象中，并进行解码
        for (var i = 0; i < urlData.length; i++) {
          userInfo[urlData[i].split('=')[0]] = decodeURIComponent(urlData[i].split('=')[1]);
        }
        console.log(userInfo);
        return userInfo;
    },
    //==================== 获取时间戳 ==============================
    getTimeStamp: function() {
        // 精确到秒
        var timestamp1 = Date.parse(new Date());
        // 精确到毫秒
        var timestamp2 = ( new Date() ).valueOf();
        // 精确到毫秒
        var timestamp3 = new Date().getTime();
        return timestamp1;
    },
    //===================== 将时间戳转化为日期 ======================
    timeFormat: function(t, hourShow) {
        if (!t) {
            t = 1401552000000;
        } else {
            t = t / 1;
        }
        var timeNow = new Date(t);
        var y = timeNow.getFullYear();
        var m = timeNow.getMonth() + 1;
        var d = timeNow.getDate();
        var h = timeNow.getHours() % 12;
        var ap = (timeNow.getHours() / 12) > 1 ? 'PM' : 'AM';
        var min = timeNow.getMinutes() < 10 ? ('0' + timeNow.getMinutes()) : timeNow.getMinutes();
        var str = hourShow ? (y + '/' + m + '/' + d + '   ' + h + ':' + min) : y + '/' + m + '/' + d;
        return str;
    },
    //=================== ajax请求get方法 ======================
    getData: function(obj) {
        var uid = ['player_uid', 'agent_uid'];
        //处理data 不同角色id名称不同
        if (common.getRole() == '玩家') {
          obj.url = obj.url + '&' + uid[0] + '=' + common.getQueryString('id');
        } else if (common.getRole() == '代理') {
          obj.url = obj.url + '&' + uid[1] + '=' + common.getQueryString('id');
        }
        $.ajax({
            url: obj.url,
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                obj.callback(res);
            }
        })
    },
    //ajax请求post方法
    postData: function(obj) {
        var uid = ['player_uid', 'agent_uid'];
        //处理data 不同角色id名称不同
        if (common.getRole() == '玩家') {
          obj.data[uid[0]] = common.getQueryString('id');
        } else if (common.getRole() == '代理') {
          obj.data[uid[1]] = common.getQueryString('id');
        }
        $.ajax({
            url: obj.url,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: JSON.stringify(obj.data),
            success: function(res) {
                obj.callback(res);
            }
        });
    }
};
$.ajax({
    type: 'GET',
    url: 'http://139.129.96.48:7901/game/wxSign?area=jilin&url=' + encodeURIComponent(location.href.split('#')[0]),
    success: function (res) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx7064473f5d9e12d1', // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.sign,// 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
    }
});
