$(function(){
  var
  jqName = $('#name'),
  jqPhone = $('#phone'),
  jqPhotoCode = $('#photoCode');
  
  //方法函数
  //============================== 用户名验证 =============================
  // function checkUser() {
  //   var reg = /^[a-z0-9_-]{3,16}$/;
  //   var userName = jqName.val().trim();    
  //   var errorUserName = $('.error_userName');
  //   if (reg.test(userName)) {
  //     errorUserName.hide();
  //     return true;
  //   } else if (userName == '') {
  //     errorUserName.show();
  //     errorUserName.text('用户名不能为空');
  //     return false;
  //   } else {
  //     errorUserName.show();
  //     errorUserName.text('用户名格式不正确');
  //     return false;
  //   }
  // }
  //============================== 微信名验证 =============================
  // function checkWechat() {
  //   var reg = /^[a-z0-9_-]{3,16}$/;
  //   var userWechat = $('#wechat').val().trim();
  //   var errorWechat = $('.error_wechat');
  //   if (reg.test(userWechat)) {
  //     errorWechat.hide();
  //     return true;
  //   } else if (userWechat == '') {
  //     errorWechat.show();
  //     errorWechat.text('微信名不能为空');
  //     return false;
  //   } else {
  //     errorWechat.show();
  //     errorWechat.text('微信名格式不正确');
  //     return false;
  //   }
  // }
  //============================== 手机号验证 =============================
  function checkPhone() {
    var reg = /^1[0-9]{10}$/;
    var userPhone = jqPhone.val().trim();    
    var errorPhone = $('.error_phone');
    if (reg.test(userPhone)) {
      errorPhone.hide();
      return true;
    } else if (userPhone == '') {
      errorPhone.text('手机号码不能为空');
      errorPhone.show();
      return false;
    } else {
      errorPhone.text('您输入的手机号码有误');
      errorPhone.show();
      return false;
    }
  }
  //============================== 用户密码验证 ===========================
  // function checkPassword() {
  //   var reg = /^[a-z0-9_-]{6,18}$/;
  //   var userPassword = $('#password').val().trim();
  //   var errorPassword = $('.error_password');
  //   if (reg.test(userPassword)) {
  //     errorPassword.hide();
  //     return true;
  //   } else if (userPassword == '') {
  //     errorPassword.text('密码不能为空');
  //     errorPassword.show();
  //     return false;
  //   } else {
  //     errorPassword.text('密码格式不正确');
  //     errorPassword.show();
  //     return false;
  //   }
  // }
  //============================= 确认密码验证 ============================
  // function checkConfirmPassword() {
  //   var userPassword = $('#password').val().trim();
  //   var userConfirmPassword = $('#confirmPassword').val().trim();
  //   var errorConfirmPassword = $('.error_confirmPassword');
  //   //console.log(userPassword);
  //   //console.log(userConfirmPassword);
  //   if (userPassword == userConfirmPassword && userConfirmPassword !== '' && userPassword !== '') {
  //     errorConfirmPassword.hide();
  //     return true;
  //   } else if (userConfirmPassword == '') {
  //     errorConfirmPassword.text('确认密码不能为空');
  //     errorConfirmPassword.show();
  //     return false;
  //   } else {
  //     errorConfirmPassword.text('两次密码不一致');
  //     errorConfirmPassword.show();
  //     return false;
  //   }
  // }
  //============================= 请求图片验证码接口 ======================
  var codeDetail = {
    imgurl: '',
    captchaCode: '',
    judge: false
  };
  function getCode() {
    $.getJSON(common.registerDomain + 'api/verifyCode?callback=?', function(res) {
      codeDetail.imgurl = res.data.img;
      codeDetail.captchaCode = res.data.captchaCode;
      $('.photoCode_img').attr({ 'src': 'data:image/png;base64,' + codeDetail.imgurl });
    })
  }
  //默认验证码
  getCode();
  //============================= 验证图片验证码接口 ==========================
  function checkCode() {
    var photoCode = jqPhotoCode.val().trim().toLowerCase();
    if (photoCode.length == 4) {
        $.getJSON(common.registerDomain + 'api/register?callback=?', {
          operator: 'checkCode',
          captchaCode: codeDetail.captchaCode,
          vcode: photoCode
        }, function (res) {
          console.log(res);
          if (res.status == 0) {
            $('.error_photoCode').hide();
            codeDetail.judge = true;
          }
          else{
            $('.error_photoCode').show();
            codeDetail.judge = false;
          }
        })
    } else {
      codeDetail.judge = false;
      return false;
    }
  }
  //============================= 发送手机验证码接口 =========================
  function sendPhoneCode(ele) {
    var phone = jqPhone.val().trim();
    $.getJSON(common.registerDomain + 'api/register?callback=?', {
      operator: 'sendSms',
      mobile: phone
    }, function(res) {
      console.log(res.status);
      if (res.status == 0) {
        var num = 60;
        var timer = setInterval(function() {
          num--;
          ele.css('color', '#D2D9DC').text('重新获取('+ num +')');
          if (num == 0) {
            clearInterval(timer);
            ele.css('color', '#66B6F8').text('发送手机验证码');
          }
        }, 1000);
      }
      else {
        $('.register_errorHint_content div').text(res.data);
        $('.register_errorHint').show();
      }
    })
  }

  //========================== 微信登录 =================================
  //window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7064473f5d9e12d1&redirect_uri=' + decodeURIComponent('http://game.tigerz.nz/manage/register/register.html') +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'

  //事件合集
  //=========================== 名称一栏失去焦点 ==========================
  // jqName.blur(function(){ checkUser(); });
  //=========================== 获取名称 =================================
  $('.register_form_name p').text(common.getUserInfo().nickname);
  //=========================== 获取省份 =================================
  $('.register_form_provinces p').text(common.getArea(common.getUserInfo().area));
  //=========================== 微信一栏失去焦点 ==========================
  // $('#wechat').blur(function(){ checkWechat(); });
  //=============================== 选择市 ================================
  // $('.city_select').click(function(){
  //   $('.city_container').show();
  // });
  // $('.city_container').click(function(){ $(this).hide() });
  // $('.city_container_detail').click(function(event){
  //   event.stopPropagation();
  // });
  // $('.city_container_detail').on('click', 'p', function(){
  //   //改变城市内容
  //   $('.city_container').hide();
  //   $('.city_shi').text($(this).children('span').last().text());
  //   //改变城市样式
  //   $(this).siblings('p').children('span').removeClass();
  //   $(this).children('span').eq(0).addClass('city_detail_true');
  // });
  //=========================== 手机号一栏失去焦点 ========================
  jqPhone.blur(function(){ checkPhone(); });
  //=========================== 发送手机验证码 ===========================
  $('.form_phone_send').click(function(){
    var aa = checkPhone();
    var text = $(this).text();
    if (aa && text == '发送手机验证码') {
      sendPhoneCode($(this));
    }
  });
  //=========================== 手机验证码一栏失去焦点 ====================

  //=========================== 密码一栏失去焦点 =========================
  // $('#password').blur(function(){ checkPassword(); });
  //=========================== 确认密码一栏失去焦点 =====================
  // $('#confirmPassword').blur(function(){ checkConfirmPassword(); });

  //=========================== 图片验证码一栏、点击图片或换一张 =============
  $('.photoCode_img,.photoCode_huan').click(function(){
    jqPhotoCode.val('');
    getCode();
  });
  //=========================== 图片验证码输入框改变事件 =====================
  jqPhotoCode.bind({
    blur: function() {

    },
    keyup: function() {
      checkCode();
    }
  });
  //=========================== 选择协议事件 =================================
  $('#agreement_confirm_checked').click(function(){
    var aa = $(this).prop("checked");
    if (aa) {
      $('.form_agreement_confirm').css({
        'background': 'url("./data/img/false.png") left center no-repeat',
        'backgroundSize': '0.28rem'
      });
      $(this).prop('checked', false);
      $('.form_submit').prop('disabled', true).css('background', '#cdcdcd');
    } else {
      $('.form_agreement_confirm').css({
        'background': 'url("./data/img/true.png") left center no-repeat',
        'backgroundSize': '0.28rem'
      });
      $(this).prop('checked', true);
      $('.form_submit').prop('disabled', false).css('background', '#66B6F8');
    }
  });
  //=========================== 关闭提交后错误信息弹窗事件 =============================
  $('.register_errorHint_content span').click(function() {
    $(this).closest('.register_errorHint').hide();
  })
  //=========================== input获得焦点时，手机软键盘自动滚动到当前位置 ===========
  $('input').on('focus', function(){
    this.scrollIntoView();
  })
  //=========================== 提交表单事件 =================================
  $('.register_form').submit(function(){
    // var a = checkUser();
    // var b = checkWechat();
    var c = checkPhone();
    // var d = checkPassword();
    // var e = checkConfirmPassword();

    if (codeDetail.judge) {
      if (c) {
        $.getJSON(common.registerDomain + 'api/register?callback=?', {
          operator: 'add',
          vcode: jqPhotoCode.val().trim().toLowerCase(),
          captchaCode: codeDetail.captchaCode,
          mobileVcode: $('#phoneCode').val().trim(),
          recommend: $('#referees').val().trim(),
          nickname: common.getUserInfo().nickname,
          mobile: jqPhone.val().trim(),
          province: common.getUserInfo().area,
          role: 8,
          openid: common.getUserInfo().wxOpenId,
          unionid: common.getUserInfo().wxUnionId
        }, function(res) {
          if(res.status == 0) {
            // console.log(res.data);
            window.location.href = 'http://game.tigerz.nz/manage/register/orderDetail.html?mobile=' + res.data.mobile + '&id=' + res.data.agentId + '&nickName=' + res.data.nickName + '&area=' + res.data.province + '&role=8&referruid=' + res.data.referruid + '&wxOpenId=' + common.getUserInfo().wxOpenId + '&wxUnionId=' + common.getUserInfo().wxUnionId;
          }
          else if (res.status == -3) {
            console.log(res.data);
          }
          else {
            $('.register_errorHint_content div').text(res.data);
            $('.register_errorHint').show();
          }
        })
      }
    } else {
      $('.error_photoCode').show();
    }

    return false;
  });


  

})