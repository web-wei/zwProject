$(function(){
  wx.ready(function(){
      wx.onMenuShareTimeline({
          title: '老铁棋牌官方公众号 - 游戏下载', // 分享标题
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
          title: '老铁棋牌官方公众号 - 游戏下载', // 分享标题
          desc: '老铁棋牌，游戏快速稳定无外挂，多种玩法。快和朋友一起来玩吧~', // 分享描述
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
  // 根据forward参数  判断是跳转还是直接进入，等于1是跳转进入
  if (common.getUserInfo().forward == 1) {
    $('.allGameDownload_hint').show();
  }
  var version = {
    weixin: common.versions().weixin,
    android: common.versions().android,
    iPhone: common.versions().iPhone,
    iPad: common.versions().iPad,
    iPod: common.versions().iPod
  };
  // 各个地区下载数据
  var allGameDownloadData = [
    {
      iconUrl: './data/img/icon_jilin.png',
      title: '老铁棋牌-吉林',
      size: '34.7MB',
      description: '原汁原味的吉林本地麻将',
      downUrl: 'http://game.tigerz.nz/manage/register/gameDownload.html?type=0&area=jilin'
    },
    {
      iconUrl: './data/img/icon_shulan.png',
      title: '老铁棋牌-舒兰',
      size: '34.7MB',
      description: '原汁原味的舒兰本地麻将',
      downUrl: 'http://game.tigerz.nz/manage/register/gameDownload.html?type=0&area=shulan'
    },
    {
      iconUrl: './data/img/icon_siping.png',
      title: '老铁棋牌-四平',
      size: '34.7MB',
      description: '原汁原味的四平本地麻将',
      downUrl: 'http://game.tigerz.nz/manage/register/gameDownload.html?type=0&area=siping'
    }
  ];
  function openApp() {
    var roomId = common.getUserInfo().room_id;
    var cmdid = common.getUserInfo().cmdid;
    var appid = common.getUserInfo().app_id;
    var suffix = "{'room_id':" + roomId + ",'cmdid':" + cmdid + "}";
    if (version.weixin) {
      $('.hint').show();
      $('.hint_close').hide();
    }
    else if (version.android) {
      window.location.href = common.params['common'].androidSckema + suffix;
    } else if (version.iPhone || version.iPad || version.iPod) {
      window.location.href = common.params['common'].iosSckema + suffix;
    }
    // 页面下载地址中，参数type改为1
    allGameDownloadData[0].downUrl = 'http://game.tigerz.nz/manage/register/gameDownload.html?type=1&area=jilin&room_id=' + roomId + '&cmdid=' + cmdid + '&app_id=' + appid;
    allGameDownloadData[1].downUrl = 'http://game.tigerz.nz/manage/register/gameDownload.html?type=1&area=shulan&room_id=' + roomId + '&cmdid=' + cmdid + '&app_id=' + appid;
    allGameDownloadData[2].downUrl = 'http://game.tigerz.nz/manage/register/gameDownload.html?type=1&area=siping&room_id=' + roomId + '&cmdid=' + cmdid + '&app_id=' + appid;
  }
  // 根据isShareRoom参数 true说明分享房间号
  if (common.getUserInfo().isShareRoom == 'true') {
    openApp();
  }
  $.each(allGameDownloadData, function (index, ele) { 
     var element = '<div class="allGameDownload_detail_item"><div class="allGameDownload_item_img"><img src="'+ ele.iconUrl +'" alt="图标"></div><div class="allGameDownload_item_main"><h2>'+ ele.title +'</h2><p class="allGameDownload_main_size">'+ ele.size +'</p><p class="allGameDownload_main_des">'+ ele.description +'</p></div><a href="'+ ele.downUrl +'"><div class="allGameDownload_item_down">下载</div></a></div>';
      $('.allGameDownload_detail').append(element);
  });






})