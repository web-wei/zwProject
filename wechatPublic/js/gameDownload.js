$(function(){
  //================== 微信分享 ===============================
  wx.ready(function(){
    wx.onMenuShareTimeline({
        title: '打老铁舒兰麻将赢大红包', // 分享标题
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
        title: '打老铁舒兰麻将赢大红包', // 分享标题
        desc: '我刚刚在打老铁舒兰麻将赢了红包，你也试试吧~', // 分享描述
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
  var area = common.getUserInfo().area;
  var type = common.getUserInfo().type;
  var pageData;
  var version = {
    weixin: common.versions().weixin,
    android: common.versions().android,
    iPhone: common.versions().iPhone,
    iPad: common.versions().iPad,
    iPod: common.versions().iPod
  };
  function navigate() {
    if (version.weixin) {
        $('.hint').show();
    }
    else if (version.android) {
      //================== 适配域名 ===============================
      $.ajax({
        type: 'GET',
        url: 'http://game.tigerz.nz/manage/register/gameDownload.html',
        success: function(){
          window.location.href = pageData.androidDownloadUrl;
        },
        error: function(){
          window.location.href = pageData.androidDownloadUrl1;
        }
      });
    } else if (version.iPhone || version.iPad || version.iPod) {
        window.location.href = pageData.iosDownloadUrl;
    }
  }
  function openApp() {
    if (version.weixin) {
        $('.hint').show();
        $('.hint_close').hide();
    }
    else if (version.android) {
        window.location.href = pageData.androidSckema;
    } else if (version.iPhone || version.iPad || version.iPod) {
        window.location.href = pageData.iosSckema;
    }
  }
  function showEle() {
    if (version.android) {
      $('.gameDownload').show();
      $('.gameDownload_ios').hide();
      $('.hint img').attr('src', './data/img/hint.png');
    }
    else if (version.iPhone || version.iPad || version.iPod) {
      $('.gameDownload').show();
      $('.gameDownload_ios').show();
      $('.hint img').attr('src', './data/img/hint1.png');
    }
  }
  showEle();
  // ============ 通过type判断做什么事 ========================
  if (type == 0) { // 分享下载页面 (必须参数 area)
    pageData = {
      iconImgUrl: common.params[area].iconImgUrl,
      wechatService: common.params[area].wechatService,
      wechatPublic: common.params[area].wechatPublic,
      pageTitle: common.params[area].download.pageTitle,
      pageDesc: common.params[area].download.pageDesc,
      androidDownloadUrl: common.params[area].androidDownloadUrl,
      androidDownloadUrl1: common.params[area].androidDownloadUrl1,
      iosDownloadUrl: common.params[area].iosDownloadUrl
    };
  }
  else if (type == 1) { // 微信好友分享房间号 （必须参数 area room_id cmdid app_id）
    var roomId = common.getUserInfo().room_id;
    var cmdid = common.getUserInfo().cmdid;
    var appid = common.getUserInfo().app_id;
    var suffix = "{'room_id':" + roomId + ",'cmdid':" + cmdid + "}";
    pageData = {
      iconImgUrl: common.params[area].iconImgUrl,
      wechatService: common.params[area].wechatService,
      wechatPublic: common.params[area].wechatPublic,
      androidDownloadUrl: common.params[area].androidDownloadUrl,
      androidDownloadUrl1: common.params[area].androidDownloadUrl1,
      iosDownloadUrl: common.params[area].iosDownloadUrl,
      pageTitle: common.params[area].share.pageTitle + roomId,
      pageDesc: common.params[area].share.pageDesc,
      androidSckema: common.params[area].share.androidSckema + suffix,
      iosSckema: common.params[area].share.iosSckema + suffix
    };
    openApp();
  }
  // ================== 公用 =============================
  $('.laotie_icon img').attr('src', pageData.iconImgUrl);
  $('.laotie_name p').text(pageData.pageTitle);
  $('.laotie_description p').text(pageData.pageDesc);
  $('.laotie_wechat').text(pageData.wechatService);
  $('.laotie_wechatpublic').text(pageData.wechatPublic);
  $('.laotie_download').click(function(){
    navigate();
  })
  $('.hint_close').click(function(){
    showEle();
    $(this).closest('.hint').hide();
  });
})



