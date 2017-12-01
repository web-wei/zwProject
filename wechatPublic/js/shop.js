$(function(){
    wx.ready(function(){
        wx.onMenuShareTimeline({
            title: '老铁棋牌官方公众号 - 老铁商城', // 分享标题
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://game.tigerz.nz/manage/register/data/img/share.png', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () { 
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareAppMessage({
            title: '老铁棋牌官方公众号 - 老铁商城', // 分享标题
            desc: '商城：手指点一点，财运滚滚来，爱上商城，钱包更充足。', // 分享描述
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://game.tigerz.nz/manage/register/data/img/share.png', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () { 
                // 用户确认分享后执行的回调函数
            },
            cancel: function () { 
                // 用户取消分享后执行的回调函数
            }
        });
    });
  $('.shop_content_name').text('昵称：' + common.getUserInfo().nickname);
  $('.shop_content_area').text('地区：' + common.getArea(common.getUserInfo().area) + '麻将');
  // =========================== 获取商品list请求 ===============================
  common.getData({
    url: common.payDomain + '/commodity/wxpackage?area=' + common.getUserInfo().area,
    callback: function(data) {
      if (data.status == 0) {
        $('.shop_items').html('');
        $.each(data.data, function (index, ele) { 
           var element = '<div class="shop_item"><p class="shop_item_card">'+ ele.name +'</p><img class="shop_item_img" src="./data/img/card.png" alt="房卡"><p class="shop_item_money" shopId="'+ ele.id +'" >'+ ele.amount +'元购买</p>';
           $('.shop_items').append(element);
        });
      }
    }
  });
  // =========================== 发送支付请求 =====================================
  var payFlag = true;
  $('.shop_items').on('click', '.shop_item_money', function(){
    var shopId = $(this).attr('shopId');
    if (payFlag && shopId) {
      payFlag = false;
      common.postData({
        url: common.payDomain + '/game/wxPlayerOrder',
        data: {
          openid: common.getUserInfo().wxOpenId,
          unionid: common.getUserInfo().wxUnionId,
          area: common.getUserInfo().area,
          cid: shopId,
          timestamp: common.getTimeStamp()
        },
        callback: function(data) {
            //================ 调用h5微信支付 ============================
            function onBridgeReady() {
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": data.data.appId,  //公众号名称，由商户传入
                        "timeStamp": data.data.timeStamp,  //时间戳，自1970年以来的秒数
                        "nonceStr": data.data.nonceStr, //随机串
                        "package": data.data.package,
                        "signType": data.data.signType, //微信签名方式：
                        "paySign": data.data.paySign //微信签名 
                    },
                    function (res) {
                        payFlag = true;
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                              window.location.href = 'http://game.tigerz.nz/manage/register/payResult.html?type=1&commodity_name=' + data.data.commodity_name +'&order_code=' + data.data.order_code + '&total_fee=' + data.data.total_fee +'&area=' + common.getUserInfo().area + '&role=' + common.getUserInfo().role + '&id=' + common.getUserInfo().id + '&wxOpenId=' + common.getUserInfo().wxOpenId + '&wxUnionId=' + common.getUserInfo().wxUnionId;
                         }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                    }
                );
            }
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }
        }
      });
    }
  })

})