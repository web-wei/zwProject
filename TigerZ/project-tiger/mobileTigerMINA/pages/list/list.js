// list.js
var common = require('../../common/common.js')
//获取应用实例
var app = getApp()

//跳转到详情页（可售、非可售）
function jumpDetail(obj,area) {
  if (obj.status == 'sale') {
    return '/pages/detail/detail?id=' + obj._id + '&streetAddress=' + obj.streetAddress + '&suburb=' + obj.suburb + '&area=' + area;
  } else {
    return '/pages/house/house?id=' + obj.id + '&streetAddress=' + obj.streetAddress + '&suburb=' + obj.suburb + '&area=' + area;
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchHouseByArea: [],
    param: {},
    schoolHouse: {
      bedroom: {
        all: true,
        one: false,
        two: false,
        three: false,
        four: false,
        more: false
      }
    },
    listFiltrateArea: false,
    listFiltrateCampus: false,
    listFiltrateRoomNum: true,
    listFiltrateSort: false,
    citys: [],
    citysSuburb: [],
    campusCity: [],
    checkboxItem: [
      { name: 'All', value: 'All', checked: true},
      { name: '1', value: '1', checked: false},
      { name: '2', value: '2', checked: false},
      { name: '3', value: '3', checked: false},
      { name: '4', value: '4', checked: false},
      { name: '>4', value: '>4', checked: false }
    ],
    listFiltrateTick1: true,
    listFiltrateTick2: false,
    listFiltrateTick3: false,
    listFiltrateTick4: false,
    HomesforYouColor: true,
    NewestColor: false,
    PriceUpColor: false,
    PriceDownColor: false,
    auctionMask: false,
    moreItem: false,
    listFiltrateAreaLeftbackgroundColor: 0,
    listFiltrateAreaLeftbackgroundColor1: true,
    listFiltrateAreaLeftbackgroundColor2: true,
    listFiltrateAreaLeftbackgroundColor3: 0,
    qwert: true,
    qwert1: true,
    qwert2: true,
    listFiltrateBall1: true,
    listFiltrateBall2: false,
    listFiltrateBall3: false,
    listFiltrateBall4: false,
    noHouseRed: false,
    listPort: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      console.log(getCurrentPages());
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log(res);
          // var latitude = res.latitude
          // var longitude = res.longitude
          // var speed = res.speed
          // var accuracy = res.accuracy
        }
      })
      var that = this;
      that.setData({
        param: {
          name: options.name || 'Auckland City',
          level: options.level/1 || 2,
          page: options.page/1 || 0,
          sort: options.sort || 'default',
          isAllHouse: options.isAllHouse || 'false',
          bedroom: {
            all: true,
            one: false,
            two: false,
            three: false,
            four: false,
            more: false
          },
          scope: options.scope || 'Auckland'
        }
      })
      //ajax请求，获取list页面的数据
      common.factory.postData({
        url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchHouseByArea',
        data: JSON.stringify(that.data.param),
        callBack: function (res) {
          console.log(res);
          if (res.data[0].houseInfo.length <= 0) {
            that.setData({
              searchHouseByArea: res.data[0].houseInfo,
              noHouseRed: true
            })
          } else {
            //处理数据
            for (var item of res.data[0].houseInfo) {
              item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
              item.url = jumpDetail(item,that.data.param.scope);
            }
            // console.log(common.factory._JSON1[that.data.param.scope].city[0]);
            that.setData({
              searchHouseByArea: res.data[0].houseInfo,
              citys: common.factory._JSON1[that.data.param.scope].city,
              citysSuburb: common.factory._JSON1[that.data.param.scope].suburb[common.factory._JSON1[that.data.param.scope].city[0]],
              campusCity: common.factory._JSON1[that.data.param.scope].school[common.factory._JSON1[that.data.param.scope].city[0]]

            })
          }
          
        }
      });
      //动态设置当前页面的标题。
      wx.setNavigationBarTitle({
        title: 'TigerZ in ' + that.data.param.scope
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  //scroll-view 上拉触底事件
  pullUpLoad: function(){
    var that = this;
    //loading显示
    that.setData({
      auctionMask: true
    })
    //触底翻页
    that.data.param.page += 1;
    //请求数据
    common.factory.postData({
        url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchHouseByArea',
        data: JSON.stringify(that.data.param),
        callBack: function (res) {
          // console.log(that.data.param.page);    
          // console.log(res.data[0].maxPage); 
          if (that.data.param.page >= res.data[0].maxPage) {
            that.setData({
              moreItem: true,
              auctionMask: false
            })
            that.data.param.page = 0;
          } else {
            //处理数据
            for (var item of res.data[0].houseInfo) {
              item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
              item.url = jumpDetail(item, that.data.param.scope);
            }
            //更新数据
            that.setData({
              auctionMask: false, //关闭loading
              moreItem: false,
              searchHouseByArea: that.data.searchHouseByArea.concat(res.data[0].houseInfo)
            })
          }

        }
      });
  },
  //scroll滚动事件
  itemsScroll: function(e){
    var aa = e.detail.scrollTop;
    
  },
  //进入搜索
  jrSearch: function(){
    wx.navigateTo({
      url: '/pages/search/search?area=' + this.data.param.scope,
    })
  },

  //area事件
  sjArea: function(){
    if (this.data.listFiltrateArea) {
      this.setData({
        listFiltrateArea: !this.data.listFiltrateArea,
        listAreaColor: false,
        triangleColor: false
      })
    } else {
      this.setData({
        listFiltrateArea: !this.data.listFiltrateArea,
        listFiltrateCampus: false,
        listFiltrateRoomNum: true,
        listFiltrateSort: false,
        listAreaColor: true,
        triangleColor: true,
        listSchool: false,
        triangleSchoolColor: false,
        listBedrooms: false,
        triangleBedroomsColor: false,
        listSort: false,
        triangleSortColor: false
      })
    }
  },

  //school事件
  sjSchool: function(){
    if (this.data.listFiltrateCampus){
      this.setData({
        listFiltrateCampus: !this.data.listFiltrateCampus,
        listSchool: false,
        triangleSchoolColor: false
      })
    } else {
      this.setData({
        listFiltrateArea: false,
        listFiltrateCampus: !this.data.listFiltrateCampus,
        listFiltrateRoomNum: true,
        listFiltrateSort: false,
        listSchool: true,
        triangleSchoolColor: true,
        listAreaColor: false,
        triangleColor: false,
        listBedrooms: false,
        triangleBedroomsColor: false,
        listSort: false,
        triangleSortColor: false
      })
    }
  },

  //bedrooms事件
  sjBedrooms: function(){
    if (this.data.listFiltrateRoomNum) {
      this.setData({
        listFiltrateArea: false,
        listFiltrateCampus: false,
        listFiltrateRoomNum: !this.data.listFiltrateRoomNum,
        listFiltrateSort: false,
        listBedrooms: true,
        triangleBedroomsColor: true,
        listAreaColor: false,
        triangleColor: false,
        listSchool: false,
        triangleSchoolColor: false,
        listSort: false,
        triangleSortColor: false
      })
    } else {
      this.setData({
        listFiltrateRoomNum: !this.data.listFiltrateRoomNum,
        listBedrooms: false,
        triangleBedroomsColor: false
      })
    }
  },

  //sort事件
  sjSort: function(){
    if (this.data.listFiltrateSort) {
      this.setData({
        listFiltrateSort: !this.data.listFiltrateSort,
        listSort: false,
        triangleSortColor: false
      })
    } else {
      this.setData({
        listFiltrateArea: false,
        listFiltrateCampus: false,
        listFiltrateRoomNum: true,
        listFiltrateSort: !this.data.listFiltrateSort,
        listSort: true,
        triangleSortColor: true,
        listAreaColor: false,
        triangleColor: false,
        listSchool: false,
        triangleSchoolColor: false,
        listBedrooms: false,
        triangleBedroomsColor: false
      })
    }
  },

  //citys left事件
  citysText: function(event){
    // console.log(event.currentTarget.dataset.idx);
    // console.log(this.data.listFiltrateAreaLeftbackgroundColor);
    //去除右边class
    if (event.currentTarget.dataset.idx == this.data.listFiltrateAreaLeftbackgroundColor) {
      this.setData({
        qwert: true
      })
      console.log('a');
    } else {
      this.setData({
        qwert: false
      })
      console.log('b');
    }
    //更新数据
    var text = event.currentTarget.dataset.text;
    this.setData({
      citysSuburb: common.factory._JSON1[this.data.param.scope].suburb[text],
      listFiltrateAreaLeftbackgroundColor: event.currentTarget.dataset.idx,
      listFiltrateAreaLeftbackgroundColor1: false,
      qwert1: false
    })
    
  },

  campusCitysText: function(event){
    //去除右边class
    if (event.currentTarget.dataset.scidx == this.data.listFiltrateAreaLeftbackgroundColor3) {
      this.setData({
        qwert2: true
      })
      // console.log('a');
    } else {
      this.setData({
        qwert2: false
      })
      // console.log('b');
    }
    var text = event.currentTarget.dataset.text;
    this.setData({
      campusCity: common.factory._JSON1[this.data.param.scope].school[text],
      listFiltrateAreaLeftbackgroundColor3: event.currentTarget.dataset.scidx,
      listFiltrateAreaLeftbackgroundColor2: false,
      qwert2: false
    })
  },

  sjCampisCityName: function(event){
    var that = this;
    that.setData({
      auctionMask: true, //loading显示
      citysSuburbColor1: event.currentTarget.dataset.ccidx,
      moreItem: false,
      listFiltrateCampus: false,
      qwert: false,
      qwert1: false,
      qwert2: true,
      listPort: false,
      listFiltrateBall1: false,
      listFiltrateBall2: true,
      listFiltrateBall3: false,
      listFiltrateBall4: false,
      listFiltrateTick1: true,
      listFiltrateTick2: false,
      listFiltrateTick3: false,
      listFiltrateTick4: false,
      HomesforYouColor: true,
      NewestColor: false,
      PriceUpColor: false,
      PriceDownColor: false,
      listFiltrateSort: false,
      checkboxItem: [
        { name: 'All', value: 'All', checked: true },
        { name: '1', value: '1', checked: false },
        { name: '2', value: '2', checked: false },
        { name: '3', value: '3', checked: false },
        { name: '4', value: '4', checked: false },
        { name: '>4', value: '>4', checked: false }
      ],
      scrollTop: 0,
      searchHouseByArea: []  //清空数据
    })
    //参数
    that.data.schoolHouse.sort = 'defalut';
    that.data.schoolHouse.id = event.currentTarget.dataset.id;
    that.data.schoolHouse.bedroom.all = true;
    that.data.schoolHouse.bedroom.one = false;
    that.data.schoolHouse.bedroom.two = false;
    that.data.schoolHouse.bedroom.three = false;
    that.data.schoolHouse.bedroom.four = false;
    that.data.schoolHouse.bedroom.more = false;
    //ajqx请求
    common.factory.postData({
      url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getSchoolHouse',
      data: JSON.stringify(that.data.schoolHouse),
      callBack: function(res){
        if (res.data.houseList.length <= 0){
          that.setData({
            searchHouseByArea: res.data.houseList,
            noHouseRed: true,
            auctionMask: false, //loading关闭
          })
        } else {
          //处理数据
          for (var item of res.data.houseList) {
            item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
            item.url = jumpDetail(item, that.data.param.scope);
          }
          that.setData({
            searchHouseByArea: res.data.houseList,
            noHouseRed: false,
            auctionMask: false, //loading关闭
          })
        }
      }
    })
  },

  sjCitysSuburb: function(event){
    // console.log(event);
    var that = this;
   that.setData({
     auctionMask: true, //loading显示
     citysSuburbColor: event.currentTarget.dataset.sidx,
     moreItem: false,
     listFiltrateArea: false,
     qwert: true,
     qwert1: false,
     qwert2: false,
     listPort: true,
     listFiltrateBall1: true,
     listFiltrateBall2: false,
     listFiltrateBall3: false,
     listFiltrateBall4: false,
     listFiltrateTick1: true,
     listFiltrateTick2: false,
     listFiltrateTick3: false,
     listFiltrateTick4: false,
     HomesforYouColor: true,
     NewestColor: false,
     PriceUpColor: false,
     PriceDownColor: false,
     listFiltrateSort: false,
     checkboxItem: [
       { name: 'All', value: 'All', checked: true },
       { name: '1', value: '1', checked: false },
       { name: '2', value: '2', checked: false },
       { name: '3', value: '3', checked: false },
       { name: '4', value: '4', checked: false },
       { name: '>4', value: '>4', checked: false }
     ],
     scrollTop: 0
   })
   //参数
   that.data.param.level = 3;
   that.data.param.name = event.currentTarget.dataset.text;
   that.data.param.page = 0;
   that.data.param.sort = 'default';
   that.data.param.bedroom.all = true;
   that.data.param.bedroom.one = false;
   that.data.param.bedroom.two = false;
   that.data.param.bedroom.three = false;
   that.data.param.bedroom.four = false;
   that.data.param.bedroom.more = false;
   //ajax请求，获取list页面的数据
   common.factory.postData({
     url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchHouseByArea',
     data: JSON.stringify(that.data.param),
     callBack: function (res) {
      //  console.log(res);
       if (res.data[0].houseInfo.length <= 0){
        that.setData({
          searchHouseByArea: res.data[0].houseInfo,
          noHouseRed: true,
          auctionMask: false, //loading关闭
        })
       } else{
         //处理数据
         for (var item of res.data[0].houseInfo) {
           item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
           item.url = jumpDetail(item, that.data.param.scope);
         }
         that.setData({
           searchHouseByArea: res.data[0].houseInfo,
           noHouseRed: false,
           auctionMask: false, //loading关闭
         })
       }   
     }
   });
  },

  checkboxChange: function(e){
    // console.log(e.currentTarget.dataset.name);
    var param = {};
    // console.log("checkboxItem["+(e.currentTarget.dataset.name-0)+"]")
    // var string = "checkboxItem["+(e.currentTarget.dataset.name-0)+"].checked";
    if(e.currentTarget.dataset.name !== "All"){
      e.currentTarget.dataset.name =  e.currentTarget.dataset.name == ">4" ? 5 :  e.currentTarget.dataset.name;
      var string = "checkboxItem["+(e.currentTarget.dataset.name-0)+"].checked";
      var tempAll = "checkboxItem[0].checked";
      param[string] = !this.data.checkboxItem[e.currentTarget.dataset.name].checked;
      param[tempAll] = false;
      this.setData(param);
      // console.log(this.data);
      // console.log(this.data.checkboxItem);
    }else{
      this.setData({
          checkboxItem: [
            { name: 'All', value: 'All', checked: true},
            { name: '1', value: '1', checked: false},
            { name: '2', value: '2', checked: false},
            { name: '3', value: '3', checked: false},
            { name: '4', value: '4', checked: false},
            { name: '>4', value: '>4', checked: false },
          ]
        })
    }
    
  },

  sjRoomNum: function(){
    this.setData({
      listFiltrateRoomNum: true,
      listFiltrateBall3: true,
      scrollTop: 0,
      auctionMask: true, //loading显示
    })
    //参数
    this.data.param.bedroom.all = this.data.checkboxItem[0].checked;
    this.data.param.bedroom.one = this.data.checkboxItem[1].checked;
    this.data.param.bedroom.two = this.data.checkboxItem[2].checked;
    this.data.param.bedroom.three = this.data.checkboxItem[3].checked;
    this.data.param.bedroom.four = this.data.checkboxItem[4].checked;
    this.data.param.bedroom.more = this.data.checkboxItem[5].checked;
    this.data.schoolHouse.bedroom.all = this.data.checkboxItem[0].checked;
    this.data.schoolHouse.bedroom.one = this.data.checkboxItem[1].checked;
    this.data.schoolHouse.bedroom.two = this.data.checkboxItem[2].checked;
    this.data.schoolHouse.bedroom.three = this.data.checkboxItem[3].checked;
    this.data.schoolHouse.bedroom.four = this.data.checkboxItem[4].checked;
    this.data.schoolHouse.bedroom.more = this.data.checkboxItem[5].checked;
    //更新数据
    var that = this;
    if(that.data.listPort){
      common.factory.postData({
        url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchHouseByArea',
        data: JSON.stringify(that.data.param),
        callBack: function(res){
          if (res.data[0].houseInfo.length <= 0) {
            that.setData({
              searchHouseByArea: res.data[0].houseInfo,
              noHouseRed: true,
              auctionMask: false //loading关闭
            })
          } else {
            //处理数据
            for (var item of res.data[0].houseInfo) {
              item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
              item.url = jumpDetail(item, that.data.param.scope);
            }
            that.setData({
              searchHouseByArea: res.data[0].houseInfo,
              noHouseRed: false,
              auctionMask: false //loading关闭
            })
          }  
        }
      })
    }else {
      //ajqx请求
      common.factory.postData({
        url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getSchoolHouse',
        data: JSON.stringify(that.data.schoolHouse),
        callBack: function (res) {
          if (res.data.houseList.length <= 0) {
            that.setData({
              searchHouseByArea: res.data.houseList,
              noHouseRed: true,
              auctionMask: false //loading关闭
            })
          } else {
            //处理数据
            for (var item of res.data.houseList) {
              item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
              item.url = jumpDetail(item, that.data.param.scope);
            }
            that.setData({
              searchHouseByArea: res.data.houseList,
              noHouseRed: false,
              auctionMask: false //loading关闭
            })
          }
        }
      })
    }
  },

  HomesforYou: function(){
      var that = this;
      that.setData({
        auctionMask: true, //loading显示
        listFiltrateTick1: true,
        listFiltrateTick2: false,
        listFiltrateTick3: false,
        listFiltrateTick4: false,
        HomesforYouColor: true,
        NewestColor: false,
        PriceUpColor: false,
        PriceDownColor: false,
        listFiltrateSort: false,
        listFiltrateBall4: true,
        scrollTop: 0
      })
      that.data.param.sort = 'default';
      that.data.schoolHouse.sort = 'default';
      if(that.data.listPort){
        common.factory.postData({
          url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchHouseByArea',
          data: JSON.stringify(that.data.param),
          callBack: function(res){
            if (res.data[0].houseInfo.length <= 0) {
              that.setData({
                searchHouseByArea: res.data[0].houseInfo,
                noHouseRed: true,
                auctionMask: false //loading关闭
              })
            } else {
              //处理数据
              for (var item of res.data[0].houseInfo) {
                item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
                item.url = jumpDetail(item, that.data.param.scope);
              }
              that.setData({
                searchHouseByArea: res.data[0].houseInfo,
                noHouseRed: false,
                auctionMask: false //loading关闭
              })
            }  
          }
        })
      } else{
        //ajqx请求
        common.factory.postData({
          url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getSchoolHouse',
          data: JSON.stringify(that.data.schoolHouse),
          callBack: function (res) {
            if (res.data.houseList.length <= 0) {
              that.setData({
                searchHouseByArea: res.data.houseList,
                noHouseRed: true,
                auctionMask: false //loading关闭
              })
            } else {
              //处理数据
              for (var item of res.data.houseList) {
                item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
                item.url = jumpDetail(item, that.data.param.scope);
              }
              that.setData({
                searchHouseByArea: res.data.houseList,
                noHouseRed: false,
                auctionMask: false //loading关闭
              })
            }
          }
        })
      }
  },
  Newest: function(){
      var that = this;
      this.setData({
        auctionMask: true, //loading显示
        listFiltrateTick1: false,
        listFiltrateTick2: true,
        listFiltrateTick3: false,
        listFiltrateTick4: false,
        HomesforYouColor: false,
        NewestColor: true,
        PriceUpColor: false,
        PriceDownColor: false,
        listFiltrateSort: false,
        listFiltrateBall4: true,
        scrollTop: 0
      })
      that.data.param.sort = 'newest';
      that.data.schoolHouse.sort = 'newest';
      if (that.data.listPort) {
        common.factory.postData({
          url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchHouseByArea',
          data: JSON.stringify(that.data.param),
          callBack: function (res) {
            if (res.data[0].houseInfo.length <= 0) {
              that.setData({
                searchHouseByArea: res.data[0].houseInfo,
                noHouseRed: true,
                auctionMask: false //loading关闭
              })
            } else {
              //处理数据
              for (var item of res.data[0].houseInfo) {
                item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
                item.url = jumpDetail(item, that.data.param.scope);
              }
              that.setData({
                searchHouseByArea: res.data[0].houseInfo,
                noHouseRed: false,
                auctionMask: false //loading关闭
              })
            }
          }
        })
      }else{
        //ajqx请求
        common.factory.postData({
          url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getSchoolHouse',
          data: JSON.stringify(that.data.schoolHouse),
          callBack: function (res) {
            if (res.data.houseList.length <= 0) {
              that.setData({
                searchHouseByArea: res.data.houseList,
                noHouseRed: true,
                auctionMask: false //loading关闭
              })
            } else {
              //处理数据
              for (var item of res.data.houseList) {
                item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
                item.url = jumpDetail(item, that.data.param.scope);
              }
              that.setData({
                searchHouseByArea: res.data.houseList,
                noHouseRed: false,
                auctionMask: false //loading关闭
              })
            }
          }
        })
      }
  },
  PriceUp: function(){
      var that = this; 
      that.setData({
        auctionMask: true, //loading显示
        listFiltrateTick1: false,
        listFiltrateTick2: false,
        listFiltrateTick3: true,
        listFiltrateTick4: false,
        HomesforYouColor: false,
        NewestColor: false,
        PriceUpColor: true,
        PriceDownColor: false,
        listFiltrateSort: false,
        listFiltrateBall4: true,
        scrollTop: 0
      })
      that.data.param.sort = 'priceDown';
      that.data.schoolHouse.sort = 'priceDown';
      if (that.data.listPort) {
        common.factory.postData({
          url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchHouseByArea',
          data: JSON.stringify(that.data.param),
          callBack: function (res) {
            if (res.data[0].houseInfo.length <= 0) {
              that.setData({
                searchHouseByArea: res.data[0].houseInfo,
                noHouseRed: true,
                auctionMask: false //loading关闭
              })
            } else {
              //处理数据
              for (var item of res.data[0].houseInfo) {
                item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
                item.url = jumpDetail(item, that.data.param.scope);
              }
              that.setData({
                searchHouseByArea: res.data[0].houseInfo,
                noHouseRed: false,
                auctionMask: false //loading关闭
              })
            }
          }
        })
      }else{
        //ajqx请求
        common.factory.postData({
          url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getSchoolHouse',
          data: JSON.stringify(that.data.schoolHouse),
          callBack: function (res) {
            if (res.data.houseList.length <= 0) {
              that.setData({
                searchHouseByArea: res.data.houseList,
                noHouseRed: true,
                auctionMask: false //loading关闭
              })
            } else {
              //处理数据
              for (var item of res.data.houseList) {
                item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
                item.url = jumpDetail(item, that.data.param.scope);
              }
              that.setData({
                searchHouseByArea: res.data.houseList,
                noHouseRed: false,
                auctionMask: false //loading关闭
              })
            }
          }
        })
      }
  },
  PriceDown: function(){
      var that = this;
      that.setData({
        auctionMask: true, //loading显示
        listFiltrateTick1: false,
        listFiltrateTick2: false,
        listFiltrateTick3: false,
        listFiltrateTick4: true,
        HomesforYouColor: false,
        NewestColor: false,
        PriceUpColor: false,
        PriceDownColor: true,
        listFiltrateSort: false,
        listFiltrateBall4: true,
        scrollTop: 0
      })
      that.data.param.sort = 'priceUp';
      that.data.schoolHouse.sort = 'priceUp';
      if (that.data.listPort) {
        common.factory.postData({
          url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/searchHouseByArea',
          data: JSON.stringify(that.data.param),
          callBack: function (res) {
            if (res.data[0].houseInfo.length <= 0) {
              that.setData({
                searchHouseByArea: res.data[0].houseInfo,
                noHouseRed: true,
                auctionMask: false //loading关闭
              })
            } else {
              //处理数据
              for (var item of res.data[0].houseInfo) {
                item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
                item.url = jumpDetail(item, that.data.param.scope);
              }
              that.setData({
                searchHouseByArea: res.data[0].houseInfo,
                noHouseRed: false,
                auctionMask: false //loading关闭
              })
            }
          }
        })
      }else{
        //ajqx请求
        common.factory.postData({
          url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getSchoolHouse',
          data: JSON.stringify(that.data.schoolHouse),
          callBack: function (res) {
            if (res.data.houseList.length <= 0) {
              that.setData({
                searchHouseByArea: res.data.houseList,
                noHouseRed: true,
                auctionMask: false //loading关闭
              })
            } else {
              //处理数据
              for (var item of res.data.houseList) {
                item.houseMainImagePath = common.factory.imgDomain + item.houseMainImagePath;
                item.url = jumpDetail(item, that.data.param.scope);
              }
              that.setData({
                searchHouseByArea: res.data.houseList,
                noHouseRed: false,
                auctionMask: false //loading关闭
              })
            }
          }
        })
      }
  },
  sjLocation: function(){
   wx.navigateTo({
     url: '../location/location?area=' + this.data.param.scope
   })
  }


})