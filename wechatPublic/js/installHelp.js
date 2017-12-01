$(function(){
  var version = {
    weixin: common.versions().weixin,
    android: common.versions().android,
    iPhone: common.versions().iPhone,
    iPad: common.versions().iPad,
    iPod: common.versions().iPod
  };
  if (version.iPhone || version.iPad || version.iPod) {
    $('.installHelp_version').attr('src', './data/img/installHelp_ios_4.jpg').css('height', '100%');
  }


})