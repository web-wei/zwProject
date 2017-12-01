var common = require('../../common/common.js')
// location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: 'Auckland',
    allCity: common.factory._JSON1.all,
    allCityFirst: 'Auckland City',
    active: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getCurrentPages());
    console.log(options);
    this.setData({
      allCityFirst: common.factory._JSON1[options.area].city[0],
      area: options.area || 'Auckland'
    })
    //动态设置当前页面的标题。
    wx.setNavigationBarTitle({
      title: 'TigerZ in ' + options.area
    })
  },
  sjTiaoZhuan: function(e){
    var text = e.currentTarget.dataset.text;
    wx.reLaunch({
      url: '../list/list?name=' + common.factory._JSON1[text].city[0] + '&level=2&page=0&sort=default&isAllHouse=false&scope=' + text
    })
  }
})