$(function() {
    /*
        url参数中
        type==0为订单页面充值状态;
        type==1为充值商城页面充值状态;
    */
    var type = common.getUserInfo().type;
    //======================== 发送充值状态请求 ======================   
    common.postData({
        url: common.payDomain + '/game/getOrderDesc',
        data: {
            area: common.getUserInfo().area,
            order_code: common.getUserInfo().order_code,
            total_fee: common.getUserInfo().total_fee,
            commodity_name: common.getUserInfo().commodity_name
        },
        callback: function (res) {
            if (res.data.is_order) {
                $('.payResult_detail_nickname').text(res.data.nickname);
                $('.payResult_detail_area').text(common.getArea(res.data.area));
                $('.payResult_detail_mobile').text(res.data.mobile);
                $('.payResult_detail_commodity').text(res.data.commodity_name);
                $('.payResult_detail_totalFee').text(res.data.total_fee + '元');
                $('.payResult_detail_time').text(common.timeFormat(res.data.time, true));
            }
            else {
                $('.payResult_result span').css({
                    'background': 'url(./data/img/resultError.png) no-repeat',
                    'backgroundSize': 'contain'
                });
                $('.payResult_result p').text('充值失败');
                $('.payResult_detail').hide();
                $('.payResult_button').text('返回充值');
            }
            //================ 跳转事件 ==========================================
            $('.payResult_button').click(function() {
                if ($(this).text() == '完成') {
                    if (type == 0) {
                        window.location.href = 'http://game.tigerz.nz/manage/index.html?#/home?area=' + res.data.area + '&role=' + res.data.role + '&id=' + res.data.id + '&nickname=' + res.data.nickname + '&card=' + res.data.card + '&dayu_sign=' + res.data.dayu_sign + '&wxOpenId=' + common.getUserInfo().wxOpenId + '&wxUnionId=' + common.getUserInfo().wxUnionId;
                    }
                    else if (type == 1) {
                        window.location.href = 'http://game.tigerz.nz/manage/register/shop.html?area=' + res.data.area + '&role=' + res.data.role + '&id=' + res.data.id + '&nickname=' + res.data.nickname + '&card=' + res.data.card + '&dayu_sign=' + res.data.dayu_sign + '&wxOpenId=' + common.getUserInfo().wxOpenId + '&wxUnionId=' + common.getUserInfo().wxUnionId;
                    }
                }
                else if ($(this).text() == '返回充值') {
                    window.history.back();
                }
            })
        }
    })
})