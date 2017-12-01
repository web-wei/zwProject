var common = require('../../common/common.js')
//获取应用实例
var app = getApp()
Page({
  data:{
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    elePriceArea: '-',
    housePrice: '-',
    bedroom: '-',
    bathroom: '-',
    carPark: '-',
    buildingAge: '-',
    floorArea: '-',
    pType: '-',
    totalAnnualRates: '-',
    latestCapitalValue: '-',
    land: '-',
    estimate: '-',
    latestImprovementValue: '-',
    latestLandValue: '-',
    slope: '-',
    wallMaterial: '-',
    zone: '-',
    moreBasicInformation: false,
    moreBasicInformationContent: 'More Basic information',
    noPropertyHistory: false, //PropertyHistory显示隐藏 if
    historyMainTop: true,
    historyMainCenter: true,
    historyMainBottom: true,
    historyMore: false,
    morePropertyHistoryContent: 'More Property History',
    cvPrice: '',
    cvType: '',
    cvData: '',
    recordHouseInfoSale: true,
    recordHouseInfoTraded: false,
    recordSwitchColor: true,
    recordSwitchColor1: false,
    areaMidPrice: '-',
    areaPriceChangeByYear: '-',
    schoolDistrict: [],
    schoolDistrict1: [],
    schoolDistrict2: [],
    noSchool: false,
    noSchoolContent: 'No School District',
    recordSwitchColorSchool: true,
    recordSwitchColorSchool1: false,
    communityTotalPeople: '-',
    crimeRate: '-',
    holdNum: '-',
    publicNum: '-'
    
  },
  onLoad: function (options){
    console.log(getCurrentPages());
    console.log(options);
    var detectedHouseDetailId = options.id || '582db4eb4860e427946270de';
    var that = this;
    //detail页面数据
    common.factory.getData({
      url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getHouseBaseInfo/' + detectedHouseDetailId + '/en',
      callBack: function(res){
        console.log(res.data.data);
        //动态设置当前页面的标题。
        wx.setNavigationBarTitle({
          title: 'TigerZ in ' + options.area
        })
        if(res.data.data.length > 0 ){
          var detailData = res.data.data[0],
            imgs = detailData.houseUrlsImagePath, land = '';
          //处理照片路径
          for (var i = 0; i < imgs.length; i++) {
            imgs[i] = common.factory.imgDomain + imgs[i];
          }
          //land
          if (detailData.type == 'Cross Lease') {
            detailData.landArea > 0 ? land = '1/' + detailData.houseHolds + ' share ' + detailData.landArea + '㎡' : land = 'N/A';
          } else {
            detailData.landArea > 0 ? land = detailData.landArea + '㎡' : land = 'N/A';
          }
          //elePriceArea
          var elePriceArea = detailData.streetAddress + ',' + detailData.suburb + ',' + detailData.addressCity,
            // housePrice
            housePrice = detailData.housePrice ? detailData.housePrice : '-',
            bedroom = detailData.bedroom > 0 ? detailData.bedroom : '-',
            bathroom = detailData.bathroom > 0 ? detailData.bathroom : '-',
            carPark = detailData.carPark > 0 ? detailData.carPark : '-',
            buildingAge = detailData.buildingAge > 0 ? detailData.buildingAge : '-',
            floorArea = detailData.floorArea > 0 ? detailData.floorArea + ' ㎡' : 'N/A',
            pType = detailData.type,
            totalAnnualRates = detailData.totalAnnualRates > 0 ? '$' + detailData.totalAnnualRates : '-',
            latestCapitalValue = detailData.latestCapitalValue > 0 ? '$' + common.factory.numFormat(detailData.latestCapitalValue) : '-',
            estimate = detailData["automatedValuationModelPredictions"] ? '$' + common.factory.numFormat(detailData['automatedValuationModelPredictions'][0].prediction) : 'N/A',
            latestImprovementValue = detailData.latestImprovementValue > 0 ? '$' + common.factory.numFormat(detailData.latestImprovementValue) : '-',
            latestLandValue = detailData.latestLandValue <= 0 ? '-' : '$' + common.factory.numFormat(detailData.latestLandValue),
            slope = detailData.eastWestAngel + '°(E-W), ' + detailData.nouthSouthAngel + '°(N-S)',
            wallMaterial = detailData.wallMaterial ? detailData.wallMaterial : 'N/A',
            zone = detailData.zone !== '' ? detailData.zone : '-',
            cvPrice = detailData.cvAndSale.length ? common.factory.numFormat(detailData.cvAndSale[0].price) : '-',
            cvType = detailData.cvAndSale.length ? detailData.cvAndSale[0].type : '-',
            cvData = detailData.cvAndSale.length ? common.factory.timeFormat(detailData.cvAndSale[0].date, false) : '-',
            cvPrice1 = detailData.cvAndSale.length ? common.factory.numFormat(detailData.cvAndSale[detailData.cvAndSale.length - 1].price) : '-',
            cvType1 = detailData.cvAndSale.length ? detailData.cvAndSale[detailData.cvAndSale.length - 1].type : '-',
            cvData1 = detailData.cvAndSale.length ? common.factory.timeFormat(detailData.cvAndSale[detailData.cvAndSale.length - 1].date, false) : '-',
            cvAndSale = detailData.cvAndSale.slice(1, detailData.cvAndSale.length - 1),
            //房地产趋势数据
            areaMidPrice = detailData.areaMidPrice > 0 ? common.factory.numFormat(detailData.areaMidPrice) : 'N/A',
            areaPriceChangeByYear = detailData.areaPriceChangeByYear == '' ? '-' : detailData.areaPriceChangeByYear;
          //cvdata数据
          for (var q = 0; q < cvAndSale.length; q++){
            cvAndSale[q].price = common.factory.numFormat(cvAndSale[q].price) || '-';
            cvAndSale[q].type = cvAndSale[q].type || '-';
            cvAndSale[q].date = common.factory.timeFormat(cvAndSale[q].date, false) || '-';
          }
          // console.log(cvAndSale);

          //更新房屋基本数据
          that.setData({
            imgUrls: imgs,
            elePriceArea: elePriceArea,
            housePrice: housePrice,
            bedroom: bedroom,
            bathroom: bathroom,
            carPark: carPark,
            buildingAge: buildingAge,
            floorArea: floorArea,
            pType: pType,
            totalAnnualRates: totalAnnualRates,
            latestCapitalValue: latestCapitalValue,
            land: land,
            estimate: estimate,
            latestImprovementValue: latestImprovementValue,
            latestLandValue: latestLandValue,
            slope: slope,
            wallMaterial: wallMaterial,
            zone: zone,
            areaMidPrice: areaMidPrice,
            areaPriceChangeByYear: areaPriceChangeByYear
          })
          //判断房屋历史记录
          if (detailData.cvAndSale.length <= 0) {
            that.setData({
              noPropertyHistory: true, //PropertyHistory显示隐藏 if
              historyMainTop: false,
              historyMainCenter: false,
              historyMainBottom: false, 
              historyMore: false
            })
          } else {
            if (detailData.cvAndSale.length == 1) {
              that.setData({
                noPropertyHistory: false, //PropertyHistory显示隐藏 if
                historyMainTop: true,
                historyMainCenter: false,
                historyMainBottom: false,
                historyMore: false,
                cvPrice: cvPrice,
                cvType: cvType,
                cvData: cvData
              })
            } else if (detailData.cvAndSale.length == 2) {
              that.setData({
                noPropertyHistory: false, //PropertyHistory显示隐藏 if
                historyMainTop: true,
                historyMainCenter: false,
                historyMainBottom: true,
                historyMore: false,
                cvPrice: cvPrice,
                cvType: cvType,
                cvData: cvData,
                cvPrice1: cvPrice1,
                cvType1: cvType1,
                cvData1: cvData1
              })
            } else if (detailData.cvAndSale.length == 3) {
              that.setData({
                noPropertyHistory: false, //PropertyHistory显示隐藏 if
                historyMainTop: true,
                historyMainCenter: true,
                historyMainBottom: true,
                historyMore: false,
                cvPrice: cvPrice,
                cvType: cvType,
                cvData: cvData,
                cvPrice1: cvPrice1,
                cvType1: cvType1,
                cvData1: cvData1,
                cvAndSale: cvAndSale
              })
            } else if (detailData.cvAndSale.length > 3) {
              that.setData({
                noPropertyHistory: false, //PropertyHistory显示隐藏 if
                historyMainTop: true,
                historyMainCenter: true,
                historyMainBottom: true,
                historyMore: true,
                cvPrice: cvPrice,
                cvType: cvType,
                cvData: cvData,
                cvPrice1: cvPrice1,
                cvType1: cvType1,
                cvData1: cvData1,
                cvAndSale: cvAndSale.slice(0,1),
                cvAndSale1: cvAndSale
              })
            }
          }

          //附近在售房源
          common.factory.postData({
            url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getNearbyHouse',
            data: JSON.stringify({ 'basePoint': detailData.basePoint }),
            callBack: function (res) {
              console.log(res);
              //处理数据
              for(var i =0; i < res.data.length; i++){
                res.data[i].houseMainImagePath = common.factory.imgDomain + res.data[i].houseMainImagePath;
                res.data[i].title = res.data[i].title == '' ? 'Unknown' : res.data[i].title;
                res.data[i].housePrice = res.data[i].housePrice == '' ? 'Unknown' : res.data[i].housePrice;
                res.data[i].listedDate = common.factory.timeFormat(res.data[i].listedDate)
              }
              that.setData({
                saleData: res.data.slice(0, 4)
              })
            }
          });

          //附近成交房源信息
          common.factory.postData({
            url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getNearbyDealedHouse',
            data: JSON.stringify({ 'basePoint': detailData.basePoint }),
            callBack: function (res) {
              console.log(res);
              for(var i = 0; i < res.data.length; i++){
                res.data[i].coverImgPath = common.factory.imgDomain + res.data[i].coverImgPath;
                res.data[i].createTime = common.factory.timeFormat(res.data[i].createTime, false);
                res.data[i].price = common.factory.numFormat(res.data[i].price);
              }
              that.setData({
                traded: res.data.slice(0,4)
              });
            }
          });

          //校区信息
          if (detailData.schoolInfo){
            var schoolIds = [];
            var schoolDis = {};
            for (var i = 0; i < detailData.schoolInfo.length; i++) {
              schoolIds.push(detailData.schoolInfo[i].school_id);
              schoolDis[detailData.schoolInfo[i].school_id] = detailData.schoolInfo[i].min_distanct;
            }

            common.factory.postData({
              url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getSchoolsBaseInfo',
              data: JSON.stringify({ 'schools': schoolIds }),
              callBack: function (res) {
                console.log(res);
                var district = [],
                    sprivate = [];
                for (var j = 0; j < res.data.length; j++) {
                  res.data[j].minDis = schoolDis[res.data[j]._id];
                  //给这个对象添加两个属性  一个是打印黄色星星的个数  一个是打印灰色星星的个数
                  var setStar = common.factory.setStar(res.data[j]);
                  //将学校分类   分为学区学校  和私人学校
                  if (res.data[j].schoolAttribute == 'School District') {
                    district.push(res.data[j]);
                  }
                  if (res.data[j].schoolAttribute == 'Private School') {
                    sprivate.push(res.data[j]);
                  }
                }
                //学校显示最多显示三所学校
                district = district.length > 3 ? district.slice(0, 3) : district;
                sprivate = sprivate.length > 3 ? sprivate.slice(0, 3) : sprivate;
                //排序
                district = common.factory.sort(district);
                sprivate = common.factory.sort(sprivate);
                console.log(district);
                console.log(sprivate);
                //公立学校
                for (var e = 0; e < district.length; e++){
                  district[e].minDis = district[e].minDis.toFixed(2);
                }
                if (district.length > 0) { 
                  that.setData({
                    schoolDistrict1: district,
                    schoolDistrict: district,
                    noSchool: false
                  })
                } else {
                  that.setData({
                    noSchool: true,
                    noSchoolContent: 'No School District'
                  })
                }
                //私立学校
                for (var t = 0; t < sprivate.length; t++) {
                  sprivate[t].minDis = sprivate[t].minDis.toFixed(2);
                }
                if (sprivate.length > 0) {
                  that.setData({
                    schoolDistrict2: sprivate,
                    noSchool: false
                  })
                } else {
                  that.setData({
                    noSchool: true,
                    noSchoolContent: 'No Private School'
                  })
                }
               


              }
            });

          }

          //社区信息
          if (detailData.meshblockNumber) {
            common.factory.postData({
              url: 'https://' + common.factory.tigerDomain + '/tigerspring/rest/getCommunityInfoBaseInfo/',
              data: JSON.stringify({ "meshNo": detailData.meshblockNumber, "tiaCode": detailData.tlaCode, "areaunitCode": detailData.areaunitCode, 'lang': 'en' }),
              callBack: function(res){
                var communityData = res.data[0];
                var publicNum = communityData.households[0].number == -1 ? 1 : communityData.households[0].number;
                var holdNum = communityData.households[1].number == -1 ? 3 : communityData.households[1].number;

                communityData.familyIncomeForRegion = communityData.familyIncomeForRegion.toFixed(0);
                communityData.familyIncomeForCity = communityData.familyIncomeForCity.toFixed(0);
                communityData.familyIncome = communityData.familyIncome.toFixed(0);
                communityData.degree[0].number = (communityData.degree[0].number * 100 / communityData.allDegree || 0.1).toFixed(2) + '%';
                communityData.degree[1].number = (communityData.degree[1].number * 100 / communityData.allDegree || 0.1).toFixed(2) + '%';
                communityData.degree[2].number = (communityData.degree[2].number * 100 / communityData.allDegree || 0.1).toFixed(2) + '%';
                communityData.degree[3].number = (communityData.degree[3].number * 100 / communityData.allDegree || 0.1).toFixed(2) + '%';
                var incomeWidth1 = (Number(communityData.familyIncomeForRegion) / 200000) * 100 + '%';
                var incomeWidth2 = (Number(communityData.familyIncomeForCity) / 200000) * 100 + '%';
                var incomeWidth3 = (Number(communityData.familyIncome) / 200000) * 100 + '%';

                //设置Religious Affiliation参数
                var regionNum = [];
                for (var re = 0, len = communityData.religions.length; re < len; re++) {
                  if (communityData.religions[re].number != 0) {
                    var a = {};
                    a.value = (100 * communityData.religions[re].number / communityData.allReligions).toFixed(2) + ' %';
                    a.name = communityData.religions[re].name;
                    regionNum.push(a);
                  }
                }
                // console.log(regionNum);
                //设置人口种族参数 并生成饼状图
                var kpNum = [];
                for (var kp = 0, len = communityData.ethnic.length; kp < len; kp++) {
                  if (communityData.ethnic[kp].number != 0) {
                    var a = {};
                    a.value = (100 * communityData.ethnic[kp].number / communityData.allEthnicCount).toFixed(2) + ' %';
                    a.name = communityData.ethnic[kp].name;
                    kpNum.push(a);
                  }
                }








                that.setData({
                  communityTotalPeople: communityData.communityTotalPeople,
                  crimeRate: communityData.crimeRate.toFixed(2) + '%',
                  publicNum: publicNum.toFixed(2),
                  holdNum: holdNum.toFixed(2),
                  incomeWidth1: incomeWidth1,
                  incomeWidth2: incomeWidth2,
                  incomeWidth3: incomeWidth3,
                  communityData: communityData,
                  regionNum: regionNum,
                  kpNum: kpNum,
                  detailData: detailData
                })
              }
            })
          }




        }
      }
    })
  },
  basicInformation: function(event){ // basicInformation显示更多或者较少事件
    if (this.data.moreBasicInformation){
      this.setData({
        moreBasicInformation: !this.data.moreBasicInformation,
        moreBasicInformationContent: 'More Basic information'
      })
    }else{
      this.setData({
        moreBasicInformation: !this.data.moreBasicInformation,
        moreBasicInformationContent: 'Less Basic information'
      })
    }
    
  },
  historyMoreSj: function(){ //property history 显示或隐藏
    console.log(this);
    if (this.data.morePropertyHistoryContent == 'More Property History'){
      this.setData({
        morePropertyHistoryContent : 'Less Property History',
        cvAndSale: this.data.cvAndSale1
      })
    } else {
      this.setData({
        morePropertyHistoryContent: 'More Property History',
        cvAndSale: this.data.cvAndSale.slice(0, 1)
      })
    }
  },
  recordSwitchLeft: function(){ // surrounding listing
    this.setData({
      recordHouseInfoSale: true,
      recordHouseInfoTraded: false,
      recordSwitchColor: true,
      recordSwitchColor1: false
    })
  },
  recordSwitchRight: function(){
    this.setData({
      recordHouseInfoTraded: true,
      recordHouseInfoSale: false,
      recordSwitchColor1: true,
      recordSwitchColor: false
    })
  },
  recordSwitchLeftSchool: function(){
    this.setData({
      schoolDistrict: this.data.schoolDistrict1,
      recordSwitchColorSchool: true,
      recordSwitchColorSchool1: false
    })
  },
  recordSwitchRightSchool: function(){
    this.setData({
      schoolDistrict: this.data.schoolDistrict2,
      recordSwitchColorSchool: false,
      recordSwitchColorSchool1: true
    })
  }
})