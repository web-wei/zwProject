//search.js
var common = require('../../common/common.js')
//获取应用实例
var app = getApp()
//封装的判断跳转哪个页面
function FzjudgePage(obj,area) {
    wx.getStorage({
      key: 'searchHistory',
      success: function(res) {
        // console.log('yes');
        // console.log(res);
        // console.log(res.data.concat(obj));
        var aa = common.factory.unique(res.data.concat(obj), true);
        wx.setStorage({
          key: 'searchHistory',
          data: aa
        })
      },
      fail: function(){
        console.log('no');
        wx.setStorage({
          key: "searchHistory",
          data: [obj]
        })
      }
    })

    if (obj.level == 4){
      if (obj.isSale) {
        wx.redirectTo({
          url: '/pages/detail/detail?id=' + obj._id + '&name=' + obj.name + '&fatherName=' + obj.fatherName + '&area=' + area
        }) 
      } else {
        wx.redirectTo({
          url: '/pages/house/house?id=' + obj._id + '&name=' + obj.name + '&fatherName=' + obj.fatherName + '&area=' + area
        })
      }
    } else {
      wx.reLaunch({
        url: '/pages/list/list?name=' + obj.name + '&level=' + obj.level + '&page=0&sort=default&isAllHouse=false&scope=' + area
      })
    }
}
//封装的判断搜索框返回数据的级别和是否在售
function judgeLevel(nLevel, isSale) {
  switch (nLevel) {
    case 1:
      return 'Region';
      break;
    case 2:
      return 'City';
      break;
    case 3:
      return 'Suburb';
      break;
    case 4:
      return isSale ? 'House(for sale)' : 'House(not for sale)';
      // return factory.detectedLng == 'en' ? isSale ? 'House(for sale)' : 'House(not for sale)' : isSale ? 'House(在售)' : 'House(非可售)';
    default: 
      break;
  }
}

//封装的判断发送新请求还是使用历史记录
function searchJudge(val,that) {
  val.length > 0 ? searchNew(val,that) : searchHistory(that);
}
//封装的判断发送新请求时
function searchNew(val,that) {
  //post请求
  common.factory.postData({
    url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchInFuzzy',
    data: JSON.stringify({
      'content': val,
      'scope': that.data.area
    }),
    callBack: function (res) {
      //console.log(res.data.length);
      if (res.data.length > 0) {
        //数据过滤
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].area = judgeLevel(res.data[i].level,res.data[i].isSale);
        }
        // console.log(res.data);
        that.setData({
          searchInFuzzy: res.data,
          searchNew: false,
          searchTop: true,
          searchHistory: true,
          searchClearHistory: true,
          noData: true
        });
      } else {
        that.setData({
          searchInFuzzy: [],
          searchNew: false,
          searchTop: true,
          searchHistory: true,
          searchClearHistory: true,
          noData: false
        })
      }
    }
  });
 
}
//封装的判断使用历史记录显示时
function searchHistory(that) {
  wx.getStorage({
    key: 'searchHistory',
    success: function(res) {
      // console.log('yes');
      // console.log(res);
      var aa = common.factory.unique(res.data, true);
      wx.setStorage({
        key: "searchHistory",
        data: aa
      })
      that.setData({
        searchNew: true, //搜索隐藏或显示
        searchTop: false,
        searchHistory: false,
        searchClearHistory: false,
        noData: true,
        historyData: res.data.reverse()
      })
    },
    fail: function(){
      // console.log('no');
      that.setData({
        searchNew: true, //搜索隐藏或显示
        searchTop: false,
        searchHistory: true,
        searchClearHistory: true,
        noData: true,
        historyData: []
      })
    }
  })
}
//注册页面
Page({
  data:{
    hotSearch: [], //热搜词
    focus: true, //input聚焦
    searchInFuzzy: [], //搜索数据
    searchNew: true, //搜索隐藏或显示
    searchTop: false,
    searchHistory: true,
    searchClearHistory: true,
    noData: true,
    historyData: []
    

  },
  onLoad: function(options){
    wx.getStorage({
      key: 'searchHistory',
      success: function (res) {
        console.log(res)
        
      }
    })
    console.log(options);
    // console.log(getCurrentPages());
    var that = this;
    //热搜词
    that.setData({
      hotSearch: common.factory._JSON1[options.area].city,
      area: options.area
    })
    //显示历史记录
    searchHistory(that);
    //动态设置当前页面的标题。
    wx.setNavigationBarTitle({
      title: 'TigerZ in ' + that.data.area
    })
  },
  shuru: function(event){ //输入框事件
    var val = event.detail.value.trim();
    var that = this;
    searchJudge(val,that);   
  },
  judgePage: function(event){ //判断页面跳转事件
    var obj = event.currentTarget.dataset.url;
    FzjudgePage(obj,this.data.area);
  },
  clearHistory: function(){
    wx.clearStorageSync();
    this.setData({
      searchNew: true, //搜索隐藏或显示
      searchTop: false,
      searchHistory: true,
      searchClearHistory: true,
      noData: true,
      historyData: []
    })
  }
})
