//index.js
var common = require('../../common/common.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    houseStatistics: []
  },
  onLoad: function () {
    console.log('onLoad')
    console.log(getCurrentPages());
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    //过去12个月价格数据 get
    common.factory.getData({
      url: 'https://api.tigerz.nz/tigerspring/rest/getHouseStatistics',
      callBack: function (res) {
        console.log(res);
        that.setData({
          houseStatistics: res.data.data.priceIncreaseList
        })
      }
    })

  }
})
