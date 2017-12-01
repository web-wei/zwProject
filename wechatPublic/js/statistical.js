$(function(){
  var area =  'jilin'; // 默认地区

  function getAreaGameData(area) {
    $.ajax({
      type: 'get',
      url: 'http://game.tigerz.nz/api/gamedata',
      data: 'operator=gameData&area=' + area,
      dataType: 'jsonp',
      jsonp: 'callback',
      success: function (res) {
        console.log(res);
        if (res.status == 0) {
          var ele = '<caption>统计(按区域)</caption><tr><th>统计项</th><th>完成状态</th></tr><tr><td>日新增用户数量</td><td>'+ res.data.curDayNewPlayerCount +'</td></tr><tr><td>周新增用户数量</td><td>'+ res.data.curWeekNewPlayerCount +'</td></tr><tr><td>月新增用户数量</td><td>'+ res.data.curMonthNewPlayerCount +'</td></tr><tr><td>总用户数量</td><td>'+ res.data.allPlayerCount +'</td></tr><tr><td>日登陆用户数量</td><td>'+ res.data.curDayLoginPlayerCount +'</td></tr><tr><td>周登陆用户数量</td><td>'+ res.data.curWeekLoginPlayerCount +'</td></tr><tr><td>月登陆用户数量</td><td>'+ res.data.curMonthLoginPlayerCount +'</td></tr><tr><td>日开房间数量</td><td>'+ res.data.curDayStartRoomsCount +'</td></tr><tr><td>周开房间数量</td><td>'+  res.data.curWeekStartRoomsCount +'</td></tr><tr><td>月开房间数量</td><td>'+ res.data.curMonthStartRoomsCount +'</td></tr><tr><td>总开房间数量</td><td>'+ res.data.allStartRoomsCount +'</td></tr><tr><td>日消耗房卡数量</td><td>'+  res.data.curDayCostCardCount +'</td></tr><tr><td>周消耗房卡数量</td><td>'+ res.data.curWeekCostCardCount +'</td></tr><tr><td>月消耗房卡数量</td><td>'+ res.data.curMonthCostCardCount +'</td></tr><tr><td>总消耗房卡数量</td><td>'+ res.data.allCostCardCount +'</td></tr><tr><td>日新增代理数量</td><td>'+ res.data.curDayNewAgentCount +'</td></tr><tr><td>周新增代理数量</td><td>'+  res.data.curWeekNewAgentCount +'</td></tr><tr><td>月新增代理数量</td><td>'+ res.data.curMonthNewAgentCount +'</td></tr><tr><td>总代理数量</td><td>'+ res.data.allAgentCount +'</td></tr><tr><td>日充值额</td><td>'+ res.data.curDayPlayerPayCount +'</td></tr><tr><td>周充值额</td><td>'+ res.data.curWeekPlayerPayCount +'</td></tr><tr><td>月充值额</td><td>'+ res.data.curMonthPlayerPayCount +'</td></tr><tr><td>总充值额</td><td>'+ res.data.allPlayerPayCount +'</td></tr><tr><td>日用户佣金数</td><td>'+ res.data.curDayPlayerProfitCount +'</td></tr><tr><td>周用户佣金数</td><td>'+ res.data.curWeekPlayerProfitCount +'</td></tr><tr><td>月用户佣金数</td><td>'+ res.data.curMonthPlayerProfitCount +'</td></tr><tr><td>总用户佣金数</td><td>'+ res.data.allPlayerProfitCount +'</td></tr><tr><td>日净收益</td><td>'+ (res.data.curDayPlayerPayCount - res.data.curDayPlayerProfitCount) +'</td></tr><tr><td>周净收益</td><td>'+ (res.data.curWeekPlayerPayCount - res.data.curWeekPlayerProfitCount) +'</td></tr><tr><td>月净收益</td><td>'+ (res.data.curMonthPlayerPayCount - res.data.curMonthPlayerProfitCount) +'</td></tr><tr><td>总净收益</td><td>'+ (res.data.allPlayerPayCount - res.data.allPlayerProfitCount) +'</td></tr>';
          $('.statistical table').append(ele);
        }
      }
    });
  }
  getAreaGameData(area);

  $('select').change(function(){
    console.log($(this).val());
    area = $(this).val();
    $('.statistical table').html('');
    getAreaGameData(area);
  })
})