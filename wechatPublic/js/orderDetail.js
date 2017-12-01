$(function() {
    //======================= url获取订单个人信息详情 ===============================
    var orderUserInfo = common.getUserInfo();
    $('.orderDetail_info_nickName').text('姓名：' + orderUserInfo.nickName);
    $('.orderDetail_info_province').text('省份：' + common.getArea(orderUserInfo.area));
    $('.orderDetail_info_mobile').text('手机号: ' + orderUserInfo.mobile);
    if (orderUserInfo.referruid == 1)
        // 没有推荐人
        $('.orderDetail_info_referruid').hide();
    else
        // 有推荐人
        $('.orderDetail_info_referruid').text('推荐人ID：' + orderUserInfo.referruid);

    //======================== 获取商品信息 =======================================
    $.get(common.payDomain + '/commodity/package?buyer_id=4064529&buyer_role=4&isNew=0&area=mongo_henan', function(res) {
        console.log(res.data[0]);
        $('.orderDetail_privilege_price').text('￥ ' + res.data[0].price).attr('shopId', res.data[0].id);
        $('.orderDetail_pay_price').text('￥ ' + res.data[0].price).attr('shopId', res.data[0].id);
    })

    //======================== 支付请求 ===============================================
    var payFlag = true;
    $('.orderDetail_pay_send').click(function() {
        var shopId = $('.orderDetail_pay_price').attr('shopId');
        if (payFlag && shopId) {
            payFlag = false;
            common.postData({
                url: common.payDomain + '/order/create',
                data: {
                    buyer_id: orderUserInfo.id,
                    buyer_role: 4,
                    area: orderUserInfo.area,
                    paytype: 2, //2 微信支付 1 支付宝支付
                    id: shopId,
                    openid: orderUserInfo.wxOpenId,
                    jsapi: 1,
                    timestamp: common.getTimeStamp()
                },
                callback: function(data) {
                    //================ 调用h5微信支付 ============================
                    function onBridgeReady() {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId": data.data.appId,     //公众号名称，由商户传入
                                "timeStamp": data.data.timeStamp,         //时间戳，自1970年以来的秒数
                                "nonceStr": data.data.nonceStr, //随机串
                                "package": data.data.package,
                                "signType": data.data.signType,         //微信签名方式：
                                "paySign": data.data.paySign //微信签名 
                            },
                            function (res) {
                                payFlag = true;
                                if (res.err_msg == "get_brand_wcpay_request:ok") {
                                    window.location.href = 'http://game.tigerz.nz/manage/register/payResult.html?type=0&commodity_name=' + data.data.commodity_name +'&order_code=' + data.data.order_code + '&total_fee=' + data.data.total_fee +'&area=' + orderUserInfo.area + '&role='+ orderUserInfo.role +'&id=' + orderUserInfo.id + '&wxOpenId=' + orderUserInfo.wxOpenId + '&wxUnionId=' + orderUserInfo.wxUnionId;
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
    });

})