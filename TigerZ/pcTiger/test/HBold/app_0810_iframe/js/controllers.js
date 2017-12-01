/**
 * Created by jvid on 2016/10/25.
 */
//=================================================== 首页控制器 =================================
app.controller('homeCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory','$interval','$location','publicFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$location,pFactory){
    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/index.html"
    }

    var cityJson = citysJson
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;
    //挂载home页面所有数据
    $scope.allValue = {};
    $scope.allValue.timer = '';
    $scope.allValue.currentSelectCity = "Auckland";

    $scope.allValue.currentNavFn = cityJson[$scope.allValue.currentSelectCity].hotSearch[0].en;
    $scope.allValue.citysNav = {
        city:cityJson[$scope.allValue.currentSelectCity].hotSearch
    }
    $scope.allValue.currentNavSuburbs = cityJson[$scope.allValue.currentSelectCity].suburb[$scope.allValue.currentNavFn]

    $scope.allValue.overNavLiEvent = function(n,str){
        $scope.allValue.currentNavFn = str;
        $scope.allValue.currentNavSuburbs = cityJson[$scope.allValue.currentSelectCity].suburb[$scope.allValue.currentNavFn]

        $scope.allValue.cds = myFactory.addClassName({
            itemSmall : '.nav_citys>li',
            name : 'overNavLi',
            num : n,
            nextEvent :false
        })
    };
    $scope.allValue.sOverNavLiEvent = function(n){
        $scope.allValue.cdss = myFactory.addClassName({
            itemSmall : '.nav_city_wrap>li',
            name : 'overNavSubLi',
            num : n,
            nextEvent :false
        })
    };

    //切换城市
    $scope.allValue.changCityFn = function(str){
        angular.element('.home_addr_choice').toggle(300);
        angular.element('.home_current_city').text(str.en);
        $scope.allValue.currentSelectCity = str.en;
        angular.element('.dataSave').data('ct',$scope.allValue.currentSelectCity)

        //在页面展示的热搜替换
        $scope.allValue.currentNavFn = $scope.cityJson[$scope.allValue.currentSelectCity].hotSearch[0].en;
        $scope.allValue.citysNav = {
            city:$scope.cityJson[$scope.allValue.currentSelectCity].hotSearch
        }
        $scope.allValue.currentNavSuburbs = $scope.cityJson[$scope.allValue.currentSelectCity].suburb[$scope.allValue.currentNavFn]
    }

    var seoWord = location.href.indexOf('?') == -1 ? '' : location.href.substr(location.href.indexOf('?')+1);

    $scope.allValue.seoWord = seoWord.split('-').join(' ').length == 0 ? 'Start Your Search Today' : seoWord.split('-').join(' ')

    var titleSeoWord = $scope.allValue.seoWord == "Start Your Search Today" ? "" : $scope.allValue.seoWord;

    //设置英文首页SEO
    var titleStr = "Tigerz | property search auckland | "+ titleSeoWord;
    $('title').text(titleStr);
    $("meta[name='keywords']").attr('content',titleStr);
    var descStr =  "Outstanding Real Estate Company in New Zealand – Expert Agents specialise in homes for sale, commercial and industrial property, farms, waterfront property and property management";
    $("meta[name='description']").attr('content',descStr);
    //=================================== 获取热搜词 ========================================================
    $scope.allValue.hotWords = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHotWords/en',
        callBack : function(data){
            //console.log(data);
            $scope.allValue.hotWordAll = data.data.slice(0,5);
            $scope.allValue.hotSuburb = data.data.slice(5);
        }
    });
    //========================================加载页面时候请求的数据 获取的是显示房子数量 涨幅的数据============================
    $scope.allValue.loadPage = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHouseStatistics',
        callBack : function(data){
            $scope.allValue.statics = data.data;
            var n = 0;
            angular.element('.dataSave').data('timerSave') && $interval.cancel(angular.element('.dataSave').data('timerSave'));

            $scope.allValue.timer = $interval(function(){
                angular.element('.hld_static').animate({'top':-n*0.6*parseFloat(document.documentElement.style.fontSize)},300,function(){
                    n++;
                    if(n>=data.data.priceIncreaseList.length/3+1){
                        angular.element('.hld_static').css({'top':0});
                        n = 0;
                    }
                })
            },3000);
            angular.element('.dataSave').data('timerSave',$scope.allValue.timer);
        }
    });
    //搜索框要的显示数据
    $scope.allValue.subFlag = true;
    $scope.allValue.footSubFlag = true;
    $scope.allValue.currentValue = '';
    $scope.allValue.footValue = '';
    //====================================顶部搜索框内容发生改变的时候的请求数据======================
    $scope.allValue.searchBar = function(){
        //console.log(localStorage.getItem('searchHistory'));
        if($scope.allValue.currentValue.length != 0){
            angular.element('.home_search_history').hide();
            angular.element('.home_search_simple').show();
            angular.element('.home_search_error').hide();
            $scope.allValue.searchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.currentValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    //console.log(data);
                    $scope.allValue.searchData = data.data;
                    data.data.length != 0 ? angular.element('.home_search_error').hide() : angular.element('.home_search_error').show();
                    $scope.allValue.searchBtn = function(){
                        if($scope.allValue.currentValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return 'detail?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity
                            }else{
                                return 'search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+'&ct='+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.home_search_history').show();
            angular.element('.home_search_simple').hide();
            angular.element('.home_search_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                var json = {};
                $scope.allValue.searchHistoryData = [];
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        //console.log(obj);
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.blurEvent = function(){
        $scope.allValue.subFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.overEvent = function () {
        $scope.allValue.subFlag = false;
        $scope.allValue.blurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.leaveEvent = function (){
        $scope.allValue.blurEvent = function(){
            $scope.allValue.subFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.focusEvent = function(){
        $scope.allValue.subFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
            //console.log($scope.allValue.searchHistoryData);
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            if(obj.isSale){
                return 'detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }else{
                return 'house?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }

        }else{
            return 'search?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(for sale)' : 'House(not for sale)';
                break;
        }
    };

    //=================================底部搜索框内容发生变化事件==================================
    $scope.allValue.footSearchBar = function(){
        if($scope.allValue.footValue.length != 0){
            angular.element('.hf_search_history').hide();
            angular.element('.hf_search_simple').show();
            angular.element('.hf_search_error').hide();
            $scope.allValue.footSearchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.footValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    $scope.allValue.footSearchData = data.data;
                    data.data.length != 0 ? angular.element('.hf_search_error').hide() : angular.element('.hf_search_error').show();
                    $scope.allValue.footSearchBtn = function(){
                        if($scope.allValue.footValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return 'detail?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity
                            }else{
                                return 'search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn=' + data.data[0].fatherName+'&ct='+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.hf_search_history').show();
            angular.element('.hf_search_simple').hide();
            angular.element('.hf_search_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                $scope.allValue.searchHistoryData = [];
                var json = {};
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };
    $scope.allValue.footFocusEvent = function(){
        $scope.allValue.footSubFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    $scope.allValue.footBlurEvent = function(){
        $scope.allValue.footSubFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.footOverEvent = function () {
        $scope.allValue.footSubFlag = false;
        $scope.allValue.footBlurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.footLeaveEvent = function (){
        $scope.allValue.footBlurEvent = function(){
            $scope.allValue.footSubFlag = true;
        }
    };

    //=================================== dataInformation中的点击切换 ============================
    $scope.allValue.dataInfo = function(n){
        $scope.allValue.diw = myFactory.addClassName({
            itemSmall : '.hld_downdata>li',
            name : 'hld_turn_num',
            num : n,
            nextEvent :false //在接下来要实现上面轮播
        });
        $scope.allValue.din = myFactory.addClassName({
            itemSmall : '.hld_downdata>li>.hld_downdata_icon',
            name :'hld_turn_icon',
            num : n,
            nextEvent : false
        });
        $scope.allValue.dataInfoClick = myFactory.home.litteDot({
            wrap: '.hldu_ul',
            num: n,
            moveWidth: 9.8,
            moveTime: 500,
            nextEvent: false
        })
    };

    //----------------------------------------------推荐房源和公司介绍-------后期会做--------------
    /*

    //================================== 获取 open house 的数据 ====================================
    $scope.allValue.getOpenHouseData = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getRecommendGoodHouse/21',
        callBack : function(data){
            var tempAllHouse = data.data.slice(0);
            $scope.allValue.openHouseData = [];
            for(var i = 0; i < 7; i++){
                var tempArr = tempAllHouse.slice(i*3,(i+1)*3);
                $scope.allValue.openHouseData.push(tempArr);
            }
            //console.log(data)
        }
    });

    //================================= 获取 great high school 的数据==============================
    $scope.allValue.getSchoolHouseData = myFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getRecommendSchoolHouse/21',
        callBack : function(data){
            var tempAllHouse = data.data.slice(0);
            $scope.allValue.schoolHouseData = [];
            for(var i = 0; i < 7; i++){
                var tempArr = tempAllHouse.slice(i*3,(i+1)*3);
                $scope.allValue.schoolHouseData.push(tempArr);
            }
        }
    });

    //================================ 获取waterfront 的数据======================================
    $scope.allValue.getWaterHouseData = myFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getRecommendViewHouse/21',
        callBack : function(data){
            var tempAllHouse = data.data.slice(0);
            $scope.allValue.waterHouseData = [];
            for(var i = 0; i < 7; i++){
                var tempArr = tempAllHouse.slice(i*3,(i+1)*3);
                $scope.allValue.waterHouseData.push(tempArr);
            }
        }
    });
    //================================= open house 中的点击切换 ==================================
    $scope.allValue.openHouse = function(str){
        $scope.allValue.oHouse = myFactory.normalTurn({
            wrap : '.hoh_img_trun',
            direct : 'left',
            clickType : str,
            clickDefalut : 'add',
            maxNum : 7,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            //下面小图添加样式
            nextEventOption : {
                itemSmall : '.hoh_dot>li',
                name : 'hoh_doted',
                num : 0,
                nextEvent : false
            }
        })
    };
    $scope.allValue.openHouseDot = function(n){
        $scope.allValue.oHouseDotClick = myFactory.home.litteDot({
            wrap : '.hoh_img_trun',
            num : n,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            nextEventOption : {
                itemSmall : '.hoh_dot>li',
                name : 'hoh_doted',
                num : n,
                nextEvent : false
            }
        })
    };

    //================================= great high school 中的点击切换 ==========================
    $scope.allValue.greatHighSchool = function(str){
        $scope.allValue.ghSchool = myFactory.normalTurn({
            wrap : '.hgs_img_trun',
            direct : 'left',
            clickType : str,
            clickDefalut : 'add',
            maxNum : 7,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            //下面小图添加样式
            nextEventOption : {
                itemSmall : '.hgs_dot>li',
                name : 'hgs_doted',
                num : 0,
                nextEvent : false
            }
        })
    };
    $scope.allValue.ghDot = function(n){
        $scope.allValue.oHouseDotClick = myFactory.home.litteDot({
            wrap : '.hgs_img_trun',
            num : n,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            nextEventOption : {
                itemSmall : '.hgs_dot>li',
                name : 'hgs_doted',
                num : n,
                nextEvent : false
            }
        })
    };

    //================================ waterfront 中的点击切换 =================================
    $scope.allValue.waterFront = function(str){
        $scope.allValue.ghSchool = myFactory.normalTurn({
            wrap : '.hw_img_trun',
            direct : 'left',
            clickType : str,
            clickDefalut : 'add',
            maxNum : 7,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            //下面小图添加样式
            nextEventOption : {
                itemSmall : '.hw_dot>li',
                name : 'hw_doted',
                num : 0,
                nextEvent : false
            }
        })
    };
    $scope.allValue.wfDot = function(n){
        $scope.allValue.oHouseDotClick = myFactory.home.litteDot({
            wrap : '.hw_img_trun',
            num : n,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            nextEventOption : {
                itemSmall : '.hw_dot>li',
                name : 'hw_doted',
                num : n,
                nextEvent : false
            }
        })
    };

    //================================= tigerz介绍点击切换 ============================
    $scope.allValue.tigerzIntroduce = function (str){
        $scope.allValue.introduce = myFactory.normalTurn({
            wrap : '.hth_turn',
            direct : 'left',
            clickType : str,
            clickDefalut : 'add',
            maxNum : 7,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            //下面小图添加样式
            nextEventOption : {
                itemSmall : '.hth_dot>li',
                name : 'hth_doted',
                num : 0,
                nextEvent : false
            }
        })
    };
    $scope.allValue.introduceDot = function(n){
        $scope.allValue.introduceDotClick = myFactory.home.litteDot({
            wrap : '.hth_turn',
            num : n,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            nextEventOption : {
                itemSmall : '.hth_dot>li',
                name : 'hth_doted',
                num : n,
                nextEvent : false
            }
        })
    };


    */
    //----------------------------------------------登陆注册----------------------------------------
    $scope.allValue.isLogin = false;
    $scope.allValue.hasLogin = false;
    $scope.allValue.lEmail = '';
    $scope.allValue.lPassword = '';
    $scope.allValue.loginTemp = true;
    $scope.allValue.rightUser = true;
    $scope.allValue.autoLogin = true;
    $scope.allValue.exitEmail = false;
    $scope.allValue.jugeRePassword = false;
    $scope.allValue.registPassword = '';
    $scope.allValue.registRePassword = '';

    $scope.allValue.loginFn = function(){
        $scope.allValue.isLogin = !$scope.allValue.isLogin;
    };
    $scope.allValue.loginRigist = function(){
        $scope.allValue.loginTemp = !$scope.allValue.loginTemp;
    }
    $scope.allValue.loginBtnFn = function(str){
        if(str){return}
        if($scope.allValue.autoLogin){
            alert('Two week automatic login');
        }
        console.log($scope.allValue.lEmail);
        console.log($scope.allValue.lPassword);
        $scope.allValue.hasLogin = true;
        $scope.allValue.isLogin = false;
        document.cookie = 'name'+'='+$scope.allValue.lEmail
        //window.setCookie('name','jvid')
    }
    $scope.allValue.jugePassword = function(){
        $scope.allValue.jugeRePassword = $scope.allValue.registPassword == $scope.allValue.registRePassword ? false : true;
    }

    //================================================ zw 嵌套网页 =================================================

}]);
//==================================================== 搜索页控制器 =================================================
app.controller('searchCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory','$timeout','$interval','publicFactory','searchFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$timeout,$interval,pFactory,sFactory){
   $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;

    $("meta[name='keywords']").attr('content',"Tigerz | Houses For Sale in New Zealand | Auction | Estimate");

    //挂载所有数据
    $scope.allValue = {};

    //地图上犯罪率照片的范围
    var _bounds = {
        1:[[1,1],[1,1]],
        2:[[3,2],[3,2]],
        3:[[7,4],[7,5]],
        4:[[15,9],[15,10]],
        5:[[30,19],[31,20]],
        6:[[60,38],[63,41]],
        7:[[121,76],[127,83]],
        8:[[243,152],[255,166]],
        9:[[486,305],[511,332]],
        10:[[973,611],[1023,666]],
        11:[[1947,1222],[2047,1333]],
        12:[[3894,2445],[4095,2667]],
        13:[[7789,4890],[8191,5335]],
        14:[[15578,9781],[16383,10671]],
        15:[[31156,19562],[32767,21342]],
        16:[[62312,39124],[65535,39182]]
    };

    //纪录判断地图是否拖动从而重新去调整上一页下一页的点击事件
    $scope.allValue.jugeTemp = 0;


    var localParam = location.href.indexOf('?') == -1 ? 'name=Auckland%20City&level=2&page=0&sort=default&isAllHouse=false&ct=Auckland' : location.href.substr(location.href.indexOf('?')+1);

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/list.html" + '?' + localParam;
    }

    angular.element('.dataSave').data('searchParam',localParam);
    $('.search_language_cn').attr('href','/search_cn?'+angular.element('.dataSave').data('searchParam'));
    $('.search_language_en').attr('href','/search?'+angular.element('.dataSave').data('searchParam'));

    var localItem = localParam.split('&');
    var cityTemp = true;
    var subsurbTemp = true;
    var roomsTemp = true;
    var schoolTemp = true;
    var changeMapTemp = false;
    $scope.allValue.totalHouseNum = 0;
    $scope.allValue.curSchool = "School";

    //默认是priceUp 返回数据是价格越来越低
    var priceUpDown = true;

    $scope.allValue.roomParam = {
        "all":true,
        "one":false,
        "two":false,
        "three":false,
        "four":false,
        "more":false
    }
    $scope.allValue.schoolParam = {
        id:"5840ea5a1cab461c20cf55c8",
        sort:'default'
    };
    $scope.allValue.schoolParam.bedroom = $scope.allValue.roomParam;

    $scope.allValue.param = {};
    for(var i = 0; i < localItem.length; i++){
        $scope.allValue.param[localItem[i].split('=')[0]] = decodeURIComponent(localItem[i].split('=')[1]);
    };

    $scope.allValue.param.bedroom = $scope.allValue.roomParam;
    $scope.allValue.param.level = $scope.allValue.param.level/1;
    $scope.allValue.param.page = $scope.allValue.param.page/1;

    $scope.allValue.ct = $scope.allValue.param.ct || "Auckland";
    $scope.allValue.param.scope = $scope.allValue.param.ct || "Auckland";

    $scope.allValue.select = {
        city:$scope.cityJson[$scope.allValue.ct].city,
        suburb:$scope.cityJson[$scope.allValue.ct].suburb
    }
    $scope.allValue.selectSchool = $scope.cityJson[$scope.allValue.ct].school



    $scope.allValue.pageJumpParam = $.extend({},$scope.allValue.param);
    //$scope.allValue.pageJumpParam.page == 0 ? angular.element('.slp_pre_pro').hide() : angular.element('.slp_pre_pro').show();

    $scope.allValue.proPage = $scope.allValue.pageJumpParam.page - 1;
    $scope.allValue.nextPage = $scope.allValue.pageJumpParam.page + 1;

    if($scope.allValue.pageJumpParam.page <= 0){
        angular.element('.slp_pre_pro').hide();
        $scope.allValue.proPage = 0;
    }else{
        angular.element('.slp_pre_pro').show();
    }

    (function(){
        var navNumber;
        switch ($scope.allValue.pageJumpParam.sort){
            case 'newest':
                navNumber = 1;
                break;
            case 'cheap':
                navNumber = 2;
                break;
            default:
                navNumber = 0;
                break;
        }
        $scope.allValue.navd = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : navNumber,
            nextEvent : false
        });
    })()

    var mapZoom = setMapZoom($scope.allValue.param.level);

    if($scope.allValue.param.level == 2){
        $scope.allValue.currentCity = $scope.allValue.param.name;
        $scope.allValue.currentSuburb = 'All suburbs';
    }else if($scope.allValue.param.level == 3){
        $scope.allValue.currentSuburb = $scope.allValue.param.name;
        $scope.allValue.currentCity = $scope.allValue.param.fn;
    }

    $scope.allValue.suburbs = $scope.allValue.select.suburb[$scope.allValue.currentCity];
    $scope.allValue.schools = $scope.allValue.selectSchool[$scope.allValue.currentCity];

    function setMapZoom(n){
        switch (n){
            case 1:
                return 11;
                break;
            case 2:
                return 13;
                break;
            case 3:
                return 15;
                break;
            default :
                return 11;
                break;
        }
    }
    window.onresize = function(){
        if(window.innerWidth >= 1250){
            document.documentElement.style.fontSize = '97.66px';
        }else{
            //innerWidth <= 1000 ? $('body').css({'overflowX':'scroll'}) : $('body').css({'overflowX':'hidden'});
            innerWidth <= 1000 ? document.documentElement.style.fontSize = '78.13px' : document.documentElement.style.fontSize = innerWidth / 12.8 + 'px';
        }
        $scope.allValue.d = sFactory.setSearchHight();
    };
    $scope.allValue.b = sFactory.setSearchHight();

    var houseMarker = [];
    var suburbMarker = [];
    var cityMarker = [];
    var countryMarker = [];

    var tempHouseArr = [];
    var tempSuburbArr = [];
    var tempCityArr = [];

    var hotelMarker = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };


    //var testTemp = {"name":"Auckland City","level":2,"page":0,"sort":"default","isAllHouse":"false","bedroom":{"all":true,"one":false,"two":false,"three":false,"four":false,"more":false},"scope":"Auckland"}
    //============================= 获取当前属性的房源 ==============================
    $scope.allValue.getSearchData = pFactory.postData({
        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
        data:JSON.stringify($scope.allValue.param),
        //data:JSON.stringify(testTemp),
        callBack : function(data){
            //console.log(data);
            if($scope.allValue.pageJumpParam.page >= data.data[0].maxPage){
                angular.element('.slp_next_pro').hide();
                $scope.allValue.nextPage = data.data[0].maxPage;
                $scope.allValue.proPage = data.data[0].maxPage - 1;
            }else{
                angular.element('.slp_next_pro').show();
            }

            $scope.allValue.listHouse = data.data[0];
            $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;

            $('.slp_list_load').hide();
            $('title').text($scope.allValue.param.name + ' have ' +$scope.allValue.listHouse.propNum+' houses on sale |新西兰房产中介 | Auction | Estimate')

            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
            if(data.data[0].houseInfo.length == 0 && data.data[0].mapInfo.length == 0){
                angular.element('.noHouse').show();
                $timeout(function(){
                    angular.element('.noHouse').hide();
                },2000);
            }else{
                //设置当前页和总共有多少页
                $scope.allValue.listHouse.curPage += 1;
                $scope.allValue.listHouse.maxPage += 1;
                $scope.allValue.nextPage = $scope.allValue.nextPage >= $scope.allValue.listHouse.maxPage ? $scope.allValue.listHouse.maxPage : $scope.allValue.nextPage;
                $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                }
            }

            //创建地图 在接下来使用地图都试$scope.allValue.c.map
            $scope.allValue.mapOption = {
                id:'search_map',
                map:'searchMap',
                position : {lat: (data.data[0].basePoint[1] || -36.9140054167), lng: (data.data[0].basePoint[0] || 174.884204283)},
                zoom: mapZoom,
                drag:true,
                wheelEvent : true
            }

            //页面加载时候出现的地图
            $scope.allValue.c = pFactory.setSearchMap($scope.allValue.mapOption);
            var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});

            //首次进来的时候判断现在的level 决定地图显示marker的类型
            /*
                4 显示house
                3 显示suburb
                2 显示city
           */
            if(data.data[0].mapLevel == 3){
                tempSuburbArr = data.data[0].mapInfo;
                for(var m = 0,len=data.data[0].mapInfo.length; m < len; m++){
                    suburbMarker.push(sFactory.suburbMarker(data.data[0].mapInfo[m],$scope.allValue.c.map));
                }
            }
            if(data.data[0].mapLevel == 2){
                tempCityArr = data.data[0].mapInfo;
                for(var m = 0,len=data.data[0].mapInfo.length; m < len; m++){
                    cityMarker.push(sFactory.cityMarker(data.data[0].mapInfo[m],$scope.allValue.c.map));
                }
            }
            if(data.data[0].mapLevel == 4){
                tempHouseArr = data.data[0].mapInfo;
                $scope.allValue.searchDot = sFactory.makeMapDot(data.data[0].mapInfo,$scope.allValue.c.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                houseMarker = houseMarker.concat($scope.allValue.searchDot);
            }

            $scope.allValue.c.map.addListener('dragend',function(){
                $('.search_loading_wrap').show();
                $('.slp_list_load').show();

                $scope.allValue.jugeTemp = 1;
                $('.slp_more_btn').eq(0).hide();
                $('.slp_more_btn').eq(1).show();

                //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                if(hotelMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['restaurant'],
                        cb:callbackHotel
                    })
                }else if(hospitalMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['hospital'],
                        cb:callbackHospital
                    });
                }else if(supermarketMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['convenience_store'],
                        cb:callbackSupermarket
                    })
                }


                //设置拖动后的请求参数
                $scope.allValue.xy = {
                    "zoom":$scope.allValue.c.map.getZoom(),
                    "bounds": [$scope.allValue.c.map.getBounds().getNorthEast().lng(),$scope.allValue.c.map.getBounds().getNorthEast().lat(),$scope.allValue.c.map.getBounds().getSouthWest().lng(),$scope.allValue.c.map.getBounds().getSouthWest().lat()],
                    "page":0,
                    "sort":"default",
                    "isAllHouse":false
                }
                $scope.allValue.navd = myFactory.addClassName({
                    itemSmall : '.slp_nav>ol>li',
                    name : 'slp_nav_actived',
                    num : 0,
                    nextEvent : false
                });
                $scope.allValue.getSearchData = pFactory.postData({
                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                    data:JSON.stringify($scope.allValue.xy),
                    callBack : function(data){

                        var timer = $interval(function(){
                            if(parseInt($('.loading_item').width()) >= 200){
                                $('.search_loading_wrap').hide();
                                $('.loading_item').css({'width':40});
                                $('.loading_item_num').text(20);
                                $interval.cancel(timer);
                                //console.log(data)
                                $scope.allValue.listHouse = data.data[0];
                                $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                $('.slp_list_load').hide();

                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                if(data.data[0].mapInfo.length == 0 && data.data[0].houseInfo.length == 0){
                                    angular.element('.noHouse').show();
                                    $timeout(function(){
                                        angular.element('.noHouse').hide();
                                    },1500);
                                    return;
                                }else {
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)

                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();

                                    if($scope.allValue.listHouse.mapLevel == 4){
                                        var newMarker =  pFactory.differentArr(tempHouseArr,data.data[0].mapInfo);

                                        if(newMarker.length != 0){
                                            $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.c.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                            houseMarker = houseMarker.concat($scope.allValue.searchDot);
                                            //tempHouseArr = data.data[0].mapInfo;
                                            tempHouseArr = tempHouseArr.concat(newMarker);
                                        }
                                    }else if($scope.allValue.listHouse.mapLevel == 3){

                                        var newMarker =  pFactory.differentArr(tempSuburbArr,data.data[0].mapInfo);

                                        if(newMarker.length != 0){
                                            tempSuburbArr = tempSuburbArr.concat(newMarker);
                                            for(var m = 0,len = newMarker.length; m < len; m++){
                                                suburbMarker.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.c.map));
                                            }
                                        }
                                    }else if($scope.allValue.listHouse.mapLevel == 2){
                                        var newMarker =  pFactory.differentArr(tempCityArr,data.data[0].mapInfo);
                                        if(newMarker.length != 0){
                                            tempCityArr = tempCityArr.concat(newMarker);
                                            for(var m = 0,len = newMarker.length; m < len; m++) {
                                                cityMarker.push(sFactory.cityMarker(newMarker[m],$scope.allValue.c.map));
                                            }
                                        }
                                    }else{
                                        if(countryMarker.length == 0){
                                            countryMarker.push(sFactory.countryMarker($scope.allValue.c.map));
                                        }
                                    }
                                }

                            }
                            $('.loading_item').css({'width':'+=20'});
                            $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                        },1);
                    }
                })
                //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                $scope.allValue.preMapPage = function(){
                    $('.slp_list_load').show();
                    $scope.allValue.xy.page -= 1;
                    angular.element('.slp_next').show();
                    if($scope.allValue.xy.page < 0){
                        $('.slp_list_load').hide();
                        return
                    }else{
                        $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                            data:JSON.stringify($scope.allValue.xy),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)

                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }


                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                }
                $scope.allValue.nextMapPage = function(){
                    $('.slp_list_load').show();
                    $scope.allValue.xy.page += 1;
                    angular.element('.slp_pre').show();
                    if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                        $('.slp_list_load').hide();
                        return
                    }else{
                        $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                            data:JSON.stringify($scope.allValue.xy),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)

                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }


                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                }
            });

            //=============================== 检测地图事件 ============================
            $scope.allValue.c.map.addListener('zoom_changed',function(){
                if($scope.allValue.mapMaker){
                    $scope.allValue.mapMaker.setMap(null)
                    $scope.allValue.mapMaker = null;
                }
                $('.search_loading_wrap').show();
                $('.slp_list_load').show();
                $scope.allValue.jugeTemp = 1;
                $('.slp_more_btn').eq(0).hide();
                $('.slp_more_btn').eq(1).show();
                $scope.allValue.xy = {
                    "zoom":$scope.allValue.c.map.getZoom(),
                    "bounds": [$scope.allValue.c.map.getBounds().getNorthEast().lng(),$scope.allValue.c.map.getBounds().getNorthEast().lat(),$scope.allValue.c.map.getBounds().getSouthWest().lng(),$scope.allValue.c.map.getBounds().getSouthWest().lat()],
                    "page":0,
                    "sort":"default",
                    "isAllHouse":false
                }

                //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                if(hotelMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['restaurant'],
                        cb:callbackHotel
                    })
                }else if(hospitalMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['hospital'],
                        cb:callbackHospital
                    });
                }else if(supermarketMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['convenience_store'],
                        cb:callbackSupermarket
                    })
                }

                $scope.allValue.navd = myFactory.addClassName({
                    itemSmall : '.slp_nav>ol>li',
                    name : 'slp_nav_actived',
                    num : 0,
                    nextEvent : false
                });
                $scope.allValue.getSearchData = pFactory.postData({
                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                    data:JSON.stringify($scope.allValue.xy),
                    callBack : function(data){
                        var timer = $interval(function(){
                            if(parseInt($('.loading_item').width()) >= 200){
                                $('.search_loading_wrap').hide();
                                $('.loading_item').css({'width':40});
                                $('.loading_item_num').text(20);
                                $interval.cancel(timer);

                                $scope.allValue.listHouse = data.data[0];
                                $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                $('.slp_list_load').hide();

                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                if(data.data[0].mapInfo.length == 0 && data.data[0].houseInfo.length == 0){
                                    angular.element('.noHouse').show();
                                    $timeout(function(){
                                        angular.element('.noHouse').hide();
                                    },1500);
                                    return;
                                }else{
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)

                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                    if($scope.allValue.listHouse.mapLevel == 4){
                                        tempSuburbArr = [];
                                        tempCityArr = [];
                                        suburbMarker = sFactory.deleteMarker(suburbMarker);
                                        cityMarker = sFactory.deleteMarker(cityMarker);
                                        countryMarker = sFactory.deleteMarker(countryMarker);

                                        var newMarker = pFactory.differentArr(tempHouseArr,data.data[0].mapInfo);
                                        if(newMarker.length != 0){
                                            //console.log(newMarker);
                                            $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.c.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                            houseMarker = houseMarker.concat($scope.allValue.searchDot);
                                            tempHouseArr = tempHouseArr.concat(newMarker);
                                        }
                                    }else if($scope.allValue.listHouse.mapLevel == 3){

                                        houseMarker = sFactory.deleteHouseMarker(houseMarker);
                                        cityMarker = sFactory.deleteMarker(cityMarker);
                                        countryMarker = sFactory.deleteMarker(countryMarker);
                                        var newMarker =  pFactory.differentArr(tempSuburbArr,data.data[0].mapInfo);
                                        tempHouseArr = [];
                                        tempCityArr = [];

                                        if(newMarker.length != 0){
                                            tempSuburbArr = tempSuburbArr.concat(newMarker);
                                            for(var m = 0,len = newMarker.length; m < len; m++){
                                                suburbMarker.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.c.map))
                                            }
                                        }

                                    }else if($scope.allValue.listHouse.mapLevel == 2){
                                        houseMarker = sFactory.deleteHouseMarker(houseMarker);
                                        suburbMarker = sFactory.deleteMarker(suburbMarker);
                                        countryMarker = sFactory.deleteMarker(countryMarker);
                                        var newMarker =  pFactory.differentArr(tempCityArr,data.data[0].mapInfo);
                                        tempHouseArr = [];
                                        tempSuburbArr = [];

                                        if(newMarker.length != 0){
                                            tempCityArr = tempCityArr.concat(newMarker);
                                            for(var m = 0,len = newMarker.length; m < len; m++) {
                                                cityMarker.push(sFactory.cityMarker(newMarker[m],$scope.allValue.c.map))
                                            }
                                        }

                                    }else{
                                        tempHouseArr = [];
                                        tempSuburbArr = [];
                                        tempCityArr = [];

                                        houseMarker = sFactory.deleteHouseMarker(houseMarker);
                                        suburbMarker = sFactory.deleteMarker(suburbMarker);
                                        cityMarker = sFactory.deleteMarker(cityMarker);
                                        if(countryMarker.length == 0){
                                            countryMarker.push(sFactory.countryMarker($scope.allValue.c.map));
                                        }
                                    }
                                }
                            }
                            $('.loading_item').css({'width':'+=20'});
                            $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                        },1);
                    }
                })
                //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                $scope.allValue.preMapPage = function(){
                    $('.slp_list_load').show();
                    $scope.allValue.xy.page -= 1;
                    angular.element('.slp_next').show();
                    if($scope.allValue.xy.page < 0){
                        $('.slp_list_load').hide();
                        return;
                    }else{
                        $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                            data:JSON.stringify($scope.allValue.xy),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)

                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }

                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                }
                $scope.allValue.nextMapPage = function(){
                    $('.slp_list_load').show();
                    $scope.allValue.xy.page += 1;
                    angular.element('.slp_pre').show();
                    if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                        $('.slp_list_load').hide();
                        return
                    }else{
                        $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                            data:JSON.stringify($scope.allValue.xy),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();
                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)

                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }

                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                }
            });
            //点击左侧列表项 地图显示相应的房子
            $scope.allValue.showView = function(obj,$event){
                //console.log($scope.allValue.ct);
                $event.stopPropagation();
                if($scope.allValue.mapMaker){
                    $scope.allValue.mapMaker.setMap(null)
                    $scope.allValue.mapMaker = null;
                }
                var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                    '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                    '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                    '<p class="map_info_price">'+obj.housePrice+'</p>' +
                    '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                    '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                    '</div></div>' +
                    '</a>';
                if(houseMarker){
                    for(x in houseMarker){
                        if(obj._id == houseMarker[x]._id){
                            houseMarker[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                            houseMarker[x].name.zIndex = 3;
                            infoWindowS.setContent(contentString);
                            infoWindowS.open($scope.allValue.c.map, houseMarker[x].name);
                            return;
                        }
                    }
                }
                $scope.allValue.mapMaker = new google.maps.Marker({
                    position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                    title : obj.title,
                    icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                    map: $scope.allValue.c.map,
                    zIndex:9
                });
                infoWindowS.setContent(contentString);
                infoWindowS.open($scope.allValue.c.map, $scope.allValue.mapMaker);
                $scope.allValue.mapMaker.addListener('click', function() {
                    infoWindowS.setContent(contentString);
                    infoWindowS.open($scope.allValue.c.map, $scope.allValue.mapMaker);
                });

            };
            //==================================================地图列表导航事件==================================
            //search页面列表左侧导航设置 点击添加样式
            $scope.allValue.setListNav = function(n,str){
                $scope.allValue.sln = myFactory.addClassName({
                    itemSmall : '.slp_nav>ol>li',
                    name : 'slp_nav_actived',
                    num : n,
                    nextEvent : false
                });
                $('.slp_list_load').show();
                if($scope.allValue.jugeTemp){
                    if(n == 2){
                        if(priceUpDown){
                            $scope.allValue.xy.sort = 'priceUp';
                            $('.priceUp').css({'border-top-color':'brown'})
                            $('.priceDown').css({'border-bottom-color':'gray'})
                        }else{
                            $scope.allValue.xy.sort = 'priceDown';
                            $('.priceUp').css({'border-top-color':'gray'})
                            $('.priceDown').css({'border-bottom-color':'brown'})
                        }
                        priceUpDown = !priceUpDown;
                    }else{
                        $scope.allValue.xy.sort = str;
                    }

                    $scope.allValue.xy.page = 0;
                    $scope.allValue.getNextData = pFactory.postData({
                        url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/searchHouseByMap',
                        data: JSON.stringify($scope.allValue.xy),
                        callBack: function (data) {
                            $scope.allValue.listHouse = data.data[0];
                            $('.slp_list_load').hide();

                            if(data.data[0].houseInfo){
                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)

                                }
                            }

                        }
                    })
                }else{
                    if(n == 2){
                        if(priceUpDown){
                            $scope.allValue.param.sort = 'priceUp';
                            $('.priceUp').css({'border-top-color':'brown'})
                            $('.priceDown').css({'border-bottom-color':'gray'})
                        }else{
                            $scope.allValue.param.sort = 'priceDown';
                            $('.priceUp').css({'border-top-color':'gray'})
                            $('.priceDown').css({'border-bottom-color':'brown'})
                        }
                        priceUpDown = !priceUpDown;
                    }else{
                        $scope.allValue.param.sort = str;
                    }
                    //$scope.allValue.param.sort = str;
                    $scope.allValue.param.page = 0;
                    $scope.allValue.pageJumpParam.sort = str;
                    $scope.allValue.pageJumpParam.page = 0;
                    $scope.allValue.proPage = 0;
                    $scope.allValue.nextPage = 1;
                    //console.log(str)
                    $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                    $scope.allValue.getNextData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                        data:JSON.stringify($scope.allValue.param),
                        callBack : function(data){
                            $scope.allValue.listHouse = data.data[0];
                            $('.slp_list_load').hide();

                            if(data.data[0].houseInfo){
                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                }
                            }


                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                            //设置当前页和总共有多少页
                            $scope.allValue.listHouse.curPage += 1;
                            //////////////////////////////////////////////////
                            //          调节页数使用之前是注释掉的               //
                            //////////////////////////////////////////////////
                            $scope.allValue.listHouse.maxPage += 1;
                        }
                    });
                }
            };

            //安全指数的事件
            $('.search_safe_close').on('click',function(){
                $('.search_safe_icon').show();
                $('.search_safe_display').hide();
                $scope.allValue.c.map.overlayMapTypes.pop();
            });
            $('.search_hotel_close').on('click',function(){
                $('.search_safe_icon').show();
                $('.search_hotel_display').hide();
                //console.log(hotelMarker.markerArr);
                //hotelMarker.moveMap = false;
                //hotelMarker.markerArr = sFactory.deleteMarker(hotelMarker.markerArr)
                for(x in hotelMarker.markerArr){
                    hotelMarker.markerArr[x].setMap(null);
                }
                hotelMarker = {
                    markerArr : [],
                    moveMap : false,
                    color:'#3c8df6',
                    tempArr : []
                };
            });
            $('.search_hospital_close').on('click',function(){
                $('.search_safe_icon').show();
                $('.search_hospital_display').hide();
                //hospitalMarker.moveMap = false;
                for(x in hospitalMarker.markerArr){
                    hospitalMarker.markerArr[x].setMap(null);
                }
                hospitalMarker = {
                    markerArr : [],
                    moveMap : false,
                    color:'#26cf5c',
                    tempArr : []
                };
            });
            $('.search_supermarket_close').on('click',function(){
                $('.search_safe_icon').show();
                $('.search_supermarket_display').hide();
                //supermarketMarker.moveMap = false;
                for(x in supermarketMarker.markerArr){
                    supermarketMarker.markerArr[x].setMap(null);
                }
                supermarketMarker = {
                    markerArr : [],
                    moveMap : false,
                    color:'#a970ff',
                    tempArr : []
                };
            });

            var service = new google.maps.places.PlacesService($scope.allValue.c.map);
            function callbackHotel(results, status) {
                //console.log(results);
                //if(hotelMarker.markerArr.length != 0){
                //    for(x in hotelMarker.markerArr){
                //        hotelMarker.markerArr[x].setMap($scope.allValue.c.map);
                //    }
                //}
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var newMarkerArr = hotelMarker.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker.tempArr,results)
                    hotelMarker.tempArr = hotelMarker.tempArr.concat(newMarkerArr);
                    hotelMarker.markerArr = hotelMarker.markerArr.concat(sFactory.makeServiceDot({
                        color:hotelMarker.color,
                        map:$scope.allValue.c.map,
                        arr:newMarkerArr
                    }))

                }
            };
            function callbackHospital(results, status) {
                //console.log(results);
                //if(hospitalMarker.markerArr.length != 0){
                //    for(x in hospitalMarker.markerArr){
                //        hospitalMarker.markerArr[x].setMap($scope.allValue.c.map);
                //    }
                //}
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var newMarkerArr = hospitalMarker.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker.tempArr,results)
                    hospitalMarker.tempArr = hospitalMarker.tempArr.concat(newMarkerArr);
                    hospitalMarker.markerArr = hospitalMarker.markerArr.concat(sFactory.makeServiceDot({
                        color:hospitalMarker.color,
                        map:$scope.allValue.c.map,
                        arr:newMarkerArr
                    }))
                }
            };
            function callbackSupermarket(results, status) {
                //console.log(results);
                //if(supermarketMarker.markerArr.length != 0){
                //    for(x in supermarketMarker.markerArr){
                //        supermarketMarker.markerArr[x].setMap($scope.allValue.c.map);
                //    }
                //}
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var newMarkerArr = supermarketMarker.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker.tempArr,results)
                    supermarketMarker.tempArr = supermarketMarker.tempArr.concat(newMarkerArr);
                    supermarketMarker.markerArr = supermarketMarker.markerArr.concat(sFactory.makeServiceDot({
                        color:supermarketMarker.color,
                        map:$scope.allValue.c.map,
                        arr:newMarkerArr
                    }))

                }
            };
            function serviceFn(obj){
                request = {
                    bounds:obj.bns,
                    types: obj.ty
                };
                service.nearbySearch(request, obj.cb);
            }
            $scope.allValue.blockFilter = function(str){
                var _mapbounds = $scope.allValue.c.map.getBounds();
                /*
                * 1 ---> crime
                * 2 ---> Restaurant
                * 3 ---> hospital
                * 4 ---> Convenience
                * */
                if(str == 1){
                    crimeFn($scope.allValue.c.map)
                }else if(str == 2){
                    $('.search_safe_icon').hide();
                    $('.search_hotel_display').show();
                    hotelMarker.moveMap = true;
                    serviceFn({
                        bns:_mapbounds,
                        ty:['restaurant'],
                        cb:callbackHotel
                    })
                }else if(str == 3){
                    $('.search_safe_icon').hide();
                    $('.search_hospital_display').show();
                    serviceFn({
                        bns:_mapbounds,
                        ty:['hospital'],
                        cb:callbackHospital
                    });
                    hospitalMarker.moveMap = true;
                }else if(str == 4){
                    $('.search_safe_icon').hide();
                    $('.search_supermarket_display').show();
                    supermarketMarker.moveMap = true;
                    serviceFn({
                        bns:_mapbounds,
                        ty:['convenience_store'],
                        cb:callbackSupermarket
                    })
                }

            }
        }
    });



    //function jugeBlock(str,mapObj){
    //    switch (str){
    //        case 'crime':
    //            crimeFn(mapObj);
    //            break;
    //        case 'hotel':
    //            hotelFn(mapObj)
    //            break;
    //        case 'hospital':
    //            hospitalFn(mapObj)
    //            break;
    //        case 'supermarket':
    //            mallFn(mapObj)
    //            break;
    //    }
    //}
    function crimeFn(mapObj){
        $('.search_safe_icon').hide();
        $('.search_safe_display').show();
        var imageMapType = new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                if (zoom < 1 || zoom > 16 ||
                    _bounds[zoom][0][0] > coord.x || coord.x > _bounds[zoom][1][0] ||
                    _bounds[zoom][0][1] > coord.y || coord.y > _bounds[zoom][1][1]) {
                    return null;
                }
                return ['http://139.129.223.20/sellinghouse/map/'+zoom+'/'+coord.x+'/'+coord.y+'.png?14'].join('');
            },
            tileSize: new google.maps.Size(256, 256)
        });
        mapObj.overlayMapTypes.push(imageMapType);
    }
    //function hotelFn(mapObj,arr){
    //    $('.search_safe_icon').hide();
    //    $('.search_hotel_display').show();
    //    //if(arr.length == 0){
    //        pFactory.getData({
    //            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getOtherBuildingInfo/hotel',
    //            callBack:function(data){
    //                console.log(data);
    //                //hotelMarkerData = data.data;
    //                //hotelMarkerArr = sFactory.makeServiceDot({
    //                //    arr:hotelMarkerData,
    //                //    map:mapObj,
    //                //    color:'#3c8df6'
    //                //});
    //            }
    //        })
    //    //}else{
    //    //    return;
    //    //}
    //
    //}
    //function hospitalFn(mapObj){
    //    console.log('hospital');
    //    $('.search_safe_icon').hide();
    //    $('.search_hospital_display').show();
    //    pFactory.getData({
    //        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getOtherBuildingInfo/hospital',
    //        callBack:function(data){
    //            console.log(data);
    //        }
    //    })
    //}
    //function mallFn(mapObj){
    //    console.log('supermarket');
    //    $('.search_safe_icon').hide();
    //    $('.search_supermarket_display').show();
    //    pFactory.getData({
    //        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getOtherBuildingInfo/supermarket',
    //        callBack:function(data){
    //            console.log(data);
    //        }
    //    })
    //}

    var houseMarker2 = [];
    var suburbMarker2 = [];
    var cityMarker2 = [];
    var countryMarker2 = [];

    var tempHouseArr2 = [];
    var tempSuburbArr2 = [];
    var tempCityArr2 = [];

    var hotelMarker2 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker2 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker2 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };

    //筛选框事件
    $('.search_select_city').on('click',function(){
        $('.select_item').hide();
        subsurbTemp = true;
        roomsTemp = true;
        schoolTemp = true;
        $('.select_tri').removeClass('select_open_tri')
        if(cityTemp){
            $('.search_select_cityItem').show();
            $('.select_city_tri').addClass('select_open_tri')
        }else{
            $('.search_select_cityItem').hide();
            $('.select_city_tri').removeClass('select_open_tri')
        }
        cityTemp = !cityTemp
    });
    $scope.allValue.cityClick = function(str){
        changeMapTemp = false;
        $scope.allValue.curSchool = "School";
        $('.search_safe_icon').show();
        $('.search_safe_display').hide();
        $('.search_safe_icon').unbind("click");
        $('.search_safe_close').unbind('click');
        $scope.allValue.roomParam = {
            "all":true,
            "one":false,
            "two":false,
            "three":false,
            "four":false,
            "more":false
        }
        $('.select_rooms_show').text('Bedrooms')
        $scope.jugeChange = true;
        $scope.allValue.c = null;
        $scope.allValue.sb = null;
        cityTemp = true;
        $('.search_select_cityItem').hide();
        $('.select_city_show').text(str)
        $('.select_city_tri').removeClass('select_open_tri')
        $('.slp_list_load').show();
        $scope.allValue.param.name = str;
        $scope.allValue.currentCity = str;

        $scope.allValue.param.level = 2;
        $scope.allValue.param.page = 0;
        $scope.allValue.jugeTemp = 0;
        $scope.allValue.param.bedroom = $scope.allValue.roomParam;

        //$scope.allValue.ct = $scope.allValue.param.ct || "Auckland";

        angular.element('.slp_more_next').hide();
        angular.element('.slp_pre').hide();
        angular.element('.slp_next').show();
        $scope.allValue.ln = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : 0,
            nextEvent : false
        });
        priceUpDown = true;
        $('.priceUp').css({'border-top-color':'gray'})
        $('.priceDown').css({'border-bottom-color':'gray'})
        $scope.allValue.schoolParam.sort = 'defalut';
        $scope.allValue.param.sort = 'default';
        mapZoom = setMapZoom($scope.allValue.param.level);
        $scope.allValue.currentSuburb = 'All Suburb';
        $scope.allValue.suburbs = [];

        $scope.allValue.suburbs = $scope.allValue.select.suburb[$scope.allValue.currentCity];
        $scope.allValue.schools = $scope.allValue.selectSchool[$scope.allValue.currentCity];

        $scope.allValue.getSearchData = pFactory.postData({
            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
            data:JSON.stringify($scope.allValue.param),
            callBack : function(data){
                $scope.allValue.listHouse = data.data[0];
                $('.slp_list_load').hide();
                $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                if(data.data[0].houseInfo.length == 0 && data.data[0].mapInfo.length == 0 ){
                    angular.element('.noHouse').show();
                    $timeout(function(){
                        angular.element('.noHouse').hide();
                    },2000);
                }else{
                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                    }
                    //设置当前页和总共有多少页
                    $scope.allValue.listHouse.curPage += 1;
                    $scope.allValue.listHouse.maxPage += 1;
                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                }

                //创建地图 在接下来使用地图都试$scope.allValue.c.map
                $scope.allValue.mapOption = {
                    id:'search_map',
                    map:'searchMap2',
                    position : {lat: data.data[0].basePoint[1], lng:data.data[0].basePoint[0]},
                    zoom: mapZoom,
                    wheelEvent : true
                }
                $scope.allValue.ct = pFactory.setSearchMap($scope.allValue.mapOption);
                var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});
                houseMarker2 = [];
                suburbMarker2 = [];
                cityMarker2 = [];
                countryMarker2 = [];

                tempHouseArr2 = [];
                tempSuburbArr2 = [];
                tempCityArr2 = [];

                tempSuburbArr2 = data.data[0].mapInfo;
                for(var m = 0,len=$scope.allValue.listHouse.mapInfo.length; m < len; m++){
                    suburbMarker2.push(sFactory.suburbMarker($scope.allValue.listHouse.mapInfo[m],$scope.allValue.ct.map));
                }

                $scope.allValue.ct.map.addListener('dragend',function(){
                    //console.log('b')
                    $('.search_loading_wrap').show();
                    $('.slp_list_load').show();
                    $scope.allValue.jugeTemp = 1;
                    $('.slp_more_btn').eq(0).hide();
                    $('.slp_more_btn').eq(1).show();
                    $scope.allValue.xy = {
                        "zoom":$scope.allValue.ct.map.getZoom(),
                        "bounds": [$scope.allValue.ct.map.getBounds().getNorthEast().lng(),$scope.allValue.ct.map.getBounds().getNorthEast().lat(),$scope.allValue.ct.map.getBounds().getSouthWest().lng(),$scope.allValue.ct.map.getBounds().getSouthWest().lat()],
                        "page":0,
                        "sort":"default",
                        "isAllHouse":false
                    }

                    //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                    if(hotelMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(hospitalMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                    }else if(supermarketMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                    $scope.allValue.navd = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : 0,
                        nextEvent : false
                    });
                    $scope.allValue.getSearchData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                        data:JSON.stringify($scope.allValue.xy),
                        callBack : function(data){
                            var timer = $interval(function(){
                                if(parseInt($('.loading_item').width()) >= 200){
                                    $('.search_loading_wrap').hide();
                                    $('.loading_item').css({'width':40});
                                    $('.loading_item_num').text(20);
                                    $interval.cancel(timer);

                                    $scope.allValue.listHouse = data.data[0];
                                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    if(data.data[0].mapInfo.length == 0){
                                        angular.element('.noHouse').show();
                                        $timeout(function(){
                                            angular.element('.noHouse').hide();
                                        },1500);
                                    }else {
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                        if($scope.allValue.listHouse.mapLevel == 4){

                                            var newMarker = pFactory.differentArr(tempHouseArr2,data.data[0].mapInfo);
                                            if(newMarker.length != 0){
                                                $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.ct.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                houseMarker2 = houseMarker2.concat($scope.allValue.searchDot);
                                                tempHouseArr2 = tempHouseArr.concat(newMarker);
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==3){
                                            var newMarker = pFactory.differentArr(tempSuburbArr2,data.data[0].mapInfo);
                                            if(newMarker.length != 0){
                                                tempSuburbArr2 = tempSuburbArr2.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++){
                                                    suburbMarker2.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.ct.map))
                                                }
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==2){
                                            var newMarker = pFactory.differentArr(tempCityArr2,data.data[0].mapInfo)
                                            if(newMarker.length != 0){
                                                tempCityArr2 = tempCityArr2.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++) {
                                                    cityMarker2.push(sFactory.cityMarker(newMarker[m],$scope.allValue.ct.map));
                                                }
                                            }
                                        }else{
                                            if(countryMarker2.length == 0){
                                                countryMarker2.push(sFactory.countryMarker($scope.allValue.ct.map));
                                            }
                                        }
                                    }
                                }
                                $('.loading_item').css({'width':'+=20'});
                                $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                            },1);
                            $('.slp_list_load').hide();
                        }
                    })
                    //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                    $scope.allValue.preMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page -= 1;
                        angular.element('.slp_next').show();
                        if($scope.allValue.xy.page < 0){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                    $scope.allValue.nextMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page += 1;
                        angular.element('.slp_pre').show();
                        if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').show();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                });

                //=============================== 检测地图事件 ============================
                $scope.allValue.ct.map.addListener('zoom_changed',function(){
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null);
                        $scope.allValue.mapMaker = null;
                    }
                    $('.search_loading_wrap').show();
                    $('.slp_list_load').show();
                    $scope.allValue.jugeTemp = 1;
                    $('.slp_more_btn').eq(0).hide();
                    $('.slp_more_btn').eq(1).show();
                    $scope.allValue.xy = {
                        "zoom":$scope.allValue.ct.map.getZoom(),
                        "bounds": [$scope.allValue.ct.map.getBounds().getNorthEast().lng(),$scope.allValue.ct.map.getBounds().getNorthEast().lat(),$scope.allValue.ct.map.getBounds().getSouthWest().lng(),$scope.allValue.ct.map.getBounds().getSouthWest().lat()],
                        "page":0,
                        "sort":"default",
                        "isAllHouse":false
                    }

                    //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                    if(hotelMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(hospitalMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                    }else if(supermarketMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                    $scope.allValue.ln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : 0,
                        nextEvent : false
                    });
                    $scope.allValue.getSearchData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                        data:JSON.stringify($scope.allValue.xy),
                        callBack : function(data){
                            var timer = $interval(function(){
                                if(parseInt($('.loading_item').width()) >= 200){
                                    $('.search_loading_wrap').hide();
                                    $('.loading_item').css({'width':40});
                                    $('.loading_item_num').text(20);
                                    $interval.cancel(timer);

                                    $scope.allValue.listHouse = data.data[0];
                                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    if(data.data[0].mapInfo.length == 0){
                                        angular.element('.noHouse').show();
                                        $timeout(function(){
                                            angular.element('.noHouse').hide();
                                        },1500);
                                    }else{
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                        if($scope.allValue.listHouse.mapLevel == 4){
                                            var newMarker = pFactory.differentArr(tempHouseArr2,data.data[0].mapInfo);
                                            tempSuburbArr2 = [];
                                            tempCityArr2 = [];

                                            countryMarker2 = sFactory.deleteMarker(countryMarker2);
                                            suburbMarker2 = sFactory.deleteMarker(suburbMarker2);
                                            cityMarker2 = sFactory.deleteMarker(cityMarker2)

                                            if(newMarker.length != 0){
                                                $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.ct.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                houseMarker2 = houseMarker2.concat($scope.allValue.searchDot);
                                                tempHouseArr2 = tempHouseArr2.concat(newMarker);
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==3){

                                            var newMarker = pFactory.differentArr(tempSuburbArr2,data.data[0].mapInfo)
                                            tempHouseArr2 = [];
                                            tempCityArr2 = [];

                                            houseMarker2 = sFactory.deleteHouseMarker(houseMarker2)
                                            cityMarker2 = sFactory.deleteMarker(cityMarker2)
                                            countryMarker2 = sFactory.deleteMarker(countryMarker2)

                                            if(newMarker.length != 0){
                                                tempSuburbArr2 = tempSuburbArr2.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++){
                                                    suburbMarker2.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.ct.map))
                                                }
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==2){
                                            var newMarker = pFactory.differentArr(tempCityArr2,data.data[0].mapInfo)
                                            tempHouseArr2 = [];
                                            tempSuburbArr2 = [];

                                            houseMarker2 = sFactory.deleteHouseMarker(houseMarker2);
                                            suburbMarker2 = sFactory.deleteMarker(suburbMarker2);
                                            countryMarker2 = sFactory.deleteMarker(countryMarker2);

                                            if(newMarker.length != 0){
                                                tempCityArr2 = tempCityArr2.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++) {
                                                    cityMarker2.push(sFactory.cityMarker(newMarker[m],$scope.allValue.ct.map));
                                                }
                                            }
                                        }else{
                                            //console.log(data.data[0])
                                            tempHouseArr2 = [];
                                            tempSuburbArr2 = [];
                                            tempCityArr2 = [];

                                            houseMarker2 = sFactory.deleteHouseMarker(houseMarker2);
                                            suburbMarker2 = sFactory.deleteMarker(suburbMarker2);
                                            cityMarker2 = sFactory.deleteMarker(cityMarker2);
                                            if(countryMarker2.length == 0){
                                                countryMarker2.push(sFactory.countryMarker($scope.allValue.ct.map));
                                            }
                                        }
                                    }

                                }
                                $('.loading_item').css({'width':'+=20'});
                                $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                            },1);
                        }
                    })
                    //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                    $scope.allValue.preMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page -= 1;
                        angular.element('.slp_next').show();
                        if($scope.allValue.xy.page < 0){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }


                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                    $scope.allValue.nextMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page += 1;
                        angular.element('.slp_pre').show();
                        if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                });

                $scope.allValue.showView = function(obj,$event){
                    $event.stopPropagation();
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null);
                        $scope.allValue.mapMaker = null;
                    }
                    var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                        '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                        '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                        '<p class="map_info_price">'+obj.housePrice+'</p>' +
                        '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                        '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                        '</div></div>' +
                        '</a>';
                    if(houseMarker2){
                        for(x in houseMarker2){
                            if(obj._id == houseMarker2[x]._id){
                                houseMarker2[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                houseMarker2[x].name.zIndex = 3;
                                infoWindowS.setContent(contentString);
                                infoWindowS.open($scope.allValue.ct.map, houseMarker2[x].name);
                                return;
                            }
                        }
                    }
                    $scope.allValue.mapMaker = new google.maps.Marker({
                        position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                        title : obj.title,
                        icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                        map: $scope.allValue.ct.map,
                        zIndex:9
                    });
                    $scope.allValue.mapMaker.addListener('click', function() {
                        infoWindowS.setContent(contentString);
                        infoWindowS.open($scope.allValue.ct.map, $scope.allValue.mapMaker);
                    });
                    infoWindowS.setContent(contentString);
                    infoWindowS.open($scope.allValue.ct.map, $scope.allValue.mapMaker);

                }
                //==================================================地图列表导航事件==================================
                //search页面列表左侧导航设置 点击添加样式
                $scope.allValue.setListNav = function(n,str){
                    $scope.allValue.sln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : n,
                        nextEvent : false
                    });
                    $('.slp_list_load').show();
                    if($scope.allValue.jugeTemp){
                        //$scope.allValue.xy.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.xy.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.xy.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.xy.sort = str;
                        }
                        $scope.allValue.xy.page = 0;
                        $scope.allValue.getNextData = pFactory.postData({
                            url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/searchHouseByMap',
                            data: JSON.stringify($scope.allValue.xy),
                            callBack: function (data) {
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }
                            }
                        })
                    }else{
                        //$scope.allValue.param.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.param.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.param.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.param.sort = str;
                        }
                        //console.log(str)
                        $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                            data:JSON.stringify($scope.allValue.param),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }

                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                };

                //安全指数的事件
                $('.search_safe_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_safe_display').hide();
                    $scope.allValue.ct.map.overlayMapTypes.pop();
                });
                $('.search_hotel_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hotel_display').hide();
                    //console.log(hotelMarker.markerArr);
                    //hotelMarker.moveMap = false;
                    //hotelMarker.markerArr = sFactory.deleteMarker(hotelMarker.markerArr)
                    for(x in hotelMarker2.markerArr){
                        hotelMarker2.markerArr[x].setMap(null);
                    }
                    hotelMarker2 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#3c8df6',
                        tempArr : []
                    };
                });
                $('.search_hospital_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hospital_display').hide();
                    //hospitalMarker.moveMap = false;
                    for(x in hospitalMarker2.markerArr){
                        hospitalMarker2.markerArr[x].setMap(null);
                    }
                    hospitalMarker2 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#26cf5c',
                        tempArr : []
                    };
                });
                $('.search_supermarket_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_supermarket_display').hide();
                    //supermarketMarker.moveMap = false;
                    for(x in supermarketMarker2.markerArr){
                        supermarketMarker2.markerArr[x].setMap(null);
                    }
                    supermarketMarker2 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#a970ff',
                        tempArr : []
                    };
                });

                var service = new google.maps.places.PlacesService($scope.allValue.ct.map);
                function callbackHotel(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hotelMarker2.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker2.tempArr,results)
                        hotelMarker2.tempArr = hotelMarker2.tempArr.concat(newMarkerArr);
                        hotelMarker2.markerArr = hotelMarker2.markerArr.concat(sFactory.makeServiceDot({
                            color:hotelMarker2.color,
                            map:$scope.allValue.ct.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function callbackHospital(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hospitalMarker2.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker2.tempArr,results)
                        hospitalMarker2.tempArr = hospitalMarker2.tempArr.concat(newMarkerArr);
                        hospitalMarker2.markerArr = hospitalMarker2.markerArr.concat(sFactory.makeServiceDot({
                            color:hospitalMarker2.color,
                            map:$scope.allValue.ct.map,
                            arr:newMarkerArr
                        }))
                    }
                };
                function callbackSupermarket(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = supermarketMarker2.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker2.tempArr,results)
                        supermarketMarker2.tempArr = supermarketMarker2.tempArr.concat(newMarkerArr);
                        supermarketMarker2.markerArr = supermarketMarker2.markerArr.concat(sFactory.makeServiceDot({
                            color:supermarketMarker2.color,
                            map:$scope.allValue.ct.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function serviceFn(obj){
                    request = {
                        bounds:obj.bns,
                        types: obj.ty
                    };
                    service.nearbySearch(request, obj.cb);
                }
                $scope.allValue.blockFilter = function(str){
                    var _mapbounds = $scope.allValue.ct.map.getBounds();
                    /*
                     * 1 ---> crime
                     * 2 ---> Restaurant
                     * 3 ---> hospital
                     * 4 ---> Convenience
                     * */
                    if(str == 1){
                        crimeFn($scope.allValue.ct.map)
                    }else if(str == 2){
                        $('.search_safe_icon').hide();
                        $('.search_hotel_display').show();
                        hotelMarker2.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(str == 3){
                        $('.search_safe_icon').hide();
                        $('.search_hospital_display').show();
                        serviceFn({
                            bns:_mapbounds,
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                        hospitalMarker2.moveMap = true;
                    }else if(str == 4){
                        $('.search_safe_icon').hide();
                        $('.search_supermarket_display').show();
                        supermarketMarker2.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                }
            }
        });
    };

    var houseMarker3 = [];
    var suburbMarker3 = [];
    var cityMarker3 = [];
    var countryMarker3 = [];

    var tempHouseArr3 = [];
    var tempSuburbArr3 = [];
    var tempCityArr3 = [];

    var hotelMarker3 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker3 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker3 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };

    $('.search_select_suburb').on('click',function(){
        $('.select_item').hide();
        $('.select_tri').removeClass('select_open_tri')
        cityTemp = true;
        roomsTemp = true;
        schoolTemp = true;
        if(subsurbTemp){
            $('.search_select_suburbItem').show();
            $('.select_suburb_tri').addClass('select_open_tri');
        }else{
            $('.search_select_suburbItem').hide();
            $('.select_suburb_tri').removeClass('select_open_tri');
        }
        subsurbTemp = !subsurbTemp;
    });
    $scope.allValue.suburbClick = function(str){
        changeMapTemp = false;
        $scope.allValue.curSchool = "School";
        $('.search_safe_icon').show();
        $('.search_safe_display').hide();
        $('.search_safe_icon').unbind("click");
        $('.search_safe_close').unbind('click');
        $scope.allValue.c = null;
        $scope.allValue.ct = null;

        $scope.allValue.roomParam = {
            "all":true,
            "one":false,
            "two":false,
            "three":false,
            "four":false,
            "more":false
        }
        $('.select_rooms_show').text('Bedrooms')

        $('.search_select_suburbItem').hide();
        $('.slp_list_load').show();
        subsurbTemp = true;
        $scope.allValue.currentSuburb = str;
        $scope.allValue.suburbs = $scope.allValue.select.suburb[str];
        $('.select_suburb_tri').removeClass('select_open_tri')
        $scope.allValue.ln = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : 0,
            nextEvent : false
        });
        priceUpDown = true;
        $('.priceUp').css({'border-top-color':'gray'});
        $('.priceDown').css({'border-bottom-color':'gray'});
        $scope.allValue.schoolParam.sort = 'defalut';
        $scope.allValue.param.sort = 'default';
        $scope.allValue.param.name = str;
        $scope.allValue.param.level = 3;
        $scope.allValue.param.page = 0;
        $scope.allValue.jugeTemp = 0;

        $scope.allValue.param.bedroom = $scope.allValue.roomParam;
        angular.element('.slp_more_next').hide();
        angular.element('.slp_pre').hide();
        angular.element('.slp_next').show();

        mapZoom = setMapZoom($scope.allValue.param.level);
        $scope.allValue.suburbs = $scope.allValue.select.suburb[$scope.allValue.currentCity];
        $scope.allValue.schools = $scope.allValue.selectSchool[$scope.allValue.currentCity];

        $scope.allValue.getSearchData = pFactory.postData({
            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
            data:JSON.stringify($scope.allValue.param),
            callBack : function(data){
                //console.log(data);
                $scope.allValue.listHouse = data.data[0];
                $('.slp_list_load').hide();
                $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum
                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                if(data.data[0].houseInfo == 0 && data.data[0].mapInfo.length == 0){
                    angular.element('.noHouse').show();
                    $timeout(function(){
                        angular.element('.noHouse').hide();
                    },2000);
                }else{
                    //设置当前页和总共有多少页
                    $scope.allValue.listHouse.curPage += 1;
                    $scope.allValue.listHouse.maxPage += 1;
                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                }

                //创建地图 在接下来使用地图都试$scope.allValue.c.map
                $scope.allValue.mapOption = {
                    id:'search_map',
                    map:'searchMap',
                    position : {lat: data.data[0].basePoint[1], lng:data.data[0].basePoint[0]},
                    zoom: mapZoom,
                    wheelEvent : true
                }
                $scope.allValue.sb = pFactory.setSearchMap($scope.allValue.mapOption);

                if(data.data[0].houseInfo){
                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                    }
                }

                var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});

                houseMarker3 = [];
                suburbMarker3 = [];
                cityMarker3 = [];
                countryMarker3 = [];

                tempHouseArr3 = [];
                tempSuburbArr3 = [];
                tempCityArr3 = [];

                //首次进来的时候判断现在的level 决定地图显示marker的类型
                tempHouseArr3 = data.data[0].mapInfo;
                $scope.allValue.searchDot = sFactory.makeMapDot(data.data[0].mapInfo,$scope.allValue.sb.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                houseMarker3 = houseMarker3.concat($scope.allValue.searchDot);

                $scope.allValue.sb.map.addListener('dragend',function(){
                    $('.search_loading_wrap').show();
                    $('.slp_list_load').show();

                    $scope.allValue.jugeTemp = 1;
                    $('.slp_more_btn').eq(0).hide();
                    $('.slp_more_btn').eq(1).show();
                    $scope.allValue.xy = {
                        "zoom":$scope.allValue.sb.map.getZoom(),
                        "bounds": [$scope.allValue.sb.map.getBounds().getNorthEast().lng(),$scope.allValue.sb.map.getBounds().getNorthEast().lat(),$scope.allValue.sb.map.getBounds().getSouthWest().lng(),$scope.allValue.sb.map.getBounds().getSouthWest().lat()],
                        "page":0,
                        "sort":"default",
                        "isAllHouse":false
                    }
                    //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                    if(hotelMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(hospitalMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                    }else if(supermarketMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }
                    $scope.allValue.ln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : 0,
                        nextEvent : false
                    });
                    $scope.allValue.getSearchData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                        data:JSON.stringify($scope.allValue.xy),
                        callBack : function(data){
                            var timer = $interval(function(){
                                if(parseInt($('.loading_item').width()) >= 200){
                                    $('.search_loading_wrap').hide();
                                    $('.loading_item').css({'width':40});
                                    $('.loading_item_num').text(20);
                                    $interval.cancel(timer);

                                    $scope.allValue.listHouse = data.data[0];
                                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    if(data.data[0].mapInfo == 0){
                                        angular.element('.noHouse').show();
                                        $timeout(function(){
                                            angular.element('.noHouse').hide();
                                        },1500);
                                    }else {
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                        if($scope.allValue.listHouse.mapLevel == 4){
                                            var newMarker = pFactory.differentArr(tempHouseArr3,data.data[0].mapInfo)
                                            tempSuburbArr3 = [];
                                            tempCityArr3 = [];

                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);
                                            if(newMarker.length != 0){
                                                $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.sb.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                houseMarker3 = houseMarker3.concat($scope.allValue.searchDot);
                                                tempHouseArr3 = tempHouseArr3.concat(newMarker);
                                            }

                                        }else if($scope.allValue.listHouse.mapLevel==3){
                                            var newMarker = pFactory.differentArr(tempSuburbArr3,data.data[0].mapInfo)
                                            tempHouseArr3 = [];
                                            tempCityArr3 = [];

                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);
                                            if(newMarker.length != 0){
                                                tempSuburbArr3 = tempSuburbArr3.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++){
                                                    suburbMarker3.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.sb.map))
                                                }
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==2){
                                            var newMarker = pFactory.differentArr(tempCityArr3,data.data[0].mapInfo)
                                            tempHouseArr3 = [];
                                            tempSuburbArr3 = [];

                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);

                                            if(newMarker.length != 0){
                                                tempCityArr3 = tempCityArr3.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++) {
                                                    cityMarker3.push(sFactory.cityMarker(newMarker[m],$scope.allValue.sb.map));
                                                }
                                            }
                                        }else{
                                            tempHouseArr3 = [];
                                            tempSuburbArr3 = [];
                                            tempCityArr3 = [];
                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            if(countryMarker3.length == 0){
                                                countryMarker3.push(sFactory.countryMarker($scope.allValue.sb.map));
                                            }
                                        }
                                    }

                                }
                                $('.loading_item').css({'width':'+=20'});
                                $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                            },1);
                        }
                    })
                    //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                    $scope.allValue.preMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page -= 1;
                        angular.element('.slp_next').show();
                        if($scope.allValue.xy.page < 0){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                    $scope.allValue.nextMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page += 1;
                        angular.element('.slp_pre').show();
                        if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                            return
                        }else{
                            $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();


                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                });
                //=============================== 检测地图事件 ============================
                $scope.allValue.sb.map.addListener('zoom_changed',function(){
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null);
                        $scope.allValue.mapMaker = null;
                    }
                    $('.slp_list_load').show();
                    $('.search_loading_wrap').show();
                    $scope.allValue.jugeTemp = 1;
                    $('.slp_more_btn').eq(0).hide();
                    $('.slp_more_btn').eq(1).show();
                    $scope.allValue.xy = {
                        "zoom":$scope.allValue.sb.map.getZoom(),
                        "bounds": [$scope.allValue.sb.map.getBounds().getNorthEast().lng(),$scope.allValue.sb.map.getBounds().getNorthEast().lat(),$scope.allValue.sb.map.getBounds().getSouthWest().lng(),$scope.allValue.sb.map.getBounds().getSouthWest().lat()],
                        "page":0,
                        "sort":"default",
                        "isAllHouse":false
                    }

                    //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                    if(hotelMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(hospitalMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                    }else if(supermarketMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                    $scope.allValue.ln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : 0,
                        nextEvent : false
                    });
                    $scope.allValue.getSearchData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                        data:JSON.stringify($scope.allValue.xy),
                        callBack : function(data){
                            var timer = $interval(function(){
                                if(parseInt($('.loading_item').width()) >= 200){
                                    $('.search_loading_wrap').hide();
                                    $('.loading_item').css({'width':40});
                                    $('.loading_item_num').text(20);
                                    $interval.cancel(timer);
                                    //console.log(data.data[0])
                                    $scope.allValue.listHouse = data.data[0];
                                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    if(data.data[0].mapInfo.length == 0){
                                        angular.element('.noHouse').show();
                                        $timeout(function(){
                                            angular.element('.noHouse').hide();
                                        },1500);
                                    }else{
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                        if($scope.allValue.listHouse.mapLevel == 4){
                                            var newMarker = pFactory.differentArr(tempHouseArr3,data.data[0].mapInfo)
                                            tempSuburbArr3 = [];
                                            tempCityArr3 = [];

                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);
                                            if(newMarker.length != 0){
                                                $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.sb.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                houseMarker3 = houseMarker3.concat($scope.allValue.searchDot);
                                                tempHouseArr3 = tempHouseArr3.concat(newMarker);
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==3){
                                            var newMarker = pFactory.differentArr(tempSuburbArr3,data.data[0].mapInfo)
                                            tempHouseArr3 = [];
                                            tempCityArr3 = [];

                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);

                                            if(newMarker.length != 0){
                                                tempSuburbArr3 = tempSuburbArr3.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++){
                                                    suburbMarker3.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.sb.map))
                                                }
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel == 2){
                                            var newMarker = pFactory.differentArr(tempCityArr3,data.data[0].mapInfo)
                                            tempHouseArr3 = [];
                                            tempSuburbArr3 = [];

                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);

                                            if(newMarker.length != 0){
                                                tempCityArr3 = tempCityArr3.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++) {
                                                    cityMarker3.push(sFactory.cityMarker(newMarker[m],$scope.allValue.sb.map));
                                                }
                                            }
                                        }else{
                                            //console.log(data.data[0])
                                            tempHouseArr3 = [];
                                            tempSuburbArr3 = [];
                                            tempCityArr3 = [];
                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);

                                            if(countryMarker3.length == 0){
                                                countryMarker3.push(sFactory.countryMarker($scope.allValue.sb.map));
                                            }
                                        }
                                    }
                                }
                                $('.loading_item').css({'width':'+=20'});
                                $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                            },1);
                        }
                    })
                    //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                    $scope.allValue.preMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page -= 1;
                        angular.element('.slp_next').show();
                        if($scope.allValue.xy.page < 0){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                    $scope.allValue.nextMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page += 1;
                        angular.element('.slp_pre').show();
                        if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                });

                $scope.allValue.showView = function(obj,$event){
                    $event.stopPropagation();
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null);
                        $scope.allValue.mapMaker = null;
                    }
                    var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                        '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                        '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                        '<p class="map_info_price">'+obj.housePrice+'</p>' +
                        '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                        '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                        '</div></div>' +
                        '</a>';

                    if(houseMarker3){
                        for(x in houseMarker3){
                            if(obj._id == houseMarker3[x]._id){
                                houseMarker3[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                houseMarker3[x].name.zIndex = 3;
                                infoWindowS.setContent(contentString);
                                infoWindowS.open($scope.allValue.sb.map, houseMarker3[x].name);
                                return;
                            }
                        }
                    }


                    $scope.allValue.mapMaker = new google.maps.Marker({
                        position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                        title : obj.title,
                        icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                        map: $scope.allValue.sb.map,
                        zIndex:9
                    });
                    infoWindowS.setContent(contentString);
                    infoWindowS.open($scope.allValue.sb.map, $scope.allValue.mapMaker);
                    $scope.allValue.mapMaker.addListener('click', function() {
                        infoWindowS.setContent(contentString);
                        infoWindowS.open($scope.allValue.sb.map, $scope.allValue.mapMaker);
                    });
                }

                //==================================================地图列表导航事件==================================
                //search页面列表左侧导航设置 点击添加样式
                $scope.allValue.setListNav = function(n,str){
                    $scope.allValue.sln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : n,
                        nextEvent : false
                    });
                    $('.slp_list_load').show();
                    if($scope.allValue.jugeTemp){
                        //$scope.allValue.xy.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.xy.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.xy.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.xy.sort = str;
                        }
                        $scope.allValue.xy.page = 0;
                        $scope.allValue.getNextData = pFactory.postData({
                            url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/searchHouseByMap',
                            data: JSON.stringify($scope.allValue.xy),
                            callBack: function (data) {
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();
                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }
                            }
                        })
                    }else{
                        //$scope.allValue.param.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.param.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.param.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.param.sort = str;
                        }
                        $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                            data:JSON.stringify($scope.allValue.param),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();
                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }
                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                };

                //安全指数的事件
                $('.search_safe_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_safe_display').hide();
                    $scope.allValue.sb.map.overlayMapTypes.pop();
                });
                $('.search_hotel_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hotel_display').hide();
                    for(x in hotelMarker3.markerArr){
                        hotelMarker3.markerArr[x].setMap(null);
                    }
                    hotelMarker3 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#3c8df6',
                        tempArr : []
                    };
                });
                $('.search_hospital_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hospital_display').hide();
                    //hospitalMarker.moveMap = false;
                    for(x in hospitalMarker3.markerArr){
                        hospitalMarker3.markerArr[x].setMap(null);
                    }
                    hospitalMarker3 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#26cf5c',
                        tempArr : []
                    };
                });
                $('.search_supermarket_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_supermarket_display').hide();
                    //supermarketMarker.moveMap = false;
                    for(x in supermarketMarker3.markerArr){
                        supermarketMarker3.markerArr[x].setMap(null);
                    }
                    supermarketMarker3 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#a970ff',
                        tempArr : []
                    };
                });

                var service = new google.maps.places.PlacesService($scope.allValue.sb.map);
                function callbackHotel(results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hotelMarker3.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker3.tempArr,results)
                        hotelMarker3.tempArr = hotelMarker3.tempArr.concat(newMarkerArr);
                        hotelMarker3.markerArr = hotelMarker3.markerArr.concat(sFactory.makeServiceDot({
                            color:hotelMarker3.color,
                            map:$scope.allValue.sb.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function callbackHospital(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hospitalMarker3.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker3.tempArr,results)
                        hospitalMarker3.tempArr = hospitalMarker3.tempArr.concat(newMarkerArr);
                        hospitalMarker3.markerArr = hospitalMarker3.markerArr.concat(sFactory.makeServiceDot({
                            color:hospitalMarker3.color,
                            map:$scope.allValue.sb.map,
                            arr:newMarkerArr
                        }))
                    }
                };
                function callbackSupermarket(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = supermarketMarker3.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker3.tempArr,results)
                        supermarketMarker3.tempArr = supermarketMarker3.tempArr.concat(newMarkerArr);
                        supermarketMarker3.markerArr = supermarketMarker3.markerArr.concat(sFactory.makeServiceDot({
                            color:supermarketMarker3.color,
                            map:$scope.allValue.sb.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function serviceFn(obj){
                    request = {
                        bounds:obj.bns,
                        types: obj.ty
                    };
                    service.nearbySearch(request, obj.cb);
                }
                $scope.allValue.blockFilter = function(str){
                    var _mapbounds = $scope.allValue.sb.map.getBounds();
                    /*
                     * 1 ---> crime
                     * 2 ---> Restaurant
                     * 3 ---> hospital
                     * 4 ---> Convenience
                     * */
                    if(str == 1){
                        crimeFn($scope.allValue.sb.map)
                    }else if(str == 2){
                        $('.search_safe_icon').hide();
                        $('.search_hotel_display').show();
                        hotelMarker3.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(str == 3){
                        $('.search_safe_icon').hide();
                        $('.search_hospital_display').show();
                        serviceFn({
                            bns:_mapbounds,
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                        hospitalMarker3.moveMap = true;
                    }else if(str == 4){
                        $('.search_safe_icon').hide();
                        $('.search_supermarket_display').show();
                        supermarketMarker3.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                }
            }
        });
    };

    var houseMarker4 = [];
    var suburbMarker4 = [];
    var cityMarker4 = [];
    var countryMarker4 = [];

    var tempHouseArr4 = [];
    var tempSuburbArr4 = [];
    var tempCityArr4 = [];

    var hotelMarker4 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker4 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker4 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };

    var hotelMarker6 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker6 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker6 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };

    $('.search_select_rooms').on('click',function(){
        //console.log('a')
        $('.select_item').hide();
        $('.select_tri').removeClass('select_open_tri')
        cityTemp = true;
        subsurbTemp = true;
        schoolTemp = true;
        if(roomsTemp){
            $('.search_select_roomsItem').show();
            $('.select_rooms_tri').addClass('select_open_tri');
        }else{
            $('.search_select_roomsItem').hide();
            //stopPao = false;
            $('.select_rooms_tri').removeClass('select_open_tri');
        }
        roomsTemp = !roomsTemp;
    });
    $scope.allValue.selectRoom = function(str,$event){
        //$scope.allValue.curSchool = "School";
        $scope.allValue.ln = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : 0,
            nextEvent : false
        });
        priceUpDown = true;
        $('.priceUp').css({'border-top-color':'gray'})
        $('.priceDown').css({'border-bottom-color':'gray'})
        $scope.allValue.schoolParam.sort = 'defalut';
        $scope.allValue.param.sort = 'default';
        $('.search_safe_icon').unbind("click");
        $('.search_safe_close').unbind('click');
        $('.slp_list_load').show();
        $('.search_safe_icon').show();
        $('.search_safe_display').hide();
        if($scope.allValue.sr){
            $scope.allValue.sr.map.overlayMapTypes.pop();
        }

        $scope.allValue.param.page = 0;

        angular.element('.slp_pre').hide();

        var strTxt = "";
        roomsTemp = true;
        switch (str){
            case 'all':
                $scope.allValue.roomParam.one = false;
                $scope.allValue.roomParam.two = false;
                $scope.allValue.roomParam.three = false;
                $scope.allValue.roomParam.four = false;
                $scope.allValue.roomParam.more = false;
                $scope.allValue.roomParam.all = !$scope.allValue.roomParam.all;
                break;
            case 'one':
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.one = !$scope.allValue.roomParam.one;
                break;
            case 'two':
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.two = !$scope.allValue.roomParam.two;
                break;
            case 'three':
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.three = !$scope.allValue.roomParam.three;
                break;
            case 'four':
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.four = !$scope.allValue.roomParam.four;
                break;
            default:
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.more = !$scope.allValue.roomParam.more;
                break;
        }
        for(x in $scope.allValue.roomParam) {
            if ($scope.allValue.roomParam[x]) {
                strTxt += turnNumberForShow(x) + ','
            }
        }
        strTxt == "Unlimited," ? $('.select_rooms_show').text(strTxt) : $('.select_rooms_show').text(strTxt + "Bedrooms");
        $event.stopPropagation();

        if(!($scope.allValue.roomParam.one || $scope.allValue.roomParam.two || $scope.allValue.roomParam.three ||$scope.allValue.roomParam.four || $scope.allValue.roomParam.more || $scope.allValue.roomParam.all)){
            $scope.allValue.param.bedroom.all = true;
        }
        $scope.allValue.param.bedroom = $scope.allValue.roomParam;
        //当changeMapTemp为true 学区房中选择卧室
        //当当changeMapTemp为false时 普通选择
        if(changeMapTemp){
            $scope.allValue.getSearchData = pFactory.postData({
                url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getSchoolHouse',
                data: JSON.stringify($scope.allValue.schoolParam),
                callBack:function(data){
                    $('.slp_list_load').hide();
                    //创建地图 在接下来使用地图都试$scope.allValue.ss.map
                    $scope.allValue.schoolmapOption = {
                        id:'search_map',
                        map:'schoolMap',
                        position : {lat: data.data.geoCoordinatesPt[1], lng:data.data.geoCoordinatesPt[0]},
                        zoom: 14,
                        wheelEvent : true
                    }
                    $scope.allValue.listHouse.houseInfo = data.data.houseList;
                    $scope.allValue.totalHouseNum = data.data.houseList.length;
                    for(var sh = 0,len = data.data.houseList.length; sh < len; sh++){
                        data.data.houseList[sh].houseUpDate = myFactory.timeFormat(data.data.houseList[sh].listedDate)
                    }
                    //console.log($scope.allValue.listHouse.houseInfo);
                    $scope.allValue.listHouse.curPage = $scope.allValue.listHouse.maxPage = 1;
                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                    $scope.allValue.ss = pFactory.setSearchMap($scope.allValue.schoolmapOption);

                    $scope.allValue.schoolCircle = sFactory.circleSchool(data.data.geoCoordinates)
                    $scope.allValue.schoolCircle.setMap($scope.allValue.ss.map);

                    var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});
                    tempHouseArr5 = data.data.houseList;
                    //console.log(tempHouseArr);
                    $scope.allValue.searchShoolDot = sFactory.makeMapDot(tempHouseArr5,$scope.allValue.ss.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                    houseMarker5 = $scope.allValue.searchShoolDot;
                    //点击左侧列表项 地图显示相应的房子
                    $scope.allValue.showView = function(obj,$event){
                        $event.stopPropagation();
                        //console.log(houseMarker5)
                        if($scope.allValue.mapMaker){
                            $scope.allValue.mapMaker.setMap(null)
                            $scope.allValue.mapMaker = null;
                        }
                        var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                            '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                            '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                            '<p class="map_info_price">'+obj.housePrice+'</p>' +
                            '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                            '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                            '</div></div>' +
                            '</a>';
                        if(houseMarker5){
                            for(x in houseMarker5){
                                if(obj._id == houseMarker5[x]._id){
                                    //console.log('a')
                                    houseMarker5[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                    houseMarker5[x].name.zIndex = 3;
                                    infoWindowS.setContent(contentString);
                                    infoWindowS.open($scope.allValue.ss.map, houseMarker5[x].name);
                                    return;
                                }
                            }
                        }
                        $scope.allValue.mapMaker = new google.maps.Marker({
                            position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                            title : obj.title,
                            icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                            map: $scope.allValue.ss.map,
                            zIndex:9
                        });
                        infoWindowS.setContent(contentString);
                        infoWindowS.open($scope.allValue.ss.map, $scope.allValue.mapMaker);
                        $scope.allValue.mapMaker.addListener('click', function() {
                            infoWindowS.setContent(contentString);
                            infoWindowS.open($scope.allValue.ss.map, $scope.allValue.mapMaker);
                        });

                    };

                    $scope.allValue.setListNav = function(n,str){
                        $scope.allValue.sln = myFactory.addClassName({
                            itemSmall : '.slp_nav>ol>li',
                            name : 'slp_nav_actived',
                            num : n,
                            nextEvent : false
                        });
                        $('.slp_list_load').show();
                        //$scope.allValue.schoolParam.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.schoolParam.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.schoolParam.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.schoolParam.sort = str;
                        }
                        $scope.allValue.getSearchData = pFactory.postData({
                            url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getSchoolHouse',
                            data: JSON.stringify($scope.allValue.schoolParam),
                            callBack: function (data) {
                                $('.slp_list_load').hide();
                                $scope.allValue.listHouse.houseInfo = data.data.houseList;
                                for(var sh1 = 0,len = data.data.houseList.length; sh1 < len; sh1++){
                                    data.data.houseList[sh1].houseUpDate = myFactory.timeFormat(data.data.houseList[sh1].listedDate)
                                }
                            }
                        })
                    };

                       //安全指数的事件
                    $('.search_safe_close').on('click',function(){
                        $('.search_safe_icon').show();
                        $('.search_safe_display').hide();
                        $scope.allValue.ss.map.overlayMapTypes.pop();
                    });
                    $('.search_hotel_close').on('click',function(){
                        $('.search_safe_icon').show();
                        $('.search_hotel_display').hide();
                        for(x in hotelMarker6.markerArr){
                            hotelMarker6.markerArr[x].setMap(null);
                        }
                        hotelMarker6 = {
                            markerArr : [],
                            moveMap : false,
                            color:'#3c8df6',
                            tempArr : []
                        };
                    });
                    $('.search_hospital_close').on('click',function(){
                        $('.search_safe_icon').show();
                        $('.search_hospital_display').hide();
                        //hospitalMarker.moveMap = false;
                        for(x in hospitalMarker6.markerArr){
                            hospitalMarker6.markerArr[x].setMap(null);
                        }
                        hospitalMarker6 = {
                            markerArr : [],
                            moveMap : false,
                            color:'#26cf5c',
                            tempArr : []
                        };
                    });
                    $('.search_supermarket_close').on('click',function(){
                        $('.search_safe_icon').show();
                        $('.search_supermarket_display').hide();
                        //supermarketMarker.moveMap = false;
                        for(x in supermarketMarker6.markerArr){
                            supermarketMarker6.markerArr[x].setMap(null);
                        }
                        supermarketMarker6 = {
                            markerArr : [],
                            moveMap : false,
                            color:'#a970ff',
                            tempArr : []
                        };
                    });

                    var service = new google.maps.places.PlacesService($scope.allValue.ss.map);
                    function callbackHotel(results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var newMarkerArr = hotelMarker6.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker6.tempArr,results)
                            hotelMarker6.tempArr = hotelMarker6.tempArr.concat(newMarkerArr);
                            hotelMarker6.markerArr = hotelMarker6.markerArr.concat(sFactory.makeServiceDot({
                                color:hotelMarker6.color,
                                map:$scope.allValue.ss.map,
                                arr:newMarkerArr
                            }))

                        }
                    };
                    function callbackHospital(results, status) {

                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var newMarkerArr = hospitalMarker6.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker6.tempArr,results)
                            hospitalMarker6.tempArr = hospitalMarker6.tempArr.concat(newMarkerArr);
                            hospitalMarker6.markerArr = hospitalMarker6.markerArr.concat(sFactory.makeServiceDot({
                                color:hospitalMarker6.color,
                                map:$scope.allValue.ss.map,
                                arr:newMarkerArr
                            }))
                        }
                    };
                    function callbackSupermarket(results, status) {

                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var newMarkerArr = supermarketMarker6.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker6.tempArr,results)
                            supermarketMarker6.tempArr = supermarketMarker6.tempArr.concat(newMarkerArr);
                            supermarketMarker6.markerArr = supermarketMarker6.markerArr.concat(sFactory.makeServiceDot({
                                color:supermarketMarker6.color,
                                map:$scope.allValue.ss.map,
                                arr:newMarkerArr
                            }))

                        }
                    };
                    function serviceFn(obj){
                        request = {
                            bounds:obj.bns,
                            types: obj.ty
                        };
                        service.nearbySearch(request, obj.cb);
                    }
                    $scope.allValue.blockFilter = function(str){
                        var _mapbounds = $scope.allValue.ss.map.getBounds();
                        /*
                         * 1 ---> crime
                         * 2 ---> Restaurant
                         * 3 ---> hospital
                         * 4 ---> Convenience
                         * */
                        if(str == 1){
                            crimeFn($scope.allValue.ss.map)
                        }else if(str == 2){
                            $('.search_safe_icon').hide();
                            $('.search_hotel_display').show();
                            hotelMarker5.moveMap = true;
                            serviceFn({
                                bns:_mapbounds,
                                ty:['restaurant'],
                                cb:callbackHotel
                            })
                        }else if(str == 3){
                            $('.search_safe_icon').hide();
                            $('.search_hospital_display').show();
                            serviceFn({
                                bns:_mapbounds,
                                ty:['hospital'],
                                cb:callbackHospital
                            });
                            hospitalMarker5.moveMap = true;
                        }else if(str == 4){
                            $('.search_safe_icon').hide();
                            $('.search_supermarket_display').show();
                            supermarketMarker5.moveMap = true;
                            serviceFn({
                                bns:_mapbounds,
                                ty:['convenience_store'],
                                cb:callbackSupermarket
                            })
                        }

                    }
                }
            })
        }else{
            $scope.allValue.getSearchData = pFactory.postData({
                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                data:JSON.stringify($scope.allValue.param),
                callBack : function(data){
                    $scope.allValue.listHouse = data.data[0];
                    $('.slp_list_load').hide();
                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum
                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                    if(data.data[0].houseInfo == 0 && data.data[0].mapInfo.length == 0){
                        angular.element('.noHouse').show();
                        $timeout(function(){
                            angular.element('.noHouse').hide();
                        },2000);
                    }else{
                        //设置当前页和总共有多少页
                        $scope.allValue.listHouse.curPage += 1;
                        $scope.allValue.listHouse.maxPage += 1;
                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                    }

                    if(data.data[0].mapLevel != 4 && $scope.allValue.sr){
                        return;
                    }else{
                        $scope.allValue.sr = null;
                        //创建地图 在接下来使用地图都试$scope.allValue.c.map
                        $scope.allValue.mapOption = {
                            id:'search_map',
                            map:'searchMap',
                            position : {lat: data.data[0].basePoint[1], lng:data.data[0].basePoint[0]},
                            zoom: setMapZoom((data.data[0].mapLevel - 1)),
                            wheelEvent : true
                        }
                        $scope.allValue.sr = pFactory.setSearchMap($scope.allValue.mapOption);

                        if(data.data[0].houseInfo){
                            for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                            }
                        }

                        var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});

                        houseMarker4 = [];
                        suburbMarker4 = [];
                        cityMarker4 = [];
                        countryMarker4 = [];

                        tempHouseArr4 = [];
                        tempSuburbArr4 = [];
                        tempCityArr4 = [];

                        /*
                         4 显示house
                         3 显示suburb
                         2 显示city
                         */
                        if(data.data[0].mapLevel == 2){
                            //console.log('a')
                            tempCityArr4 = data.data[0].mapInfo;
                            for(var m = 0,len=data.data[0].mapInfo.length; m < len; m++){
                                cityMarker4.push(sFactory.cityMarker(data.data[0].mapInfo[m],$scope.allValue.sr.map));
                            }
                        }
                        if(data.data[0].mapLevel == 3){
                            //console.log('a')
                            tempSuburbArr4 = data.data[0].mapInfo;
                            for(var m = 0,len=data.data[0].mapInfo.length; m < len; m++){
                                suburbMarker4.push(sFactory.suburbMarker(data.data[0].mapInfo[m],$scope.allValue.sr.map));
                            }
                        }
                        if(data.data[0].mapLevel == 4){
                            tempHouseArr4 = data.data[0].mapInfo;
                            //console.log(tempHouseArr);
                            $scope.allValue.searchDot = sFactory.makeMapDot(data.data[0].mapInfo,$scope.allValue.sr.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                            houseMarker4 = houseMarker4.concat($scope.allValue.searchDot);
                        }

                        $scope.allValue.sr.map.addListener('dragend',function(){
                            $('.search_loading_wrap').show();
                            $('.slp_list_load').show();

                            $scope.allValue.jugeTemp = 1;
                            $('.slp_more_btn').eq(0).hide();
                            $('.slp_more_btn').eq(1).show();
                            $scope.allValue.xy = {
                                "zoom":$scope.allValue.sr.map.getZoom(),
                                "bounds": [$scope.allValue.sr.map.getBounds().getNorthEast().lng(),$scope.allValue.sr.map.getBounds().getNorthEast().lat(),$scope.allValue.sr.map.getBounds().getSouthWest().lng(),$scope.allValue.sr.map.getBounds().getSouthWest().lat()],
                                "page":0,
                                "sort":"default",
                                "isAllHouse":false
                            }

                            //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                            if(hotelMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['restaurant'],
                                    cb:callbackHotel
                                })
                            }else if(hospitalMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['hospital'],
                                    cb:callbackHospital
                                });
                            }else if(supermarketMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['convenience_store'],
                                    cb:callbackSupermarket
                                })
                            }

                            $scope.allValue.xy.bedroom = $scope.allValue.roomParam;
                            $scope.allValue.ln = myFactory.addClassName({
                                itemSmall : '.slp_nav>ol>li',
                                name : 'slp_nav_actived',
                                num : 0,
                                nextEvent : false
                            });
                            $scope.allValue.getSearchData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    var timer = $interval(function(){
                                        if(parseInt($('.loading_item').width()) >= 200){
                                            $('.search_loading_wrap').hide();
                                            $('.loading_item').css({'width':40});
                                            $('.loading_item_num').text(20);
                                            $interval.cancel(timer);

                                            $scope.allValue.listHouse = data.data[0];
                                            $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                            if(data.data[0].mapInfo == 0){
                                                angular.element('.noHouse').show();
                                                $timeout(function(){
                                                    angular.element('.noHouse').hide();
                                                },1500);
                                            }else {
                                                //设置当前页和总共有多少页
                                                $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                                if($scope.allValue.listHouse.mapLevel == 4){
                                                    var newMarker = pFactory.differentArr(tempHouseArr4,data.data[0].mapInfo)
                                                    tempSuburbArr4 = [];
                                                    tempCityArr4 = [];

                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);
                                                    if(newMarker.length != 0){
                                                        $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.sr.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                        houseMarker4 = houseMarker4.concat($scope.allValue.searchDot);
                                                        tempHouseArr4 = tempHouseArr4.concat(newMarker);
                                                    }

                                                }else if($scope.allValue.listHouse.mapLevel==3){
                                                    var newMarker = pFactory.differentArr(tempSuburbArr4,data.data[0].mapInfo)
                                                    tempHouseArr4 = [];
                                                    tempCityArr4 = [];

                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);
                                                    if(newMarker.length != 0){
                                                        tempSuburbArr4 = tempSuburbArr4.concat(newMarker);
                                                        for(var m = 0,len = newMarker.length; m < len; m++){
                                                            suburbMarker4.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.sr.map))
                                                        }
                                                    }
                                                }else if($scope.allValue.listHouse.mapLevel==2){
                                                    var newMarker = pFactory.differentArr(tempCityArr4,data.data[0].mapInfo)
                                                    tempHouseArr4 = [];
                                                    tempSuburbArr4 = [];

                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);

                                                    if(newMarker.length != 0){
                                                        tempCityArr4 = tempCityArr4.concat(newMarker);
                                                        for(var m = 0,len = newMarker.length; m < len; m++) {
                                                            cityMarker4.push(sFactory.cityMarker(newMarker[m],$scope.allValue.sr.map));
                                                        }
                                                    }
                                                }else{
                                                    tempHouseArr4 = [];
                                                    tempSuburbArr4 = [];
                                                    tempCityArr4 = [];
                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    if(countryMarker4.length == 0){
                                                        countryMarker4.push(sFactory.countryMarker($scope.allValue.sr.map));
                                                    }
                                                }
                                            }

                                        }
                                        $('.loading_item').css({'width':'+=20'});
                                        $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                                    },1);
                                }
                            })
                            //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                            $scope.allValue.preMapPage = function(){
                                $('.slp_list_load').show();
                                $scope.allValue.xy.page -= 1;
                                angular.element('.slp_next').show();
                                if($scope.allValue.xy.page < 0){
                                    $('.slp_list_load').hide();
                                    return
                                }else{
                                    $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                                    $scope.allValue.getNextData = pFactory.postData({
                                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                        data:JSON.stringify($scope.allValue.xy),
                                        callBack : function(data){
                                            $scope.allValue.listHouse = data.data[0];
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                            //设置当前页和总共有多少页
                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                        }
                                    });
                                }
                            }
                            $scope.allValue.nextMapPage = function(){
                                $('.slp_list_load').show();
                                $scope.allValue.xy.page += 1;
                                angular.element('.slp_pre').show();
                                if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                                    return
                                }else{
                                    $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                                    $scope.allValue.getNextData = pFactory.postData({
                                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                        data:JSON.stringify($scope.allValue.xy),
                                        callBack : function(data){
                                            $scope.allValue.listHouse = data.data[0];
                                            $('.slp_list_load').hide();


                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)

                                                }
                                            }

                                            //设置当前页和总共有多少页
                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                        }
                                    });
                                }
                            }
                        });
                        //=============================== 检测地图事件 ============================
                        $scope.allValue.sr.map.addListener('zoom_changed',function(){
                            if($scope.allValue.mapMaker){
                                $scope.allValue.mapMaker.setMap(null);
                                $scope.allValue.mapMaker = null;
                            }
                            $('.slp_list_load').show();
                            $('.search_loading_wrap').show();
                            $scope.allValue.jugeTemp = 1;
                            $('.slp_more_btn').eq(0).hide();
                            $('.slp_more_btn').eq(1).show();
                            $scope.allValue.xy = {
                                "zoom":$scope.allValue.sr.map.getZoom(),
                                "bounds": [$scope.allValue.sr.map.getBounds().getNorthEast().lng(),$scope.allValue.sr.map.getBounds().getNorthEast().lat(),$scope.allValue.sr.map.getBounds().getSouthWest().lng(),$scope.allValue.sr.map.getBounds().getSouthWest().lat()],
                                "page":0,
                                "sort":"default",
                                "isAllHouse":false
                            }

                            //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                            if(hotelMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['restaurant'],
                                    cb:callbackHotel
                                })
                            }else if(hospitalMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['hospital'],
                                    cb:callbackHospital
                                });
                            }else if(supermarketMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['convenience_store'],
                                    cb:callbackSupermarket
                                })
                            }

                            $scope.allValue.xy.bedroom = $scope.allValue.roomParam;
                            $scope.allValue.ln = myFactory.addClassName({
                                itemSmall : '.slp_nav>ol>li',
                                name : 'slp_nav_actived',
                                num : 0,
                                nextEvent : false
                            });
                            $scope.allValue.getSearchData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    var timer = $interval(function(){
                                        if(parseInt($('.loading_item').width()) >= 200){
                                            $('.search_loading_wrap').hide();
                                            $('.loading_item').css({'width':40});
                                            $('.loading_item_num').text(20);
                                            $interval.cancel(timer);
                                            //console.log(data.data[0])
                                            $scope.allValue.listHouse = data.data[0];
                                            $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                            if(data.data[0].mapInfo.length == 0){
                                                angular.element('.noHouse').show();
                                                $timeout(function(){
                                                    angular.element('.noHouse').hide();
                                                },1500);
                                            }else{
                                                //设置当前页和总共有多少页
                                                $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                                if($scope.allValue.listHouse.mapLevel == 4){
                                                    var newMarker = pFactory.differentArr(tempHouseArr4,data.data[0].mapInfo)
                                                    tempSuburbArr4 = [];
                                                    tempCityArr4 = [];

                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);
                                                    if(newMarker.length != 0){
                                                        $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.sr.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                        houseMarker4 = houseMarker4.concat($scope.allValue.searchDot);
                                                        tempHouseArr4 = tempHouseArr4.concat(newMarker);
                                                    }
                                                }else if($scope.allValue.listHouse.mapLevel==3){
                                                    var newMarker = pFactory.differentArr(tempSuburbArr4,data.data[0].mapInfo)
                                                    tempHouseArr4 = [];
                                                    tempCityArr4 = [];

                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);

                                                    if(newMarker.length != 0){
                                                        tempSuburbArr4 = tempSuburbArr3.concat(newMarker);
                                                        for(var m = 0,len = newMarker.length; m < len; m++){
                                                            suburbMarker4.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.sr.map))
                                                        }
                                                    }
                                                }else if($scope.allValue.listHouse.mapLevel == 2){
                                                    var newMarker = pFactory.differentArr(tempCityArr4,data.data[0].mapInfo)
                                                    tempHouseArr4 = [];
                                                    tempSuburbArr4 = [];

                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);

                                                    if(newMarker.length != 0){
                                                        tempCityArr4 = tempCityArr4.concat(newMarker);
                                                        for(var m = 0,len = newMarker.length; m < len; m++) {
                                                            cityMarker4.push(sFactory.cityMarker(newMarker[m],$scope.allValue.sr.map));
                                                        }
                                                    }
                                                }else{
                                                    //console.log(data.data[0])
                                                    tempHouseArr4 = [];
                                                    tempSuburbArr4 = [];
                                                    tempCityArr4 = [];
                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);

                                                    if(countryMarker4.length == 0){
                                                        countryMarker4.push(sFactory.countryMarker($scope.allValue.sr.map));
                                                    }
                                                }
                                            }
                                        }
                                        $('.loading_item').css({'width':'+=20'});
                                        $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                                    },1);
                                }
                            })
                            //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                            $scope.allValue.preMapPage = function(){
                                $('.slp_list_load').show();
                                $scope.allValue.xy.page -= 1;
                                angular.element('.slp_next').show();
                                if($scope.allValue.xy.page < 0){
                                    $('.slp_list_load').hide();
                                    return
                                }else{
                                    $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                                    $scope.allValue.getNextData = pFactory.postData({
                                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                        data:JSON.stringify($scope.allValue.xy),
                                        callBack : function(data){
                                            $scope.allValue.listHouse = data.data[0];
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                            //设置当前页和总共有多少页
                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                        }
                                    });
                                }
                            }
                            $scope.allValue.nextMapPage = function(){
                                $('.slp_list_load').show();
                                $scope.allValue.xy.page += 1;
                                angular.element('.slp_pre').show();
                                if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                                    $('.slp_list_load').hide();
                                    return
                                }else{
                                    $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                                    $scope.allValue.getNextData = pFactory.postData({
                                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                        data:JSON.stringify($scope.allValue.xy),
                                        callBack : function(data){
                                            $scope.allValue.listHouse = data.data[0];
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            //设置当前页和总共有多少页
                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                        }
                                    });
                                }
                            }
                        });

                        $scope.allValue.showView = function(obj,$event){
                            $event.stopPropagation();
                            if($scope.allValue.mapMaker){
                                $scope.allValue.mapMaker.setMap(null);
                                $scope.allValue.mapMaker = null;
                            }
                            var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                                '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                                '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                                '<p class="map_info_price">'+obj.housePrice+'</p>' +
                                '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                                '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                                '</div></div>' +
                                '</a>';

                            if(houseMarker4){
                                for(x in houseMarker4){
                                    if(obj._id == houseMarker4[x]._id){
                                        houseMarker4[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                        houseMarker4[x].name.zIndex = 3;
                                        infoWindowS.setContent(contentString);
                                        infoWindowS.open($scope.allValue.sr.map, houseMarker4[x].name);
                                        return;
                                    }
                                }
                            }


                            $scope.allValue.mapMaker = new google.maps.Marker({
                                position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                                title : obj.title,
                                icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                                map: $scope.allValue.sr.map,
                                zIndex:9
                            });
                            infoWindowS.setContent(contentString);
                            infoWindowS.open($scope.allValue.sr.map, $scope.allValue.mapMaker);
                            $scope.allValue.mapMaker.addListener('click', function() {
                                infoWindowS.setContent(contentString);
                                infoWindowS.open($scope.allValue.sr.map, $scope.allValue.mapMaker);
                            });
                        }

                        //==================================================地图列表导航事件==================================
                        //search页面列表左侧导航设置 点击添加样式
                        $scope.allValue.setListNav = function(n,str){
                            $scope.allValue.sln = myFactory.addClassName({
                                itemSmall : '.slp_nav>ol>li',
                                name : 'slp_nav_actived',
                                num : n,
                                nextEvent : false
                            });
                            $('.slp_list_load').show();
                            //$scope.allValue.param.sort = str;
                            if(n == 2){
                                if(priceUpDown){
                                    $scope.allValue.param.sort = 'priceUp';
                                    $('.priceUp').css({'border-top-color':'brown'})
                                    $('.priceDown').css({'border-bottom-color':'gray'})
                                }else{
                                    $scope.allValue.param.sort = 'priceDown';
                                    $('.priceUp').css({'border-top-color':'gray'})
                                    $('.priceDown').css({'border-bottom-color':'brown'})
                                }
                                priceUpDown = !priceUpDown;
                            }else{
                                $scope.allValue.param.sort = str;
                            }
                            $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                                data:JSON.stringify($scope.allValue.param),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();
                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        };


                        //安全指数的事件
                        $('.search_safe_close').on('click',function(){
                            $('.search_safe_icon').show();
                            $('.search_safe_display').hide();
                            $scope.allValue.sr.map.overlayMapTypes.pop();
                        });
                        $('.search_hotel_close').on('click',function(){
                            $('.search_safe_icon').show();
                            $('.search_hotel_display').hide();
                            for(x in hotelMarker4.markerArr){
                                hotelMarker4.markerArr[x].setMap(null);
                            }
                            hotelMarker4 = {
                                markerArr : [],
                                moveMap : false,
                                color:'#3c8df6',
                                tempArr : []
                            };
                        });
                        $('.search_hospital_close').on('click',function(){
                            $('.search_safe_icon').show();
                            $('.search_hospital_display').hide();
                            //hospitalMarker.moveMap = false;
                            for(x in hospitalMarker4.markerArr){
                                hospitalMarker4.markerArr[x].setMap(null);
                            }
                            hospitalMarker4 = {
                                markerArr : [],
                                moveMap : false,
                                color:'#26cf5c',
                                tempArr : []
                            };
                        });
                        $('.search_supermarket_close').on('click',function(){
                            $('.search_safe_icon').show();
                            $('.search_supermarket_display').hide();
                            //supermarketMarker.moveMap = false;
                            for(x in supermarketMarker4.markerArr){
                                supermarketMarker4.markerArr[x].setMap(null);
                            }
                            supermarketMarker4 = {
                                markerArr : [],
                                moveMap : false,
                                color:'#a970ff',
                                tempArr : []
                            };
                        });

                        var service = new google.maps.places.PlacesService($scope.allValue.sr.map);
                        function callbackHotel(results, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var newMarkerArr = hotelMarker4.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker4.tempArr,results)
                                hotelMarker4.tempArr = hotelMarker4.tempArr.concat(newMarkerArr);
                                hotelMarker4.markerArr = hotelMarker4.markerArr.concat(sFactory.makeServiceDot({
                                    color:hotelMarker4.color,
                                    map:$scope.allValue.sr.map,
                                    arr:newMarkerArr
                                }))

                            }
                        };
                        function callbackHospital(results, status) {

                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var newMarkerArr = hospitalMarker4.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker4.tempArr,results)
                                hospitalMarker4.tempArr = hospitalMarker4.tempArr.concat(newMarkerArr);
                                hospitalMarker4.markerArr = hospitalMarker4.markerArr.concat(sFactory.makeServiceDot({
                                    color:hospitalMarker4.color,
                                    map:$scope.allValue.sr.map,
                                    arr:newMarkerArr
                                }))
                            }
                        };
                        function callbackSupermarket(results, status) {

                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var newMarkerArr = supermarketMarker4.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker4.tempArr,results)
                                supermarketMarker4.tempArr = supermarketMarker4.tempArr.concat(newMarkerArr);
                                supermarketMarker4.markerArr = supermarketMarker4.markerArr.concat(sFactory.makeServiceDot({
                                    color:supermarketMarker4.color,
                                    map:$scope.allValue.sr.map,
                                    arr:newMarkerArr
                                }))

                            }
                        };
                        function serviceFn(obj){
                            request = {
                                bounds:obj.bns,
                                types: obj.ty
                            };
                            service.nearbySearch(request, obj.cb);
                        }
                        $scope.allValue.blockFilter = function(str){
                            var _mapbounds = $scope.allValue.sr.map.getBounds();
                            /*
                             * 1 ---> crime
                             * 2 ---> Restaurant
                             * 3 ---> hospital
                             * 4 ---> Convenience
                             * */
                            if(str == 1){
                                crimeFn($scope.allValue.sr.map)
                            }else if(str == 2){
                                $('.search_safe_icon').hide();
                                $('.search_hotel_display').show();
                                hotelMarker4.moveMap = true;
                                serviceFn({
                                    bns:_mapbounds,
                                    ty:['restaurant'],
                                    cb:callbackHotel
                                })
                            }else if(str == 3){
                                $('.search_safe_icon').hide();
                                $('.search_hospital_display').show();
                                serviceFn({
                                    bns:_mapbounds,
                                    ty:['hospital'],
                                    cb:callbackHospital
                                });
                                hospitalMarker4.moveMap = true;
                            }else if(str == 4){
                                $('.search_safe_icon').hide();
                                $('.search_supermarket_display').show();
                                supermarketMarker4.moveMap = true;
                                serviceFn({
                                    bns:_mapbounds,
                                    ty:['convenience_store'],
                                    cb:callbackSupermarket
                                })
                            }

                        }
                        $scope.allValue.jugeTemp = 1;
                        $('.slp_more_btn').eq(0).hide();
                        $('.slp_more_btn').eq(1).show();
                        //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                        $scope.allValue.preMapPage = function(){
                            $('.slp_list_load').show();
                            $scope.allValue.param.page -= 1;
                            angular.element('.slp_next').show();
                            if($scope.allValue.param.page < 0){
                                $('.slp_list_load').hide();
                                return
                            }else{
                                $scope.allValue.param.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                                $scope.allValue.getNextData = pFactory.postData({
                                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                                    data:JSON.stringify($scope.allValue.param),
                                    callBack : function(data){
                                        $scope.allValue.listHouse = data.data[0];
                                        $('.slp_list_load').hide();

                                        if(data.data[0].houseInfo){
                                            for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            }
                                        }

                                        //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.curPage += 1;
                                        $scope.allValue.listHouse.maxPage += 1;
                                    }
                                });
                            }
                        }
                        $scope.allValue.nextMapPage = function(){
                            $('.slp_list_load').show();
                            $scope.allValue.param.page += 1;
                            angular.element('.slp_pre').show();
                            if($scope.allValue.param.page > $scope.allValue.listHouse.maxPage-1){
                                $('.slp_list_load').hide();
                                return
                            }else{
                                $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                                $scope.allValue.getNextData = pFactory.postData({
                                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                                    data:JSON.stringify($scope.allValue.param),
                                    callBack : function(data){
                                        $scope.allValue.listHouse = data.data[0];
                                        $('.slp_list_load').hide();

                                        if(data.data[0].houseInfo){
                                            for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            }
                                        }

                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.curPage += 1;
                                        $scope.allValue.listHouse.maxPage += 1;
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }

    };
    function turnNumberForShow(str){
        switch (str){
            case 'all':
                return 'Unlimited';
                break;
            case 'one':
                return '1';
                break;
            case 'two':
                return '2';
                break;
            case 'three':
                return '3';
                break;
            case 'four':
                return '4';
                break;
            default:
                return '>4';
                break;
        }
    }

    var houseMarker5 = [];

    var tempHouseArr5 = [];

    var hotelMarker5 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker5 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker5 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };


    $('.search_select_school').on('click',function(){
        //console.log('a')
        $('.select_item').hide();
        $('.select_tri').removeClass('select_open_tri')
        cityTemp = true;
        subsurbTemp = true;
        roomTemp = true;
        if(schoolTemp){
            $('.search_select_schoolItem').show();
            $('.select_school_tri').addClass('select_open_tri');
        }else{
            $('.search_select_schoolItem').hide();
            //stopPao = false;
            $('.select_school_tri').removeClass('select_open_tri');
        }
        schoolTemp = !schoolTemp;
    });
    $scope.allValue.schoolClick = function(s){
        //console.log(a)
        $scope.allValue.ln = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : 0,
            nextEvent : false
        });
        priceUpDown = true;
        $('.priceUp').css({'border-top-color':'gray'})
        $('.priceDown').css({'border-bottom-color':'gray'})
        $scope.allValue.schoolParam.sort = 'defalut';
        $scope.allValue.param.sort = 'default';
        $scope.allValue.roomParam = {
            "all":true,
            "one":false,
            "two":false,
            "three":false,
            "four":false,
            "more":false
        }
        $('.select_rooms_show').text('Bedrooms');
        $('.search_safe_icon').unbind("click");
        $('.search_safe_close').unbind('click');
        $scope.allValue.curSchool = s.name;
        changeMapTemp = true;
        $('.slp_list_load').show();
        $('.search_safe_icon').show();
        $('.search_safe_display').hide();
        if($scope.allValue.ss){
            $scope.allValue.ss.map.overlayMapTypes.pop();
        }
        angular.element('.slp_pre').hide();
        $scope.allValue.schoolParam.id = s.id;
        $scope.allValue.schoolParam.bedroom = $scope.allValue.roomParam;

        $scope.allValue.getSearchData = pFactory.postData({
            url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getSchoolHouse',
            data: JSON.stringify($scope.allValue.schoolParam),
            callBack:function(data){
                //console.log(data.data)
                //console.log(data.data.geoCoordinatesPt);
                //console.log(data.data);
                $('.slp_list_load').hide();
                for(var sh = 0,len = data.data.houseList.length; sh < len; sh++){
                    data.data.houseList[sh].houseUpDate = myFactory.timeFormat(data.data.houseList[sh].listedDate)
                }
                //创建地图 在接下来使用地图都试$scope.allValue.ss.map
                $scope.allValue.schoolmapOption = {
                    id:'search_map',
                    map:'schoolMap',
                    position : {lat: data.data.geoCoordinatesPt[1], lng:data.data.geoCoordinatesPt[0]},
                    zoom: 14,
                    wheelEvent : true
                }
                $scope.allValue.listHouse.houseInfo = data.data.houseList;
                $scope.allValue.totalHouseNum = data.data.houseList.length;
                //console.log($scope.allValue.listHouse.houseInfo);
                $scope.allValue.listHouse.curPage = $scope.allValue.listHouse.maxPage = 1;
                $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                $scope.allValue.ss = pFactory.setSearchMap($scope.allValue.schoolmapOption);

                $scope.allValue.schoolCircle = sFactory.circleSchool(data.data.geoCoordinates)
                $scope.allValue.schoolCircle.setMap($scope.allValue.ss.map);

                var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});
                tempHouseArr5 = data.data.houseList;
                //console.log(tempHouseArr);
                $scope.allValue.searchShoolDot = sFactory.makeMapDot(tempHouseArr5,$scope.allValue.ss.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                houseMarker5 = $scope.allValue.searchShoolDot;
                //点击左侧列表项 地图显示相应的房子
                $scope.allValue.showView = function(obj,$event){
                    $event.stopPropagation();
                    //console.log(houseMarker5)
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null)
                        $scope.allValue.mapMaker = null;
                    }
                    var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                        '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                        '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                        '<p class="map_info_price">'+obj.housePrice+'</p>' +
                        '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                        '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                        '</div></div>' +
                        '</a>';
                    if(houseMarker5){
                        for(x in houseMarker5){
                            if(obj._id == houseMarker5[x]._id){
                                //console.log('a')
                                houseMarker5[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                houseMarker5[x].name.zIndex = 3;
                                infoWindowS.setContent(contentString);
                                infoWindowS.open($scope.allValue.ss.map, houseMarker5[x].name);
                                return;
                            }
                        }
                    }
                    $scope.allValue.mapMaker = new google.maps.Marker({
                        position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                        title : obj.title,
                        icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                        map: $scope.allValue.ss.map,
                        zIndex:9
                    });
                    infoWindowS.setContent(contentString);
                    infoWindowS.open($scope.allValue.ss.map, $scope.allValue.mapMaker);
                    $scope.allValue.mapMaker.addListener('click', function() {
                        infoWindowS.setContent(contentString);
                        infoWindowS.open($scope.allValue.ss.map, $scope.allValue.mapMaker);
                    });
                };

                //==================================================地图列表导航事件==================================
                //search页面列表左侧导航设置 点击添加样式
                $scope.allValue.setListNav = function(n,str){
                    $scope.allValue.sln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : n,
                        nextEvent : false
                    });
                    $('.slp_list_load').show();
                    //$scope.allValue.schoolParam.sort = str;
                    if(n == 2){
                        if(priceUpDown){
                            $scope.allValue.schoolParam.sort = 'priceUp';
                            $('.priceUp').css({'border-top-color':'brown'})
                            $('.priceDown').css({'border-bottom-color':'gray'})
                        }else{
                            $scope.allValue.schoolParam.sort = 'priceDown';
                            $('.priceUp').css({'border-top-color':'gray'})
                            $('.priceDown').css({'border-bottom-color':'brown'})
                        }
                        priceUpDown = !priceUpDown;
                    }else{
                        $scope.allValue.schoolParam.sort = str;
                    }
                    $scope.allValue.getSearchData = pFactory.postData({
                        url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getSchoolHouse',
                        data: JSON.stringify($scope.allValue.schoolParam),
                        callBack: function (data) {
                            $('.slp_list_load').hide();
                            $scope.allValue.listHouse.houseInfo = data.data.houseList;
                            for(var sh1 = 0,len = data.data.houseList.length; sh1 < len; sh1++){
                                data.data.houseList[sh1].houseUpDate = myFactory.timeFormat(data.data.houseList[sh1].listedDate)
                            }
                        }
                    })
                };

                //安全指数的事件
                $('.search_safe_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_safe_display').hide();
                    $scope.allValue.ss.map.overlayMapTypes.pop();
                });
                $('.search_hotel_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hotel_display').hide();
                    for(x in hotelMarker5.markerArr){
                        hotelMarker5.markerArr[x].setMap(null);
                    }
                    hotelMarker5 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#3c8df6',
                        tempArr : []
                    };
                });
                $('.search_hospital_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hospital_display').hide();
                    //hospitalMarker.moveMap = false;
                    for(x in hospitalMarker5.markerArr){
                        hospitalMarker5.markerArr[x].setMap(null);
                    }
                    hospitalMarker5 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#26cf5c',
                        tempArr : []
                    };
                });
                $('.search_supermarket_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_supermarket_display').hide();
                    //supermarketMarker.moveMap = false;
                    for(x in supermarketMarker5.markerArr){
                        supermarketMarker5.markerArr[x].setMap(null);
                    }
                    supermarketMarker5 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#a970ff',
                        tempArr : []
                    };
                });

                var service = new google.maps.places.PlacesService($scope.allValue.ss.map);
                function callbackHotel(results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hotelMarker5.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker5.tempArr,results)
                        hotelMarker5.tempArr = hotelMarker5.tempArr.concat(newMarkerArr);
                        hotelMarker5.markerArr = hotelMarker5.markerArr.concat(sFactory.makeServiceDot({
                            color:hotelMarker5.color,
                            map:$scope.allValue.ss.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function callbackHospital(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hospitalMarker5.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker5.tempArr,results)
                        hospitalMarker5.tempArr = hospitalMarker5.tempArr.concat(newMarkerArr);
                        hospitalMarker5.markerArr = hospitalMarker5.markerArr.concat(sFactory.makeServiceDot({
                            color:hospitalMarker5.color,
                            map:$scope.allValue.ss.map,
                            arr:newMarkerArr
                        }))
                    }
                };
                function callbackSupermarket(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = supermarketMarker5.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker5.tempArr,results)
                        supermarketMarker5.tempArr = supermarketMarker5.tempArr.concat(newMarkerArr);
                        supermarketMarker5.markerArr = supermarketMarker5.markerArr.concat(sFactory.makeServiceDot({
                            color:supermarketMarker5.color,
                            map:$scope.allValue.ss.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function serviceFn(obj){
                    request = {
                        bounds:obj.bns,
                        types: obj.ty
                    };
                    service.nearbySearch(request, obj.cb);
                }
                $scope.allValue.blockFilter = function(str){
                    var _mapbounds = $scope.allValue.ss.map.getBounds();
                    /*
                     * 1 ---> crime
                     * 2 ---> Restaurant
                     * 3 ---> hospital
                     * 4 ---> Convenience
                     * */
                    if(str == 1){
                        crimeFn($scope.allValue.ss.map)
                    }else if(str == 2){
                        $('.search_safe_icon').hide();
                        $('.search_hotel_display').show();
                        hotelMarker5.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(str == 3){
                        $('.search_safe_icon').hide();
                        $('.search_hospital_display').show();
                        serviceFn({
                            bns:_mapbounds,
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                        hospitalMarker5.moveMap = true;
                    }else if(str == 4){
                        $('.search_safe_icon').hide();
                        $('.search_supermarket_display').show();
                        supermarketMarker5.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                }
            }
        })
    }

    $scope.allValue.hideSelectDiv = function(){
        cityTemp = true;
        subsurbTemp = true;
        roomsTemp = true;
        $('.select_item').hide();
        $('.select_tri').removeClass('select_open_tri');
    };
    $('#search_map').on('click',function(){
        cityTemp = true;
        subsurbTemp = true;
        roomsTemp = true;
        $('.select_item').hide();
        $('.select_tri').removeClass('select_open_tri');
    });

    //================================搜索框事件============================
    $scope.allValue.searchPageValue = '';
    $scope.allValue.searchSubFlag = true;

    $scope.allValue.searchPageBar = function(){
        if($scope.allValue.searchPageValue.length != 0){
            angular.element('.searchPage_history').hide();
            angular.element('.searchPage_simple').show();
            angular.element('.searchPage_error').hide();
            $scope.allValue.searchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.searchPageValue,"scope":$scope.allValue.ct}),
                callBack:function(data) {
                    $scope.allValue.searchPageData = data.data;
                    data.data.length != 0 ? angular.element('.searchPage_error').hide() : angular.element('.searchPage_error').show();

                    $scope.allValue.searchPageBtn = function(){
                        if($scope.allValue.searchPageValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return '/detail?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName;
                            }else{
                                return '/search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn=' + data.data[0].fatherName;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.searchPage_history').show();
            angular.element('.searchPage_simple').hide();
            angular.element('.searchPage_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                $scope.allValue.searchHistoryData = [];
                var json = {};
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };

    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.searchBlurEvent = function(){
        $scope.allValue.searchSubFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.searchOverEvent = function (){
        $scope.allValue.searchSubFlag = false;
        $scope.allValue.searchBlurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.searchLeaveEvent = function (){
        $scope.allValue.searchBlurEvent = function(){
            $scope.allValue.searchSubFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.searchFocusEvent = function(){
        $scope.allValue.searchSubFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            //return '/detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName;
            if(obj.isSale){
                return 'detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.ct;
            }else{
                return 'house?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.ct;
            }
        }else{
            return '/search?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.ct;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(for sale)' : 'House(not for sale)';
                break;
        }
    };

}]);
//===================================================== 详情页控制器 ==============================
app.controller('detailCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope', 'myFactory','$interval','$timeout','publicFactory','$sce',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$timeout,pFactory,$sce){ // zw添加$se,使用$sce控制代码安全检查
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;
    //$("meta[name='keywords']").attr('content',"Tigerz | Houses For Sale in New Zealand | Auction | Estimate");

    //挂载detail的所有变量
    $scope.allValue = {};
    //console.log(angular.element('.dataSave').data());
    //$scope.allValue.currentSelectCity = angular.element('.dataSave').data('ct') ? angular.element('.dataSave').data('ct') : "Auckland";
    $scope.allValue.jugeFootMap = true;
    $scope.allValue.jugeTurnMap = true;
    $scope.allValue.showTurnMap = false;
    var img_index_num = 0;
    //设置锚点
    $scope.allValue.jump = myFactory.detail.anchor;
    //页面加载是设置滚动的最大高度 初始化页面的一些设置
    $scope.allValue.sc = myFactory.detail.sc();
    //获取当前的houseid
    $scope.allValue.nowIdParam = location.href.indexOf('?') == -1 ? '582db4eb4860e427946270de': location.href.substr(location.href.indexOf('?')+1);

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/detail.html" + '?' + $scope.allValue.nowIdParam;
    }
    angular.element('.dataSave').data('detailParam',$scope.allValue.nowIdParam);

    $scope.allValue.currentSelectCity =  decodeURIComponent($scope.allValue.nowIdParam.split('&')[ $scope.allValue.nowIdParam.split('&').length-1])

    $('.detail_language_en').attr('href','/detail?'+angular.element('.dataSave').data('detailParam'));
    $('.detail_language_cn').attr('href','/detail_cn?'+angular.element('.dataSave').data('detailParam'));

    $scope.allValue.nowId = $scope.allValue.nowIdParam.split('&')[0];
    //==========================================数据获取数据===============================
    $scope.allValue.allData = '';
    //========================================= zw 默认barfoot不存在 ====================
    $scope.allValue.judgeBarfoot = false;
    $scope.allValue.barfootSrc = '';
    //==================================获取房子的基本信息==========================
    $scope.allValue.basicData = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHouseBaseInfo/'+$scope.allValue.nowId + '/en',
        callBack:function(data){
            console.log(data.data[0].sourceLink.indexOf('barfoot'));
            //===================  zw 修改如果状态为不可售，直接跳转到house页面 ================================
            if(data.data[0].status !== 'sale'){
                window.location = '/house?' + data.data[0].houseId + '&' + data.data[0].addressLocality + '&' + data.data[0].addressRegion;
                angular.element('.isDelete').show();
            } else {
                //=================== zw 将其他的网页直接嵌入 ===================================
                $scope.allValue.judgeBarfoot = true;
                $scope.allValue.barfootSrc = $sce.trustAsResourceUrl(data.data[0].houseLink);
                angular.element('.dsi_slideDown').animate({
                    height: 'toggle',
                    opacity: 'toggle'
                },3000);
                $timeout(function(){
                    angular.element('.detail_mask').hide();
                },3000,false);

                $scope.allValue.allData = data.data[0];
                $scope.allValue.allData.agentList = data.data[0].agentList.length != 0 ? data.data[0].agentList : [{
                    agent_id:"default",
                    agent_icon:"http://res.tigerz.nz/imgs/robot.png",
                    agent_mobile:"wjc@tigerz.nz",
                    agent_name:"TigerZ",
                    agent_url:""
                }];
                $scope.allValue.allData.shareData = $scope.allValue.allData.landArea ? ($scope.allValue.allData.type == "Cross Lease" ? ('1/'+$scope.allValue.allData.houseHolds + ' share ' + $scope.allValue.allData.landArea + '㎡') : $scope.allValue.allData.landArea + '㎡') : 'N/A';

                $scope.allValue.allData.titleAddr = $scope.allValue.allData.streetAddress + ', ' + $scope.allValue.allData.suburb + ', ' + $scope.allValue.allData.addressCity

                $scope.allValue.showLogo = $scope.allValue.allData.logoImageUrlPath ? false : true;

                $('.detail_nav .mapJump').attr('href','/search?name='+ data.data[0].suburb +'&level=3&page=0&sort=default&isAllHouse=false&fn='+data.data[0].addressCity);

                //$('.detail_nav .mapJump').attr('href','/search?name='+ data.data[0].suburb +'&level=3&page=0&sort=default&isAllHouse=false&fn='+data.data[0].addressCity);
                //$('.detail_nav a').eq(2).attr('href','/estimate');

                $('.detail_logo1').attr('href','/search?name='+ data.data[0].suburb +'&level=3&page=0&sort=default&isAllHouse=false&fn='+data.data[0].addressCity);

                //设置详情页英文SEO信息
                var titleStr = "Free Property Data for " + $scope.allValue.allData.titleAddr;
                $scope.allValue.detailLogotitle = titleStr;
                $('title').text(titleStr +' | Auction | Estimate');
                $("meta[name='keywords']").attr('content',titleStr);
                var descStr =  "Free Home estimates,Land,School,Valuations,Community,Property Sold History Recent Sales, free Property Data for " + $scope.allValue.allData.titleAddr + ".Make smarter property decisions";
                $("meta[name='description']").attr('content',descStr);

                $scope.allValue.upDateTime = myFactory.timeFormat(data.data[0].listedDate)

                //=========allValue.allData.areaPriceChangeByYear 涨幅如果是涨显示为绿颜色如果是跌显示卫红颜色
                $scope.allValue.areaPriceColor = $scope.allValue.allData.areaPriceChangeByYear.indexOf('+') != -1 ? 'greenColor' : 'redColor';

                $scope.allValue.auctionAddr = true;
                $scope.allValue.auctionTime = true;

                if(data.data[0].priceType == 3){
                    $scope.allValue.auctionAddr = true;
                    $scope.allValue.auctionTime = true;
                }else if(data.data[0].priceType == 2){
                    $scope.allValue.auctionTime = false;
                    $scope.allValue.auctionValue = myFactory.timeFormat(data.data[0].tenderDate,1);
                }else{
                    $scope.allValue.auctionAddr = false;
                    $scope.allValue.auctionTime = false;
                    $scope.allValue.auctionValue = myFactory.timeFormat(data.data[0].actionDate,1);
                }

                //==================房子的历史成交，先将时间戳转化为日期，然后赋值给一个数组，循环显示出来==========================
                for(var cv = 0,len = data.data[0].cvAndSale.length; cv < len; cv++){
                    data.data[0].cvAndSale[cv].cvTime = myFactory.timeFormat(data.data[0].cvAndSale[cv].date)
                    //data.data[0].cvAndSale[cv].cvTime = myFactory.timeFormat(data.data[0].cvAndSale[cv].date)
                }
                $scope.allValue.cvEventData = data.data[0].cvAndSale ? data.data[0].cvAndSale : [];

                $scope.allValue.estimateValue = data.data[0]["automatedValuationModelPredictions"] ? data.data[0]["automatedValuationModelPredictions"][0].prediction : false;
                $scope.allValue.allData.landArea = $scope.allValue.allData.landArea <= 0 ? 'N/A' : ($scope.allValue.allData.landArea + '㎡');
                $scope.allValue.allData.floorArea = $scope.allValue.allData.floorArea <= 0 ? 'N/A' : ($scope.allValue.allData.floorArea +'㎡');
                //=============================注意项数据的ture或者false=============================================
                $scope.allValue.allData.tower = !($scope.allValue.allData.pylonInfo) || $scope.allValue.allData.pylonInfo.pylon_min_distance > 1000 ? true : false;

                $scope.allValue.allData.land = (!($scope.allValue.allData.nouthSouthAngel) || Math.abs($scope.allValue.allData.nouthSouthAngel/1) < 2) && (!($scope.allValue.allData.eastWestAngel) || Math.abs($scope.allValue.allData.eastWestAngel/1) < 2) ? true : false;
                $scope.allValue.allData.highway = !($scope.allValue.allData.highwayInfo) || $scope.allValue.allData.highwayInfo.highway_min_distance > 200 ? true : false;

                $scope.allValue.allData.railway = !($scope.allValue.allData.railwayInfo) || $scope.allValue.allData.railwayInfo.railway_min_distance > 300 ? true : false;
                $scope.allValue.allData.petrolStation = !($scope.allValue.allData.petrolStationsInfo) || $scope.allValue.allData.petrolStationsInfo.petrol_stations_distance > 150 ? true : false;

                $scope.allValue.allData.stream = !($scope.allValue.allData.indicativeStreamInfo) || $scope.allValue.allData.indicativeStreamInfo[0].indicative_stream_min_distance > 30 ? true : false;
                $scope.allValue.allData.tree = $scope.allValue.allData.treeInfo ? false : true;
                //=================================社区基本信息============================
                $scope.allValue.allData.latestCapitalValue = $scope.allValue.allData.latestCapitalValue == -1 ? '' : $scope.allValue.allData.latestCapitalValue;
                $scope.allValue.allData.totalAnnualRates = $scope.allValue.allData.totalAnnualRates == -1 ? '' : '$ '+$scope.allValue.allData.totalAnnualRates;
                //$scope.allValue.allImg = data.data[0].houseUrlsImagePath ? data.data[0].houseUrlsImagePath : ['sss'];

                $scope.allValue.allImg = ['222'];
                $scope.allValue.bigImg = ['222'];
                if(data.data[0].houseUrlsImagePath){
                    $scope.allValue.allImg = data.data[0].houseUrlsImagePath;
                }

                if($scope.allValue.allImg && $scope.allValue.allImg.length){
                    $scope.allValue.max_index = $scope.allValue.allImg.length - 1;
                    //angular.element('.desiel_up_wrap').css({'width':(7.56*$scope.allValue.allImg.length)*parseFloat(document.documentElement.style.fontSize)});
                    angular.element('.dsiel_down_smallimgs').css({'width':(1.3*$scope.allValue.allImg.length)*parseFloat(document.documentElement.style.fontSize)});
                }

                //===================================涨幅信息数据处理==========================================
                $scope.allValue.allData.areaMidPrice = $scope.allValue.allData.areaMidPrice < 0 ? false : $scope.allValue.allData.areaMidPrice;
                $scope.allValue.allData.areaPriceChangeByYear = $scope.allValue.allData.areaPriceChangeByYear == '' ? '-' : $scope.allValue.allData.areaPriceChangeByYear;


                //点击按钮实现图片滚动
                //$scope.allValue.btnStopTurn = function(str){
                //    $scope.allValue.btnTurn = myFactory.normalTurn({
                //        //点击按钮是上面大图的移动
                //        wrap : '.desiel_up_wrap',
                //        direct : 'left',
                //        clickType : str,
                //        clickDefalut : 'add',
                //        maxNum : $scope.allValue.allImg.length,
                //        moveWidth : 7.558,
                //        moveTime : 500,
                //        nextEvent : true,
                //        eventName : 'addClassName',
                //        //下面小图添加样式
                //        nextEventOption : {
                //            itemSmall : '.dsiel_down_small>.dsiel_down_smallimgs>img',
                //            name : 'onimg',
                //            num : 0,
                //            nextEvent : true,
                //            eventName : 'smallWrapMove',
                //            //下面小图位置的移动
                //            nextEventOption : {
                //                moveType : str,
                //                moveClass : '.dsiel_down_smallimgs',
                //                direct : 'left',
                //                currentNum : 0,
                //                maxN : $scope.allValue.allImg.length
                //            }
                //        }
                //    })
                //}

                //按钮滚动
                $scope.allValue.btnStopTurn = function(str){
                    //img_index_num = str == 'add' ? (++img_index_num > $scope.allValue.allImg.length-1 ? $scope.allValue.allImg.length-1 : img_index_num) : (--img_index_num < 0 ? 0 : img_index_num);
                    if(str == 'add'){
                        img_index_num++
                        if(img_index_num > $scope.allValue.allImg.length-1){
                            img_index_num = $scope.allValue.allImg.length-1;
                            return;
                        }
                    }else{
                        img_index_num--
                        if(img_index_num < 0){
                            img_index_num = 0;
                            return;
                        }
                    }
                    $scope.allValue.btnTurn = myFactory.opacityTurn({
                        //点击按钮是上面大图的移动
                        currIndex:img_index_num,
                        max_index: $scope.allValue.allImg.length-1,
                        nextEvent : true,
                        eventName : 'addClassName',
                        //下面小图添加样式
                        nextEventOption : {
                            itemSmall : '.dsiel_down_small>.dsiel_down_smallimgs>img',
                            name : 'onimg',
                            num : 0,
                            nextEvent : true,
                            eventName : 'smallWrapMove',
                            //下面小图位置的移动
                            nextEventOption : {
                                moveType : str,
                                moveClass : '.dsiel_down_smallimgs',
                                direct : 'left',
                                currentNum : 0,
                                maxN : $scope.allValue.allImg.length
                            }
                        }
                    })
                }

                //===========================================历史成交列表================================
                if($scope.allValue.allData.sales){
                    $scope.allValue.salesList = $scope.allValue.allData.sale;
                }else{
                    $scope.allValue.salesList = [];
                }
                //=============================================生成图表部分===============================
                //生成education图表
                $scope.allValue.educationChart = pFactory.createChart({
                    myChart : 'education',
                    itemClass : '.daiici_education_chart'
                });
                //生成income图表
                $scope.allValue.incomeChart = pFactory.createChart({
                    myChart : 'income',
                    itemClass : '.daiici_income_chart'
                });
                //生成rate图表
                $scope.allValue.rateChart = pFactory.createChart({
                    myChart : 'rate',
                    itemClass : '.daiici_rate_chart'
                });
                //生成Religious Affiliation图表
                $scope.allValue.livingChart = pFactory.createChart({
                    myChart : 'livingRate',
                    itemClass : '.daiicil_left_chart'
                });
                //representation图表部分
                $scope.allValue.representationChart = pFactory.createChart({
                    myChart : 'representation',
                    itemClass : '.daiicil_right_chart'
                });

                //设置图标响应式和加载loading
                $scope.reRep = myFactory.detail.chartResize({
                    chart1 : $scope.allValue.representationChart.myChart,
                    chart2 : $scope.allValue.livingChart.myChart,
                    chart3 : $scope.allValue.rateChart.myChart,
                    chart4 : $scope.allValue.educationChart.myChart,
                    chart5 : $scope.allValue.incomeChart.myChart
                });
                $scope.chartLoad = myFactory.detail.chartLoading({
                    chart1 : $scope.allValue.representationChart.myChart,
                    chart2 : $scope.allValue.livingChart.myChart,
                    chart3 : $scope.allValue.rateChart.myChart,
                    chart4 : $scope.allValue.educationChart.myChart,
                    chart5 : $scope.allValue.incomeChart.myChart
                });

                //==========================================图表生成结束===============================

                //==================================加载页面的时候在地图上将当前的房子显示出来======================
                //设置最下面地图的参数
                $scope.allValue.mapOption = {
                    id:'detail_footer_map',
                    map:'detailMap',
                    position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                    zoom: 17,
                    drag : true,
                    wheelEvent : false
                };
                /*
                 创建地图  pFactory.setSearchMap 会返回一个对象
                 所以$scope.allValue.mapObj是一个对象
                 这个对象中$scope.allValue.mapObj.map 是创建出来的地图 以后地图事件都用这个
                 */
                $scope.allValue.mapObj = pFactory.setSearchMap($scope.allValue.mapOption);
                //地图上将房子圈起来
                $scope.allValue.circleHouse = pFactory.circleHouse({
                    coordinate : $scope.allValue.allData.coordinateArray,
                    mapName : $scope.allValue.mapObj.map
                });

                //=================================附近成交房子地图================================
                $scope.allValue.dealMapOption = {
                    id:'detail_footer_dealmap',
                    map:'detailDealMap',
                    position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                    zoom: 17,
                    drag : true,
                    wheelEvent : false
                };
                /*
                 创建地图  pFactory.setSearchMap 会返回一个对象
                 所以$scope.allValue.mapObj是一个对象
                 这个对象中$scope.allValue.mapObj.map 是创建出来的地图 以后地图事件都用这个
                 */
                $scope.allValue.dealMapObj = pFactory.setSearchMap($scope.allValue.dealMapOption);
                //================================ 加载页面是显示当前房子结束 ==================================

                //===================================== 获取学校数据 ==================================
                if($scope.allValue.allData.schoolInfo){
                    var schoolIds = [];
                    var schoolDis = {};
                    //console.log($scope.allValue.allData.schoolInfo);
                    for(var i = 0,len = $scope.allValue.allData.schoolInfo.length ; i < len ; i++){
                        schoolIds.push($scope.allValue.allData.schoolInfo[i].school_id);
                        schoolDis[$scope.allValue.allData.schoolInfo[i].school_id] = $scope.allValue.allData.schoolInfo[i].min_distanct;
                    }
                    $scope.allValue.schoolIds =  JSON.stringify({'schools':schoolIds});
                    $scope.allValue.schoolData = pFactory.postData({
                        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getSchoolsBaseInfo',
                        data:$scope.allValue.schoolIds,
                        callBack:function(data) {
                            //console.log('===================学校数据====================');
                            $scope.allValue.schoolData = data.data;
                            $scope.allValue.district = [];
                            $scope.allValue.private = [];
                            //if($scope.allValue.schoolData){
                            for(var j = 0,len = $scope.allValue.schoolData.length ; j < len ; j++){
                                $scope.allValue.schoolData[j].minDis = schoolDis[$scope.allValue.schoolData[j]._id];
                                //给这个对象添加两个属性  一个是打印黄色星星的个数  一个是打印灰色星星的个数
                                $scope.allValue.setStar = myFactory.detail.setStar($scope.allValue.schoolData[j]);
                                //将学校分类   分为学区学校  和私人学校
                                if($scope.allValue.schoolData[j].schoolAttribute == 'School District'){
                                    $scope.allValue.district.push($scope.allValue.schoolData[j]);
                                }
                                if($scope.allValue.schoolData[j].schoolAttribute == 'Private School'){
                                    $scope.allValue.private.push($scope.allValue.schoolData[j]);
                                }
                            };
                            //学校显示最多显示三所学校
                            $scope.allValue.district = $scope.allValue.district.length > 3 ? $scope.allValue.district.slice(0,3) : $scope.allValue.district;
                            $scope.allValue.private = $scope.allValue.private.length > 3 ? $scope.allValue.private.slice(0,3) : $scope.allValue.private;
                            //}
                        }
                    });
                }
                //====================================== 获取社区数据 ==================================
                if($scope.allValue.allData.meshblockNumber){
                    $scope.allValue.cummunityData = pFactory.postData({
                        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getCommunityInfoBaseInfo/',
                        data:JSON.stringify({"meshNo":$scope.allValue.allData.meshblockNumber,"tiaCode":$scope.allValue.allData.tlaCode,"areaunitCode":$scope.allValue.allData.areaunitCode,'lang':'en'}),
                        callBack:function(data) {
                            //console.log(data.data[0]);
                            //console.log('===================社区数据====================');
                            $scope.allValue.communityData = data.data[0];

                            $scope.allValue.safeType = myFactory.detail.jugeSafe($scope.allValue.communityData.crimeRate)

                            //============================================部署图表的数据===============================
                            // 指定income图表的配置项和数据
                            $scope.allValue.incomeOption = {
                                tooltip: {},
                                grid: {
                                    left: '0',
                                    right: '4%',
                                    bottom: '16%',
                                    containLabel: true
                                },
                                legend: {
                                    data:['income']
                                },
                                xAxis: {
                                    splitLine:{show: false},
                                    data: ["Auckland",$scope.allValue.allData.suburb,$scope.allValue.allData.road],
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 25,
                                        margin: 2,
                                        textStyle: {
                                            color: "#222"
                                        }
                                    }
                                },
                                splitLine:{show: false},
                                yAxis :{
                                    splitLine:{show: false},
                                    axisLabel: {
                                        show: false
                                    }
                                },
                                series: [{
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: '#fee100',
                                            label: {
                                                show: true,
                                                position: 'top',
                                                formatter: '${c}',
                                                textStyle : {
                                                    color:'#000',
                                                    fontSize:14
                                                }
                                            }
                                        }
                                    },
                                    barWidth:50,
                                    data: [$scope.allValue.communityData.familyIncomeForRegion.toFixed(0),$scope.allValue.communityData.familyIncomeForCity.toFixed(0),$scope.allValue.communityData.familyIncome.toFixed(0)]
                                }]
                            };
                            $scope.allValue.incomeChart.myChart.setOption($scope.allValue.incomeOption);
                            $scope.allValue.incomeChart.myChart.hideLoading();

                            //设置education图表的参数
                            $scope.allValue.educationOption = {
                                tooltip: {},
                                grid: {
                                    left: '5%',
                                    right: '4%',
                                    bottom: '16%',
                                    containLabel: true
                                },
                                legend: {
                                    data:['education']
                                },
                                xAxis: {
                                    splitLine:{show: false},
                                    type : 'category',
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 25,
                                        margin: 2,
                                        textStyle: {
                                            color: "#222"
                                        }
                                    },
                                    data: [data.data[0].degree[0].name,data.data[0].degree[1].name,data.data[0].degree[2].name,data.data[0].degree[3].name]
                                },
                                splitLine:{show: false},
                                yAxis :{
                                    splitLine:{show: false},
                                    axisLabel: {
                                        show: false
                                    }
                                },
                                series: [{
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: '#fee100',
                                            label: {
                                                show: true,
                                                position: 'top',
                                                formatter: '{c}%',
                                                textStyle : {
                                                    color:'#000',
                                                    fontSize:14
                                                }
                                            }
                                        }
                                    },
                                    barWidth:50,
                                    data: [
                                        ($scope.allValue.communityData.degree[0].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                        ($scope.allValue.communityData.degree[1].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                        ($scope.allValue.communityData.degree[2].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                        ($scope.allValue.communityData.degree[3].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2)
                                    ]
                                }]
                            };
                            $scope.allValue.educationChart.myChart.setOption($scope.allValue.educationOption);
                            $scope.allValue.educationChart.myChart.hideLoading();

                            //设置rate参数
                            var publicNum = $scope.allValue.communityData.households[0].number == -1 ? 1 : $scope.allValue.communityData.households[0].number;
                            var holdNum = $scope.allValue.communityData.households[1].number == -1 ? 3 : $scope.allValue.communityData.households[1].number;

                            $scope.allValue.rateOption = {
                                tooltip: {},
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '16%',
                                    containLabel: true
                                },
                                legend: {
                                    data:['education','ccc']
                                },
                                xAxis: {
                                    splitLine:{show: false},
                                    data: [data.data[0].households[0].name,data.data[0].households[1].name],
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 25,
                                        margin: 2,
                                        textStyle: {
                                            color: "#222",
                                        }
                                    }
                                },
                                splitLine:{show: false},
                                yAxis :{
                                    splitLine:{show: false},
                                    axisLabel: {
                                        show: false
                                    }
                                },
                                series: [{
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: '#fee100',
                                            label: {
                                                show: true,
                                                position: 'top',
                                                formatter: '{c}%',
                                                textStyle : {
                                                    color:'#000',
                                                    fontSize:14
                                                }
                                            }
                                        }
                                    },
                                    barWidth:50,
                                    data: [
                                        {
                                            name : 'b',
                                            value : holdNum.toFixed(2)
                                        },
                                        {
                                            name : 'a',
                                            value : publicNum.toFixed(2)
                                        }
                                    ]
                                }]
                            };
                            $scope.allValue.rateChart.myChart.setOption($scope.allValue.rateOption);
                            $scope.allValue.rateChart.myChart.hideLoading();

                            var regionName = [];
                            var regionNum = [];
                            for(var re = 0,len = data.data[0].religions.length; re < len; re++){
                                if(data.data[0].religions[re].number != 0){
                                    regionName.push(data.data[0].religions[re].name);
                                    var a = {};
                                    a.value = (100*$scope.allValue.communityData.religions[re].number/$scope.allValue.communityData.allReligions).toFixed(2);
                                    a.name = data.data[0].religions[re].name;
                                    regionNum.push(a);
                                }
                            }

                            //设置Religious Affiliation参数
                            $scope.allValue.livingOption = {
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{b}:\n{c}%"
                                },
                                color:['#bcf360','#37c73a','#ffd655','#dce0c0','#ffd900','#6059f0','#fd6840','#fb40fd','#ff0000'],
                                legend: {
                                    orient: 'vertical',
                                    x: 4.5*parseFloat(document.documentElement.style.fontSize)+'px',
                                    y: 'middle',
                                    data:regionName
                                },
                                series: [
                                    {
                                        type:'pie',
                                        radius: ['45%', '65%'],
                                        avoidLabelOverlap: true,
                                        data:regionNum
                                    }
                                ]
                            };
                            $scope.allValue.livingChart.myChart.setOption($scope.allValue.livingOption);
                            $scope.allValue.livingChart.myChart.hideLoading();


                            //设置人口种族参数 并生成饼状图
                            var kpName = [];
                            var kpNum = [];
                            for(var kp = 0,len = data.data[0].ethnic.length; kp < len; kp++){
                                if(data.data[0].ethnic[kp].number != 0){
                                    kpName.push(data.data[0].ethnic[kp].name);
                                    var a = {};
                                    a.value = (100*$scope.allValue.communityData.ethnic[kp].number/$scope.allValue.communityData.allEthnicCount).toFixed(2);
                                    a.name = data.data[0].ethnic[kp].name;
                                    kpNum.push(a);
                                }
                            }


                            $scope.allValue.representationOption = {
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{b}:\n{c}%"
                                },
                                color:['#bcf360','#ffd900','#37c73a','#ffd655','#dce0c0','#6059f0'],
                                legend: {
                                    orient: 'vertical',
                                    x: 4.5*parseFloat(document.documentElement.style.fontSize)+'px',
                                    y: 'middle',
                                    data:kpName
                                },
                                series: [
                                    {
                                        type:'pie',
                                        radius: ['45%', '65%'],
                                        avoidLabelOverlap: true,
                                        data:kpNum
                                    }
                                ]
                            }
                            $scope.allValue.representationChart.myChart.setOption($scope.allValue.representationOption);
                            $scope.allValue.representationChart.myChart.hideLoading();
                            //===============================================图表数据设置结束============================
                        }
                    })
                };
                //==================================== 获取附近房源信息 =====================================
                $scope.allValue.nearby = pFactory.postData({
                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyHouse',
                    data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                    callBack : function(data){
                        //============================附近房源信息=======================;
                        $scope.allValue.nearbyHouse = data.data;
                        var info = new google.maps.InfoWindow({maxWidth: 550});

                        for(var i = 0,len = data.data.length; i < len; i++){
                            data.data[i].houseCreateTime = myFactory.timeFormat(data.data[i].listedDate)
                        }
                        $scope.allValue.setNearbyHouseMap = myFactory.detail.setNearbyHouseIcon($scope.allValue.nearbyHouse,$scope.allValue.mapObj.map,$scope.allValue.allData.basePoint,info,$scope.imgDomain);
                        //附近房源li点击事件   在地图上显示信息框
                        $scope.allValue.nearbyHouseClick = function (obj){
                            //console.log(obj)
                            var contentString = '<a href="/detail?'+ obj._id +'&'+ obj.streetAddress +'&'+ obj.addressCity +'" class="mapInfo" target="_blank"><div>' +
                                '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+obj.houseMainImagePath+'"/></div>' +
                                '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                                '<p class="map_info_price">'+obj.housePrice+'</p>' +
                                '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                                '<ul><li><span class="map_info_bed"></span><span>'+obj.bedRoom+'</span><span class="map_info_bath"></span><span>'+obj.bathRoom+'</span></li></ul>' +
                                '</div></div>' +
                                '</a>';

                            info.setContent(contentString);
                            for(var c = 0,len = $scope.allValue.setNearbyHouseMap.length ; c < len ; c++){
                                if($scope.allValue.setNearbyHouseMap[c].markerPosition == obj._id){
                                    info.open($scope.allValue.mapObj.map, $scope.allValue.setNearbyHouseMap[c].name);
                                }
                            }
                        }
                    }
                });
                //==================================== zw 获取附近成交房源信息 =============================
                $scope.allValue.nearbyDealed = pFactory.postData({
                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyDealedHouse',
                    data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                    callBack : function(data){
                        // 处理各个数据的格式
                        for(var i = 0,len = data.data.length; i < len; i++){
                            data.data[i].dealHouseTime = myFactory.timeFormat(data.data[i].createTime);
                            data.data[i].price = data.data[i].price/1;
                        }
                        // 全部分页数据
                        $scope.allValue.paginationData = pFactory.paginationData(data.data);
                        // 当前页数
                        $scope.allValue.paginationData.pageNow = 0 / 1;
                        // 页面默认第0页数据
                        $scope.allValue.dealHouse = $scope.allValue.paginationData[$scope.allValue.paginationData.pageNow];
                        // 左翻页事件
                        $scope.allValue.paginationEventLeft = function(pageNow) {
                            if (pageNow > 0) {
                                $scope.allValue.paginationData.pageNow = pageNow - 1;
                                $scope.allValue.dealHouse = $scope.allValue.paginationData[$scope.allValue.paginationData.pageNow];
                            }
                        }
                        // 右翻页事件
                        $scope.allValue.paginationEventRight = function(pageNow) {
                            if (pageNow < $scope.allValue.paginationData.pageAll - 1) {
                                $scope.allValue.paginationData.pageNow = pageNow + 1;
                                $scope.allValue.dealHouse = $scope.allValue.paginationData[$scope.allValue.paginationData.pageNow];
                            }
                        }
                    }
                })


            }
        }
    });

    //地图导航添加样式
    $scope.allValue.mapNavAdd = function(n){
        myFactory.addClassName({
            itemSmall : '.daii_surrounding_nav>li',
            name : 'mapnav',
            num : n,
            nextEvent : false
        });
        myFactory.addClassName({
            itemSmall : '.daii_surrounding_info',
            name : 'daii_showMap',
            num : n,
            nextEvent : false
        });
        if(n == 1 && $scope.allValue.jugeFootMap){
            //=================================== 获取附近成交房源信息 ===================================
            $scope.allValue.nearby = pFactory.postData({
                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyDealedHouse',
                data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                callBack : function(data){
                    $scope.allValue.dealHouse = data.data;
                    console.log(data.data);
                    for(var i = 0,len = $scope.allValue.dealHouse.length; i < len; i++){
                        $scope.allValue.dealHouse[i].dealHouseTime = myFactory.timeFormat($scope.allValue.dealHouse[i].createTime);
                        $scope.allValue.dealHouse[i].price = $scope.allValue.dealHouse[i].price/1;
                    }
                    //$scope.allValue.dealMapObj
                    var info2 = new google.maps.InfoWindow({maxWidth: 550});
                    $scope.allValue.setDealHouseMap = myFactory.detail.setDealHouseIcon($scope.allValue.dealHouse,$scope.allValue.dealMapObj.map,$scope.allValue.allData.basePoint,info2,$scope.imgDomain);
                    //附近房源li点击事件   在地图上显示信息框
                    $scope.allValue.dealHouseClick = function (obj){
                        var contentString = '<a href="javascript:void(0)" class="mapInfo"><div>' +
                            '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+obj.coverImgPath+'"/></div>' +
                            '<div class="map_dis_wrap"><h4 title="'+ obj.dealHouseTime +'">Sold Time:'+obj.dealHouseTime+'</h4>' +
                            '<p class="map_info_price">$'+obj.price+'</p>' +
                            '<p class="map_info_addr">'+obj.hougardenAddress+'</p>' +
                            '<ul><li><span class="map_info_bed"></span><span>'+obj.bedrooms+'</span><span class="map_info_bath"></span><span>'+obj.bathrooms+'</span></li></ul>' +
                            '</div></div>' +
                            '</a>';

                        info2.setContent(contentString);
                        for(var c = 0,len = $scope.allValue.setDealHouseMap.length ; c < len ; c++){
                            if($scope.allValue.setDealHouseMap[c].markerName == obj._id){
                                info2.open($scope.allValue.dealMapObj.map, $scope.allValue.setDealHouseMap[c].name);
                            }
                        }
                    }
                }
            });
            $scope.allValue.jugeFootMap = false;
        }
    };
    $scope.allValue.duringName = '';
    //点击下面的小图实现轮播
    $scope.allValue.stopTurn = function(n){
        $scope.allValue.showTurnMap = false;
        //$('.dsie_left_up').addClass('zIndex');
        //$('#dsie_left_map').removeClass('zIndex');
        var currentN = -Math.round(parseFloat($('.dsiel_down_smallimgs').css('left')) / (1.29*parseFloat(document.documentElement.style.fontSize)));
        var currentType = (n != currentN ) ? 'add' : 'minus';
        img_index_num = n;
        angular.element('.desiel_scale_img').removeClass('showImage');
        angular.element('.desiel_scale_img').eq(n).addClass('showImage');
        //停止轮播后点击那个小图标给那个添加样式
        $scope.allValue.stopAdd = myFactory.addClassName({
            itemSmall : '.dsiel_down_small>.dsiel_down_smallimgs>img',
            name : 'onimg',
            num : n,
            nextEvent : true,
            eventName: 'smallWrapMove',
            nextEventOption : {
                moveType : currentType,
                moveClass : '.dsiel_down_smallimgs',
                direct : 'left',
                currentNum : 0,
                maxN : $scope.allValue.allImg.length
            }
        });
        //点击小图标后上面大图的轮播
        $scope.allValue.sT = myFactory.detail.stopTurn(n);
    };
    //学校导航 点击添加样式
    $scope.allValue.schoolNav = function(n){
        $scope.schoolDaoHang = myFactory.addClassName({
            itemSmall : '.daii_school_info>ul>li',
            name : 'schoolclicked',
            num : n,
            nextEvent : true,
            eventName : 'showDiv',
            nextEventOption : {
                eventNum : n,
                itemName : '.daiis_info_wrap>table'
            }
        })
    };
    /*   轮播地图 显示   */
    $scope.allValue.turnJpg = function(){
        $scope.allValue.showTurnMap = true;
        //$('.dsie_left_up').removeClass('zIndex');
        //$('#dsie_left_map').addClass('zIndex');
        //console.log($scope.allValue.turnMap);
        if($scope.allValue.jugeTurnMap){
            //console.log('mapshow');
            $scope.allValue.turnMap = {
                id:'dsie_left_map',
                map:'leftMap',
                position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                zoom: 19,
                drag : true,
                wheelEvent : false
            };
            //地图上打点标记当前的房子
            $scope.allValue.turnLeftMap = pFactory.setSearchMap($scope.allValue.turnMap);
            $scope.allValue.turnMapCircleHouse = pFactory.circleHouse({
                coordinate : $scope.allValue.allData.coordinateArray,
                mapName : $scope.allValue.turnLeftMap.map
            });
            $scope.allValue.turnLeftMap.name = new google.maps.Marker({
                position: $scope.allValue.turnLeftMap.position,
                icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                map: $scope.allValue.turnLeftMap.map
            });
            $scope.allValue.jugeTurnMap = false;
        }
    }

    //================================搜索框事件============================
    $scope.allValue.detailPageValue = '';
    $scope.allValue.detailSubFlag = true;
//====================搜索框主要事件=============================
    $scope.allValue.detailSearchBar = function(){
        if($scope.allValue.detailPageValue.length != 0){
            angular.element('.detailPage_history').hide();
            angular.element('.detailPage_simple').show();
            angular.element('.detailPage_error').hide();
            $scope.allValue.detailSearchData = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.detailPageValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    $scope.allValue.detailPageData = data.data;
                    data.data.length != 0 ? angular.element('.detailPage_error').hide() : angular.element('.detailPage_error').show();

                    $scope.allValue.detailPageBtn = function(){
                        if($scope.allValue.detailPageValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return data.data[0]._id+'&'+data.data[0].name+','+data.data[0].fatherName
                            }else{
                                return '/search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.detailPage_history').show();
            angular.element('.detailPage_simple').hide();
            angular.element('.detailPage_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                $scope.allValue.searchHistoryData = [];
                var json = {};
                for(var h = 0,len = tempArr.length; h < len; h++){
                    //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.detailBlurEvent = function(){
        $scope.allValue.detailSubFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.detailOverEvent = function () {
        $scope.allValue.detailSubFlag = false;
        $scope.allValue.detailBlurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.detailLeaveEvent = function (){
        $scope.allValue.detailBlurEvent = function(){
            $scope.allValue.detailSubFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.detailFocusEvent = function(){
        $scope.allValue.detailSubFlag = false;
        $scope.allValue.searchHistoryData = [];
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            var json = {};
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            //return '/detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName
            if(obj.isSale){
                return 'detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName+"&"+$scope.allValue.currentSelectCity;
            }else{
                return 'house?'+obj._id+'&'+obj.name+'&'+obj.fatherName+"&"+$scope.allValue.currentSelectCity;
            }
        }else{
            return '/search?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+"&ct="+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(for sale)' : 'House(not for sale)';
                break;
        }
    };

    //添加收藏夹
    $scope.allValue.addMark = pFactory.addMark;

}]);
//==================================================== 非可售房源控制器 ============================
app.controller('houseCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory','$interval','$timeout','publicFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$timeout,pFactory){
    $scope.cityJson = citysJson;
    //数据请求时候的域floorArea名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;

    //挂载house的所有变量
    $scope.allValue = {};

    if(location.href.indexOf('?') == -1){
        $scope.allValue.nowIdParam = '5807187f4860e40bb24f7b32';
        $scope.allValue.houseParam = '5807187f4860e40bb24f7b32';
        $scope.allValue.currentSelectCity = "Auckland";
    }else{
        $scope.allValue.houseParam = location.href.substr(location.href.indexOf('?')+1);
        $scope.allValue.nowIdParam = location.href.substr(location.href.indexOf('?')+1).split('&')[0];
        $scope.allValue.currentSelectCity = decodeURIComponent(location.href.substr(location.href.indexOf('?')+1).split('&')[location.href.substr(location.href.indexOf('?')+1).split('&').length-1])
    }

    angular.element('.dataSave').data('houseParam',$scope.allValue.houseParam);

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/house.html" + '?' + $scope.allValue.houseParam;
    }

    $('.house_language_en').attr('href','/house?'+angular.element('.dataSave').data('houseParam'));
    $('.house_language_cn').attr('href','/house_cn?'+angular.element('.dataSave').data('houseParam'));

    $scope.allValue.jugeFootMap = true;
    //================================搜索框事件============================
    $scope.allValue.housePageValue = '';
    $scope.allValue.houseSubFlag = true;
//====================搜索框主要事件=============================
    $scope.allValue.houseSearchBar = function(){
        if($scope.allValue.housePageValue.length != 0){
            angular.element('.housePage_history').hide();
            angular.element('.housePage_simple').show();
            angular.element('.housePage_error').hide();
            $scope.allValue.houseSearchData = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.housePageValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    $scope.allValue.housePageData = data.data;
                    data.data.length != 0 ? angular.element('.housePage_error').hide() : angular.element('.housePage_error').show();

                    $scope.allValue.housePageBtn = function(){
                        if($scope.allValue.housePageValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return '/detail?'+ data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName
                            }else{
                                return '/search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.housePage_history').show();
            angular.element('.housePage_simple').hide();
            angular.element('.housePage_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                $scope.allValue.searchHistoryData = [];
                var json = {};
                for(var h = 0,len = tempArr.length; h < len; h++){
                    //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.houseBlurEvent = function(){
        $scope.allValue.houseSubFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.houseOverEvent = function () {
        $scope.allValue.houseSubFlag = false;
        $scope.allValue.houseBlurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.houseLeaveEvent = function (){
        $scope.allValue.houseBlurEvent = function(){
            $scope.allValue.houseSubFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.houseFocusEvent = function(){
        $scope.allValue.houseSubFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    //判断跳转的页面是search页还是house页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            //return '/detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName
            if(obj.isSale){
                return 'detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName+"&"+$scope.allValue.currentSelectCity;
            }else{
                return 'house?'+obj._id+'&'+obj.name+'&'+obj.fatherName+"&"+$scope.allValue.currentSelectCity;
            }
        }else{
            return '/search?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+"&ct="+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(for sale)' : 'House(not for sale)';
                break;
        }
    };
    //导航栏的状态
    $scope.allValue.hn = myFactory.house.sc();
    //设置锚点
    $scope.allValue.jump = myFactory.house.anchor;
    //学校导航 点击添加样式
    $scope.allValue.schoolNav = function(n){
        $scope.schoolDaoHang = myFactory.addClassName({
            itemSmall : '.daii_school_info>ul>li',
            name : 'schoolclicked',
            num : n,
            nextEvent : true,
            eventName : 'showDiv',
            nextEventOption : {
                eventNum : n,
                itemName : '.daiis_info_wrap>table'
            }
        })
    };

    //========================请求房子数据==================================
    $scope.allValue.baseData = pFactory.getData({
        url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getGeneralHouseBaseInfo/'+ $scope.allValue.nowIdParam +'/en',
        callBack: function (data) {
            //console.log(data)
            $scope.allValue.allData = data.data.houseGeneral;
            //console.log($scope.allValue.allData);

            $scope.allValue.allData.shareData = $scope.allValue.allData.landArea ? ($scope.allValue.allData.type == "Cross Lease" ? ('1/'+$scope.allValue.allData.houseHolds + ' share ' + $scope.allValue.allData.landArea + '㎡') : $scope.allValue.allData.landArea + '㎡') : 'N/A';

            //$scope.allValue.allData.shareData = $scope.allValue.allData.type == "Cross Lease" ? '1/'+$scope.allValue.allData.houseHolds + ' share ' + $scope.allValue.allData.landArea + '㎡' : $scope.allValue.allData.landArea + '㎡';


            $scope.allValue.allData.titleAddr = $scope.allValue.allData.address + ', ' + $scope.allValue.allData.oldSuburb+ ', ' + $scope.allValue.allData.city

            if($scope.allValue.allData.automatedValuationModelPredictions){
                $scope.allValue.upTime = myFactory.timeFormat($scope.allValue.allData.automatedValuationModelPredictions[0].prediction_date);
            }else{
                $scope.allValue.upTime = "N/A"
            }

            $scope.allValue.midP = data.data.areaMidPrice;
            $scope.allValue.grownP = data.data.areaPriceChangeByYear;
            //设置详情页英文SEO信息
            var titleStr = "Free Property Data for " + $scope.allValue.allData.titleAddr;
            $scope.allValue.houseLogotitle = titleStr;
            $('title').text(titleStr+' | Auction | Estimate');
            //var keywordStr =  titleStr;
            $("meta[name='keywords']").attr('content',titleStr);
            var descStr =  "Free Home estimates,Land,School,Valuations,Community,Property Sold History Recent Sales, free Property Data for " + $scope.allValue.allData.titleAddr + ".Make smarter property decisions";
            $("meta[name='description']").attr('content',descStr);
            //console.log($scope.allValue.allData)
            //$scope.allValue.houseCtime = myFactory.detail.getLocalTime(data.data.cvAndSale[0].date,9);
            //$scope.allValue.houseCvPrice = data.data.cvAndSale[0].price;

            $scope.allValue.turnMap = {
                id:'house_top_map',
                map:'leftMap',
                position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                zoom: 19,
                drag : true,
                wheelEvent : false,
                type : google.maps.MapTypeId.SATELLITE
            };
            //地图上打点标记当前的房子
            $scope.allValue.turnLeftMap = pFactory.setSearchMap($scope.allValue.turnMap);
            $scope.allValue.turnMapCircleHouse = pFactory.circleHouse({
                coordinate : $scope.allValue.allData.coordinateArray,
                mapName : $scope.allValue.turnLeftMap.map
            });
            $scope.allValue.turnLeftMap.name = new google.maps.Marker({
                position: $scope.allValue.turnLeftMap.position,
                icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                map: $scope.allValue.turnLeftMap.map
            });

            //$scope.allValue.estimateValue = data.data.houseGeneral["automatedValuationModelPredictions"] ? data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction : 'N/A';

            if(data.data.houseGeneral["automatedValuationModelPredictions"] && data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction){
                $scope.allValue.estimateValue = '$' + pFactory.numFormat(data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction);
                $scope.allValue.highEstimate = '$' + pFactory.numFormat(data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction + data.data.houseGeneral["automatedValuationModelPredictions"][0].variance);
                $scope.allValue.lowEstimate = '$' + pFactory.numFormat(data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction - data.data.houseGeneral["automatedValuationModelPredictions"][0].variance);
            }else{
                $scope.allValue.estimateValue = 'N/A';
                $scope.allValue.highEstimate = 'N/A';
                $scope.allValue.lowEstimate = 'N/A';
            }

            $scope.allValue.allData.landArea = $scope.allValue.allData.landArea <= 0 ? 'N/A' : ($scope.allValue.allData.landArea + '㎡');
            $scope.allValue.allData.floorArea = $scope.allValue.allData.floorArea <= 0 ? 'N/A' : ($scope.allValue.allData.floorArea +'㎡');

            //=============================注意项数据的ture或者false=============================================
            $scope.allValue.allData.tower = !($scope.allValue.allData.pylonInfo) || $scope.allValue.allData.pylonInfo.pylon_min_distance > 1000 ? true : false;
            $scope.allValue.allData.land = (!($scope.allValue.allData.nouthSouthAngel) || Math.abs($scope.allValue.allData.nouthSouthAngel/1) < 2) && (!($scope.allValue.allData.eastWestAngel) || Math.abs($scope.allValue.allData.eastWestAngel/1) < 2) ? true : false;
            $scope.allValue.allData.highway = !($scope.allValue.allData.highwayInfo) || $scope.allValue.allData.highwayInfo.highway_min_distance > 200 ? true : false;
            $scope.allValue.allData.railway = !($scope.allValue.allData.railwayInfo) || $scope.allValue.allData.railwayInfo.railway_min_distance > 300 ? true : false;
            $scope.allValue.allData.petrolStation = !($scope.allValue.allData.petrolStationsInfo) || $scope.allValue.allData.petrolStationsInfo.petrol_stations_distance > 150 ? true : false;
            $scope.allValue.allData.stream = !($scope.allValue.allData.indicativeStreamInfo) || $scope.allValue.allData.indicativeStreamInfo[0].indicative_stream_min_distance > 30 ? true : false;
            $scope.allValue.allData.tree = $scope.allValue.allData.treeInfo ? false : true;


            //===================================== 获取学校数据 ==================================
            if($scope.allValue.allData.schoolInfo){
                var schoolIds = [];
                var schoolDis = {};
                for(var i = 0,len = $scope.allValue.allData.schoolInfo.length ; i < len ; i++){
                    schoolIds.push($scope.allValue.allData.schoolInfo[i].school_id);
                    schoolDis[$scope.allValue.allData.schoolInfo[i].school_id] = $scope.allValue.allData.schoolInfo[i].min_distanct;
                }
                $scope.allValue.schoolIds =  JSON.stringify({'schools':schoolIds});
                $scope.allValue.schoolData = pFactory.postData({
                    url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getSchoolsBaseInfo',
                    data:$scope.allValue.schoolIds,
                    callBack:function(data) {
                        //console.log('===================学校数据====================');
                        $scope.allValue.schoolData = data.data;
                        $scope.allValue.district = [];
                        $scope.allValue.private = [];
                        for(var j = 0,len = $scope.allValue.schoolData.length ; j < len ; j++){
                            $scope.allValue.schoolData[j].minDis = schoolDis[$scope.allValue.schoolData[j]._id];
                            //给这个对象添加两个属性  一个是打印黄色星星的个数  一个是打印灰色星星的个数
                            $scope.allValue.setStar = myFactory.detail.setStar($scope.allValue.schoolData[j]);
                            //将学校分类   分为学区学校  和私人学校
                            if($scope.allValue.schoolData[j].schoolAttribute == 'School District'){
                                $scope.allValue.district.push($scope.allValue.schoolData[j]);
                            }
                            if($scope.allValue.schoolData[j].schoolAttribute == 'Private School'){
                                $scope.allValue.private.push($scope.allValue.schoolData[j]);
                            }
                        };
                        //学校显示最多显示三所学校
                        $scope.allValue.district = $scope.allValue.district.length > 3 ? $scope.allValue.district.slice(0,3) : $scope.allValue.district;
                        $scope.allValue.private = $scope.allValue.private.length > 3 ? $scope.allValue.private.slice(0,3) : $scope.allValue.private;
                    }
                });
            };

            //===================================== 历史成交数据 ==============================
            //==================房子的历史成交，先将时间戳转化为日期，然后赋值给一个数组，循环显示出来==========================
            $scope.allValue.cvEventData = data.data.cvAndSale;
            for(var cv = 0,len = data.data.cvAndSale.length; cv < len; cv++){
                data.data.cvAndSale[cv].cvTime = myFactory.timeFormat(data.data.cvAndSale[cv].date)
            }
            //====================================== 获取社区信息 =================================

            //=============================================生成图表部分===============================
            //生成education图表
            $scope.allValue.educationChart = pFactory.createChart({
                myChart : 'education',
                itemClass : '.daiici_education_chart'
            });
            //生成income图表
            $scope.allValue.incomeChart = pFactory.createChart({
                myChart : 'income',
                itemClass : '.daiici_income_chart'
            });
            //生成rate图表
            $scope.allValue.rateChart = pFactory.createChart({
                myChart : 'rate',
                itemClass : '.daiici_rate_chart'
            });
            //生成Religious Affiliation图表
            $scope.allValue.livingChart = pFactory.createChart({
                myChart : 'livingRate',
                itemClass : '.daiicil_left_chart'
            });
            //representation图表部分
            $scope.allValue.representationChart = pFactory.createChart({
                myChart : 'representation',
                itemClass : '.daiicil_right_chart'
            });

            //设置图标响应式和加载loading
            $scope.reRep = myFactory.detail.chartResize({
                chart1 : $scope.allValue.representationChart.myChart,
                chart2 : $scope.allValue.livingChart.myChart,
                chart3 : $scope.allValue.rateChart.myChart,
                chart4 : $scope.allValue.educationChart.myChart,
                chart5 : $scope.allValue.incomeChart.myChart
            });
            $scope.chartLoad = myFactory.detail.chartLoading({
                chart1 : $scope.allValue.representationChart.myChart,
                chart2 : $scope.allValue.livingChart.myChart,
                chart3 : $scope.allValue.rateChart.myChart,
                chart4 : $scope.allValue.educationChart.myChart,
                chart5 : $scope.allValue.incomeChart.myChart
            });
                //=========== 获取社区数据 =========
            if($scope.allValue.allData.meshblockNumber){
                $scope.allValue.cummunityData = pFactory.postData({
                    url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getCommunityInfoBaseInfo/',
                    data:JSON.stringify({"meshNo":$scope.allValue.allData.meshblockNumber,"tiaCode":$scope.allValue.allData.tlaCode,"areaunitCode":$scope.allValue.allData.areaunitCode,'lang':'en'}),
                    callBack:function(data) {
                        //console.log(data.data[0]);
                        //console.log('===================社区数据====================');
                        $scope.allValue.communityData = data.data[0];

                        $scope.allValue.safeType = myFactory.detail.jugeSafe($scope.allValue.communityData.crimeRate)

                        //============================================部署图表的数据===============================
                        // 指定income图表的配置项和数据
                        $scope.allValue.incomeOption = {
                            tooltip: {},
                            grid: {
                                left: '0',
                                right: '4%',
                                bottom: '16%',
                                containLabel: true
                            },
                            legend: {
                                data:['income']
                            },
                            xAxis: {
                                splitLine:{show: false},
                                data: ["Auckland",$scope.allValue.allData.suburb,$scope.allValue.allData.road],
                                axisLabel: {
                                    interval: 0,
                                    rotate: 25,
                                    margin: 2,
                                    textStyle: {
                                        color: "#222"
                                    }
                                }
                            },
                            splitLine:{show: false},
                            yAxis :{
                                splitLine:{show: false},
                                axisLabel: {
                                    show: false
                                }
                            },
                            series: [{
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#fee100',
                                        label: {
                                            show: true,
                                            position: 'top',
                                            formatter: '${c}',
                                            textStyle : {
                                                color:'#000',
                                                fontSize:14
                                            }
                                        }
                                    }
                                },
                                barWidth:50,
                                data: [$scope.allValue.communityData.familyIncomeForRegion.toFixed(0),$scope.allValue.communityData.familyIncomeForCity.toFixed(0),$scope.allValue.communityData.familyIncome.toFixed(0)]
                            }]
                        };
                        $scope.allValue.incomeChart.myChart.setOption($scope.allValue.incomeOption);
                        $scope.allValue.incomeChart.myChart.hideLoading();

                        //设置education图表的参数
                        $scope.allValue.educationOption = {
                            tooltip: {},
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '16%',
                                containLabel: true
                            },
                            legend: {
                                data:['education']
                            },
                            xAxis: {
                                splitLine:{show: false},
                                type : 'category',
                                axisLabel: {
                                    interval: 0,
                                    rotate: 25,
                                    margin: 2,
                                    textStyle: {
                                        color: "#222"
                                    }
                                },
                                data: [data.data[0].degree[0].name,data.data[0].degree[1].name,data.data[0].degree[2].name,data.data[0].degree[3].name]
                            },
                            splitLine:{show: false},
                            yAxis :{
                                splitLine:{show: false},
                                axisLabel: {
                                    show: false
                                }
                            },
                            series: [{
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#fee100',
                                        label: {
                                            show: true,
                                            position: 'top',
                                            formatter: '{c}%',
                                            textStyle : {
                                                color:'#000',
                                                fontSize:14
                                            }
                                        }
                                    }
                                },
                                barWidth:50,
                                data: [
                                    ($scope.allValue.communityData.degree[0].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                    ($scope.allValue.communityData.degree[1].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                    ($scope.allValue.communityData.degree[2].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                    ($scope.allValue.communityData.degree[3].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2)
                                ]
                            }]
                        };
                        $scope.allValue.educationChart.myChart.setOption($scope.allValue.educationOption);
                        $scope.allValue.educationChart.myChart.hideLoading();

                        //设置rate参数
                        var publicNum = $scope.allValue.communityData.households[0].number == -1 ? 1 : $scope.allValue.communityData.households[0].number;
                        var holdNum = $scope.allValue.communityData.households[1].number == -1 ? 3 : $scope.allValue.communityData.households[1].number;

                        $scope.allValue.rateOption = {
                            tooltip: {},
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '16%',
                                containLabel: true
                            },
                            legend: {
                                data:['education','ccc']
                            },
                            xAxis: {
                                splitLine:{show: false},
                                data: [data.data[0].households[0].name,data.data[0].households[1].name],
                                axisLabel: {
                                    interval: 0,
                                    rotate: 25,
                                    margin: 2,
                                    textStyle: {
                                        color: "#222",
                                    }
                                }
                            },
                            splitLine:{show: false},
                            yAxis :{
                                splitLine:{show: false},
                                axisLabel: {
                                    show: false
                                }
                            },
                            series: [{
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#fee100',
                                        label: {
                                            show: true,
                                            position: 'top',
                                            formatter: '{c}%',
                                            textStyle : {
                                                color:'#000',
                                                fontSize:14
                                            }
                                        }
                                    }
                                },
                                barWidth:50,
                                data: [
                                    {
                                        name : 'b',
                                        value : holdNum.toFixed(2)
                                    },
                                    {
                                        name : 'a',
                                        value : publicNum.toFixed(2)
                                    }
                                ]
                            }]
                        };
                        $scope.allValue.rateChart.myChart.setOption($scope.allValue.rateOption);
                        $scope.allValue.rateChart.myChart.hideLoading();

                        var regionName = [];
                        var regionNum = [];
                        for(var re = 0,len = data.data[0].religions.length; re < len; re++){
                            if(data.data[0].religions[re].number != 0){
                                regionName.push(data.data[0].religions[re].name);
                                var a = {};
                                a.value = (100*$scope.allValue.communityData.religions[re].number/$scope.allValue.communityData.allReligions).toFixed(2);
                                a.name = data.data[0].religions[re].name;
                                regionNum.push(a);
                            }
                        }

                        //设置Religious Affiliation参数
                        $scope.allValue.livingOption = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{b}:\n{c}%"
                            },
                            color:['#bcf360','#37c73a','#ffd655','#dce0c0','#ffd900','#6059f0','#fd6840','#fb40fd','#ff0000'],
                            legend: {
                                orient: 'vertical',
                                x: 4.5*parseFloat(document.documentElement.style.fontSize)+'px',
                                y: 'middle',
                                data:regionName
                            },
                            series: [
                                {
                                    type:'pie',
                                    radius: ['45%', '65%'],
                                    avoidLabelOverlap: true,
                                    data:regionNum
                                }
                            ]
                        };
                        $scope.allValue.livingChart.myChart.setOption($scope.allValue.livingOption);
                        $scope.allValue.livingChart.myChart.hideLoading();

                        //设置人口种族参数 并生成饼状图
                        var kpName = [];
                        var kpNum = [];
                        for(var kp = 0,len = data.data[0].ethnic.length; kp < len; kp++){
                            if(data.data[0].ethnic[kp].number != 0){
                                kpName.push(data.data[0].ethnic[kp].name);
                                var a = {};
                                a.value = (100*$scope.allValue.communityData.ethnic[kp].number/$scope.allValue.communityData.allEthnicCount).toFixed(2);
                                a.name = data.data[0].ethnic[kp].name;
                                kpNum.push(a);
                            }
                        }


                        $scope.allValue.representationOption = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{b}:\n{c}%"
                            },
                            color:['#bcf360','#ffd900','#37c73a','#ffd655','#dce0c0','#6059f0'],
                            legend: {
                                orient: 'vertical',
                                x: 4.5*parseFloat(document.documentElement.style.fontSize)+'px',
                                y: 'middle',
                                data:kpName
                            },
                            series: [
                                {
                                    type:'pie',
                                    radius: ['45%', '65%'],
                                    avoidLabelOverlap: true,
                                    data:kpNum
                                }
                            ]
                        }
                        $scope.allValue.representationChart.myChart.setOption($scope.allValue.representationOption);
                        $scope.allValue.representationChart.myChart.hideLoading();
                        //===============================================图表数据设置结束============================
                    }
                })
            };


            //==================================加载页面的时候在地图上将当前的房子显示出来======================
            //设置最下面地图的参数
            $scope.allValue.mapOption = {
                id:'detail_footer_map',
                map:'detailMap',
                position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                zoom: 17,
                drag : true,
                wheelEvent : false
            };
            /*
             创建地图  pFactory.setSearchMap 会返回一个对象
             所以$scope.allValue.mapObj是一个对象
             这个对象中$scope.allValue.mapObj.map 是创建出来的地图 以后地图事件都用这个
             */
            $scope.allValue.mapObj = pFactory.setSearchMap($scope.allValue.mapOption);
            //地图上将房子圈起来
            $scope.allValue.circleHouse = pFactory.circleHouse({
                coordinate : $scope.allValue.allData.coordinateArray,
                mapName : $scope.allValue.mapObj.map
            });
            $scope.allValue.mapOption.name = new google.maps.Marker({
                position: $scope.allValue.mapOption.position,
                icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                map: $scope.allValue.mapOption.map
            });
            //=================================附近成交房子地图================================
            $scope.allValue.dealMapOption = {
                id:'detail_footer_dealmap',
                map:'detailDealMap',
                position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                zoom: 17,
                drag : true,
                wheelEvent : false
            };
            $scope.allValue.dealMapObj = pFactory.setSearchMap($scope.allValue.dealMapOption);


            //==================================== 获取附近房源信息 =====================================
            $scope.allValue.nearby = pFactory.postData({
                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyHouse',
                data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                callBack : function(data){
                    //============================附近房源信息=======================;
                    $scope.allValue.nearbyHouse = data.data;
                    //console.log(data)
                    var info = new google.maps.InfoWindow({maxWidth: 550});

                    for(var i = 0,len = data.data.length; i < len; i++){
                        data.data[i].houseCreateTime = myFactory.timeFormat(data.data[i].listedDate)
                    }
                    //console.log(data.data)
                    $scope.allValue.setNearbyHouseMap = myFactory.detail.setNearbyHouseIcon($scope.allValue.nearbyHouse,$scope.allValue.mapObj.map,$scope.allValue.allData.basePoint,info,$scope.imgDomain);
                    //附近房源li点击事件   在地图上显示信息框
                    $scope.allValue.nearbyHouseClick = function (obj){
                        //console.log(obj)
                        var contentString = '<a href="/detail?'+ obj._id +'&'+ obj.streetAddress +'&'+ obj.addressCity +'" class="mapInfo" target="_blank"><div>' +
                            '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+obj.houseMainImagePath+'"/></div>' +
                            '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                            '<p class="map_info_price">'+obj.housePrice+'</p>' +
                            '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                            '<ul><li><span class="map_info_bed"></span><span>'+obj.bedRoom+'</span><span class="map_info_bath"></span><span>'+obj.bathRoom+'</span></li></ul>' +
                            '</div></div>' +
                            '</a>';

                        info.setContent(contentString);
                        for(var c = 0,len = $scope.allValue.setNearbyHouseMap.length ; c < len ; c++){
                            if($scope.allValue.setNearbyHouseMap[c].markerPosition == obj._id){
                                info.open($scope.allValue.mapObj.map, $scope.allValue.setNearbyHouseMap[c].name);
                            }
                        }
                    }
                }
            });
        }
    });

    //地图导航添加样式
    $scope.allValue.mapNavAdd = function(n){
        myFactory.addClassName({
            itemSmall : '.daii_surrounding_nav>li',
            name : 'mapnav',
            num : n,
            nextEvent : false
        });
        myFactory.addClassName({
            itemSmall : '.daii_surrounding_info',
            name : 'daii_showMap',
            num : n,
            nextEvent : false
        });
        if(n == 1 && $scope.allValue.jugeFootMap){
            //=================================== 获取附近成交房源信息 ===================================
            $scope.allValue.nearby = pFactory.postData({
                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyDealedHouse',
                data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                callBack : function(data){
                    console.log(data)
                    $scope.allValue.dealHouse = data.data;
                    for(var i = 0,len = $scope.allValue.dealHouse.length; i < len; i++){
                        $scope.allValue.dealHouse[i].dealHouseTime = myFactory.timeFormat($scope.allValue.dealHouse[i].createTime);
                        $scope.allValue.dealHouse[i].price = $scope.allValue.dealHouse[i].price/1;
                    }
                    //$scope.allValue.dealMapObj
                    var info2 = new google.maps.InfoWindow({maxWidth: 550});
                    $scope.allValue.setDealHouseMap = myFactory.detail.setDealHouseIcon($scope.allValue.dealHouse,$scope.allValue.dealMapObj.map,$scope.allValue.allData.basePoint,info2,$scope.imgDomain);
                    //附近房源li点击事件   在地图上显示信息框
                    $scope.allValue.dealHouseClick = function (obj){
                        var contentString = '<a href="javascript:void(0)" class="mapInfo"><div>' +
                            '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+obj.coverImgPath+'"/></div>' +
                            '<div class="map_dis_wrap"><h4 title="'+ obj.dealHouseTime +'">Sold Time:'+obj.dealHouseTime+'</h4>' +
                            '<p class="map_info_price">$'+obj.price+'</p>' +
                            '<p class="map_info_addr">'+obj.hougardenAddress+'</p>' +
                            '<ul><li><span class="map_info_bed"></span><span>'+obj.bedrooms+'</span><span class="map_info_bath"></span><span>'+obj.bathrooms+'</span></li></ul>' +
                            '</div></div>' +
                            '</a>';

                        info2.setContent(contentString);
                        for(var c = 0,len = $scope.allValue.setDealHouseMap.length ; c < len ; c++){
                            if($scope.allValue.setDealHouseMap[c].markerName == obj._id){
                                info2.open($scope.allValue.dealMapObj.map, $scope.allValue.setDealHouseMap[c].name);
                            }
                        }
                    }
                }
            });
            $scope.allValue.jugeFootMap = false;
        }
    };

}]);
//===================================================== 估值页面 =======================================================
app.controller('estimateCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory','$interval','$location','publicFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$location,pFactory){
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;
    //挂载home页面所有数据
    $scope.allValue = {};
    $scope.allValue.timer = '';

    $scope.allValue.param = {};
    if(location.href.indexOf('?') == -1){
        $scope.allValue.currentSelectCity = "Auckland";
    }else{
        var paramArr = location.href.substr(location.href.indexOf('?')+1).split('&');
       console.log(paramArr);
        paramArr.forEach(function(item){
            $scope.allValue.param[item.split("=")[0]] = decodeURIComponent(item.split("=")[1]);
        })
        $scope.allValue.currentSelectCity = $scope.allValue.param.city
    }


    //设置英文首页SEO
    var titleStr = "House Price Estimate nz | TigerZ | Auction | Estimate";
    $('title').text(titleStr);
    $("meta[name='keywords']").attr('content',titleStr);
    var descStr =  "Sarch over 550,000 Auckland properties and free property insights";
    $("meta[name='description']").attr('content',descStr);

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/estimate.html?city=Auckland"
    }

    //=================================== 获取热搜词 ========================================================
    $scope.allValue.hotWords = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHotWords/en',
        callBack : function(data){
            //console.log(data);
            $scope.allValue.hotWordAll = data.data.slice(0,5);
            $scope.allValue.hotSuburb = data.data.slice(5);
        }
    });
    //========================================加载页面时候请求的数据 获取的是显示房子数量 涨幅的数据============================
    $scope.allValue.loadPage = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHouseStatistics',
        callBack : function(data){
            $scope.allValue.statics = data.data;
            var n = 0;
            if(angular.element('.dataSave').data('timerSave')){
                $interval.cancel(angular.element('.dataSave').data('timerSave'));
            }
            $scope.allValue.timer = $interval(function(){
                angular.element('.hld_static').animate({'top':-n*0.6*parseFloat(document.documentElement.style.fontSize)},300,function(){
                    n++;
                    if(n>=data.data.priceIncreaseList.length/3+1){
                        angular.element('.hld_static').css({'top':0});
                        n = 0;
                    }
                })
            },3000);
            angular.element('.dataSave').data('timerSave',$scope.allValue.timer);
        }
    });

    //搜索框要的显示数据
    $scope.allValue.subFlag = true;
    $scope.allValue.footSubFlag = true;
    $scope.allValue.currentValue = '';
    $scope.allValue.footValue = '';
    //====================================顶部搜索框内容发生改变的时候的请求数据======================
    $scope.allValue.searchBar = function(){
        if($scope.allValue.currentValue.length != 0){
            angular.element('.home_search_history').hide();
            angular.element('.home_search_simple').show();
            angular.element('.home_search_error').hide();
            $scope.allValue.searchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.currentValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    //console.log(data);
                    $scope.allValue.searchData = data.data;
                    data.data.length != 0 ? angular.element('.home_search_error').hide() : angular.element('.home_search_error').show();
                    $scope.allValue.searchBtn = function(){
                        if($scope.allValue.currentValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return 'detail?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity
                            }else{
                                return 'search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+"ct="+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.home_search_history').show();
            angular.element('.home_search_simple').hide();
            angular.element('.home_search_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                var json = {};
                $scope.allValue.searchHistoryData = [];
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        //console.log(obj);
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.blurEvent = function(){
        $scope.allValue.subFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.overEvent = function () {
        $scope.allValue.subFlag = false;
        $scope.allValue.blurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.leaveEvent = function (){
        $scope.allValue.blurEvent = function(){
            $scope.allValue.subFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.focusEvent = function(){
        $scope.allValue.subFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
            //console.log($scope.allValue.searchHistoryData);
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            if(obj.isSale){
                return 'detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity+"&"+$scope.allValue.currentSelectCity;
            }else{
                return 'house?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity+"&"+$scope.allValue.currentSelectCity;
            }

        }else{
            return 'search?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(for sale)' : 'House(not for sale)';
                break;
        }
    };

}]);
//===================================================== 拍卖结果页面 ==============================
app.controller('auctionCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory','$interval','$timeout','$location','publicFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$timeout,$location,pFactory){
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/auction.html?city=Auckland"
    }

    //挂载home页面所有数据
    $scope.allValue = {};
    $scope.allValue.timer = '';
    $scope.allValue.subFlag = true;

    $scope.allValue.param = {};
    if(location.href.indexOf('?') == -1){
        $scope.allValue.currentSelectCity = "Auckland";
    }else{
        var paramArr = location.href.substr(location.href.indexOf('?')+1).split('&');
        //console.log(paramArr);
        paramArr.forEach(function(item){
            $scope.allValue.param[item.split("=")[0]] = decodeURIComponent(item.split("=")[1]);
        })
        $scope.allValue.currentSelectCity = $scope.allValue.param.city
    }

    //切换城市
    $scope.allValue.changCityFn = function(str) {
        angular.element('.home_addr_choice').toggle(300);
        $scope.allValue.currentSelectCity = str.en;
    }


    //初始化分页
    myFactory.auction.page();

    //设置英文首页SEO
    var titleStr = "Auction Results Aucland nz | TigerZ | Auction | Estimate"
    $('title').text(titleStr);
    $("meta[name='keywords']").attr('content',titleStr);
    var descStr =  "The most complete and accurate property data in New Zealand";
    $("meta[name='description']").attr('content',descStr);

    //========================================加载页面时候请求的数据 获取的是显示房子数量 涨幅的数据============================
    $scope.allValue.loadPage = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHouseStatistics',
        callBack : function(data){
            $scope.allValue.statics = data.data;
            var n = 0;
            if(angular.element('.dataSave').data('timerSave')){
                $interval.cancel(angular.element('.dataSave').data('timerSave'));
            }
            $scope.allValue.timer = $interval(function(){
                angular.element('.hld_static').animate({'top':-n*0.6*parseFloat(document.documentElement.style.fontSize)},300,function(){
                    n++;
                    if(n>=data.data.priceIncreaseList.length/3+1){
                        angular.element('.hld_static').css({'top':0});
                        n = 0;
                    }
                })
            },3000);
            angular.element('.dataSave').data('timerSave',$scope.allValue.timer);
        }
    });

    //====================================顶部搜索框内容发生改变的时候的请求数据======================
    $scope.allValue.searchBar = function(){
        if($scope.allValue.currentValue.length != 0){
            angular.element('.home_search_history').hide();
            angular.element('.home_search_simple').show();
            angular.element('.home_search_error').hide();
            $scope.allValue.searchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.currentValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    //console.log(data);
                    $scope.allValue.searchData = data.data;
                    data.data.length != 0 ? angular.element('.home_search_error').hide() : angular.element('.home_search_error').show();
                    $scope.allValue.searchBtn = function(){
                        if($scope.allValue.currentValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return 'detail?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity
                            }else{
                                return 'search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+'&ct='+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.home_search_history').show();
            angular.element('.home_search_simple').hide();
            angular.element('.home_search_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                var json = {};
                $scope.allValue.searchHistoryData = [];
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        //console.log(obj);
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.blurEvent = function(){
        $scope.allValue.subFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.overEvent = function () {
        $scope.allValue.subFlag = false;
        $scope.allValue.blurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.leaveEvent = function (){
        $scope.allValue.blurEvent = function(){
            $scope.allValue.subFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.focusEvent = function(){
        $scope.allValue.subFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
            //console.log($scope.allValue.searchHistoryData);
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            if(obj.isSale){
                return 'detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }else{
                return 'house?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }

        }else{
            return 'search?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(for sale)' : 'House(not for sale)';
                break;
        }
    };
    //判断在售还是非在售确定跳转
    $scope.allValue.auctionJage = function(obj){
        if(obj.status == "Sold"){
            return "/house?"+obj.houseId+"&"+obj.addressDetail+'&'+$scope.allValue.currentSelectCity;
        }else{
            return "/detail?"+obj.sellingId+"&"+obj.addressDetail+'&'+$scope.allValue.currentSelectCity;
        }
    };

    function moveTop(){
        angular.element("html,body").animate({scrollTop:$('.home_last_info').offset().top},300);
    }
    $scope.$watch("allValue.currentSelectCity",function(){
        $scope.allValue.currentCity = "All City" //district
        $scope.allValue.currentArea = "All Suburb"//area
        $scope.allValue.currentAgency = "All Agency"//agency
        $scope.allValue.currentStatus = "Sold"//status
        var cityTemp = true;
        var areaTemp = true;
        var agencyTemp = true;
        var statusTemp = true;
        $scope.allValue.alertTimer = '';

        $scope.allValue.defaultCity = "";
        $scope.allValue.defaultSuburb = "";
        $scope.allValue.defaultAgency = "";
        $scope.allValue.defaultSold = "yes";
        $scope.allValue.defaultPage = 1;

        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        }
        //=========================================== 加载页面请求拍卖房源 ===========================================
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                //$scope.allValue.allData.shareData = $scope.allValue.allData.type == "Cross Lease" ? '1/'+$scope.allValue.allData.houseHolds + ' share ' + $scope.allValue.allData.landArea + '㎡' : $scope.allValue.allData.landArea + '㎡';

                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount;
                $scope.allValue.nowPage = data.data.curCount;
                for(x in $scope.allValue.auctionListData){
                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }

                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                };
                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide();
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }
                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });
            }
        });
        var slectTempCity = JSON.parse(JSON.stringify($scope.cityJson[$scope.allValue.currentSelectCity].city))
        slectTempCity.unshift("All City");
        $scope.allValue.select = {
            "city":slectTempCity,
            "suburb":$scope.cityJson[$scope.allValue.currentSelectCity].suburb
        }
    })

    $scope.allValue.agencys = ["All Agency","Bayleys","Ray White City Apartments","Harcourts","City Sales","Impression Real Estate"]

    //$scope.allValue.agencys = ["All Agency","Bayleys","Ray White City Apartments","Barfoot & Thompson","Harcourts","City Sales","Impression Real Estate"]
    $scope.allValue.statuses = ["All Type",'Sold','Not Sold']

    $scope.allValue.currentCity = "All City" //district
    $scope.allValue.currentArea = "All Suburb"//area
    $scope.allValue.currentAgency = "All Agency"//agency
    $scope.allValue.currentStatus = "Sold"//status
    var cityTemp = true;
    var areaTemp = true;
    var agencyTemp = true;
    var statusTemp = true;
    $scope.allValue.alertTimer = '';

    $scope.allValue.defaultCity = "";
    $scope.allValue.defaultSuburb = "";
    $scope.allValue.defaultAgency = "";
    $scope.allValue.defaultSold = "yes";
    $scope.allValue.defaultPage = 1;

    $scope.allValue.auctionParam = {
        scope:$scope.allValue.currentSelectCity,
        city:$scope.allValue.defaultCity,
        suburb:$scope.allValue.defaultSuburb,
        agency:$scope.allValue.defaultAgency,
        isSold:$scope.allValue.defaultSold,
        page:$scope.allValue.defaultPage
    }
    //=========================================== 加载页面请求拍卖房源 ===========================================
    pFactory.postData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
        data:JSON.stringify($scope.allValue.auctionParam),
        callBack:function(data) {
            console.log(data)
            $('.auction_mask').hide();
            //$scope.allValue.allData.shareData = $scope.allValue.allData.type == "Cross Lease" ? '1/'+$scope.allValue.allData.houseHolds + ' share ' + $scope.allValue.allData.landArea + '㎡' : $scope.allValue.allData.landArea + '㎡';

            $scope.allValue.auctionListData = data.data.auctionList;
            $scope.allValue.totalPage = data.data.pageCount;
            $scope.allValue.nowPage = data.data.curCount;
            for(x in $scope.allValue.auctionListData){
                if($scope.allValue.auctionListData[x].landArea){
                    if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                        $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                    }else{
                        $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                    }
                }else {
                    $scope.allValue.auctionListData[x].shareData = 'N/A'
                }

                $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
            };
            $(".tcdPageCode").empty();
            $(".tcdPageCode").append($('<div class="tcd"></div>'))

            if($.fn.createPage){
                $.fn.createPage = null;
            }
            //初始化分页
            myFactory.auction.page();
            $(".tcd").createPage({
                pageCount:$scope.allValue.totalPage/1,
                current:$scope.allValue.nowPage/1,
                backFn:function(p){
                    //console.log(p)
                    $scope.allValue.auctionParam.page = p/1;
                    $('.auction_mask').show();
                    moveTop();
                    pFactory.postData({
                        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                        data:JSON.stringify($scope.allValue.auctionParam),
                        callBack:function(data) {
                            $('.auction_mask').hide();
                            $scope.allValue.auctionListData = data.data.auctionList;
                            for(x in $scope.allValue.auctionListData){
                                if($scope.allValue.auctionListData[x].landArea){
                                    if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                        $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                    }else{
                                        $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                    }
                                }else {
                                    $scope.allValue.auctionListData[x].shareData = 'N/A'
                                }
                                $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                            }
                        }
                    });
                }
            });
        }
    });

    $('.search_select_city').on('click',function(){
        $('.search_select_areaItem').hide();
        $('.search_select_agencyItem').hide();
        $('.search_select_statusItem').hide();

        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;

        $('.select_area_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_agency_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_status_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        if(cityTemp){
            $('.search_select_cityItem').show();
            $('.select_city_tri').css({
                'border': '5px solid transparent',
                'border-bottom':'5px solid #2b2b2b',
                'top':'10px'
            });
        }else{
            $('.search_select_cityItem').hide();
            $('.select_city_tri').css({
                'border': '5px solid transparent',
                'border-top':'5px solid #2b2b2b',
                'top':'15px'
            });
        }
        cityTemp = !cityTemp
    });
    $scope.allValue.cityClick = function(str){
        $('.auction_mask').show();
        moveTop();
        cityTemp = true;
        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $scope.allValue.PAGE = null;
        $('.search_select_cityItem').hide();
        //$('.select_city_show').text(str)
        $('.select_city_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $scope.allValue.currentCity = str;
        $scope.allValue.currentArea = 'All Suburb';
        if($scope.allValue.currentCity != "All City"){
            $scope.allValue.areas = $scope.allValue.select.suburb[$scope.allValue.currentCity];
        }

        $scope.allValue.defaultCity = $scope.allValue.currentCity == "All City" ? "" : $scope.allValue.currentCity;
        $scope.allValue.defaultSuburb = "";

        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        }

        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                $('.auction_mask').hide();
                //console.log(data)
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount/1;
                $scope.allValue.nowPage = data.data.curCount/1;
                for(x in $scope.allValue.auctionListData){
                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }
                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                }
                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide();
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }
                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });

            }
        });
    }

    $('.search_select_area').on('click',function(){
        $('.search_select_agencyItem').hide();
        $('.search_select_cityItem').hide();
        $('.search_select_statusItem').hide();
        cityTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $('.select_agency_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_city_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_status_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });

        if($scope.allValue.alertTimer) {
            $timeout.cancel($scope.allValue.alertTimer)
        }
        if($scope.allValue.currentCity == "All City"){
            angular.element('.select_alert').show(30);
            $scope.allValue.alertTimer = $timeout(function(){
                angular.element('.select_alert').hide(300);
            },600)
            return
        }


        if(areaTemp){
            $('.search_select_areaItem').show();
            $('.select_area_tri').css({
                'border': '5px solid transparent',
                'border-bottom':'5px solid #2b2b2b',
                'top':'10px'
            });
        }else{
            $('.search_select_areaItem').hide();
            $('.select_area_tri').css({
                'border': '5px solid transparent',
                'border-top':'5px solid #2b2b2b',
                'top':'15px'
            });
        }
        areaTemp = !areaTemp
    });
    $scope.allValue.areaClick = function(str){
        $('.auction_mask').show();
        moveTop();
        cityTemp = true;
        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $('.search_select_areaItem').hide();
        //$('.select_city_show').text(str)
        $('.select_area_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $scope.allValue.currentArea = str;


        $scope.allValue.defaultSuburb = $scope.allValue.currentArea == "All Suburb" ? "" : $scope.allValue.currentArea;
        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        };
        //console.log($scope.allValue.auctionParam)
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount/1;
                $scope.allValue.nowPage = data.data.curCount/1;
                //console.log($scope.allValue.totalPage,$scope.allValue.nowPage);
                for(x in $scope.allValue.auctionListData){
                    //$scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].type == "Cross Lease" ? '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡' : $scope.allValue.auctionListData[x].landArea + '㎡';
                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }
                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                }

                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide();
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }

                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });

            }
        });
    }

    $('.search_select_agency').on('click',function(){
        $('.search_select_areaItem').hide();
        $('.search_select_cityItem').hide();
        $('.search_select_statusItem').hide();
        cityTemp = true;
        areaTemp = true;
        statusTemp = true;
        $('.select_area_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_city_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_status_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        if(agencyTemp){
            $('.search_select_agencyItem').show();
            $('.select_agency_tri').css({
                'border': '5px solid transparent',
                'border-bottom':'5px solid #2b2b2b',
                'top':'10px'
            });
        }else{
            $('.search_select_agencyItem').hide();
            $('.select_agency_tri').css({
                'border': '5px solid transparent',
                'border-top':'5px solid #2b2b2b',
                'top':'15px'
            });
        }
        agencyTemp = !agencyTemp
    });
    $scope.allValue.agencyClick = function(str){
        $('.auction_mask').show();
        moveTop();
        cityTemp = true;
        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $('.search_select_agencyItem').hide();
        //$('.select_city_show').text(str)
        $('.select_agency_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $scope.allValue.currentAgency = str;

        //$scope.allValue.auctionParam.city = $scope.allValue.currentCity == "All City" ? "" : $scope.allValue.currentCity;
        //$scope.allValue.auctionParam.suburb = $scope.allValue.currentArea == "All Suburb" ? "" : $scope.allValue.currentArea;
        $scope.allValue.defaultAgency = $scope.allValue.currentAgency == "All Agency" ? "" : $scope.allValue.currentAgency;
        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        };
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount/1;
                $scope.allValue.nowPage = data.data.curCount/1;
                //console.log($scope.allValue.totalPage,$scope.allValue.nowPage);
                for(x in $scope.allValue.auctionListData){
                    //$scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].type == "Cross Lease" ? '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡' : $scope.allValue.auctionListData[x].landArea + '㎡';
                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }
                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                }

                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide();
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }

                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });

            }
        });
    }

    $('.search_select_status').on('click',function(){
        $('.search_select_cityItem').hide();
        $('.search_select_agencyItem').hide();
        $('.search_select_areaItem').hide();

        cityTemp = true;
        agencyTemp = true;
        areaTemp = true;
        $('.select_city_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_agency_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_area_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        if(statusTemp){
            $('.search_select_statusItem').show();
            $('.select_status_tri').css({
                'border': '5px solid transparent',
                'border-bottom':'5px solid #2b2b2b',
                'top':'10px'
            });
        }else{
            $('.search_select_statusItem').hide();
            $('.select_status_tri').css({
                'border': '5px solid transparent',
                'border-top':'5px solid #2b2b2b',
                'top':'15px'
            });
        }
        statusTemp = !statusTemp
    });
    $scope.allValue.statusClick = function(str){
        $('.auction_mask').show();
        moveTop();
        cityTemp = true;
        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $('.search_select_statusItem').hide();
        //$('.select_city_show').text(str)
        $('.select_status_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $scope.allValue.currentStatus = str;

        $scope.allValue.defaultSold = $scope.allValue.currentStatus == "All Type" ? "" : ($scope.allValue.currentStatus == "Sold" ? "yes" : "no")
        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        };
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount/1;
                $scope.allValue.nowPage = data.data.curCount/1;
                //console.log($scope.allValue.totalPage,$scope.allValue.nowPage);
                for(x in $scope.allValue.auctionListData){
                    //$scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].type == "Cross Lease" ? '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡' : $scope.allValue.auctionListData[x].landArea + '㎡';
                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }
                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                }

                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide();
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = '1/'+$scope.allValue.auctionListData[x].houseHolds + ' share ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }

                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });
            }
        });
    }
}]);
//=================================================== 个人中心页面 ================================================
app.controller('userCtrl',['$scope','$routeParams',function($scope,$routeParams){
    //console.log(window.location);
    //console.log($routeParams);
    $scope.allValue = {};
    $scope.allValue.userPhoto = "http://res.tigerz.nz/imgs/defaultphoto.png"
    $scope.allValue.currentItem = 0;
    $scope.allValue.nickname = 'My TigerZ';
    $scope.allValue.gender = 'secret';

    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }
    var username=getCookie('name');
    if(username){
        console.log(username);
    }
}]);


//===================================================== 中文部分 ========================================
//=================================================== 中文首页控制器 =================================
app.controller('homeCNCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory1','$interval','publicFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,pFactory){
    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/index_cn.html"
    }
    var cityJson = citysJson
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;
    //挂载home页面所有数据
    $scope.allValue = {};
    $scope.allValue.timer = '';
    $scope.allValue.currentSelectCity = "Auckland";

    $scope.allValue.currentNavFn = cityJson[$scope.allValue.currentSelectCity].hotSearch[0].en;
    $scope.allValue.citysNav = {
        city:cityJson[$scope.allValue.currentSelectCity].hotSearch
    }
    $scope.allValue.currentNavSuburbs = cityJson[$scope.allValue.currentSelectCity].suburb[$scope.allValue.currentNavFn]

    $scope.allValue.overNavLiEvent = function(n,str){
        $scope.allValue.currentNavFn = str;
        $scope.allValue.currentNavSuburbs = cityJson[$scope.allValue.currentSelectCity].suburb[$scope.allValue.currentNavFn]

        $scope.allValue.cds = myFactory.addClassName({
            itemSmall : '.nav_citys>li',
            name : 'overNavLi',
            num : n,
            nextEvent :false
        })
    };
    $scope.allValue.sOverNavLiEvent = function(n){
        $scope.allValue.cdss = myFactory.addClassName({
            itemSmall : '.nav_city_wrap>li',
            name : 'overNavSubLi',
            num : n,
            nextEvent :false
        })
    };

    $scope.allValue.changCityFn = function(str){
        angular.element('.home_addr_choice').toggle(300);
        angular.element('.home_current_city').text(str.cn);
        $scope.allValue.currentSelectCity = str.en;

        //在页面展示的热搜替换
        $scope.allValue.currentNavFn = $scope.cityJson[$scope.allValue.currentSelectCity].hotSearch[0].en;
        $scope.allValue.citysNav = {
            city:$scope.cityJson[$scope.allValue.currentSelectCity].hotSearch
        }
        $scope.allValue.currentNavSuburbs = $scope.cityJson[$scope.allValue.currentSelectCity].suburb[$scope.allValue.currentNavFn]
    }

    var seoWord = location.href.indexOf('?') == -1 ? '' : location.href.substr(location.href.indexOf('?')+1);

    //设置中文首页SEO
    var titleStr = '老虎买房|新西兰房产中介|Tigerz | ' + seoWord;
    $('title').text(titleStr);
    $("meta[name='keywords']").attr('content',"老虎买房|新西兰房产中介|Tigerz |奥克兰买房,新西兰买房");

    //$("meta[name='keywords']").attr('content',titleStr+'奥克兰买房,新西兰买房');
    var descStr =  "新西兰房产中介,提供免费房产评估,学区房，社区等数据，是新西兰最大房产中介网站";
    $("meta[name='description']").attr('content',descStr);

    //=================================== 获取热搜词 ========================================================
    $scope.allValue.hotWords = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHotWords/cn',
        callBack : function(data){
            console.log(data)
            $scope.allValue.hotWordAll = data.data.slice(0,5);
            $scope.allValue.hotSuburb = data.data.slice(5);
        }
    });
    //========================================加载页面时候请求的数据 获取的是显示房子数量 涨幅的数据============================
    $scope.allValue.loadPage = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHouseStatistics',
        callBack : function(data){
            $scope.allValue.statics = data.data;
            var n = 0;
            if(angular.element('.dataSave').data('timerSave')){
                $interval.cancel(angular.element('.dataSave').data('timerSave'));
            }
            $scope.allValue.timer = $interval(function(){
                angular.element('.hld_static').animate({'top':-n*0.6*parseFloat(document.documentElement.style.fontSize)},300,function(){
                    n++;
                    if(n>=data.data.priceIncreaseList.length/3+1){
                        angular.element('.hld_static').css({'top':0});
                        n = 0;
                    }
                })
            },3000);
            angular.element('.dataSave').data('timerSave',$scope.allValue.timer);
        }
    });

    //搜索框要的显示数据
    $scope.allValue.subFlag = true;
    $scope.allValue.footSubFlag = true;
    $scope.allValue.currentValue = '';
    $scope.allValue.footValue = '';
    //====================================顶部搜索框内容发生改变的时候的请求数据======================
    $scope.allValue.searchBar = function(){
        if($scope.allValue.currentValue.length != 0){
            angular.element('.home_search_history').hide();
            angular.element('.home_search_simple').show();
            angular.element('.home_search_error').hide();
            $scope.allValue.searchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.currentValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    $scope.allValue.searchData = data.data;
                    data.data.length != 0 ? angular.element('.home_search_error').hide() : angular.element('.home_search_error').show();

                    $scope.allValue.searchBtn = function(){
                        if($scope.allValue.currentValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return '/detail_cn?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+"&"+$scope.allValue.currentSelectCity
                            }else{
                                return '/search_cn?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+"&"+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.home_search_history').show();
            angular.element('.home_search_simple').hide();
            angular.element('.home_search_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                var json = {};
                $scope.allValue.searchHistoryData = [];
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.blurEvent = function(){
        $scope.allValue.subFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.overEvent = function () {
        $scope.allValue.subFlag = false;
        $scope.allValue.blurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.leaveEvent = function (){
        $scope.allValue.blurEvent = function(){
            $scope.allValue.subFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.focusEvent = function(){
        $scope.allValue.subFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            //return 'detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName;
            if(obj.isSale){
                return 'detail_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity+"&"+$scope.allValue.currentSelectCity;
            }else{
                return 'house_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity+"&"+$scope.allValue.currentSelectCity;
            }
        }else{
            return 'search_cn?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(在售)' : 'House(非可售)';
                break;
        }
    };

    //=================================底部搜索框内容发生变化事件==================================
    $scope.allValue.footSearchBar = function(){
        if($scope.allValue.footValue.length != 0){
            angular.element('.hf_search_history').hide();
            angular.element('.hf_search_simple').show();
            angular.element('.hf_search_error').hide();
            $scope.allValue.footSearchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.footValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    $scope.allValue.footSearchData = data.data;
                    data.data.length != 0 ? angular.element('.hf_search_error').hide() : angular.element('.hf_search_error').show();
                    $scope.allValue.footSearchBtn = function(){
                        if($scope.allValue.footValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return '/detail_cn?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity
                            }else{
                                return '/search_cn?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+'&ct='+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.hf_search_history').show();
            angular.element('.hf_search_simple').hide();
            angular.element('.hf_search_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                $scope.allValue.searchHistoryData = [];
                var json = {};
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };
    $scope.allValue.footFocusEvent = function(){
        $scope.allValue.footSubFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    $scope.allValue.footBlurEvent = function(){
        $scope.allValue.footSubFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.footOverEvent = function () {
        $scope.allValue.footSubFlag = false;
        $scope.allValue.footBlurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.footLeaveEvent = function (){
        $scope.allValue.footBlurEvent = function(){
            $scope.allValue.footSubFlag = true;
        }
    };

    //=================================== dataInformation中的点击切换 ============================
    $scope.allValue.dataInfo = function(n){
        $scope.allValue.diw = myFactory.addClassName({
            itemSmall : '.hld_downdata>li',
            name : 'hld_turn_num',
            num : n,
            nextEvent :false //在接下来要实现上面轮播
        });
        $scope.allValue.din = myFactory.addClassName({
            itemSmall : '.hld_downdata>li>.hld_downdata_icon',
            name :'hld_turn_icon',
            num : n,
            nextEvent : false
        });
        $scope.allValue.dataInfoClick = myFactory.home.litteDot({
            wrap: '.hldu_ul',
            num: n,
            moveWidth: 9.8,
            moveTime: 500,
            nextEvent: false
        })
    };
    //----------------------------------------------推荐房源和公司介绍-------后期会做--------------

    /*
    //================================== 获取 open house 的数据 ====================================
    $scope.allValue.getOpenHouseData = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getRecommendGoodHouse/21',
        callBack : function(data){
            var tempAllHouse = data.data.slice(0);
            $scope.allValue.openHouseData = [];
            for(var i = 0; i < 7; i++){
                var tempArr = tempAllHouse.slice(i*3,(i+1)*3);
                $scope.allValue.openHouseData.push(tempArr);
            }
        }
    });

    //================================= 获取 great high school 的数据==============================
    $scope.allValue.getSchoolHouseData = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getRecommendSchoolHouse/21',
        callBack : function(data){
            var tempAllHouse = data.data.slice(0);
            $scope.allValue.schoolHouseData = [];
            for(var i = 0; i < 7; i++){
                var tempArr = tempAllHouse.slice(i*3,(i+1)*3);
                $scope.allValue.schoolHouseData.push(tempArr);
            }
        }
    });

    //================================ 获取waterfront 的数据======================================
    $scope.allValue.getWaterHouseData = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getRecommendViewHouse/21',
        callBack : function(data){
            var tempAllHouse = data.data.slice(0);
            $scope.allValue.waterHouseData = [];
            for(var i = 0; i < 7; i++){
                var tempArr = tempAllHouse.slice(i*3,(i+1)*3);
                $scope.allValue.waterHouseData.push(tempArr);
            }
        }
    });
    //================================= open house 中的点击切换 ==================================
    $scope.allValue.openHouse = function(str){
        $scope.allValue.oHouse = myFactory.normalTurn({
            wrap : '.hoh_img_trun',
            direct : 'left',
            clickType : str,
            clickDefalut : 'add',
            maxNum : 7,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            //下面小图添加样式
            nextEventOption : {
                itemSmall : '.hoh_dot>li',
                name : 'hoh_doted',
                num : 0,
                nextEvent : false
            }
        })
    };
    $scope.allValue.openHouseDot = function(n){
        $scope.allValue.oHouseDotClick = myFactory.home.litteDot({
            wrap : '.hoh_img_trun',
            num : n,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            nextEventOption : {
                itemSmall : '.hoh_dot>li',
                name : 'hoh_doted',
                num : n,
                nextEvent : false
            }
        })
    };

    //================================= great high school 中的点击切换 ==========================
    $scope.allValue.greatHighSchool = function(str){
        $scope.allValue.ghSchool = myFactory.normalTurn({
            wrap : '.hgs_img_trun',
            direct : 'left',
            clickType : str,
            clickDefalut : 'add',
            maxNum : 7,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            //下面小图添加样式
            nextEventOption : {
                itemSmall : '.hgs_dot>li',
                name : 'hgs_doted',
                num : 0,
                nextEvent : false
            }
        })
    };
    $scope.allValue.ghDot = function(n){
        $scope.allValue.oHouseDotClick = myFactory.home.litteDot({
            wrap : '.hgs_img_trun',
            num : n,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            nextEventOption : {
                itemSmall : '.hgs_dot>li',
                name : 'hgs_doted',
                num : n,
                nextEvent : false
            }
        })
    };

    //================================ waterfront 中的点击切换 =================================
    $scope.allValue.waterFront = function(str){
        $scope.allValue.ghSchool = myFactory.normalTurn({
            wrap : '.hw_img_trun',
            direct : 'left',
            clickType : str,
            clickDefalut : 'add',
            maxNum : 7,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            //下面小图添加样式
            nextEventOption : {
                itemSmall : '.hw_dot>li',
                name : 'hw_doted',
                num : 0,
                nextEvent : false
            }
        })
    };
    $scope.allValue.wfDot = function(n){
        $scope.allValue.oHouseDotClick = myFactory.home.litteDot({
            wrap : '.hw_img_trun',
            num : n,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            nextEventOption : {
                itemSmall : '.hw_dot>li',
                name : 'hw_doted',
                num : n,
                nextEvent : false
            }
        })
    };

    //================================= tigerz介绍点击切换 ============================
    $scope.allValue.tigerzIntroduce = function (str){
        $scope.allValue.introduce = myFactory.normalTurn({
            wrap : '.hth_turn',
            direct : 'left',
            clickType : str,
            clickDefalut : 'add',
            maxNum : 7,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            //下面小图添加样式
            nextEventOption : {
                itemSmall : '.hth_dot>li',
                name : 'hth_doted',
                num : 0,
                nextEvent : false
            }
        })
    };
    $scope.allValue.introduceDot = function(n){
        $scope.allValue.introduceDotClick = myFactory.home.litteDot({
            wrap : '.hth_turn',
            num : n,
            moveWidth : 12,
            moveTime : 500,
            nextEvent : true,
            eventName : 'addClassName',
            nextEventOption : {
                itemSmall : '.hth_dot>li',
                name : 'hth_doted',
                num : n,
                nextEvent : false
            }
        })
    };

    */

    //----------------------------------------------登陆注册----------------------------------------
    $scope.allValue.isLogin = false;
    $scope.allValue.hasLogin = false;
    $scope.allValue.lEmail = '';
    $scope.allValue.lPassword = '';
    $scope.allValue.loginTemp = true;
    $scope.allValue.rightUser = true;
    $scope.allValue.autoLogin = true;
    $scope.allValue.exitEmail = false;
    $scope.allValue.jugeRePassword = false;
    $scope.allValue.registPassword = '';
    $scope.allValue.registRePassword = '';

    $scope.allValue.loginFn = function(){
        $scope.allValue.isLogin = !$scope.allValue.isLogin;
    };
    $scope.allValue.loginRigist = function(){
        $scope.allValue.loginTemp = !$scope.allValue.loginTemp;
    }
    $scope.allValue.loginBtnFn = function(str){
        if(str){return}
        if($scope.allValue.autoLogin){
            console.log(11111111111);
            alert('Two week automatic landing');
        }
        console.log($scope.allValue.lEmail);
        console.log($scope.allValue.lPassword);
        $scope.allValue.hasLogin = true;
        $scope.allValue.isLogin = false;
        document.cookie = 'name'+'='+$scope.allValue.lEmail
        //window.setCookie('name','jvid')
    }
    $scope.allValue.jugePassword = function(){
        $scope.allValue.jugeRePassword = $scope.allValue.registPassword == $scope.allValue.registRePassword ? false : true;
    }

}]);
//==================================================== 中文搜索页控制器 =================================================
app.controller('searchCNCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory1','$timeout','$interval','publicFactory','searchFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$timeout,$interval,pFactory,sFactory){
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;
    $("meta[name='keywords']").attr('content',"老虎买房|新西兰房产中介|Tigerz |奥克兰买房,新西兰买房");

    //挂载所有数据
    $scope.allValue = {};

    //地图上犯罪率照片的范围
    var _bounds = {
        1:[[1,1],[1,1]],
        2:[[3,2],[3,2]],
        3:[[7,4],[7,5]],
        4:[[15,9],[15,10]],
        5:[[30,19],[31,20]],
        6:[[60,38],[63,41]],
        7:[[121,76],[127,83]],
        8:[[243,152],[255,166]],
        9:[[486,305],[511,332]],
        10:[[973,611],[1023,666]],
        11:[[1947,1222],[2047,1333]],
        12:[[3894,2445],[4095,2667]],
        13:[[7789,4890],[8191,5335]],
        14:[[15578,9781],[16383,10671]],
        15:[[31156,19562],[32767,21342]],
        16:[[62312,39124],[65535,39182]]
    };

    //$scope.allValue.select = {
    //    "city": [
    //        "Auckland City",
    //        "Franklin",
    //        "Hauraki Gulf Islands",
    //        "Manukau City",
    //        "North Shore City",
    //        "Papakura",
    //        "Rodney",
    //        "Waiheke Island",
    //        "Waitakere City"
    //    ],
    //    "suburb": {
    //        "Franklin": [
    //            "Aka Aka",
    //            "Ararimu",
    //            "Awhitu",
    //            "Bombay",
    //            "Buckland",
    //            "Clarks Beach",
    //            "Glen Murray",
    //            "Glenbrook",
    //            "Hunua",
    //            "Kaiaua",
    //            "Karaka",
    //            "Kingseat",
    //            "Mangatangi",
    //            "Mangatawhiri",
    //            "Manukau Heads",
    //            "Mauku",
    //            "Mercer",
    //            "Miranda",
    //            "Onewhero",
    //            "Otaua",
    //            "Paerata",
    //            "Patumahoe",
    //            "Pokeno",
    //            "Pollok",
    //            "Port Waikato",
    //            "Pukekawa",
    //            "Pukekohe",
    //            "Pukekohe East",
    //            "Puni",
    //            "Ramarama",
    //            "Te Kohanga",
    //            "Tuakau",
    //            "Waiau Pa",
    //            "Waiuku",
    //            "Whakatiwai",
    //            "Whangape"
    //        ],
    //        "North Shore City": [
    //            "Albany",
    //            "Bayswater",
    //            "Bayview",
    //            "Beach Haven",
    //            "Belmont",
    //            "Birkdale",
    //            "Birkenhead",
    //            "Browns Bay",
    //            "Campbells Bay",
    //            "Castor Bay",
    //            "Chatswood",
    //            "Devonport",
    //            "Fairview Heights",
    //            "Forrest Hill",
    //            "Glenfield",
    //            "Greenhithe",
    //            "Hauraki",
    //            "Hillcrest",
    //            "Long Bay",
    //            "Lucas Heights",
    //            "Mairangi Bay",
    //            "Milford",
    //            "Murrays Bay",
    //            "Narrow Neck",
    //            "Northcote",
    //            "Northcote Point",
    //            "Northcross",
    //            "Okura",
    //            "Oteha",
    //            "Paremoremo",
    //            "Pinehill",
    //            "Rosedale",
    //            "Rothesay Bay",
    //            "Schnapper Rock",
    //            "Stanley Point",
    //            "Sunnynook",
    //            "Takapuna",
    //            "Torbay",
    //            "Totara Vale",
    //            "Unsworth Heights",
    //            "Waiake",
    //            "Wairau Valley",
    //            "Windsor Park"
    //        ],
    //        "Rodney": [
    //            "Albany Heights",
    //            "Algies Bay",
    //            "Arkles Bay",
    //            "Army Bay",
    //            "Coatesville",
    //            "Dairy Flat",
    //            "Gulf Harbour",
    //            "Hatfields Beach",
    //            "Helensville",
    //            "Hibiscus Coast Surrounds",
    //            "Huapai",
    //            "Kaipara Flats",
    //            "Kaukapakapa",
    //            "Kumeu",
    //            "Leigh",
    //            "Mahurangi East",
    //            "Mahurangi West",
    //            "Makarau",
    //            "Manly",
    //            "Matakana",
    //            "Matakatia",
    //            "Millwater",
    //            "Muriwai",
    //            "Omaha",
    //            "Orewa",
    //            "Pakiri",
    //            "Parakai",
    //            "Point Wells",
    //            "Port Albert",
    //            "Puhoi",
    //            "Red Beach",
    //            "Redvale",
    //            "Riverhead",
    //            "Rodney Surrounds",
    //            "Sandspit",
    //            "Shelly Beach",
    //            "Silverdale",
    //            "Snells Beach",
    //            "South Head",
    //            "Stanmore Bay",
    //            "Stillwater",
    //            "Tapora",
    //            "Tauhoa",
    //            "Taupaki",
    //            "Tawharanui Peninsula",
    //            "Te Arai",
    //            "Te Hana",
    //            "Ti Point",
    //            "Tindalls Beach",
    //            "Tomarata",
    //            "Waimauku",
    //            "Wainui",
    //            "Waitoki",
    //            "Waiwera",
    //            "Warkworth",
    //            "Wayby Valley",
    //            "Wellsford",
    //            "Whangaparaoa",
    //            "Whangaripo",
    //            "Whangateau",
    //            "Wharehine",
    //            "Woodhill Forest"
    //        ],
    //        "Hauraki Gulf Islands": [
    //            "Great Barrier Island",
    //            "Kawau Island",
    //            "Other Islands",
    //            "Rakino Island"
    //        ],
    //        "Manukau City": [
    //            "Alfriston",
    //            "Auckland Airport",
    //            "Beachlands",
    //            "Botany Downs",
    //            "Brookby",
    //            "Bucklands Beach",
    //            "Burswood",
    //            "Clendon Park",
    //            "Clevedon",
    //            "Clover Park",
    //            "Cockle Bay",
    //            "Dannemora",
    //            "East Tamaki",
    //            "East Tamaki Heights",
    //            "Eastern Beach",
    //            "Farm Cove",
    //            "Favona",
    //            "Flat Bush",
    //            "Golflands",
    //            "Goodwood Heights",
    //            "Half Moon Bay",
    //            "Highland Park",
    //            "Hillpark",
    //            "Howick",
    //            "Huntington Park",
    //            "Kawakawa Bay",
    //            "Mangere",
    //            "Mangere Bridge",
    //            "Mangere East",
    //            "Manukau",
    //            "Manukau Heights",
    //            "Manurewa",
    //            "Manurewa East",
    //            "Maraetai",
    //            "Mellons Bay",
    //            "Middlemore Hospital",
    //            "Mission Heights",
    //            "Ness Valley",
    //            "Northpark",
    //            "Orere Point",
    //            "Otara",
    //            "Pakuranga",
    //            "Pakuranga Heights",
    //            "Papatoetoe",
    //            "Randwick Park",
    //            "Shamrock Park",
    //            "Shelly Park",
    //            "Somerville",
    //            "Sunnyhills",
    //            "The Gardens",
    //            "Totara Heights",
    //            "Totara Park",
    //            "Wattle Downs",
    //            "Weymouth",
    //            "Whitford",
    //            "Wiri"
    //        ],
    //        "Waitakere City": [
    //            "Bethells Beach",
    //            "Cornwallis",
    //            "Glen Eden",
    //            "Glendene",
    //            "Green Bay",
    //            "Henderson",
    //            "Henderson Valley",
    //            "Herald Island",
    //            "Hobsonville",
    //            "Huia",
    //            "Karekare",
    //            "Kelston",
    //            "Laingholm",
    //            "Massey",
    //            "New Lynn",
    //            "Oratia",
    //            "Parau",
    //            "Piha",
    //            "Ranui",
    //            "Sunnyvale",
    //            "Swanson",
    //            "Te Atatu Peninsula",
    //            "Te Atatu South",
    //            "Titirangi",
    //            "Waiatarua",
    //            "Waitakere",
    //            "West Harbour",
    //            "Westgate",
    //            "Whenuapai"
    //        ],
    //        "Papakura": [
    //            "Ardmore",
    //            "Conifer Grove",
    //            "Drury",
    //            "Hingaia",
    //            "Opaheke",
    //            "Pahurehure",
    //            "Papakura",
    //            "Red Hill",
    //            "Rosehill",
    //            "Runciman",
    //            "Takanini"
    //        ],
    //        "Auckland City": [
    //            "Auckland Central",
    //            "Avondale",
    //            "Blockhouse Bay",
    //            "Eden Terrace",
    //            "Ellerslie",
    //            "Epsom",
    //            "Freemans Bay",
    //            "Glen Innes",
    //            "Glendowie",
    //            "Grafton",
    //            "Greenlane",
    //            "Grey Lynn",
    //            "Herne Bay",
    //            "Hillsborough",
    //            "Kingsland",
    //            "Kohimarama",
    //            "Lynfield",
    //            "Meadowbank",
    //            "Mission Bay",
    //            "Morningside",
    //            "Mount Albert",
    //            "Mount Eden",
    //            "Mount Roskill",
    //            "Mount Wellington",
    //            "New Windsor",
    //            "Newmarket",
    //            "Newton",
    //            "One Tree Hill",
    //            "Onehunga",
    //            "Orakei",
    //            "Otahuhu",
    //            "Panmure",
    //            "Parnell",
    //            "Penrose",
    //            "Point Chevalier",
    //            "Point England",
    //            "Ponsonby",
    //            "Remuera",
    //            "Royal Oak",
    //            "Saint Heliers",
    //            "Saint Johns",
    //            "Saint Marys Bay",
    //            "Sandringham",
    //            "Stonefields",
    //            "Three Kings",
    //            "Waiotaiki Bay",
    //            "Waterview",
    //            "Western Springs",
    //            "Westmere"
    //        ],
    //        "Waiheke Island": [
    //            "Omiha",
    //            "Oneroa",
    //            "Onetangi",
    //            "Ostend",
    //            "Palm Beach",
    //            "Surfdale",
    //            "Waiheke Island"
    //        ]
    //    }
    //};
    //$scope.allValue.selectSchool = {
    //    "Franklin":[
    //
    //    ],
    //    "North Shore City":[
    //        {
    //            "name":"Rangitoto College",
    //            "id":"5840ea5a1cab461c20cf55c8"
    //        },
    //        {
    //            "name":"Albany Senior High School",
    //            "id":"5840ea661cab461c20cf5630"
    //        },
    //        {
    //            "name":"Long Bay College",
    //            "id":"5840ea8f1cab461c20cf5836"
    //        },
    //        {
    //            "name":"Takapuna Grammar School",
    //            "id":"5840eac81cab461c20cf5aff"
    //        },
    //        {
    //            "name":"Westlake Boys' High School",
    //            "id":"5840eae51cab461c20cf5c80"
    //        },
    //        {
    //            "name":"Westlake Girls' High School",
    //            "id":"5840eae51cab461c20cf5c81"
    //        }
    //    ],
    //    "Rodney":[
    //
    //    ],
    //    "Hauraki Gulf Islands":[
    //
    //    ],
    //    "Manukau City":[
    //        {
    //            "name":"Botany Downs Secondary College",
    //            "id":"5840ea1d1cab461c20cf52d0"
    //        },
    //        {
    //            "name":"Macleans College",
    //            "id":"5840ea901cab461c20cf583f"
    //        }
    //    ],
    //    "Waitakere City":[
    //        {
    //            "name":"Hobsonville Point Secondary School",
    //            "id":"5840ea771cab461c20cf56f8"
    //        }
    //    ],
    //    "Papakura":[
    //
    //    ],
    //    "Auckland City":[
    //        {
    //            "name":"Epsom Girls Grammar School",
    //            "id":"5840ea281cab461c20cf5355"
    //        },
    //        {
    //            "name":"Glendowie College",
    //            "id":"5840ea371cab461c20cf5405"
    //        },
    //        {
    //            "name":"Auckland Grammar",
    //            "id":"5840ea661cab461c20cf5633"
    //        }
    //    ],
    //    "Waiheke Island":[
    //
    //    ]
    //};
    $scope.allValue.totalHouseNum = 0;

    //纪录判断地图是否拖动从而重新去调整上一页下一页的点击事件
    $scope.allValue.jugeTemp = 0;
    var localParam = location.href.indexOf('?') == -1 ? 'name=Auckland%20City&level=2&page=0&sort=default&isAllHouse=false' : location.href.substr(location.href.indexOf('?')+1);

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/list_cn.html?"+localParam;
    }

    angular.element('.dataSave').data('searchParam',localParam);
    $('.search_language_cn').attr('href','/search_cn?'+angular.element('.dataSave').data('searchParam'));
    $('.search_language_en').attr('href','/search?'+angular.element('.dataSave').data('searchParam'));

    var localItem = localParam.split('&');
    var cityTemp = true;
    var subsurbTemp = true;
    var roomsTemp = true;
    var schoolTemp = true;
    var changeMapTemp = false;
    var priceUpDown = true;
    $scope.allValue.curSchool = "学校";
    $scope.allValue.roomParam = {
        "all":true,
        "one":false,
        "two":false,
        "three":false,
        "four":false,
        "more":false
    }
    $scope.allValue.schoolParam = {
        id:"5840ea5a1cab461c20cf55c8",
        sort:'default'
    };
    $scope.allValue.schoolParam.bedroom = $scope.allValue.roomParam;

    $scope.allValue.param = {};
    for(var i = 0; i < localItem.length; i++){
        $scope.allValue.param[localItem[i].split('=')[0]] = decodeURIComponent(localItem[i].split('=')[1]);
    };

    $scope.allValue.param.bedroom = $scope.allValue.roomParam;
    $scope.allValue.param.level = $scope.allValue.param.level/1;
    $scope.allValue.param.page = $scope.allValue.param.page/1;

    $scope.allValue.ct = $scope.allValue.param.ct || "Auckland";
    $scope.allValue.param.scope = $scope.allValue.param.ct || "Auckland";
    $scope.allValue.select = {
        city:$scope.cityJson[$scope.allValue.ct].city,
        suburb:$scope.cityJson[$scope.allValue.ct].suburb
    }
    $scope.allValue.selectSchool = $scope.cityJson[$scope.allValue.ct].school



    $scope.allValue.pageJumpParam = $.extend({},$scope.allValue.param);
    $scope.allValue.proPage = $scope.allValue.pageJumpParam.page - 1;
    $scope.allValue.nextPage = $scope.allValue.pageJumpParam.page + 1;

    if($scope.allValue.pageJumpParam.page <= 0){
        angular.element('.slp_pre_pro').hide();
        $scope.allValue.proPage = 0;
    }else{
        angular.element('.slp_pre_pro').show();
    }

    (function(){
        var navNumber;
        switch ($scope.allValue.pageJumpParam.sort){
            case 'newest':
                navNumber = 1;
                break;
            case 'cheap':
                navNumber = 2;
                break;
            default:
                navNumber = 0;
                break;
        }
        $scope.allValue.navd = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : navNumber,
            nextEvent : false
        });
    })()

    var mapZoom = setMapZoom($scope.allValue.param.level);

    if($scope.allValue.param.level == 2){
        $scope.allValue.currentCity = $scope.allValue.param.name;
        $scope.allValue.currentSuburb = 'All suburbs';
    }else if($scope.allValue.param.level == 3){
        $scope.allValue.currentSuburb = $scope.allValue.param.name;
        $scope.allValue.currentCity = $scope.allValue.param.fn;
    }
    $scope.allValue.suburbs = $scope.allValue.select.suburb[$scope.allValue.currentCity];
    $scope.allValue.schools = $scope.allValue.selectSchool[$scope.allValue.currentCity];

    function setMapZoom(n){
        switch (n){
            case 1:
                return 11;
                break;
            case 2:
                return 13;
                break;
            case 3:
                //return 14;
                return 15;
                break;
        }
    }
    window.onresize = function(){
        if(window.innerWidth >= 1250){
            document.documentElement.style.fontSize = '97.66px';
        }else{
            //innerWidth <= 1000 ? $('body').css({'overflowX':'scroll'}) : $('body').css({'overflowX':'hidden'});
            innerWidth <= 1000 ? document.documentElement.style.fontSize = '78.13px' : document.documentElement.style.fontSize = innerWidth / 12.8 + 'px';
        }
        $scope.allValue.d = sFactory.setSearchHight();
    };
    $scope.allValue.b = sFactory.setSearchHight();

    //============================让信息框消失的事件================================
    $scope.allValue.hideView = sFactory.hideView;

    var houseMarker = [];
    var suburbMarker = [];
    var cityMarker = [];
    var countryMarker = [];

    var tempHouseArr = [];
    var tempSuburbArr = [];
    var tempCityArr = [];


    var hotelMarker = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };
    //============================= 获取当前属性的房源 ==============================
    $scope.allValue.getSearchData = pFactory.postData({
        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
        data:JSON.stringify($scope.allValue.param),
        callBack : function(data){
            //console.log(data.data[0]);
            if($scope.allValue.pageJumpParam.page >= data.data[0].maxPage){
                angular.element('.slp_next_pro').hide();
                $scope.allValue.nextPage = data.data[0].maxPage;
                $scope.allValue.proPage = data.data[0].maxPage - 1;
            }else{
                angular.element('.slp_next_pro').show();
            }

            $scope.allValue.listHouse = data.data[0];
            $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;

            $('.slp_list_load').hide();
            $('title').text($scope.allValue.param.name + ' have ' +$scope.allValue.listHouse.propNum+' houses on sale |新西兰房产中介')

            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
            if(data.data[0].houseInfo.length == 0 && data.data[0].mapInfo.length == 0){
                angular.element('.noHouse').show();
                $timeout(function(){
                    angular.element('.noHouse').hide();
                },2000);
            }else{
                //设置当前页和总共有多少页
                $scope.allValue.listHouse.curPage += 1;
                $scope.allValue.listHouse.maxPage += 1;
                $scope.allValue.nextPage = $scope.allValue.nextPage >= $scope.allValue.listHouse.maxPage ? $scope.allValue.listHouse.maxPage : $scope.allValue.nextPage;
                $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                }
            }

            //创建地图 在接下来使用地图都试$scope.allValue.c.map
            $scope.allValue.mapOption = {
                id:'search_map',
                map:'searchMap',
                position : {lat: data.data[0].basePoint[1], lng:data.data[0].basePoint[0]},
                zoom: mapZoom,
                drag:true,
                wheelEvent : true
            }
            //页面加载时候出现的地图i
            $scope.allValue.c = ($scope.allValue.c ? null : pFactory.setSearchMap($scope.allValue.mapOption));
            //if($scope.allValue.c){
            //    $scope.allValue.c = null
            //}else{
            //    $scope.allValue.c = pFactory.setSearchMap($scope.allValue.mapOption);
            //}

            var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});

            houseMarker = [];
            suburbMarker = [];
            cityMarker = [];
            countryMarker = [];

            tempHouseArr = [];
            tempSuburbArr = [];
            tempCityArr = [];

            //首次进来的时候判断现在的level 决定地图显示marker的类型
            /*
             4 显示house
             3 显示suburb
             2 显示city
             */
            if($scope.allValue.listHouse.mapLevel == 3){
                tempSuburbArr = data.data[0].mapInfo;
                for(var m = 0,len=$scope.allValue.listHouse.mapInfo.length; m < len; m++){
                    suburbMarker.push(sFactory.suburbMarker($scope.allValue.listHouse.mapInfo[m],$scope.allValue.c.map));
                }
            }else if($scope.allValue.listHouse.mapLevel == 2){
                tempCityArr = data.data[0].mapInfo;
                for(var m = 0,len=$scope.allValue.listHouse.mapInfo.length; m < len; m++){
                    cityMarker.push(sFactory.cityMarker($scope.allValue.listHouse.mapInfo[m],$scope.allValue.c.map));
                }
            }else{
                tempHouseArr = data.data[0].mapInfo;
                //console.log(tempHouseArr);
                $scope.allValue.searchDot = sFactory.makeMapDot(data.data[0].mapInfo,$scope.allValue.c.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                houseMarker = houseMarker.concat($scope.allValue.searchDot);
            }

            $scope.allValue.c.map.addListener('dragend',function(){
                $('.search_loading_wrap').show();
                $('.slp_list_load').show();

                $scope.allValue.jugeTemp = 1;
                $('.slp_more_btn').eq(0).hide();
                $('.slp_more_btn').eq(1).show();
                //设置拖动后的请求参数
                $scope.allValue.xy = {
                    "zoom":$scope.allValue.c.map.getZoom(),
                    "bounds": [$scope.allValue.c.map.getBounds().getNorthEast().lng(),$scope.allValue.c.map.getBounds().getNorthEast().lat(),$scope.allValue.c.map.getBounds().getSouthWest().lng(),$scope.allValue.c.map.getBounds().getSouthWest().lat()],
                    "page":0,
                    "sort":"default",
                    "isAllHouse":false
                }
                //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                if(hotelMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['restaurant'],
                        cb:callbackHotel
                    })
                }else if(hospitalMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['hospital'],
                        cb:callbackHospital
                    });
                }else if(supermarketMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['convenience_store'],
                        cb:callbackSupermarket
                    })
                }

                $scope.allValue.navd = myFactory.addClassName({
                    itemSmall : '.slp_nav>ol>li',
                    name : 'slp_nav_actived',
                    num : 0,
                    nextEvent : false
                });
                $scope.allValue.getSearchData = pFactory.postData({
                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                    data:JSON.stringify($scope.allValue.xy),
                    callBack : function(data){
                        var timer = $interval(function(){
                            if(parseInt($('.loading_item').width()) >= 200){
                                $('.search_loading_wrap').hide();
                                $('.loading_item').css({'width':40});
                                $('.loading_item_num').text(20);
                                $interval.cancel(timer);
                                //console.log(data)
                                $scope.allValue.listHouse = data.data[0];
                                $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                $('.slp_list_load').hide();

                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                if(data.data[0].mapInfo.length == 0 && data.data[0].houseInfo.length == 0){
                                    angular.element('.noHouse').show();
                                    $timeout(function(){
                                        angular.element('.noHouse').hide();
                                    },1500);
                                    return;
                                }else {
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                    if($scope.allValue.listHouse.mapLevel == 4){
                                        var newMarker =  pFactory.differentArr(tempHouseArr,data.data[0].mapInfo);

                                        if(newMarker.length != 0){
                                            $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.c.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                            houseMarker = houseMarker.concat($scope.allValue.searchDot);
                                            //tempHouseArr = data.data[0].mapInfo;
                                            tempHouseArr = tempHouseArr.concat(newMarker);
                                        }
                                    }else if($scope.allValue.listHouse.mapLevel == 3){

                                        var newMarker =  pFactory.differentArr(tempSuburbArr,data.data[0].mapInfo);

                                        if(newMarker.length != 0){
                                            tempSuburbArr = tempSuburbArr.concat(newMarker);
                                            for(var m = 0,len = newMarker.length; m < len; m++){
                                                suburbMarker.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.c.map));
                                            }
                                        }
                                    }else if($scope.allValue.listHouse.mapLevel == 2){
                                        var newMarker =  pFactory.differentArr(tempCityArr,data.data[0].mapInfo);
                                        if(newMarker.length != 0){
                                            tempCityArr = tempCityArr.concat(newMarker);
                                            for(var m = 0,len = newMarker.length; m < len; m++) {
                                                cityMarker.push(sFactory.cityMarker(newMarker[m],$scope.allValue.c.map));
                                            }
                                        }
                                    }else{
                                        if(countryMarker.length == 0){
                                            countryMarker.push(sFactory.countryMarker($scope.allValue.c.map));
                                        }
                                    }
                                }

                            }
                            $('.loading_item').css({'width':'+=20'});
                            $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                        },1);
                    }
                })
                //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                $scope.allValue.preMapPage = function(){
                    $('.slp_list_load').show();
                    $scope.allValue.xy.page -= 1;
                    angular.element('.slp_next').show();
                    if($scope.allValue.xy.page < 0){
                        $('.slp_list_load').hide();
                        return
                    }else{
                        $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                            data:JSON.stringify($scope.allValue.xy),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }


                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                }
                $scope.allValue.nextMapPage = function(){
                    $('.slp_list_load').show();
                    $scope.allValue.xy.page += 1;
                    angular.element('.slp_pre').show();
                    if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                        $('.slp_list_load').hide();
                        return
                    }else{
                        $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                            data:JSON.stringify($scope.allValue.xy),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }


                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                }
            });

            //=============================== 检测地图事件 ============================
            $scope.allValue.c.map.addListener('zoom_changed',function(){
                if($scope.allValue.mapMaker){
                    $scope.allValue.mapMaker.setMap(null)
                    $scope.allValue.mapMaker = null;
                }
                $('.search_loading_wrap').show();
                $('.slp_list_load').show();
                $scope.allValue.jugeTemp = 1;
                $('.slp_more_btn').eq(0).hide();
                $('.slp_more_btn').eq(1).show();
                $scope.allValue.xy = {
                    "zoom":$scope.allValue.c.map.getZoom(),
                    "bounds": [$scope.allValue.c.map.getBounds().getNorthEast().lng(),$scope.allValue.c.map.getBounds().getNorthEast().lat(),$scope.allValue.c.map.getBounds().getSouthWest().lng(),$scope.allValue.c.map.getBounds().getSouthWest().lat()],
                    "page":0,
                    "sort":"default",
                    "isAllHouse":false
                }
                //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                if(hotelMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['restaurant'],
                        cb:callbackHotel
                    })
                }else if(hospitalMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['hospital'],
                        cb:callbackHospital
                    });
                }else if(supermarketMarker.moveMap){
                    serviceFn({
                        bns:$scope.allValue.c.map.getBounds(),
                        ty:['convenience_store'],
                        cb:callbackSupermarket
                    })
                }

                $scope.allValue.navd = myFactory.addClassName({
                    itemSmall : '.slp_nav>ol>li',
                    name : 'slp_nav_actived',
                    num : 0,
                    nextEvent : false
                });
                $scope.allValue.getSearchData = pFactory.postData({
                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                    data:JSON.stringify($scope.allValue.xy),
                    callBack : function(data){
                        var timer = $interval(function(){
                            if(parseInt($('.loading_item').width()) >= 200){
                                $('.search_loading_wrap').hide();
                                $('.loading_item').css({'width':40});
                                $('.loading_item_num').text(20);
                                $interval.cancel(timer);

                                $scope.allValue.listHouse = data.data[0];
                                $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                $('.slp_list_load').hide();

                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                if(data.data[0].mapInfo.length == 0 && data.data[0].houseInfo.length == 0){
                                    angular.element('.noHouse').show();
                                    $timeout(function(){
                                        angular.element('.noHouse').hide();
                                    },1500);
                                    return;
                                }else{
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                    if($scope.allValue.listHouse.mapLevel == 4){
                                        tempSuburbArr = [];
                                        tempCityArr = [];
                                        suburbMarker = sFactory.deleteMarker(suburbMarker);
                                        cityMarker = sFactory.deleteMarker(cityMarker);
                                        countryMarker = sFactory.deleteMarker(countryMarker);

                                        var newMarker = pFactory.differentArr(tempHouseArr,data.data[0].mapInfo);
                                        if(newMarker.length != 0){
                                            //console.log(newMarker);
                                            $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.c.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                            houseMarker = houseMarker.concat($scope.allValue.searchDot);
                                            tempHouseArr = tempHouseArr.concat(newMarker);
                                        }
                                    }else if($scope.allValue.listHouse.mapLevel == 3){

                                        houseMarker = sFactory.deleteHouseMarker(houseMarker);
                                        cityMarker = sFactory.deleteMarker(cityMarker);
                                        countryMarker = sFactory.deleteMarker(countryMarker);
                                        var newMarker =  pFactory.differentArr(tempSuburbArr,data.data[0].mapInfo);
                                        tempHouseArr = [];
                                        tempCityArr = [];

                                        if(newMarker.length != 0){
                                            tempSuburbArr = tempSuburbArr.concat(newMarker);
                                            for(var m = 0,len = newMarker.length; m < len; m++){
                                                suburbMarker.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.c.map))
                                            }
                                        }

                                    }else if($scope.allValue.listHouse.mapLevel == 2){
                                        houseMarker = sFactory.deleteHouseMarker(houseMarker);
                                        suburbMarker = sFactory.deleteMarker(suburbMarker);
                                        countryMarker = sFactory.deleteMarker(countryMarker);
                                        var newMarker =  pFactory.differentArr(tempCityArr,data.data[0].mapInfo);
                                        tempHouseArr = [];
                                        tempSuburbArr = [];

                                        if(newMarker.length != 0){
                                            tempCityArr = tempCityArr.concat(newMarker);
                                            for(var m = 0,len = newMarker.length; m < len; m++) {
                                                cityMarker.push(sFactory.cityMarker(newMarker[m],$scope.allValue.c.map))
                                            }
                                        }

                                    }else{
                                        tempHouseArr = [];
                                        tempSuburbArr = [];
                                        tempCityArr = [];

                                        houseMarker = sFactory.deleteHouseMarker(houseMarker);
                                        suburbMarker = sFactory.deleteMarker(suburbMarker);
                                        cityMarker = sFactory.deleteMarker(cityMarker);
                                        if(countryMarker.length == 0){
                                            countryMarker.push(sFactory.countryMarker($scope.allValue.c.map));
                                        }
                                    }
                                }
                            }
                            $('.loading_item').css({'width':'+=20'});
                            $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                        },1);
                    }
                })
                //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                $scope.allValue.preMapPage = function(){
                    $('.slp_list_load').show();
                    $scope.allValue.xy.page -= 1;
                    angular.element('.slp_next').show();
                    if($scope.allValue.xy.page < 0){
                        $('.slp_list_load').hide();
                        return;
                    }else{
                        $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                            data:JSON.stringify($scope.allValue.xy),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }

                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                }
                $scope.allValue.nextMapPage = function(){
                    $('.slp_list_load').show();
                    $scope.allValue.xy.page += 1;
                    angular.element('.slp_pre').show();
                    if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                        $('.slp_list_load').hide();
                        return
                    }else{
                        $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                            data:JSON.stringify($scope.allValue.xy),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();
                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }

                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                }
            });
            //点击左侧列表项 地图显示相应的房子
            $scope.allValue.showView = function(obj,$event){
                $event.stopPropagation();
                if($scope.allValue.mapMaker){
                    $scope.allValue.mapMaker.setMap(null)
                    $scope.allValue.mapMaker = null;
                }
                var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                    '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                    '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                    '<p class="map_info_price">'+obj.housePrice+'</p>' +
                    '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                    '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                    '</div></div>' +
                    '</a>';
                if(houseMarker){
                    for(x in houseMarker){
                        if(obj._id == houseMarker[x]._id){
                            houseMarker[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                            houseMarker[x].name.zIndex = 3;
                            infoWindowS.setContent(contentString);
                            infoWindowS.open($scope.allValue.c.map, houseMarker[x].name);
                            return;
                        }
                    }
                }
                $scope.allValue.mapMaker = new google.maps.Marker({
                    position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                    title : obj.title,
                    icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                    map: $scope.allValue.c.map,
                    zIndex:9
                });
                infoWindowS.setContent(contentString);
                infoWindowS.open($scope.allValue.c.map, $scope.allValue.mapMaker);
                $scope.allValue.mapMaker.addListener('click', function() {
                    infoWindowS.setContent(contentString);
                    infoWindowS.open($scope.allValue.c.map, $scope.allValue.mapMaker);
                });

            };
            //==================================================地图列表导航事件==================================
            //search页面列表左侧导航设置 点击添加样式
            $scope.allValue.setListNav = function(n,str){
                $scope.allValue.sln = myFactory.addClassName({
                    itemSmall : '.slp_nav>ol>li',
                    name : 'slp_nav_actived',
                    num : n,
                    nextEvent : false
                });
                $('.slp_list_load').show();
                if($scope.allValue.jugeTemp){
                    //$scope.allValue.xy.sort = str;
                    if(n == 2){
                        if(priceUpDown){
                            $scope.allValue.xy.sort = 'priceUp';
                            $('.priceUp').css({'border-top-color':'brown'})
                            $('.priceDown').css({'border-bottom-color':'gray'})
                        }else{
                            $scope.allValue.xy.sort = 'priceDown';
                            $('.priceUp').css({'border-top-color':'gray'})
                            $('.priceDown').css({'border-bottom-color':'brown'})
                        }
                        priceUpDown = !priceUpDown;
                    }else{
                        $scope.allValue.xy.sort = str;
                    }
                    $scope.allValue.xy.page = 0;
                    $scope.allValue.getNextData = pFactory.postData({
                        url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/searchHouseByMap',
                        data: JSON.stringify($scope.allValue.xy),
                        callBack: function (data) {
                            $scope.allValue.listHouse = data.data[0];
                            $('.slp_list_load').hide();

                            if(data.data[0].houseInfo){
                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                }
                            }

                        }
                    })
                }else{
                    //$scope.allValue.param.sort = str;
                    if(n == 2){
                        if(priceUpDown){
                            $scope.allValue.param.sort = 'priceUp';
                            $('.priceUp').css({'border-top-color':'brown'})
                            $('.priceDown').css({'border-bottom-color':'gray'})
                        }else{
                            $scope.allValue.param.sort = 'priceDown';
                            $('.priceUp').css({'border-top-color':'gray'})
                            $('.priceDown').css({'border-bottom-color':'brown'})
                        }
                        priceUpDown = !priceUpDown;
                    }else{
                        $scope.allValue.param.sort = str;
                    }
                    $scope.allValue.param.page = 0;
                    $scope.allValue.pageJumpParam.sort = str;
                    $scope.allValue.pageJumpParam.page = 0;
                    $scope.allValue.proPage = 0;
                    $scope.allValue.nextPage = 1;
                    //console.log(str)
                    $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                    $scope.allValue.getNextData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                        data:JSON.stringify($scope.allValue.param),
                        callBack : function(data){
                            $scope.allValue.listHouse = data.data[0];
                            $('.slp_list_load').hide();

                            if(data.data[0].houseInfo){
                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                    //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                }
                            }


                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                            //设置当前页和总共有多少页
                            $scope.allValue.listHouse.curPage += 1;
                            ///////////////////////////////////////
                            //      解决页数问题之前是注释掉的        //
                            ///////////////////////////////////////
                            $scope.allValue.listHouse.maxPage += 1;
                        }
                    });
                }
            };

            //安全指数的事件
            $('.search_safe_close').on('click',function(){
                $('.search_safe_icon').show();
                $('.search_safe_display').hide();
                $scope.allValue.c.map.overlayMapTypes.pop();
            });
            $('.search_hotel_close').on('click',function(){
                $('.search_safe_icon').show();
                $('.search_hotel_display').hide();
                //console.log(hotelMarker.markerArr);
                //hotelMarker.moveMap = false;
                //hotelMarker.markerArr = sFactory.deleteMarker(hotelMarker.markerArr)
                for(x in hotelMarker.markerArr){
                    hotelMarker.markerArr[x].setMap(null);
                }
                hotelMarker = {
                    markerArr : [],
                    moveMap : false,
                    color:'#3c8df6',
                    tempArr : []
                };
            });
            $('.search_hospital_close').on('click',function(){
                $('.search_safe_icon').show();
                $('.search_hospital_display').hide();
                //hospitalMarker.moveMap = false;
                for(x in hospitalMarker.markerArr){
                    hospitalMarker.markerArr[x].setMap(null);
                }
                hospitalMarker = {
                    markerArr : [],
                    moveMap : false,
                    color:'#26cf5c',
                    tempArr : []
                };
            });
            $('.search_supermarket_close').on('click',function(){
                $('.search_safe_icon').show();
                $('.search_supermarket_display').hide();
                //supermarketMarker.moveMap = false;
                for(x in supermarketMarker.markerArr){
                    supermarketMarker.markerArr[x].setMap(null);
                }
                supermarketMarker = {
                    markerArr : [],
                    moveMap : false,
                    color:'#a970ff',
                    tempArr : []
                };
            });

            var service = new google.maps.places.PlacesService($scope.allValue.c.map);
            function callbackHotel(results, status) {
                //console.log(results);
                //if(hotelMarker.markerArr.length != 0){
                //    for(x in hotelMarker.markerArr){
                //        hotelMarker.markerArr[x].setMap($scope.allValue.c.map);
                //    }
                //}
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var newMarkerArr = hotelMarker.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker.tempArr,results)
                    hotelMarker.tempArr = hotelMarker.tempArr.concat(newMarkerArr);
                    hotelMarker.markerArr = hotelMarker.markerArr.concat(sFactory.makeServiceDot({
                        color:hotelMarker.color,
                        map:$scope.allValue.c.map,
                        arr:newMarkerArr
                    }))

                }
            };
            function callbackHospital(results, status) {
                //console.log(results);
                //if(hospitalMarker.markerArr.length != 0){
                //    for(x in hospitalMarker.markerArr){
                //        hospitalMarker.markerArr[x].setMap($scope.allValue.c.map);
                //    }
                //}
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var newMarkerArr = hospitalMarker.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker.tempArr,results)
                    hospitalMarker.tempArr = hospitalMarker.tempArr.concat(newMarkerArr);
                    hospitalMarker.markerArr = hospitalMarker.markerArr.concat(sFactory.makeServiceDot({
                        color:hospitalMarker.color,
                        map:$scope.allValue.c.map,
                        arr:newMarkerArr
                    }))
                }
            };
            function callbackSupermarket(results, status) {
                //console.log(results);
                //if(supermarketMarker.markerArr.length != 0){
                //    for(x in supermarketMarker.markerArr){
                //        supermarketMarker.markerArr[x].setMap($scope.allValue.c.map);
                //    }
                //}
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var newMarkerArr = supermarketMarker.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker.tempArr,results)
                    supermarketMarker.tempArr = supermarketMarker.tempArr.concat(newMarkerArr);
                    supermarketMarker.markerArr = supermarketMarker.markerArr.concat(sFactory.makeServiceDot({
                        color:supermarketMarker.color,
                        map:$scope.allValue.c.map,
                        arr:newMarkerArr
                    }))

                }
            };
            function serviceFn(obj){
                request = {
                    bounds:obj.bns,
                    types: obj.ty
                };
                service.nearbySearch(request, obj.cb);
            }
            $scope.allValue.blockFilter = function(str){
                var _mapbounds = $scope.allValue.c.map.getBounds();
                /*
                 * 1 ---> crime
                 * 2 ---> Restaurant
                 * 3 ---> hospital
                 * 4 ---> Convenience
                 * */
                if(str == 1){
                    crimeFn($scope.allValue.c.map)
                }else if(str == 2){
                    $('.search_safe_icon').hide();
                    $('.search_hotel_display').show();
                    hotelMarker.moveMap = true;
                    serviceFn({
                        bns:_mapbounds,
                        ty:['restaurant'],
                        cb:callbackHotel
                    })
                }else if(str == 3){
                    $('.search_safe_icon').hide();
                    $('.search_hospital_display').show();
                    serviceFn({
                        bns:_mapbounds,
                        ty:['hospital'],
                        cb:callbackHospital
                    });
                    hospitalMarker.moveMap = true;
                }else if(str == 4){
                    $('.search_safe_icon').hide();
                    $('.search_supermarket_display').show();
                    supermarketMarker.moveMap = true;
                    serviceFn({
                        bns:_mapbounds,
                        ty:['convenience_store'],
                        cb:callbackSupermarket
                    })
                }

            }
        }
    });


    function crimeFn(mapObj){
        console.log('aaaaaaaaaaaaaaaaaaaa');
        $('.search_safe_icon').hide();
        $('.search_safe_display').show();
        var imageMapType = new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                if (zoom < 1 || zoom > 16 ||
                    _bounds[zoom][0][0] > coord.x || coord.x > _bounds[zoom][1][0] ||
                    _bounds[zoom][0][1] > coord.y || coord.y > _bounds[zoom][1][1]) {
                    return null;
                }
                return ['http://139.129.223.20/sellinghouse/map/'+zoom+'/'+coord.x+'/'+coord.y+'.png?14'].join('');
            },
            tileSize: new google.maps.Size(256, 256)
        });
        mapObj.overlayMapTypes.push(imageMapType);
    }

    var houseMarker2 = [];
    var suburbMarker2 = [];
    var cityMarker2 = [];
    var countryMarker2 = [];

    var tempHouseArr2 = [];
    var tempSuburbArr2 = [];
    var tempCityArr2 = [];

    var hotelMarker2 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker2 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker2 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };


    //筛选框事件
    $('.search_select_city').on('click',function(){
        $('.select_item').hide();
        subsurbTemp = true;
        roomsTemp = true
        schoolTemp = true;
        $('.select_tri').removeClass('select_open_tri')
        if(cityTemp){
            $('.search_select_cityItem').show();
            $('.select_city_tri').addClass('select_open_tri')
        }else{
            $('.search_select_cityItem').hide();
            $('.select_city_tri').removeClass('select_open_tri')
        }
        cityTemp = !cityTemp
    });
    $scope.allValue.cityClick = function(str){
        changeMapTemp = false;
        $scope.allValue.curSchool = "学校";
        $scope.jugeChange = true;
        $scope.allValue.c = null;
        $scope.allValue.sb = null;
        cityTemp = true;

        $scope.allValue.roomParam = {
            "all":true,
            "one":false,
            "two":false,
            "three":false,
            "four":false,
            "more":false
        }
        $('.select_rooms_show').text('卧室')

        $('.search_safe_icon').unbind("click");
        $('.search_safe_close').unbind('click');

        $('.search_select_cityItem').hide();
        $('.select_city_show').text(str)
        $('.select_city_tri').removeClass('select_open_tri')
        $('.slp_list_load').show();
        $scope.allValue.param.name = str;
        $scope.allValue.currentCity = str;

        $scope.allValue.param.level = 2;
        $scope.allValue.param.page = 0;
        $scope.allValue.jugeTemp = 0;
        $scope.allValue.param.bedroom = $scope.allValue.roomParam;

        angular.element('.slp_more_next').hide();
        angular.element('.slp_pre').hide();
        angular.element('.slp_next').show();
        $scope.allValue.ln = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : 0,
            nextEvent : false
        });
        priceUpDown = true;
        $('.priceUp').css({'border-top-color':'gray'})
        $('.priceDown').css({'border-bottom-color':'gray'})
        $scope.allValue.schoolParam.sort = 'defalut';
        $scope.allValue.param.sort = 'default';
        mapZoom = setMapZoom($scope.allValue.param.level);
        $scope.allValue.currentSuburb = 'All Suburb';
        $scope.allValue.suburbs = [];

        $scope.allValue.suburbs = $scope.allValue.select.suburb[$scope.allValue.currentCity];
        $scope.allValue.schools = $scope.allValue.selectSchool[$scope.allValue.currentCity];

        $scope.allValue.getSearchData = pFactory.postData({
            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
            data:JSON.stringify($scope.allValue.param),
            callBack : function(data){
                $scope.allValue.listHouse = data.data[0];
                $('.slp_list_load').hide();
                $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                if(data.data[0].houseInfo.length == 0 && data.data[0].mapInfo.length == 0 ){
                    angular.element('.noHouse').show();
                    $timeout(function(){
                        angular.element('.noHouse').hide();
                    },2000);
                }else{
                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                        //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                    }
                    //设置当前页和总共有多少页
                    $scope.allValue.listHouse.curPage += 1;
                    $scope.allValue.listHouse.maxPage += 1;
                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                }

                //创建地图 在接下来使用地图都试$scope.allValue.c.map
                $scope.allValue.mapOption = {
                    id:'search_map',
                    map:'searchMap2',
                    position : {lat: data.data[0].basePoint[1], lng:data.data[0].basePoint[0]},
                    zoom: mapZoom,
                    wheelEvent : true
                }
                $scope.allValue.ct = pFactory.setSearchMap($scope.allValue.mapOption);
                var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});
                houseMarker2 = [];
                suburbMarker2 = [];
                cityMarker2 = [];
                countryMarker2 = [];

                tempHouseArr2 = [];
                tempSuburbArr2 = [];
                tempCityArr2 = [];

                tempSuburbArr2 = data.data[0].mapInfo;
                for(var m = 0,len=$scope.allValue.listHouse.mapInfo.length; m < len; m++){
                    suburbMarker2.push(sFactory.suburbMarker($scope.allValue.listHouse.mapInfo[m],$scope.allValue.ct.map));
                }

                $scope.allValue.ct.map.addListener('dragend',function(){
                    //console.log('b')
                    $('.search_loading_wrap').show();
                    $('.slp_list_load').show();
                    $scope.allValue.jugeTemp = 1;
                    $('.slp_more_btn').eq(0).hide();
                    $('.slp_more_btn').eq(1).show();
                    $scope.allValue.xy = {
                        "zoom":$scope.allValue.ct.map.getZoom(),
                        "bounds": [$scope.allValue.ct.map.getBounds().getNorthEast().lng(),$scope.allValue.ct.map.getBounds().getNorthEast().lat(),$scope.allValue.ct.map.getBounds().getSouthWest().lng(),$scope.allValue.ct.map.getBounds().getSouthWest().lat()],
                        "page":0,
                        "sort":"default",
                        "isAllHouse":false
                    }

                    //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                    if(hotelMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(hospitalMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                    }else if(supermarketMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                    $scope.allValue.navd = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : 0,
                        nextEvent : false
                    });
                    $scope.allValue.getSearchData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                        data:JSON.stringify($scope.allValue.xy),
                        callBack : function(data){
                            var timer = $interval(function(){
                                if(parseInt($('.loading_item').width()) >= 200){
                                    $('.search_loading_wrap').hide();
                                    $('.loading_item').css({'width':40});
                                    $('.loading_item_num').text(20);
                                    $interval.cancel(timer);

                                    $scope.allValue.listHouse = data.data[0];
                                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            //data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    if(data.data[0].mapInfo.length == 0){
                                        angular.element('.noHouse').show();
                                        $timeout(function(){
                                            angular.element('.noHouse').hide();
                                        },1500);
                                    }else {
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                        if($scope.allValue.listHouse.mapLevel == 4){

                                            var newMarker = pFactory.differentArr(tempHouseArr2,data.data[0].mapInfo);
                                            if(newMarker.length != 0){
                                                $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.ct.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                houseMarker2 = houseMarker2.concat($scope.allValue.searchDot);
                                                tempHouseArr2 = tempHouseArr.concat(newMarker);
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==3){
                                            var newMarker = pFactory.differentArr(tempSuburbArr2,data.data[0].mapInfo);
                                            if(newMarker.length != 0){
                                                tempSuburbArr2 = tempSuburbArr2.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++){
                                                    suburbMarker2.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.ct.map))
                                                }
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==2){
                                            var newMarker = pFactory.differentArr(tempCityArr2,data.data[0].mapInfo)
                                            if(newMarker.length != 0){
                                                tempCityArr2 = tempCityArr2.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++) {
                                                    cityMarker2.push(sFactory.cityMarker(newMarker[m],$scope.allValue.ct.map));
                                                }
                                            }
                                        }else{
                                            if(countryMarker2.length == 0){
                                                countryMarker2.push(sFactory.countryMarker($scope.allValue.ct.map));
                                            }
                                        }
                                    }
                                }
                                $('.loading_item').css({'width':'+=20'});
                                $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                            },1);
                            $('.slp_list_load').hide();
                        }
                    })
                    //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                    $scope.allValue.preMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page -= 1;
                        angular.element('.slp_next').show();
                        if($scope.allValue.xy.page < 0){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                    $scope.allValue.nextMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page += 1;
                        angular.element('.slp_pre').show();
                        if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').show();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                });
                //=============================== 检测地图事件 ============================
                $scope.allValue.ct.map.addListener('zoom_changed',function(){
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null);
                        $scope.allValue.mapMaker = null;
                    }
                    $('.search_loading_wrap').show();
                    $('.slp_list_load').show();
                    $scope.allValue.jugeTemp = 1;
                    $('.slp_more_btn').eq(0).hide();
                    $('.slp_more_btn').eq(1).show();
                    $scope.allValue.xy = {
                        "zoom":$scope.allValue.ct.map.getZoom(),
                        "bounds": [$scope.allValue.ct.map.getBounds().getNorthEast().lng(),$scope.allValue.ct.map.getBounds().getNorthEast().lat(),$scope.allValue.ct.map.getBounds().getSouthWest().lng(),$scope.allValue.ct.map.getBounds().getSouthWest().lat()],
                        "page":0,
                        "sort":"default",
                        "isAllHouse":false
                    }

                    //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                    if(hotelMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(hospitalMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                    }else if(supermarketMarker2.moveMap){
                        serviceFn({
                            bns:$scope.allValue.ct.map.getBounds(),
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                    $scope.allValue.ln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : 0,
                        nextEvent : false
                    });
                    $scope.allValue.getSearchData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                        data:JSON.stringify($scope.allValue.xy),
                        callBack : function(data){
                            var timer = $interval(function(){
                                if(parseInt($('.loading_item').width()) >= 200){
                                    $('.search_loading_wrap').hide();
                                    $('.loading_item').css({'width':40});
                                    $('.loading_item_num').text(20);
                                    $interval.cancel(timer);

                                    $scope.allValue.listHouse = data.data[0];
                                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    if(data.data[0].mapInfo.length == 0){
                                        angular.element('.noHouse').show();
                                        $timeout(function(){
                                            angular.element('.noHouse').hide();
                                        },1500);
                                    }else{
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                        if($scope.allValue.listHouse.mapLevel == 4){
                                            var newMarker = pFactory.differentArr(tempHouseArr2,data.data[0].mapInfo);
                                            tempSuburbArr2 = [];
                                            tempCityArr2 = [];

                                            countryMarker2 = sFactory.deleteMarker(countryMarker2);
                                            suburbMarker2 = sFactory.deleteMarker(suburbMarker2);
                                            cityMarker2 = sFactory.deleteMarker(cityMarker2)

                                            if(newMarker.length != 0){
                                                $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.ct.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                houseMarker2 = houseMarker2.concat($scope.allValue.searchDot);
                                                tempHouseArr2 = tempHouseArr2.concat(newMarker);
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==3){

                                            var newMarker = pFactory.differentArr(tempSuburbArr2,data.data[0].mapInfo)
                                            tempHouseArr2 = [];
                                            tempCityArr2 = [];

                                            houseMarker2 = sFactory.deleteHouseMarker(houseMarker2)
                                            cityMarker2 = sFactory.deleteMarker(cityMarker2)
                                            countryMarker2 = sFactory.deleteMarker(countryMarker2)

                                            if(newMarker.length != 0){
                                                tempSuburbArr2 = tempSuburbArr2.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++){
                                                    suburbMarker2.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.ct.map))
                                                }
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==2){
                                            var newMarker = pFactory.differentArr(tempCityArr2,data.data[0].mapInfo)
                                            tempHouseArr2 = [];
                                            tempSuburbArr2 = [];

                                            houseMarker2 = sFactory.deleteHouseMarker(houseMarker2);
                                            suburbMarker2 = sFactory.deleteMarker(suburbMarker2);
                                            countryMarker2 = sFactory.deleteMarker(countryMarker2);

                                            if(newMarker.length != 0){
                                                tempCityArr2 = tempCityArr2.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++) {
                                                    cityMarker2.push(sFactory.cityMarker(newMarker[m],$scope.allValue.ct.map));
                                                }
                                            }
                                        }else{
                                            //console.log(data.data[0])
                                            tempHouseArr2 = [];
                                            tempSuburbArr2 = [];
                                            tempCityArr2 = [];

                                            houseMarker2 = sFactory.deleteHouseMarker(houseMarker2);
                                            suburbMarker2 = sFactory.deleteMarker(suburbMarker2);
                                            cityMarker2 = sFactory.deleteMarker(cityMarker2);
                                            if(countryMarker2.length == 0){
                                                countryMarker2.push(sFactory.countryMarker($scope.allValue.ct.map));
                                            }
                                        }
                                    }

                                }
                                $('.loading_item').css({'width':'+=20'});
                                $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                            },1);
                        }
                    })
                    //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                    $scope.allValue.preMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page -= 1;
                        angular.element('.slp_next').show();
                        if($scope.allValue.xy.page < 0){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }


                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                    $scope.allValue.nextMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page += 1;
                        angular.element('.slp_pre').show();
                        if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                });

                $scope.allValue.showView = function(obj,$event){
                    $event.stopPropagation();
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null);
                        $scope.allValue.mapMaker = null;
                    }
                    var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                        '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                        '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                        '<p class="map_info_price">'+obj.housePrice+'</p>' +
                        '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                        '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                        '</div></div>' +
                        '</a>';
                    if(houseMarker2){
                        for(x in houseMarker2){
                            if(obj._id == houseMarker2[x]._id){
                                houseMarker2[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                houseMarker2[x].name.zIndex = 3;
                                infoWindowS.setContent(contentString);
                                infoWindowS.open($scope.allValue.ct.map, houseMarker2[x].name);
                                return;
                            }
                        }
                    }
                    $scope.allValue.mapMaker = new google.maps.Marker({
                        position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                        title : obj.title,
                        icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                        map: $scope.allValue.ct.map,
                        zIndex:9
                    });
                    $scope.allValue.mapMaker.addListener('click', function() {
                        infoWindowS.setContent(contentString);
                        infoWindowS.open($scope.allValue.ct.map, $scope.allValue.mapMaker);
                    });
                    infoWindowS.setContent(contentString);
                    infoWindowS.open($scope.allValue.ct.map, $scope.allValue.mapMaker);

                }
                //==================================================地图列表导航事件==================================
                //search页面列表左侧导航设置 点击添加样式
                $scope.allValue.setListNav = function(n,str){
                    $scope.allValue.sln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : n,
                        nextEvent : false
                    });
                    $('.slp_list_load').show();
                    if($scope.allValue.jugeTemp){
                        //$scope.allValue.xy.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.xy.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.xy.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.xy.sort = str;
                        }
                        $scope.allValue.xy.page = 0;
                        $scope.allValue.getNextData = pFactory.postData({
                            url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/searchHouseByMap',
                            data: JSON.stringify($scope.allValue.xy),
                            callBack: function (data) {
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }
                            }
                        })
                    }else{
                        //$scope.allValue.param.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.param.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.param.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.param.sort = str;
                        }
                        //console.log(str)
                        $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                            data:JSON.stringify($scope.allValue.param),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();

                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }

                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                };

                //安全指数的事件
                $('.search_safe_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_safe_display').hide();
                    $scope.allValue.ct.map.overlayMapTypes.pop();
                });
                $('.search_hotel_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hotel_display').hide();
                    //console.log(hotelMarker.markerArr);
                    //hotelMarker.moveMap = false;
                    //hotelMarker.markerArr = sFactory.deleteMarker(hotelMarker.markerArr)
                    for(x in hotelMarker2.markerArr){
                        hotelMarker2.markerArr[x].setMap(null);
                    }
                    hotelMarker2 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#3c8df6',
                        tempArr : []
                    };
                });
                $('.search_hospital_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hospital_display').hide();
                    //hospitalMarker.moveMap = false;
                    for(x in hospitalMarker2.markerArr){
                        hospitalMarker2.markerArr[x].setMap(null);
                    }
                    hospitalMarker2 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#26cf5c',
                        tempArr : []
                    };
                });
                $('.search_supermarket_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_supermarket_display').hide();
                    //supermarketMarker.moveMap = false;
                    for(x in supermarketMarker2.markerArr){
                        supermarketMarker2.markerArr[x].setMap(null);
                    }
                    supermarketMarker2 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#a970ff',
                        tempArr : []
                    };
                });

                var service = new google.maps.places.PlacesService($scope.allValue.ct.map);
                function callbackHotel(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hotelMarker2.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker2.tempArr,results)
                        hotelMarker2.tempArr = hotelMarker2.tempArr.concat(newMarkerArr);
                        hotelMarker2.markerArr = hotelMarker2.markerArr.concat(sFactory.makeServiceDot({
                            color:hotelMarker2.color,
                            map:$scope.allValue.ct.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function callbackHospital(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hospitalMarker2.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker2.tempArr,results)
                        hospitalMarker2.tempArr = hospitalMarker2.tempArr.concat(newMarkerArr);
                        hospitalMarker2.markerArr = hospitalMarker2.markerArr.concat(sFactory.makeServiceDot({
                            color:hospitalMarker2.color,
                            map:$scope.allValue.ct.map,
                            arr:newMarkerArr
                        }))
                    }
                };
                function callbackSupermarket(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = supermarketMarker2.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker2.tempArr,results)
                        supermarketMarker2.tempArr = supermarketMarker2.tempArr.concat(newMarkerArr);
                        supermarketMarker2.markerArr = supermarketMarker2.markerArr.concat(sFactory.makeServiceDot({
                            color:supermarketMarker2.color,
                            map:$scope.allValue.ct.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function serviceFn(obj){
                    request = {
                        bounds:obj.bns,
                        types: obj.ty
                    };
                    service.nearbySearch(request, obj.cb);
                }
                $scope.allValue.blockFilter = function(str){
                    var _mapbounds = $scope.allValue.ct.map.getBounds();
                    /*
                     * 1 ---> crime
                     * 2 ---> Restaurant
                     * 3 ---> hospital
                     * 4 ---> Convenience
                     * */
                    if(str == 1){
                        crimeFn($scope.allValue.ct.map)
                    }else if(str == 2){
                        $('.search_safe_icon').hide();
                        $('.search_hotel_display').show();
                        hotelMarker2.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(str == 3){
                        $('.search_safe_icon').hide();
                        $('.search_hospital_display').show();
                        serviceFn({
                            bns:_mapbounds,
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                        hospitalMarker2.moveMap = true;
                    }else if(str == 4){
                        $('.search_safe_icon').hide();
                        $('.search_supermarket_display').show();
                        supermarketMarker2.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                }
            }
        });
    };

    var houseMarker3 = [];
    var suburbMarker3 = [];
    var cityMarker3 = [];
    var countryMarker3 = [];

    var tempHouseArr3 = [];
    var tempSuburbArr3 = [];
    var tempCityArr3 = [];

    var hotelMarker3 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker3 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker3 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };

    $('.search_select_suburb').on('click',function(){
        $('.select_item').hide();
        $('.select_tri').removeClass('select_open_tri')
        cityTemp = true;
        roomsTemp = true;
        schoolTemp = true;
        if(subsurbTemp){
            $('.search_select_suburbItem').show();
            $('.select_suburb_tri').addClass('select_open_tri');
        }else{
            $('.search_select_suburbItem').hide();
            $('.select_suburb_tri').removeClass('select_open_tri');
        }
        subsurbTemp = !subsurbTemp;
    });
    $scope.allValue.suburbClick = function(str){
        changeMapTemp = false;
        $scope.allValue.curSchool = "学校";
        $('.search_safe_icon').unbind("click");
        $('.search_safe_close').unbind('click');
        $scope.allValue.c = null;
        $scope.allValue.ct = null;
        $('.search_select_suburbItem').hide();
        $('.slp_list_load').show();
        subsurbTemp = true;

        $scope.allValue.roomParam = {
            "all":true,
            "one":false,
            "two":false,
            "three":false,
            "four":false,
            "more":false
        }
        $('.select_rooms_show').text('卧室')

        $scope.allValue.currentSuburb = str;
        $scope.allValue.suburbs = $scope.allValue.select.suburb[str];
        $('.select_suburb_tri').removeClass('select_open_tri')
        $scope.allValue.ln = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : 0,
            nextEvent : false
        });
        priceUpDown = true;
        $('.priceUp').css({'border-top-color':'gray'})
        $('.priceDown').css({'border-bottom-color':'gray'})
        $scope.allValue.schoolParam.sort = 'defalut';
        $scope.allValue.param.sort = 'default';
        $scope.allValue.param.name = str;
        $scope.allValue.param.level = 3;
        $scope.allValue.param.page = 0;
        $scope.allValue.jugeTemp = 0;
        $scope.allValue.param.bedroom = $scope.allValue.roomParam;

        angular.element('.slp_more_next').hide();
        angular.element('.slp_pre').hide();
        angular.element('.slp_next').show();

        mapZoom = setMapZoom($scope.allValue.param.level);
        $scope.allValue.suburbs = $scope.allValue.select.suburb[$scope.allValue.currentCity];
        $scope.allValue.schools = $scope.allValue.selectSchool[$scope.allValue.currentCity];

        $scope.allValue.getSearchData = pFactory.postData({
            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
            data:JSON.stringify($scope.allValue.param),
            callBack : function(data){
                //console.log(data);
                $scope.allValue.listHouse = data.data[0];
                $('.slp_list_load').hide();
                $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                if(data.data[0].houseInfo == 0 && data.data[0].mapInfo.length == 0){
                    angular.element('.noHouse').show();
                    $timeout(function(){
                        angular.element('.noHouse').hide();
                    },2000);
                }else{
                    //设置当前页和总共有多少页
                    $scope.allValue.listHouse.curPage += 1;
                    $scope.allValue.listHouse.maxPage += 1;
                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                }

                //创建地图 在接下来使用地图都试$scope.allValue.c.map
                $scope.allValue.mapOption = {
                    id:'search_map',
                    map:'searchMap',
                    position : {lat: data.data[0].basePoint[1], lng:data.data[0].basePoint[0]},
                    zoom: mapZoom,
                    wheelEvent : true
                }
                $scope.allValue.sb = pFactory.setSearchMap($scope.allValue.mapOption);

                if(data.data[0].houseInfo){
                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                    }
                }

                var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});

                houseMarker3 = [];
                suburbMarker3 = [];
                cityMarker3 = [];
                countryMarker3 = [];

                tempHouseArr3 = [];
                tempSuburbArr3 = [];
                tempCityArr3 = [];

                //首次进来的时候判断现在的level 决定地图显示marker的类型
                tempHouseArr3 = data.data[0].mapInfo;
                $scope.allValue.searchDot = sFactory.makeMapDot(data.data[0].mapInfo,$scope.allValue.sb.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                houseMarker3 = houseMarker3.concat($scope.allValue.searchDot);

                $scope.allValue.sb.map.addListener('dragend',function(){
                    $('.search_loading_wrap').show();
                    $('.slp_list_load').show();

                    $scope.allValue.jugeTemp = 1;
                    $('.slp_more_btn').eq(0).hide();
                    $('.slp_more_btn').eq(1).show();
                    $scope.allValue.xy = {
                        "zoom":$scope.allValue.sb.map.getZoom(),
                        "bounds": [$scope.allValue.sb.map.getBounds().getNorthEast().lng(),$scope.allValue.sb.map.getBounds().getNorthEast().lat(),$scope.allValue.sb.map.getBounds().getSouthWest().lng(),$scope.allValue.sb.map.getBounds().getSouthWest().lat()],
                        "page":0,
                        "sort":"default",
                        "isAllHouse":false
                    }
                    //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                    if(hotelMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(hospitalMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                    }else if(supermarketMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                    $scope.allValue.ln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : 0,
                        nextEvent : false
                    });
                    $scope.allValue.getSearchData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                        data:JSON.stringify($scope.allValue.xy),
                        callBack : function(data){
                            var timer = $interval(function(){
                                if(parseInt($('.loading_item').width()) >= 200){
                                    $('.search_loading_wrap').hide();
                                    $('.loading_item').css({'width':40});
                                    $('.loading_item_num').text(20);
                                    $interval.cancel(timer);

                                    $scope.allValue.listHouse = data.data[0];
                                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    if(data.data[0].mapInfo == 0){
                                        angular.element('.noHouse').show();
                                        $timeout(function(){
                                            angular.element('.noHouse').hide();
                                        },1500);
                                    }else {
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                        if($scope.allValue.listHouse.mapLevel == 4){
                                            var newMarker = pFactory.differentArr(tempHouseArr3,data.data[0].mapInfo)
                                            tempSuburbArr3 = [];
                                            tempCityArr3 = [];

                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);
                                            if(newMarker.length != 0){
                                                $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.sb.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                houseMarker3 = houseMarker3.concat($scope.allValue.searchDot);
                                                tempHouseArr3 = tempHouseArr3.concat(newMarker);
                                            }

                                        }else if($scope.allValue.listHouse.mapLevel==3){
                                            var newMarker = pFactory.differentArr(tempSuburbArr3,data.data[0].mapInfo)
                                            tempHouseArr3 = [];
                                            tempCityArr3 = [];

                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);
                                            if(newMarker.length != 0){
                                                tempSuburbArr3 = tempSuburbArr3.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++){
                                                    suburbMarker3.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.sb.map))
                                                }
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==2){
                                            var newMarker = pFactory.differentArr(tempCityArr3,data.data[0].mapInfo)
                                            tempHouseArr3 = [];
                                            tempSuburbArr3 = [];

                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);

                                            if(newMarker.length != 0){
                                                tempCityArr3 = tempCityArr3.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++) {
                                                    cityMarker3.push(sFactory.cityMarker(newMarker[m],$scope.allValue.sb.map));
                                                }
                                            }
                                        }else{
                                            tempHouseArr3 = [];
                                            tempSuburbArr3 = [];
                                            tempCityArr3 = [];
                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            if(countryMarker3.length == 0){
                                                countryMarker3.push(sFactory.countryMarker($scope.allValue.sb.map));
                                            }
                                        }
                                    }

                                }
                                $('.loading_item').css({'width':'+=20'});
                                $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                            },1);
                        }
                    })
                    //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                    $scope.allValue.preMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page -= 1;
                        angular.element('.slp_next').show();
                        if($scope.allValue.xy.page < 0){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                    $scope.allValue.nextMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page += 1;
                        angular.element('.slp_pre').show();
                        if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                            return
                        }else{
                            $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();


                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                });
                //=============================== 检测地图事件 ============================
                $scope.allValue.sb.map.addListener('zoom_changed',function(){
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null);
                        $scope.allValue.mapMaker = null;
                    }
                    $('.slp_list_load').show();
                    $('.search_loading_wrap').show();
                    $scope.allValue.jugeTemp = 1;
                    $('.slp_more_btn').eq(0).hide();
                    $('.slp_more_btn').eq(1).show();
                    $scope.allValue.xy = {
                        "zoom":$scope.allValue.sb.map.getZoom(),
                        "bounds": [$scope.allValue.sb.map.getBounds().getNorthEast().lng(),$scope.allValue.sb.map.getBounds().getNorthEast().lat(),$scope.allValue.sb.map.getBounds().getSouthWest().lng(),$scope.allValue.sb.map.getBounds().getSouthWest().lat()],
                        "page":0,
                        "sort":"default",
                        "isAllHouse":false
                    }
                    //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                    if(hotelMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(hospitalMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                    }else if(supermarketMarker3.moveMap){
                        serviceFn({
                            bns:$scope.allValue.sb.map.getBounds(),
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                    $scope.allValue.ln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : 0,
                        nextEvent : false
                    });
                    $scope.allValue.getSearchData = pFactory.postData({
                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                        data:JSON.stringify($scope.allValue.xy),
                        callBack : function(data){
                            var timer = $interval(function(){
                                if(parseInt($('.loading_item').width()) >= 200){
                                    $('.search_loading_wrap').hide();
                                    $('.loading_item').css({'width':40});
                                    $('.loading_item_num').text(20);
                                    $interval.cancel(timer);
                                    //console.log(data.data[0])
                                    $scope.allValue.listHouse = data.data[0];
                                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    if(data.data[0].mapInfo.length == 0){
                                        angular.element('.noHouse').show();
                                        $timeout(function(){
                                            angular.element('.noHouse').hide();
                                        },1500);
                                    }else{
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                        if($scope.allValue.listHouse.mapLevel == 4){
                                            var newMarker = pFactory.differentArr(tempHouseArr3,data.data[0].mapInfo)
                                            tempSuburbArr3 = [];
                                            tempCityArr3 = [];

                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);
                                            if(newMarker.length != 0){
                                                $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.sb.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                houseMarker3 = houseMarker3.concat($scope.allValue.searchDot);
                                                tempHouseArr3 = tempHouseArr3.concat(newMarker);
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel==3){
                                            var newMarker = pFactory.differentArr(tempSuburbArr3,data.data[0].mapInfo)
                                            tempHouseArr3 = [];
                                            tempCityArr3 = [];

                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);

                                            if(newMarker.length != 0){
                                                tempSuburbArr3 = tempSuburbArr3.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++){
                                                    suburbMarker3.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.sb.map))
                                                }
                                            }
                                        }else if($scope.allValue.listHouse.mapLevel == 2){
                                            var newMarker = pFactory.differentArr(tempCityArr3,data.data[0].mapInfo)
                                            tempHouseArr3 = [];
                                            tempSuburbArr3 = [];

                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            countryMarker3 = sFactory.deleteMarker(countryMarker3);

                                            if(newMarker.length != 0){
                                                tempCityArr3 = tempCityArr3.concat(newMarker);
                                                for(var m = 0,len = newMarker.length; m < len; m++) {
                                                    cityMarker3.push(sFactory.cityMarker(newMarker[m],$scope.allValue.sb.map));
                                                }
                                            }
                                        }else{
                                            //console.log(data.data[0])
                                            tempHouseArr3 = [];
                                            tempSuburbArr3 = [];
                                            tempCityArr3 = [];
                                            houseMarker3 = sFactory.deleteHouseMarker(houseMarker3);
                                            suburbMarker3 = sFactory.deleteMarker(suburbMarker3);
                                            cityMarker3 = sFactory.deleteMarker(cityMarker3);

                                            if(countryMarker3.length == 0){
                                                countryMarker3.push(sFactory.countryMarker($scope.allValue.sb.map));
                                            }
                                        }
                                    }
                                }
                                $('.loading_item').css({'width':'+=20'});
                                $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                            },1);
                        }
                    })
                    //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                    $scope.allValue.preMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page -= 1;
                        angular.element('.slp_next').show();
                        if($scope.allValue.xy.page < 0){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                    $scope.allValue.nextMapPage = function(){
                        $('.slp_list_load').show();
                        $scope.allValue.xy.page += 1;
                        angular.element('.slp_pre').show();
                        if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                            $('.slp_list_load').hide();
                            return
                        }else{
                            $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();

                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }

                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        }
                    }
                });

                $scope.allValue.showView = function(obj,$event){
                    $event.stopPropagation();
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null);
                        $scope.allValue.mapMaker = null;
                    }
                    var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                        '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                        '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                        '<p class="map_info_price">'+obj.housePrice+'</p>' +
                        '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                        '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                        '</div></div>' +
                        '</a>';

                    if(houseMarker3){
                        for(x in houseMarker3){
                            if(obj._id == houseMarker3[x]._id){
                                houseMarker3[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                houseMarker3[x].name.zIndex = 3;
                                infoWindowS.setContent(contentString);
                                infoWindowS.open($scope.allValue.sb.map, houseMarker3[x].name);
                                return;
                            }
                        }
                    }


                    $scope.allValue.mapMaker = new google.maps.Marker({
                        position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                        title : obj.title,
                        icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                        map: $scope.allValue.sb.map,
                        zIndex:9
                    });
                    infoWindowS.setContent(contentString);
                    infoWindowS.open($scope.allValue.sb.map, $scope.allValue.mapMaker);
                    $scope.allValue.mapMaker.addListener('click', function() {
                        infoWindowS.setContent(contentString);
                        infoWindowS.open($scope.allValue.sb.map, $scope.allValue.mapMaker);
                    });
                }

                //==================================================地图列表导航事件==================================
                //search页面列表左侧导航设置 点击添加样式
                $scope.allValue.setListNav = function(n,str){
                    $scope.allValue.sln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : n,
                        nextEvent : false
                    });
                    $('.slp_list_load').show();
                    if($scope.allValue.jugeTemp){
                        //$scope.allValue.xy.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.xy.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.xy.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.xy.sort = str;
                        }
                        $scope.allValue.xy.page = 0;
                        $scope.allValue.getNextData = pFactory.postData({
                            url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/searchHouseByMap',
                            data: JSON.stringify($scope.allValue.xy),
                            callBack: function (data) {
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();
                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }
                            }
                        })
                    }else{
                        //$scope.allValue.param.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.param.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.param.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.param.sort = str;
                        }
                        $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                        $scope.allValue.getNextData = pFactory.postData({
                            url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                            data:JSON.stringify($scope.allValue.param),
                            callBack : function(data){
                                $scope.allValue.listHouse = data.data[0];
                                $('.slp_list_load').hide();
                                if(data.data[0].houseInfo){
                                    for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                        data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                    }
                                }
                                //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                //设置当前页和总共有多少页
                                $scope.allValue.listHouse.curPage += 1;
                                $scope.allValue.listHouse.maxPage += 1;
                            }
                        });
                    }
                };

                //安全指数的事件
                $('.search_safe_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_safe_display').hide();
                    $scope.allValue.sb.map.overlayMapTypes.pop();
                });
                $('.search_hotel_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hotel_display').hide();
                    for(x in hotelMarker3.markerArr){
                        hotelMarker3.markerArr[x].setMap(null);
                    }
                    hotelMarker3 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#3c8df6',
                        tempArr : []
                    };
                });
                $('.search_hospital_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hospital_display').hide();
                    //hospitalMarker.moveMap = false;
                    for(x in hospitalMarker3.markerArr){
                        hospitalMarker3.markerArr[x].setMap(null);
                    }
                    hospitalMarker3 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#26cf5c',
                        tempArr : []
                    };
                });
                $('.search_supermarket_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_supermarket_display').hide();
                    //supermarketMarker.moveMap = false;
                    for(x in supermarketMarker3.markerArr){
                        supermarketMarker3.markerArr[x].setMap(null);
                    }
                    supermarketMarker3 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#a970ff',
                        tempArr : []
                    };
                });

                var service = new google.maps.places.PlacesService($scope.allValue.sb.map);
                function callbackHotel(results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hotelMarker3.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker3.tempArr,results)
                        hotelMarker3.tempArr = hotelMarker3.tempArr.concat(newMarkerArr);
                        hotelMarker3.markerArr = hotelMarker3.markerArr.concat(sFactory.makeServiceDot({
                            color:hotelMarker3.color,
                            map:$scope.allValue.sb.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function callbackHospital(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hospitalMarker3.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker3.tempArr,results)
                        hospitalMarker3.tempArr = hospitalMarker3.tempArr.concat(newMarkerArr);
                        hospitalMarker3.markerArr = hospitalMarker3.markerArr.concat(sFactory.makeServiceDot({
                            color:hospitalMarker3.color,
                            map:$scope.allValue.sb.map,
                            arr:newMarkerArr
                        }))
                    }
                };
                function callbackSupermarket(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = supermarketMarker3.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker3.tempArr,results)
                        supermarketMarker3.tempArr = supermarketMarker3.tempArr.concat(newMarkerArr);
                        supermarketMarker3.markerArr = supermarketMarker3.markerArr.concat(sFactory.makeServiceDot({
                            color:supermarketMarker3.color,
                            map:$scope.allValue.sb.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function serviceFn(obj){
                    request = {
                        bounds:obj.bns,
                        types: obj.ty
                    };
                    service.nearbySearch(request, obj.cb);
                }
                $scope.allValue.blockFilter = function(str){
                    var _mapbounds = $scope.allValue.sb.map.getBounds();
                    /*
                     * 1 ---> crime
                     * 2 ---> Restaurant
                     * 3 ---> hospital
                     * 4 ---> Convenience
                     * */
                    if(str == 1){
                        crimeFn($scope.allValue.sb.map)
                    }else if(str == 2){
                        $('.search_safe_icon').hide();
                        $('.search_hotel_display').show();
                        hotelMarker3.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(str == 3){
                        $('.search_safe_icon').hide();
                        $('.search_hospital_display').show();
                        serviceFn({
                            bns:_mapbounds,
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                        hospitalMarker3.moveMap = true;
                    }else if(str == 4){
                        $('.search_safe_icon').hide();
                        $('.search_supermarket_display').show();
                        supermarketMarker3.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                }
            }
        });
    };

    var houseMarker4 = [];
    var suburbMarker4 = [];
    var cityMarker4 = [];
    var countryMarker4 = [];

    var tempHouseArr4 = [];
    var tempSuburbArr4 = [];
    var tempCityArr4 = [];

    var hotelMarker4 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker4 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker4 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };

    var hotelMarker6 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker6 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker6 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };

    $('.search_select_rooms').on('click',function(){
        console.log('a')
        $('.select_item').hide();
        //$('.search_select_suburbItem').hide();
        //$('.search_select_cityItem').hide();
        ////$('.search_select_roomsItem').show();
        $('.select_tri').removeClass('select_open_tri')
        cityTemp = true;
        subsurbTemp = true;
        schoolTemp = true;
        if(roomsTemp){
            $('.search_select_roomsItem').show();
            $('.select_rooms_tri').addClass('select_open_tri');
        }else{
            $('.search_select_roomsItem').hide();
            //stopPao = false;
            $('.select_rooms_tri').removeClass('select_open_tri');
        }

        roomsTemp = !roomsTemp;
    });
    $scope.allValue.selectRoom = function(str,$event){
        //$scope.allValue.curSchool = "学校";
        $scope.allValue.ln = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : 0,
            nextEvent : false
        });
        priceUpDown = true;
        $('.priceUp').css({'border-top-color':'gray'})
        $('.priceDown').css({'border-bottom-color':'gray'})
        $scope.allValue.schoolParam.sort = 'defalut';
        $scope.allValue.param.sort = 'default';
        $('.search_safe_icon').unbind("click");
        $('.search_safe_close').unbind('click');
        $('.slp_list_load').show();
        $('.search_safe_icon').show();
        $('.search_safe_display').hide();
        if($scope.allValue.sr){
            $scope.allValue.sr.map.overlayMapTypes.pop();
        }
        $scope.allValue.param.page = 0;
        angular.element('.slp_pre').hide();

        var strTxt = "";
        roomsTemp = true;
        switch (str){
            case 'all':
                $scope.allValue.roomParam.one = false;
                $scope.allValue.roomParam.two = false;
                $scope.allValue.roomParam.three = false;
                $scope.allValue.roomParam.four = false;
                $scope.allValue.roomParam.more = false;
                $scope.allValue.roomParam.all = !$scope.allValue.roomParam.all;
                break;
            case 'one':
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.one = !$scope.allValue.roomParam.one;
                break;
            case 'two':
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.two = !$scope.allValue.roomParam.two;
                break;
            case 'three':
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.three = !$scope.allValue.roomParam.three;
                break;
            case 'four':
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.four = !$scope.allValue.roomParam.four;
                break;
            default:
                $scope.allValue.roomParam.all = false;
                $scope.allValue.roomParam.more = !$scope.allValue.roomParam.more;
                break;
        }
        for(x in $scope.allValue.roomParam) {
            if ($scope.allValue.roomParam[x]) {
                //console.log(x)
                //console.log(turnNumberForShow(x))
                strTxt += turnNumberForShow(x) + ','
            }
        }
        strTxt == "不限," ? $('.select_rooms_show').text(strTxt) : $('.select_rooms_show').text(strTxt + "间卧室");

        $event.stopPropagation();

        if(!($scope.allValue.roomParam.one || $scope.allValue.roomParam.two || $scope.allValue.roomParam.three ||$scope.allValue.roomParam.four || $scope.allValue.roomParam.more || $scope.allValue.roomParam.all)){
            $scope.allValue.param.bedroom.all = true;
        }
        $scope.allValue.param.bedroom = $scope.allValue.roomParam;

        //当changeMapTemp为true 学区房中选择卧室
        //当当changeMapTemp为false时 普通选择
        if(changeMapTemp){
            $scope.allValue.getSearchData = pFactory.postData({
                url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getSchoolHouse',
                data: JSON.stringify($scope.allValue.schoolParam),
                callBack:function(data){
                    //console.log(data.data)
                    //console.log(data.data.geoCoordinatesPt);

                    $('.slp_list_load').hide();
                    //创建地图 在接下来使用地图都试$scope.allValue.ss.map
                    $scope.allValue.schoolmapOption = {
                        id:'search_map',
                        map:'schoolMap',
                        position : {lat: data.data.geoCoordinatesPt[1], lng:data.data.geoCoordinatesPt[0]},
                        zoom: 14,
                        wheelEvent : true
                    }
                    $scope.allValue.listHouse.houseInfo = data.data.houseList;
                    $scope.allValue.totalHouseNum = data.data.houseList.length;
                    for(var sh = 0,len = data.data.houseList.length; sh < len; sh++){
                        data.data.houseList[sh].houseUpDate = myFactory.timeFormat(data.data.houseList[sh].listedDate)
                    }
                    //console.log($scope.allValue.listHouse.houseInfo);
                    $scope.allValue.listHouse.curPage = $scope.allValue.listHouse.maxPage = 1;
                    $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                    $scope.allValue.ss = pFactory.setSearchMap($scope.allValue.schoolmapOption);

                    $scope.allValue.schoolCircle = sFactory.circleSchool(data.data.geoCoordinates)
                    $scope.allValue.schoolCircle.setMap($scope.allValue.ss.map);

                    var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});
                    tempHouseArr5 = data.data.houseList;
                    //console.log(tempHouseArr);
                    $scope.allValue.searchShoolDot = sFactory.makeMapDot(tempHouseArr5,$scope.allValue.ss.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                    houseMarker5 = $scope.allValue.searchShoolDot;
                    //点击左侧列表项 地图显示相应的房子
                    $scope.allValue.showView = function(obj,$event){
                        $event.stopPropagation();
                        //console.log(houseMarker5)
                        if($scope.allValue.mapMaker){
                            $scope.allValue.mapMaker.setMap(null)
                            $scope.allValue.mapMaker = null;
                        }
                        var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                            '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                            '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                            '<p class="map_info_price">'+obj.housePrice+'</p>' +
                            '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                            '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                            '</div></div>' +
                            '</a>';
                        if(houseMarker5){
                            for(x in houseMarker5){
                                if(obj._id == houseMarker5[x]._id){
                                    //console.log('a')
                                    houseMarker5[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                    houseMarker5[x].name.zIndex = 3;
                                    infoWindowS.setContent(contentString);
                                    infoWindowS.open($scope.allValue.ss.map, houseMarker5[x].name);
                                    return;
                                }
                            }
                        }
                        $scope.allValue.mapMaker = new google.maps.Marker({
                            position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                            title : obj.title,
                            icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                            map: $scope.allValue.ss.map,
                            zIndex:9
                        });
                        infoWindowS.setContent(contentString);
                        infoWindowS.open($scope.allValue.ss.map, $scope.allValue.mapMaker);
                        $scope.allValue.mapMaker.addListener('click', function() {
                            infoWindowS.setContent(contentString);
                            infoWindowS.open($scope.allValue.ss.map, $scope.allValue.mapMaker);
                        });

                    };

                    $scope.allValue.setListNav = function(n,str){
                        $scope.allValue.sln = myFactory.addClassName({
                            itemSmall : '.slp_nav>ol>li',
                            name : 'slp_nav_actived',
                            num : n,
                            nextEvent : false
                        });
                        $('.slp_list_load').show();
                        //$scope.allValue.schoolParam.sort = str;
                        if(n == 2){
                            if(priceUpDown){
                                $scope.allValue.schoolParam.sort = 'priceUp';
                                $('.priceUp').css({'border-top-color':'brown'})
                                $('.priceDown').css({'border-bottom-color':'gray'})
                            }else{
                                $scope.allValue.schoolParam.sort = 'priceDown';
                                $('.priceUp').css({'border-top-color':'gray'})
                                $('.priceDown').css({'border-bottom-color':'brown'})
                            }
                            priceUpDown = !priceUpDown;
                        }else{
                            $scope.allValue.schoolParam.sort = str;
                        }
                        $scope.allValue.getSearchData = pFactory.postData({
                            url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getSchoolHouse',
                            data: JSON.stringify($scope.allValue.schoolParam),
                            callBack: function (data) {
                                $('.slp_list_load').hide();
                                $scope.allValue.listHouse.houseInfo = data.data.houseList;
                                for(var sh1 = 0,len = data.data.houseList.length; sh1 < len; sh1++){
                                    data.data.houseList[sh1].houseUpDate = myFactory.timeFormat(data.data.houseList[sh1].listedDate)
                                }
                            }
                        })
                    };

                    //安全指数的事件
                    $('.search_safe_close').on('click',function(){
                        $('.search_safe_icon').show();
                        $('.search_safe_display').hide();
                        $scope.allValue.ss.map.overlayMapTypes.pop();
                    });
                    $('.search_hotel_close').on('click',function(){
                        $('.search_safe_icon').show();
                        $('.search_hotel_display').hide();
                        for(x in hotelMarker6.markerArr){
                            hotelMarker6.markerArr[x].setMap(null);
                        }
                        hotelMarker6 = {
                            markerArr : [],
                            moveMap : false,
                            color:'#3c8df6',
                            tempArr : []
                        };
                    });
                    $('.search_hospital_close').on('click',function(){
                        $('.search_safe_icon').show();
                        $('.search_hospital_display').hide();
                        //hospitalMarker.moveMap = false;
                        for(x in hospitalMarker6.markerArr){
                            hospitalMarker6.markerArr[x].setMap(null);
                        }
                        hospitalMarker6 = {
                            markerArr : [],
                            moveMap : false,
                            color:'#26cf5c',
                            tempArr : []
                        };
                    });
                    $('.search_supermarket_close').on('click',function(){
                        $('.search_safe_icon').show();
                        $('.search_supermarket_display').hide();
                        //supermarketMarker.moveMap = false;
                        for(x in supermarketMarker6.markerArr){
                            supermarketMarker6.markerArr[x].setMap(null);
                        }
                        supermarketMarker6 = {
                            markerArr : [],
                            moveMap : false,
                            color:'#a970ff',
                            tempArr : []
                        };
                    });

                    var service = new google.maps.places.PlacesService($scope.allValue.ss.map);
                    function callbackHotel(results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var newMarkerArr = hotelMarker6.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker6.tempArr,results)
                            hotelMarker6.tempArr = hotelMarker6.tempArr.concat(newMarkerArr);
                            hotelMarker6.markerArr = hotelMarker6.markerArr.concat(sFactory.makeServiceDot({
                                color:hotelMarker6.color,
                                map:$scope.allValue.ss.map,
                                arr:newMarkerArr
                            }))

                        }
                    };
                    function callbackHospital(results, status) {

                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var newMarkerArr = hospitalMarker6.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker6.tempArr,results)
                            hospitalMarker6.tempArr = hospitalMarker6.tempArr.concat(newMarkerArr);
                            hospitalMarker6.markerArr = hospitalMarker6.markerArr.concat(sFactory.makeServiceDot({
                                color:hospitalMarker6.color,
                                map:$scope.allValue.ss.map,
                                arr:newMarkerArr
                            }))
                        }
                    };
                    function callbackSupermarket(results, status) {

                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var newMarkerArr = supermarketMarker6.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker6.tempArr,results)
                            supermarketMarker6.tempArr = supermarketMarker6.tempArr.concat(newMarkerArr);
                            supermarketMarker6.markerArr = supermarketMarker6.markerArr.concat(sFactory.makeServiceDot({
                                color:supermarketMarker6.color,
                                map:$scope.allValue.ss.map,
                                arr:newMarkerArr
                            }))

                        }
                    };
                    function serviceFn(obj){
                        request = {
                            bounds:obj.bns,
                            types: obj.ty
                        };
                        service.nearbySearch(request, obj.cb);
                    }
                    $scope.allValue.blockFilter = function(str){
                        var _mapbounds = $scope.allValue.ss.map.getBounds();
                        /*
                         * 1 ---> crime
                         * 2 ---> Restaurant
                         * 3 ---> hospital
                         * 4 ---> Convenience
                         * */
                        if(str == 1){
                            crimeFn($scope.allValue.ss.map)
                        }else if(str == 2){
                            $('.search_safe_icon').hide();
                            $('.search_hotel_display').show();
                            hotelMarker5.moveMap = true;
                            serviceFn({
                                bns:_mapbounds,
                                ty:['restaurant'],
                                cb:callbackHotel
                            })
                        }else if(str == 3){
                            $('.search_safe_icon').hide();
                            $('.search_hospital_display').show();
                            serviceFn({
                                bns:_mapbounds,
                                ty:['hospital'],
                                cb:callbackHospital
                            });
                            hospitalMarker5.moveMap = true;
                        }else if(str == 4){
                            $('.search_safe_icon').hide();
                            $('.search_supermarket_display').show();
                            supermarketMarker5.moveMap = true;
                            serviceFn({
                                bns:_mapbounds,
                                ty:['convenience_store'],
                                cb:callbackSupermarket
                            })
                        }

                    }
                }
            })
        }else{
            $scope.allValue.getSearchData = pFactory.postData({
                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                data:JSON.stringify($scope.allValue.param),
                callBack : function(data){
                    $scope.allValue.listHouse = data.data[0];
                    $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                    $('.slp_list_load').hide();
                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                    if(data.data[0].houseInfo == 0 && data.data[0].mapInfo.length == 0){
                        angular.element('.noHouse').show();
                        $timeout(function(){
                            angular.element('.noHouse').hide();
                        },2000);
                    }else{
                        //设置当前页和总共有多少页
                        $scope.allValue.listHouse.curPage += 1;
                        $scope.allValue.listHouse.maxPage += 1;
                        $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                    }

                    if(data.data[0].mapLevel != 4 && $scope.allValue.sr){
                        return;
                    }else{
                        $scope.allValue.sr = null;
                        //创建地图 在接下来使用地图都试$scope.allValue.c.map
                        $scope.allValue.mapOption = {
                            id:'search_map',
                            map:'searchMap',
                            position : {lat: data.data[0].basePoint[1], lng:data.data[0].basePoint[0]},
                            zoom: setMapZoom((data.data[0].mapLevel - 1)),
                            wheelEvent : true
                        }
                        $scope.allValue.sr = pFactory.setSearchMap($scope.allValue.mapOption);

                        if(data.data[0].houseInfo){
                            for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                            }
                        }

                        var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});

                        houseMarker4 = [];
                        suburbMarker4 = [];
                        cityMarker4 = [];
                        countryMarker4 = [];

                        tempHouseArr4 = [];
                        tempSuburbArr4 = [];
                        tempCityArr4 = [];

                        /*
                         4 显示house
                         3 显示suburb
                         2 显示city
                         */
                        if(data.data[0].mapLevel == 2){
                            //console.log('a')
                            tempCityArr4 = data.data[0].mapInfo;
                            for(var m = 0,len=data.data[0].mapInfo.length; m < len; m++){
                                cityMarker4.push(sFactory.cityMarker(data.data[0].mapInfo[m],$scope.allValue.sr.map));
                            }
                        }
                        if(data.data[0].mapLevel == 3){
                            //console.log('a')
                            tempSuburbArr4 = data.data[0].mapInfo;
                            for(var m = 0,len=data.data[0].mapInfo.length; m < len; m++){
                                suburbMarker4.push(sFactory.suburbMarker(data.data[0].mapInfo[m],$scope.allValue.sr.map));
                            }
                        }
                        if(data.data[0].mapLevel == 4){
                            tempHouseArr4 = data.data[0].mapInfo;
                            //console.log(tempHouseArr);
                            $scope.allValue.searchDot = sFactory.makeMapDot(data.data[0].mapInfo,$scope.allValue.sr.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                            houseMarker4 = houseMarker4.concat($scope.allValue.searchDot);
                        }

                        $scope.allValue.sr.map.addListener('dragend',function(){
                            $('.search_loading_wrap').show();
                            $('.slp_list_load').show();

                            $scope.allValue.jugeTemp = 1;
                            $('.slp_more_btn').eq(0).hide();
                            $('.slp_more_btn').eq(1).show();
                            $scope.allValue.xy = {
                                "zoom":$scope.allValue.sr.map.getZoom(),
                                "bounds": [$scope.allValue.sr.map.getBounds().getNorthEast().lng(),$scope.allValue.sr.map.getBounds().getNorthEast().lat(),$scope.allValue.sr.map.getBounds().getSouthWest().lng(),$scope.allValue.sr.map.getBounds().getSouthWest().lat()],
                                "page":0,
                                "sort":"default",
                                "isAllHouse":false
                            }
                            //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                            if(hotelMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['restaurant'],
                                    cb:callbackHotel
                                })
                            }else if(hospitalMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['hospital'],
                                    cb:callbackHospital
                                });
                            }else if(supermarketMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['convenience_store'],
                                    cb:callbackSupermarket
                                })
                            }

                            $scope.allValue.xy.bedroom = $scope.allValue.roomParam;
                            $scope.allValue.ln = myFactory.addClassName({
                                itemSmall : '.slp_nav>ol>li',
                                name : 'slp_nav_actived',
                                num : 0,
                                nextEvent : false
                            });
                            $scope.allValue.getSearchData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    var timer = $interval(function(){
                                        if(parseInt($('.loading_item').width()) >= 200){
                                            $('.search_loading_wrap').hide();
                                            $('.loading_item').css({'width':40});
                                            $('.loading_item_num').text(20);
                                            $interval.cancel(timer);

                                            $scope.allValue.listHouse = data.data[0];
                                            $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                            if(data.data[0].mapInfo == 0){
                                                angular.element('.noHouse').show();
                                                $timeout(function(){
                                                    angular.element('.noHouse').hide();
                                                },1500);
                                            }else {
                                                //设置当前页和总共有多少页
                                                $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                                if($scope.allValue.listHouse.mapLevel == 4){
                                                    var newMarker = pFactory.differentArr(tempHouseArr4,data.data[0].mapInfo)
                                                    tempSuburbArr4 = [];
                                                    tempCityArr4 = [];

                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);
                                                    if(newMarker.length != 0){
                                                        $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.sr.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                        houseMarker4 = houseMarker4.concat($scope.allValue.searchDot);
                                                        tempHouseArr4 = tempHouseArr4.concat(newMarker);
                                                    }

                                                }else if($scope.allValue.listHouse.mapLevel==3){
                                                    var newMarker = pFactory.differentArr(tempSuburbArr4,data.data[0].mapInfo)
                                                    tempHouseArr4 = [];
                                                    tempCityArr4 = [];

                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);
                                                    if(newMarker.length != 0){
                                                        tempSuburbArr4 = tempSuburbArr4.concat(newMarker);
                                                        for(var m = 0,len = newMarker.length; m < len; m++){
                                                            suburbMarker4.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.sr.map))
                                                        }
                                                    }
                                                }else if($scope.allValue.listHouse.mapLevel==2){
                                                    var newMarker = pFactory.differentArr(tempCityArr4,data.data[0].mapInfo)
                                                    tempHouseArr4 = [];
                                                    tempSuburbArr4 = [];

                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);

                                                    if(newMarker.length != 0){
                                                        tempCityArr4 = tempCityArr4.concat(newMarker);
                                                        for(var m = 0,len = newMarker.length; m < len; m++) {
                                                            cityMarker4.push(sFactory.cityMarker(newMarker[m],$scope.allValue.sr.map));
                                                        }
                                                    }
                                                }else{
                                                    tempHouseArr4 = [];
                                                    tempSuburbArr4 = [];
                                                    tempCityArr4 = [];
                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    if(countryMarker4.length == 0){
                                                        countryMarker4.push(sFactory.countryMarker($scope.allValue.sr.map));
                                                    }
                                                }
                                            }

                                        }
                                        $('.loading_item').css({'width':'+=20'});
                                        $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                                    },1);
                                }
                            })
                            //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                            $scope.allValue.preMapPage = function(){
                                $('.slp_list_load').show();
                                $scope.allValue.xy.page -= 1;
                                angular.element('.slp_next').show();
                                if($scope.allValue.xy.page < 0){
                                    $('.slp_list_load').hide();
                                    return
                                }else{
                                    $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                                    $scope.allValue.getNextData = pFactory.postData({
                                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                        data:JSON.stringify($scope.allValue.xy),
                                        callBack : function(data){
                                            $scope.allValue.listHouse = data.data[0];
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                            //设置当前页和总共有多少页
                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                        }
                                    });
                                }
                            }
                            $scope.allValue.nextMapPage = function(){
                                $('.slp_list_load').show();
                                $scope.allValue.xy.page += 1;
                                angular.element('.slp_pre').show();
                                if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                                    return
                                }else{
                                    $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                                    $scope.allValue.getNextData = pFactory.postData({
                                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                        data:JSON.stringify($scope.allValue.xy),
                                        callBack : function(data){
                                            $scope.allValue.listHouse = data.data[0];
                                            $('.slp_list_load').hide();


                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            //设置当前页和总共有多少页
                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                        }
                                    });
                                }
                            }
                        });
                        //=============================== 检测地图事件 ============================
                        $scope.allValue.sr.map.addListener('zoom_changed',function(){
                            if($scope.allValue.mapMaker){
                                $scope.allValue.mapMaker.setMap(null);
                                $scope.allValue.mapMaker = null;
                            }
                            $('.slp_list_load').show();
                            $('.search_loading_wrap').show();
                            $scope.allValue.jugeTemp = 1;
                            $('.slp_more_btn').eq(0).hide();
                            $('.slp_more_btn').eq(1).show();
                            $scope.allValue.xy = {
                                "zoom":$scope.allValue.sr.map.getZoom(),
                                "bounds": [$scope.allValue.sr.map.getBounds().getNorthEast().lng(),$scope.allValue.sr.map.getBounds().getNorthEast().lat(),$scope.allValue.sr.map.getBounds().getSouthWest().lng(),$scope.allValue.sr.map.getBounds().getSouthWest().lat()],
                                "page":0,
                                "sort":"default",
                                "isAllHouse":false
                            }

                            //弱国现在是打开查询饭店。。。的时候就在地图位置发生变化的时候调用这个
                            if(hotelMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['restaurant'],
                                    cb:callbackHotel
                                })
                            }else if(hospitalMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['hospital'],
                                    cb:callbackHospital
                                });
                            }else if(supermarketMarker4.moveMap){
                                serviceFn({
                                    bns:$scope.allValue.sr.map.getBounds(),
                                    ty:['convenience_store'],
                                    cb:callbackSupermarket
                                })
                            }

                            $scope.allValue.xy.bedroom = $scope.allValue.roomParam;
                            $scope.allValue.ln = myFactory.addClassName({
                                itemSmall : '.slp_nav>ol>li',
                                name : 'slp_nav_actived',
                                num : 0,
                                nextEvent : false
                            });
                            $scope.allValue.getSearchData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                data:JSON.stringify($scope.allValue.xy),
                                callBack : function(data){
                                    var timer = $interval(function(){
                                        if(parseInt($('.loading_item').width()) >= 200){
                                            $('.search_loading_wrap').hide();
                                            $('.loading_item').css({'width':40});
                                            $('.loading_item_num').text(20);
                                            $interval.cancel(timer);
                                            //console.log(data.data[0])
                                            $scope.allValue.listHouse = data.data[0];
                                            $scope.allValue.totalHouseNum = $scope.allValue.listHouse.propNum;
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                            if(data.data[0].mapInfo.length == 0){
                                                angular.element('.noHouse').show();
                                                $timeout(function(){
                                                    angular.element('.noHouse').hide();
                                                },1500);
                                            }else{
                                                //设置当前页和总共有多少页
                                                $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                                                if($scope.allValue.listHouse.mapLevel == 4){
                                                    var newMarker = pFactory.differentArr(tempHouseArr4,data.data[0].mapInfo)
                                                    tempSuburbArr4 = [];
                                                    tempCityArr4 = [];

                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);
                                                    if(newMarker.length != 0){
                                                        $scope.allValue.searchDot = sFactory.makeMapDot(newMarker,$scope.allValue.sr.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                                                        houseMarker4 = houseMarker4.concat($scope.allValue.searchDot);
                                                        tempHouseArr4 = tempHouseArr4.concat(newMarker);
                                                    }
                                                }else if($scope.allValue.listHouse.mapLevel==3){
                                                    var newMarker = pFactory.differentArr(tempSuburbArr4,data.data[0].mapInfo)
                                                    tempHouseArr4 = [];
                                                    tempCityArr4 = [];

                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);

                                                    if(newMarker.length != 0){
                                                        tempSuburbArr4 = tempSuburbArr3.concat(newMarker);
                                                        for(var m = 0,len = newMarker.length; m < len; m++){
                                                            suburbMarker4.push(sFactory.suburbMarker(newMarker[m],$scope.allValue.sr.map))
                                                        }
                                                    }
                                                }else if($scope.allValue.listHouse.mapLevel == 2){
                                                    var newMarker = pFactory.differentArr(tempCityArr4,data.data[0].mapInfo)
                                                    tempHouseArr4 = [];
                                                    tempSuburbArr4 = [];

                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    countryMarker4 = sFactory.deleteMarker(countryMarker4);

                                                    if(newMarker.length != 0){
                                                        tempCityArr4 = tempCityArr4.concat(newMarker);
                                                        for(var m = 0,len = newMarker.length; m < len; m++) {
                                                            cityMarker4.push(sFactory.cityMarker(newMarker[m],$scope.allValue.sr.map));
                                                        }
                                                    }
                                                }else{
                                                    //console.log(data.data[0])
                                                    tempHouseArr4 = [];
                                                    tempSuburbArr4 = [];
                                                    tempCityArr4 = [];
                                                    houseMarker4 = sFactory.deleteHouseMarker(houseMarker4);
                                                    suburbMarker4 = sFactory.deleteMarker(suburbMarker4);
                                                    cityMarker4 = sFactory.deleteMarker(cityMarker4);

                                                    if(countryMarker4.length == 0){
                                                        countryMarker4.push(sFactory.countryMarker($scope.allValue.sr.map));
                                                    }
                                                }
                                            }
                                        }
                                        $('.loading_item').css({'width':'+=20'});
                                        $('.loading_item_num').text(parseInt($('.loading_item_num').text())+10);
                                    },1);
                                }
                            })
                            //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                            $scope.allValue.preMapPage = function(){
                                $('.slp_list_load').show();
                                $scope.allValue.xy.page -= 1;
                                angular.element('.slp_next').show();
                                if($scope.allValue.xy.page < 0){
                                    $('.slp_list_load').hide();
                                    return
                                }else{
                                    $scope.allValue.xy.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                                    $scope.allValue.getNextData = pFactory.postData({
                                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                        data:JSON.stringify($scope.allValue.xy),
                                        callBack : function(data){
                                            $scope.allValue.listHouse = data.data[0];
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                            //设置当前页和总共有多少页
                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                        }
                                    });
                                }
                            }
                            $scope.allValue.nextMapPage = function(){
                                $('.slp_list_load').show();
                                $scope.allValue.xy.page += 1;
                                angular.element('.slp_pre').show();
                                if($scope.allValue.xy.page > $scope.allValue.listHouse.maxPage-1){
                                    $('.slp_list_load').hide();
                                    return
                                }else{
                                    $scope.allValue.xy.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                                    $scope.allValue.getNextData = pFactory.postData({
                                        url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByMap',
                                        data:JSON.stringify($scope.allValue.xy),
                                        callBack : function(data){
                                            $scope.allValue.listHouse = data.data[0];
                                            $('.slp_list_load').hide();

                                            if(data.data[0].houseInfo){
                                                for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                    data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                                }
                                            }

                                            //设置当前页和总共有多少页
                                            $scope.allValue.listHouse.curPage += 1;
                                            $scope.allValue.listHouse.maxPage += 1;
                                        }
                                    });
                                }
                            }
                        });

                        $scope.allValue.showView = function(obj,$event){
                            $event.stopPropagation();
                            if($scope.allValue.mapMaker){
                                $scope.allValue.mapMaker.setMap(null);
                                $scope.allValue.mapMaker = null;
                            }
                            var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                                '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                                '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                                '<p class="map_info_price">'+obj.housePrice+'</p>' +
                                '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                                '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                                '</div></div>' +
                                '</a>';

                            if(houseMarker4){
                                for(x in houseMarker4){
                                    if(obj._id == houseMarker4[x]._id){
                                        houseMarker4[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                        houseMarker4[x].name.zIndex = 3;
                                        infoWindowS.setContent(contentString);
                                        infoWindowS.open($scope.allValue.sr.map, houseMarker4[x].name);
                                        return;
                                    }
                                }
                            }


                            $scope.allValue.mapMaker = new google.maps.Marker({
                                position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                                title : obj.title,
                                icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                                map: $scope.allValue.sr.map,
                                zIndex:9
                            });
                            infoWindowS.setContent(contentString);
                            infoWindowS.open($scope.allValue.sr.map, $scope.allValue.mapMaker);
                            $scope.allValue.mapMaker.addListener('click', function() {
                                infoWindowS.setContent(contentString);
                                infoWindowS.open($scope.allValue.sr.map, $scope.allValue.mapMaker);
                            });
                        }

                        //==================================================地图列表导航事件==================================
                        //search页面列表左侧导航设置 点击添加样式
                        $scope.allValue.setListNav = function(n,str){
                            $scope.allValue.sln = myFactory.addClassName({
                                itemSmall : '.slp_nav>ol>li',
                                name : 'slp_nav_actived',
                                num : n,
                                nextEvent : false
                            });
                            $('.slp_list_load').show();
                            //$scope.allValue.param.sort = str;
                            if(n == 2){
                                if(priceUpDown){
                                    $scope.allValue.param.sort = 'priceUp';
                                    $('.priceUp').css({'border-top-color':'brown'})
                                    $('.priceDown').css({'border-bottom-color':'gray'})
                                }else{
                                    $scope.allValue.param.sort = 'priceDown';
                                    $('.priceUp').css({'border-top-color':'gray'})
                                    $('.priceDown').css({'border-bottom-color':'brown'})
                                }
                                priceUpDown = !priceUpDown;
                            }else{
                                $scope.allValue.param.sort = str;
                            }
                            $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                            $scope.allValue.getNextData = pFactory.postData({
                                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                                data:JSON.stringify($scope.allValue.param),
                                callBack : function(data){
                                    $scope.allValue.listHouse = data.data[0];
                                    $('.slp_list_load').hide();
                                    if(data.data[0].houseInfo){
                                        for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                            data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                        }
                                    }
                                    //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                    //设置当前页和总共有多少页
                                    $scope.allValue.listHouse.curPage += 1;
                                    $scope.allValue.listHouse.maxPage += 1;
                                }
                            });
                        };
                        //安全指数的事件
                        $('.search_safe_close').on('click',function(){
                            $('.search_safe_icon').show();
                            $('.search_safe_display').hide();
                            $scope.allValue.sr.map.overlayMapTypes.pop();
                        });
                        $('.search_hotel_close').on('click',function(){
                            $('.search_safe_icon').show();
                            $('.search_hotel_display').hide();
                            for(x in hotelMarker4.markerArr){
                                hotelMarker4.markerArr[x].setMap(null);
                            }
                            hotelMarker4 = {
                                markerArr : [],
                                moveMap : false,
                                color:'#3c8df6',
                                tempArr : []
                            };
                        });
                        $('.search_hospital_close').on('click',function(){
                            $('.search_safe_icon').show();
                            $('.search_hospital_display').hide();
                            //hospitalMarker.moveMap = false;
                            for(x in hospitalMarker4.markerArr){
                                hospitalMarker4.markerArr[x].setMap(null);
                            }
                            hospitalMarker4 = {
                                markerArr : [],
                                moveMap : false,
                                color:'#26cf5c',
                                tempArr : []
                            };
                        });
                        $('.search_supermarket_close').on('click',function(){
                            $('.search_safe_icon').show();
                            $('.search_supermarket_display').hide();
                            //supermarketMarker.moveMap = false;
                            for(x in supermarketMarker4.markerArr){
                                supermarketMarker4.markerArr[x].setMap(null);
                            }
                            supermarketMarker4 = {
                                markerArr : [],
                                moveMap : false,
                                color:'#a970ff',
                                tempArr : []
                            };
                        });

                        var service = new google.maps.places.PlacesService($scope.allValue.sr.map);
                        function callbackHotel(results, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var newMarkerArr = hotelMarker4.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker4.tempArr,results)
                                hotelMarker4.tempArr = hotelMarker4.tempArr.concat(newMarkerArr);
                                hotelMarker4.markerArr = hotelMarker4.markerArr.concat(sFactory.makeServiceDot({
                                    color:hotelMarker4.color,
                                    map:$scope.allValue.sr.map,
                                    arr:newMarkerArr
                                }))

                            }
                        };
                        function callbackHospital(results, status) {

                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var newMarkerArr = hospitalMarker4.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker4.tempArr,results)
                                hospitalMarker4.tempArr = hospitalMarker4.tempArr.concat(newMarkerArr);
                                hospitalMarker4.markerArr = hospitalMarker4.markerArr.concat(sFactory.makeServiceDot({
                                    color:hospitalMarker4.color,
                                    map:$scope.allValue.sr.map,
                                    arr:newMarkerArr
                                }))
                            }
                        };
                        function callbackSupermarket(results, status) {

                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var newMarkerArr = supermarketMarker4.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker4.tempArr,results)
                                supermarketMarker4.tempArr = supermarketMarker4.tempArr.concat(newMarkerArr);
                                supermarketMarker4.markerArr = supermarketMarker4.markerArr.concat(sFactory.makeServiceDot({
                                    color:supermarketMarker4.color,
                                    map:$scope.allValue.sr.map,
                                    arr:newMarkerArr
                                }))

                            }
                        };
                        function serviceFn(obj){
                            request = {
                                bounds:obj.bns,
                                types: obj.ty
                            };
                            service.nearbySearch(request, obj.cb);
                        }
                        $scope.allValue.blockFilter = function(str){
                            var _mapbounds = $scope.allValue.sr.map.getBounds();
                            /*
                             * 1 ---> crime
                             * 2 ---> Restaurant
                             * 3 ---> hospital
                             * 4 ---> Convenience
                             * */
                            if(str == 1){
                                crimeFn($scope.allValue.sr.map)
                            }else if(str == 2){
                                $('.search_safe_icon').hide();
                                $('.search_hotel_display').show();
                                hotelMarker4.moveMap = true;
                                serviceFn({
                                    bns:_mapbounds,
                                    ty:['restaurant'],
                                    cb:callbackHotel
                                })
                            }else if(str == 3){
                                $('.search_safe_icon').hide();
                                $('.search_hospital_display').show();
                                serviceFn({
                                    bns:_mapbounds,
                                    ty:['hospital'],
                                    cb:callbackHospital
                                });
                                hospitalMarker4.moveMap = true;
                            }else if(str == 4){
                                $('.search_safe_icon').hide();
                                $('.search_supermarket_display').show();
                                supermarketMarker4.moveMap = true;
                                serviceFn({
                                    bns:_mapbounds,
                                    ty:['convenience_store'],
                                    cb:callbackSupermarket
                                })
                            }

                        }

                        $scope.allValue.jugeTemp = 1;
                        $('.slp_more_btn').eq(0).hide();
                        $('.slp_more_btn').eq(1).show();
                        //当地图发生放大缩小或者拖动的时候 出现相应的next pre按键并绑定事件
                        $scope.allValue.preMapPage = function(){
                            $('.slp_list_load').show();
                            $scope.allValue.param.page -= 1;
                            angular.element('.slp_next').show();
                            if($scope.allValue.param.page < 0){
                                $('.slp_list_load').hide();
                                return
                            }else{
                                $scope.allValue.param.page == 0 ? angular.element('.slp_pre').hide() : angular.element('.slp_pre').show();
                                $scope.allValue.getNextData = pFactory.postData({
                                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                                    data:JSON.stringify($scope.allValue.param),
                                    callBack : function(data){
                                        $scope.allValue.listHouse = data.data[0];
                                        $('.slp_list_load').hide();

                                        if(data.data[0].houseInfo){
                                            for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            }
                                        }

                                        //当搜索地方没有房子的时候显示没有房子，并在1.5s后消失
                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.curPage += 1;
                                        $scope.allValue.listHouse.maxPage += 1;
                                    }
                                });
                            }
                        }
                        $scope.allValue.nextMapPage = function(){
                            $('.slp_list_load').show();
                            $scope.allValue.param.page += 1;
                            angular.element('.slp_pre').show();
                            if($scope.allValue.param.page > $scope.allValue.listHouse.maxPage-1){
                                $('.slp_list_load').hide();
                                return
                            }else{
                                $scope.allValue.param.page == $scope.allValue.listHouse.maxPage-1 ? angular.element('.slp_next').hide() : angular.element('.slp_next').show();
                                $scope.allValue.getNextData = pFactory.postData({
                                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchHouseByArea',
                                    data:JSON.stringify($scope.allValue.param),
                                    callBack : function(data){
                                        $scope.allValue.listHouse = data.data[0];
                                        $('.slp_list_load').hide();

                                        if(data.data[0].houseInfo){
                                            for(var ho = 0,len = data.data[0].houseInfo.length; ho < len; ho++){
                                                data.data[0].houseInfo[ho].houseUpDate = myFactory.timeFormat(data.data[0].houseInfo[ho].listedDate)
                                            }
                                        }

                                        //设置当前页和总共有多少页
                                        $scope.allValue.listHouse.curPage += 1;
                                        $scope.allValue.listHouse.maxPage += 1;
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    };
    function turnNumberForShow(str){
        //console.log(typeof str)
        //console.log(str)
        switch (str){
            case 'all':
                return '不限';
                break;
            case 'one':
                return '1';
                break;
            case 'two':
                return '2';
                break;
            case 'three':
                return '3';
                break;
            case 'four':
                return '4';
                break;
            default:
                return '>4';
                break;
        }
    }

    var houseMarker5 = [];
    var tempHouseArr5 = [];
    var hotelMarker5 = {
        markerArr : [],
        moveMap : false,
        color:'#3c8df6',
        tempArr : []
    };
    var hospitalMarker5 = {
        markerArr : [],
        moveMap : false,
        color:'#26cf5c',
        tempArr : []
    };
    var supermarketMarker5 = {
        markerArr : [],
        moveMap : false,
        color:'#a970ff',
        tempArr : []
    };
    $('.search_select_school').on('click',function(){
        //console.log('a')
        $('.select_item').hide();
        $('.select_tri').removeClass('select_open_tri')
        cityTemp = true;
        subsurbTemp = true;
        roomTemp = true;
        if(schoolTemp){
            $('.search_select_schoolItem').show();
            $('.select_school_tri').addClass('select_open_tri');
        }else{
            $('.search_select_schoolItem').hide();
            //stopPao = false;
            $('.select_school_tri').removeClass('select_open_tri');
        }
        schoolTemp = !schoolTemp;
    });
    $scope.allValue.schoolClick = function(s){
        //console.log(a)
        $scope.allValue.ln = myFactory.addClassName({
            itemSmall : '.slp_nav>ol>li',
            name : 'slp_nav_actived',
            num : 0,
            nextEvent : false
        });
        priceUpDown = true;
        $('.priceUp').css({'border-top-color':'gray'})
        $('.priceDown').css({'border-bottom-color':'gray'})
        $scope.allValue.schoolParam.sort = 'defalut';
        $scope.allValue.param.sort = 'default';
        $scope.allValue.roomParam = {
            "all":true,
            "one":false,
            "two":false,
            "three":false,
            "four":false,
            "more":false
        }
        $('.select_rooms_show').text('卧室');
        $scope.allValue.curSchool = s.name;
        changeMapTemp = true;
        //$('.slp_list_load').show();
        $('.search_safe_icon').show();
        $('.search_safe_display').hide();
        if($scope.allValue.ss){
            $scope.allValue.ss.map.overlayMapTypes.pop();
        }
        angular.element('.slp_pre').hide();
        $scope.allValue.schoolParam.id = s.id;
        $scope.allValue.schoolParam.bedroom = $scope.allValue.roomParam;
        //console.log($scope.allValue.schoolParam);
        $scope.allValue.getSearchData = pFactory.postData({
            url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getSchoolHouse',
            data: JSON.stringify($scope.allValue.schoolParam),
            callBack:function(data){
                //console.log(data)
                //console.log(data.data.geoCoordinatesPt);

                $('.slp_list_load').hide();
                //创建地图 在接下来使用地图都试$scope.allValue.ss.map
                $scope.allValue.schoolmapOption = {
                    id:'search_map',
                    map:'schoolMap',
                    position : {lat: data.data.geoCoordinatesPt[1], lng:data.data.geoCoordinatesPt[0]},
                    zoom: 14,
                    wheelEvent : true
                }
                $scope.allValue.listHouse.houseInfo = data.data.houseList;
                $scope.allValue.totalHouseNum = data.data.houseList.length;
                for(var sh = 0,len = data.data.houseList.length; sh < len; sh++){
                    data.data.houseList[sh].houseUpDate = myFactory.timeFormat(data.data.houseList[sh].listedDate)
                }
                //console.log($scope.allValue.listHouse.houseInfo);
                $scope.allValue.listHouse.curPage = $scope.allValue.listHouse.maxPage = 1;
                $scope.allValue.listHouse.maxPage <= 1 ? angular.element('.slp_more_next').hide() : angular.element('.slp_more_next').show();
                $scope.allValue.ss = pFactory.setSearchMap($scope.allValue.schoolmapOption);

                $scope.allValue.schoolCircle = sFactory.circleSchool(data.data.geoCoordinates)
                $scope.allValue.schoolCircle.setMap($scope.allValue.ss.map);

                var infoWindowS = new google.maps.InfoWindow({maxWidth: 550});
                tempHouseArr5 = data.data.houseList;
                //console.log(tempHouseArr);
                $scope.allValue.searchShoolDot = sFactory.makeMapDot(tempHouseArr5,$scope.allValue.ss.map,infoWindowS,$scope.imgDomain,$scope.allValue.ct);
                houseMarker5 = $scope.allValue.searchShoolDot;
                //点击左侧列表项 地图显示相应的房子
                $scope.allValue.showView = function(obj,$event){
                    $event.stopPropagation();
                    //console.log(houseMarker5)
                    if($scope.allValue.mapMaker){
                        $scope.allValue.mapMaker.setMap(null)
                        $scope.allValue.mapMaker = null;
                    }
                    var contentString = '<a href="detail?'+obj._id+'&'+obj.streetAddress+'&'+obj.suburb+'&'+$scope.allValue.ct+'" class="mapInfo" target="_blank"><div>' +
                        '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+ obj.houseMainImagePath +'"/></div>' +
                        '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                        '<p class="map_info_price">'+obj.housePrice+'</p>' +
                        '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                        '<ul><li><span class="map_info_bed"></span><span>'+obj.bedroom+'</span><span class="map_info_bath"></span><span>'+obj.bathroom+'</span></li></ul>' +
                        '</div></div>' +
                        '</a>';
                    if(houseMarker5){
                        for(x in houseMarker5){
                            if(obj._id == houseMarker5[x]._id){
                                //console.log('a')
                                houseMarker5[x].name.setIcon('http://res.tigerz.nz/imgs/maphisicon.png');
                                houseMarker5[x].name.zIndex = 3;
                                infoWindowS.setContent(contentString);
                                infoWindowS.open($scope.allValue.ss.map, houseMarker5[x].name);
                                return;
                            }
                        }
                    }
                    $scope.allValue.mapMaker = new google.maps.Marker({
                        position: {lat: obj.basePoint[1], lng: obj.basePoint[0]},
                        title : obj.title,
                        icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                        map: $scope.allValue.ss.map,
                        zIndex:9
                    });
                    infoWindowS.setContent(contentString);
                    infoWindowS.open($scope.allValue.ss.map, $scope.allValue.mapMaker);
                    $scope.allValue.mapMaker.addListener('click', function() {
                        infoWindowS.setContent(contentString);
                        infoWindowS.open($scope.allValue.ss.map, $scope.allValue.mapMaker);
                    });

                };

                $scope.allValue.setListNav = function(n,str){
                    $scope.allValue.sln = myFactory.addClassName({
                        itemSmall : '.slp_nav>ol>li',
                        name : 'slp_nav_actived',
                        num : n,
                        nextEvent : false
                    });
                    $('.slp_list_load').show();
                    //$scope.allValue.schoolParam.sort = str;
                    if(n == 2){
                        if(priceUpDown){
                            $scope.allValue.schoolParam.sort = 'priceUp';
                            $('.priceUp').css({'border-top-color':'brown'})
                            $('.priceDown').css({'border-bottom-color':'gray'})
                        }else{
                            $scope.allValue.schoolParam.sort = 'priceDown';
                            $('.priceUp').css({'border-top-color':'gray'})
                            $('.priceDown').css({'border-bottom-color':'brown'})
                        }
                        priceUpDown = !priceUpDown;
                    }else{
                        $scope.allValue.schoolParam.sort = str;
                    }
                    $scope.allValue.getSearchData = pFactory.postData({
                        url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getSchoolHouse',
                        data: JSON.stringify($scope.allValue.schoolParam),
                        callBack: function (data) {
                            $('.slp_list_load').hide();
                            $scope.allValue.listHouse.houseInfo = data.data.houseList;
                            for(var sh1 = 0,len = data.data.houseList.length; sh1 < len; sh1++){
                                data.data.houseList[sh1].houseUpDate = myFactory.timeFormat(data.data.houseList[sh1].listedDate)
                            }
                        }
                    })
                };

                //安全指数的事件
                $('.search_safe_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_safe_display').hide();
                    $scope.allValue.ss.map.overlayMapTypes.pop();
                });
                $('.search_hotel_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hotel_display').hide();
                    for(x in hotelMarker5.markerArr){
                        hotelMarker5.markerArr[x].setMap(null);
                    }
                    hotelMarker5 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#3c8df6',
                        tempArr : []
                    };
                });
                $('.search_hospital_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_hospital_display').hide();
                    //hospitalMarker.moveMap = false;
                    for(x in hospitalMarker5.markerArr){
                        hospitalMarker5.markerArr[x].setMap(null);
                    }
                    hospitalMarker5 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#26cf5c',
                        tempArr : []
                    };
                });
                $('.search_supermarket_close').on('click',function(){
                    $('.search_safe_icon').show();
                    $('.search_supermarket_display').hide();
                    //supermarketMarker.moveMap = false;
                    for(x in supermarketMarker5.markerArr){
                        supermarketMarker5.markerArr[x].setMap(null);
                    }
                    supermarketMarker5 = {
                        markerArr : [],
                        moveMap : false,
                        color:'#a970ff',
                        tempArr : []
                    };
                });

                var service = new google.maps.places.PlacesService($scope.allValue.ss.map);
                function callbackHotel(results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hotelMarker5.tempArr.length == 0 ? results : sFactory.differentArr(hotelMarker5.tempArr,results)
                        hotelMarker5.tempArr = hotelMarker5.tempArr.concat(newMarkerArr);
                        hotelMarker5.markerArr = hotelMarker5.markerArr.concat(sFactory.makeServiceDot({
                            color:hotelMarker5.color,
                            map:$scope.allValue.ss.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function callbackHospital(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = hospitalMarker5.tempArr.length == 0 ? results : sFactory.differentArr(hospitalMarker5.tempArr,results)
                        hospitalMarker5.tempArr = hospitalMarker5.tempArr.concat(newMarkerArr);
                        hospitalMarker5.markerArr = hospitalMarker5.markerArr.concat(sFactory.makeServiceDot({
                            color:hospitalMarker5.color,
                            map:$scope.allValue.ss.map,
                            arr:newMarkerArr
                        }))
                    }
                };
                function callbackSupermarket(results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var newMarkerArr = supermarketMarker5.tempArr.length == 0 ? results : sFactory.differentArr(supermarketMarker5.tempArr,results)
                        supermarketMarker5.tempArr = supermarketMarker5.tempArr.concat(newMarkerArr);
                        supermarketMarker5.markerArr = supermarketMarker5.markerArr.concat(sFactory.makeServiceDot({
                            color:supermarketMarker5.color,
                            map:$scope.allValue.ss.map,
                            arr:newMarkerArr
                        }))

                    }
                };
                function serviceFn(obj){
                    request = {
                        bounds:obj.bns,
                        types: obj.ty
                    };
                    service.nearbySearch(request, obj.cb);
                }
                $scope.allValue.blockFilter = function(str){
                    var _mapbounds = $scope.allValue.ss.map.getBounds();
                    /*
                     * 1 ---> crime
                     * 2 ---> Restaurant
                     * 3 ---> hospital
                     * 4 ---> Convenience
                     * */
                    if(str == 1){
                        crimeFn($scope.allValue.ss.map)
                    }else if(str == 2){
                        $('.search_safe_icon').hide();
                        $('.search_hotel_display').show();
                        hotelMarker5.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['restaurant'],
                            cb:callbackHotel
                        })
                    }else if(str == 3){
                        $('.search_safe_icon').hide();
                        $('.search_hospital_display').show();
                        serviceFn({
                            bns:_mapbounds,
                            ty:['hospital'],
                            cb:callbackHospital
                        });
                        hospitalMarker5.moveMap = true;
                    }else if(str == 4){
                        $('.search_safe_icon').hide();
                        $('.search_supermarket_display').show();
                        supermarketMarker5.moveMap = true;
                        serviceFn({
                            bns:_mapbounds,
                            ty:['convenience_store'],
                            cb:callbackSupermarket
                        })
                    }

                }
            }
        })
    }

    $scope.allValue.hideSelectDiv = function(){
        cityTemp = true;
        subsurbTemp = true;
        $('.search_select_suburbItem').hide();
        $('.search_select_cityItem').hide();
        //$('.select_city_tri').css({
        //    'border': '5px solid transparent',
        //    'border-top':'5px solid #2b2b2b',
        //    'top':'15px'
        //});
        //$('.select_suburb_tri').css({
        //    'border': '5px solid transparent',
        //    'border-top':'5px solid #2b2b2b',
        //    'top':'15px'
        //});
        $('.select_city_tri').removeClass('select_open_tri');
        $('.select_suburb_tri').removeClass('select_open_tri');
    }
    $('#search_map').on('click',function(){
        cityTemp = true;
        subsurbTemp = true;
        $('.search_select_suburbItem').hide();
        $('.search_select_cityItem').hide();
        $('.select_city_tri').removeClass('select_open_tri');
        $('.select_suburb_tri').removeClass('select_open_tri');
        //$('.select_city_tri').css({
        //    'border': '5px solid transparent',
        //    'border-top':'5px solid #2b2b2b',
        //    'top':'15px'
        //});
        //$('.select_suburb_tri').css({
        //    'border': '5px solid transparent',
        //    'border-top':'5px solid #2b2b2b',
        //    'top':'15px'
        //});
    })

    //================================搜索框事件============================
    $scope.allValue.searchPageValue = '';
    $scope.allValue.searchSubFlag = true;

    $scope.allValue.searchPageBar = function(){
        if($scope.allValue.searchPageValue.length != 0){
            angular.element('.searchPage_history').hide();
            angular.element('.searchPage_simple').show();
            angular.element('.searchPage_error').hide();
            $scope.allValue.searchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.searchPageValue,"scope":$scope.allValue.ct}),
                callBack:function(data) {
                    $scope.allValue.searchPageData = data.data;
                    data.data.length != 0 ? angular.element('.searchPage_error').hide() : angular.element('.searchPage_error').show();

                    $scope.allValue.searchPageBtn = function(){
                        if($scope.allValue.searchPageValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return '/detail_cn?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.ct
                            }else{
                                return '/search_cn?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+'&ct='+$scope.allValue.ct;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.searchPage_history').show();
            angular.element('.searchPage_simple').hide();
            angular.element('.searchPage_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                $scope.allValue.searchHistoryData = [];
                var json = {};
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };

    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.searchBlurEvent = function(){
        $scope.allValue.searchSubFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.searchOverEvent = function (){
        $scope.allValue.searchSubFlag = false;
        $scope.allValue.searchBlurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.searchLeaveEvent = function (){
        $scope.allValue.searchBlurEvent = function(){
            $scope.allValue.searchSubFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.searchFocusEvent = function(){
        $scope.allValue.searchSubFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            //return '/detail_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName
            if(obj.isSale){
                return 'detail_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.ct;
            }else{
                return 'house_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.ct;
            }
        }else{
            return '/search_cn?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.ct;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(在售)' : 'House(非可售)';
                break;
        }
    };
}]);
//==================================================== 中文详情页控制器 ==============================
app.controller('detailCNCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory1','$interval','$timeout','publicFactory','$sce',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$timeout,pFactory,$sce){ // zw添加$se,使用$sce控制代码安全检查
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;

    //挂载detail的所有变量
    $scope.allValue = {};

    $scope.allValue.currentSelectCity = "Auckland City";
    $scope.allValue.jugeFootMap = true;
    $scope.allValue.jugeTurnMap = true;
    $scope.allValue.showTurnMap = false;
    var img_index_num = 0;
    //设置锚点
    $scope.allValue.jump = myFactory.detail.anchor;
    //页面加载是设置滚动的最大高度 初始化页面的一些设置
    $scope.allValue.sc = myFactory.detail.sc();
    //获取当前的houseid
    $scope.allValue.nowIdParam = location.href.indexOf('?') == -1 ? '582db4eb4860e427946270de': location.href.substr(location.href.indexOf('?')+1);
    angular.element('.dataSave').data('detailParam',$scope.allValue.nowIdParam);

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/detail_cn.html?"+ $scope.allValue.nowIdParam;
    }

    $scope.allValue.currentSelectCity =  decodeURIComponent($scope.allValue.nowIdParam.split('&')[ $scope.allValue.nowIdParam.split('&').length-1])

    $('.detail_language_en').attr('href','/detail?'+angular.element('.dataSave').data('detailParam'));
    $('.detail_language_cn').attr('href','/detail_cn?'+angular.element('.dataSave').data('detailParam'));

    $scope.allValue.nowId = $scope.allValue.nowIdParam.split('&')[0];
    //==========================================数据获取数据===============================
    $scope.allValue.allData = '';
    //========================================= zw 默认barfoot不存在 ====================
    $scope.allValue.judgeBarfoot = false;
    $scope.allValue.barfootSrc = '';
    //==================================获取房子的基本信息==========================
    $scope.allValue.basicData = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHouseBaseInfo/'+$scope.allValue.nowId + '/cn',
        callBack:function(data){
            //===================  zw 修改如果状态为不可售，直接跳转到house页面 ================================
            if(data.data[0].status != 'sale'){
                window.location = '/house?' + data.data[0].houseId + '&' + data.data[0].addressLocality + '&' + data.data[0].addressRegion;
                angular.element('.isDelete').show();
            } else {
                //=================== zw 将其他的网页直接嵌入 ===================================
                $scope.allValue.judgeBarfoot = true;
                $scope.allValue.barfootSrc = $sce.trustAsResourceUrl(data.data[0].houseLink);
                $timeout(function(){
                    angular.element('.dsi_slideDown').animate({
                        height: 'toggle',
                        opacity: 'toggle'
                    },3000);
                    $timeout(function(){
                        angular.element('.detail_mask').hide();
                    },3000,false);
                },500,false);

                $scope.allValue.allData = data.data[0];
                $scope.allValue.allData.agentList = data.data[0].agentList ? data.data[0].agentList : [{
                    agent_id:"default",
                    agent_icon:"http://res.tigerz.nz/imgs/robot.png",
                    agent_mobile:"wjc@tigerz.nz",
                    agent_name:"TigerZ",
                    agent_url:""
                }];

                //console.log(data)
                $scope.allValue.allData.shareData = $scope.allValue.allData.landArea ? ($scope.allValue.allData.type == "Cross Lease" ? ('1/'+$scope.allValue.allData.houseHolds + ' share ' + $scope.allValue.allData.landArea + '㎡') : $scope.allValue.allData.landArea + '㎡') : 'N/A';

                //$scope.allValue.allData.shareData =  $scope.allValue.allData.type == "Cross Lease" ?  $scope.allValue.allData.houseHolds + ' 户共享 ' + $scope.allValue.allData.landArea + '㎡' : $scope.allValue.allData.landArea + '㎡';

                $scope.allValue.upDateTime = myFactory.timeFormat(data.data[0].listedDate)

                $scope.allValue.showLogo = $scope.allValue.allData.logoImageUrlPath ? false : true;

                $scope.allValue.allData.titleAddr = $scope.allValue.allData.streetAddress + ', ' + $scope.allValue.allData.addressLocality + ', ' + $scope.allValue.allData.addressCity

                $('.detail_nav .mapJump').attr('href','/search_cn?name='+ data.data[0].addressCity +'&level=2&page=0&sort=default&isAllHouse=false&fn='+data.data[0].addressCity+'&ct='+$scope.allValue.currentSelectCity);

                $('.detail_logo1').attr('href','/search_cn?name='+ data.data[0].addressCity +'&level=2&page=0&sort=default&isAllHouse=false&fn='+data.data[0].addressCity+'&ct='+$scope.allValue.currentSelectCity);


                //设置详情页中文SEO信息
                var titleStr = "新西兰房产中介," + $scope.allValue.allData.titleAddr;
                $scope.allValue.detailLogotitle = titleStr;
                $('title').text(titleStr);
                $("meta[name='keywords']").attr('content',titleStr+'新西兰买房,奥克兰房产');
                var descStr =  "免费房产评估,学校，社区等数据——" + $scope.allValue.allData.titleAddr;
                $("meta[name='description']").attr('content',descStr);

                //=========allValue.allData.areaPriceChangeByYear 涨幅如果是涨显示为绿颜色如果是跌显示卫红颜色
                $scope.allValue.areaPriceColor = $scope.allValue.allData.areaPriceChangeByYear.indexOf('+') != -1 ? 'greenColor' : 'redColor';

                $scope.allValue.auctionAddr = true;
                $scope.allValue.auctionTime = true;

                if(data.data[0].priceType == 3){
                    $scope.allValue.auctionAddr = true;
                    $scope.allValue.auctionTime = true;
                }else if(data.data[0].priceType == 2){
                    $scope.allValue.auctionTime = false;
                    $scope.allValue.auctionValue = myFactory.timeFormat(data.data[0].tenderDate,1);
                }else{
                    $scope.allValue.auctionAddr = false;
                    $scope.allValue.auctionTime = false;
                    $scope.allValue.auctionValue = myFactory.timeFormat(data.data[0].actionDate,1);
                }

                //==================房子的历史成交，先将时间戳转化为日期，然后赋值给一个数组，循环显示出来==========================
                for(var cv = 0,len = data.data[0].cvAndSale.length; cv < len; cv++){
                    data.data[0].cvAndSale[cv].cvTime = myFactory.timeFormat(data.data[0].cvAndSale[cv].date)
                }
                //console.log(data.data[0].cvAndSale);
                $scope.allValue.cvEventData = data.data[0].cvAndSale ? data.data[0].cvAndSale : [];

                $scope.allValue.estimateValue = data.data[0]["automatedValuationModelPredictions"] ? data.data[0]["automatedValuationModelPredictions"][0].prediction : false;
                $scope.allValue.allData.landArea = $scope.allValue.allData.landArea <= 0 ? 'N/A' : ($scope.allValue.allData.landArea + '㎡');
                $scope.allValue.allData.floorArea = $scope.allValue.allData.floorArea <= 0 ? 'N/A' : ($scope.allValue.allData.floorArea +'㎡');
                //=============================注意项数据的ture或者false=============================================
                $scope.allValue.allData.tower = !($scope.allValue.allData.pylonInfo) || $scope.allValue.allData.pylonInfo.pylon_min_distance > 1000 ? true : false;
                $scope.allValue.allData.land = (!($scope.allValue.allData.nouthSouthAngel) || Math.abs($scope.allValue.allData.nouthSouthAngel/1) < 2) && (!($scope.allValue.allData.eastWestAngel) || Math.abs($scope.allValue.allData.eastWestAngel/1) < 2) ? true : false;
                $scope.allValue.allData.highway = !($scope.allValue.allData.highwayInfo) || $scope.allValue.allData.highwayInfo.highway_min_distance > 200 ? true : false;
                $scope.allValue.allData.railway = !($scope.allValue.allData.railwayInfo) || $scope.allValue.allData.railwayInfo.railway_min_distance > 300 ? true : false;
                $scope.allValue.allData.petrolStation = !($scope.allValue.allData.petrolStationsInfo) || $scope.allValue.allData.petrolStationsInfo.petrol_stations_distance > 150 ? true : false;

                $scope.allValue.allData.stream = !($scope.allValue.allData.indicativeStreamInfo) || $scope.allValue.allData.indicativeStreamInfo[0].indicative_stream_min_distance > 30 ? true : false;
                $scope.allValue.allData.tree = $scope.allValue.allData.treeInfo ? false : true;
                //=================================社区基本信息============================
                $scope.allValue.allData.latestCapitalValue = $scope.allValue.allData.latestCapitalValue == -1 ? '' : $scope.allValue.allData.latestCapitalValue;
                $scope.allValue.allData.totalAnnualRates = $scope.allValue.allData.totalAnnualRates == -1 ? '' : '$ '+$scope.allValue.allData.totalAnnualRates;
                //$scope.allValue.allImg = data.data[0].houseUrlsImagePath;

                $scope.allValue.allImg = ['222'];
                $scope.allValue.bigImg = ['222'];
                if(data.data[0].houseUrlsImagePath){
                    $scope.allValue.allImg = data.data[0].houseUrlsImagePath;
                }

                if($scope.allValue.allImg && $scope.allValue.allImg.length){
                    //angular.element('.desiel_up_wrap').css({'width':(7.56*$scope.allValue.allImg.length)*parseFloat(document.documentElement.style.fontSize)});
                    angular.element('.dsiel_down_smallimgs').css({'width':(1.3*$scope.allValue.allImg.length)*parseFloat(document.documentElement.style.fontSize)});
                }


                //===================================涨幅信息数据处理==========================================
                $scope.allValue.allData.areaMidPrice = $scope.allValue.allData.areaMidPrice < 0 ? false : $scope.allValue.allData.areaMidPrice;
                $scope.allValue.allData.areaPriceChangeByYear = $scope.allValue.allData.areaPriceChangeByYear == '' ? '-' : $scope.allValue.allData.areaPriceChangeByYear;


                //点击按钮实现图片滚动

                //$scope.allValue.btnStopTurn = function(str){
                //    $scope.allValue.btnTurn = myFactory.normalTurn({
                //        //点击按钮是上面大图的移动
                //        wrap : '.desiel_up_wrap',
                //        direct : 'left',
                //        clickType : str,
                //        clickDefalut : 'add',
                //        maxNum : $scope.allValue.allImg.length,
                //        moveWidth : 7.558,
                //        moveTime : 500,
                //        nextEvent : true,
                //        eventName : 'addClassName',
                //        //下面小图添加样式
                //        nextEventOption : {
                //            itemSmall : '.dsiel_down_small>.dsiel_down_smallimgs>img',
                //            name : 'onimg',
                //            num : 0,
                //            nextEvent : true,
                //            eventName : 'smallWrapMove',
                //            //下面小图位置的移动
                //            nextEventOption : {
                //                moveType : str,
                //                moveClass : '.dsiel_down_smallimgs',
                //                direct : 'left',
                //                currentNum : 0,
                //                maxN : $scope.allValue.allImg.length
                //            }
                //        }
                //    })
                //};

                //重做------点击按钮实现图片滚动
                $scope.allValue.btnStopTurn = function(str){
                    //img_index_num = str == 'add' ? (++img_index_num > $scope.allValue.allImg.length-1 ? $scope.allValue.allImg.length-1 : img_index_num) : (--img_index_num < 0 ? 0 : img_index_num);
                    if(str == 'add'){
                        img_index_num++
                        if(img_index_num > $scope.allValue.allImg.length-1){
                            img_index_num = $scope.allValue.allImg.length-1;
                            return;
                        }
                    }else{
                        img_index_num--
                        if(img_index_num < 0){
                            img_index_num = 0;
                            return;
                        }
                    }
                    $scope.allValue.btnTurn = myFactory.opacityTurn({
                        //点击按钮是上面大图的移动
                        currIndex:img_index_num,
                        max_index: $scope.allValue.allImg.length-1,
                        nextEvent : true,
                        eventName : 'addClassName',
                        //下面小图添加样式
                        nextEventOption : {
                            itemSmall : '.dsiel_down_small>.dsiel_down_smallimgs>img',
                            name : 'onimg',
                            num : 0,
                            nextEvent : true,
                            eventName : 'smallWrapMove',
                            //下面小图位置的移动
                            nextEventOption : {
                                moveType : str,
                                moveClass : '.dsiel_down_smallimgs',
                                direct : 'left',
                                currentNum : 0,
                                maxN : $scope.allValue.allImg.length
                            }
                        }
                    })
                }

                //===========================================历史成交列表================================
                if($scope.allValue.allData.sales){
                    $scope.allValue.salesList = $scope.allValue.allData.sale;
                }else{
                    $scope.allValue.salesList = [];
                }
                //=============================================生成图表部分===============================
                //生成education图表
                $scope.allValue.educationChart = pFactory.createChart({
                    myChart : 'education',
                    itemClass : '.daiici_education_chart'
                });
                //生成income图表
                $scope.allValue.incomeChart = pFactory.createChart({
                    myChart : 'income',
                    itemClass : '.daiici_income_chart'
                });
                //生成rate图表
                $scope.allValue.rateChart = pFactory.createChart({
                    myChart : 'rate',
                    itemClass : '.daiici_rate_chart'
                });
                //生成Religious Affiliation图表
                $scope.allValue.livingChart = pFactory.createChart({
                    myChart : 'livingRate',
                    itemClass : '.daiicil_left_chart'
                });
                //representation图表部分
                $scope.allValue.representationChart = pFactory.createChart({
                    myChart : 'representation',
                    itemClass : '.daiicil_right_chart'
                });

                //设置图标响应式和加载loading
                $scope.reRep = myFactory.detail.chartResize({
                    chart1 : $scope.allValue.representationChart.myChart,
                    chart2 : $scope.allValue.livingChart.myChart,
                    chart3 : $scope.allValue.rateChart.myChart,
                    chart4 : $scope.allValue.educationChart.myChart,
                    chart5 : $scope.allValue.incomeChart.myChart
                });
                $scope.chartLoad = myFactory.detail.chartLoading({
                    chart1 : $scope.allValue.representationChart.myChart,
                    chart2 : $scope.allValue.livingChart.myChart,
                    chart3 : $scope.allValue.rateChart.myChart,
                    chart4 : $scope.allValue.educationChart.myChart,
                    chart5 : $scope.allValue.incomeChart.myChart
                });

                //==========================================图表生成结束===============================

                //==================================加载页面的时候在地图上将当前的房子显示出来======================
                //设置最下面地图的参数
                $scope.allValue.mapOption = {
                    id:'detail_footer_map',
                    map:'detailMap',
                    position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                    zoom: 17,
                    drag : true,
                    wheelEvent : false
                };
                /*
                 创建地图  pFactory.setSearchMap 会返回一个对象
                 所以$scope.allValue.mapObj是一个对象
                 这个对象中$scope.allValue.mapObj.map 是创建出来的地图 以后地图事件都用这个
                 */
                $scope.allValue.mapObj = pFactory.setSearchMap($scope.allValue.mapOption);
                //地图上将房子圈起来
                $scope.allValue.circleHouse = pFactory.circleHouse({
                    coordinate : $scope.allValue.allData.coordinateArray,
                    mapName : $scope.allValue.mapObj.map
                });

                //=================================附近成交房子地图================================
                $scope.allValue.dealMapOption = {
                    id:'detail_footer_dealmap',
                    map:'detailDealMap',
                    position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                    zoom: 17,
                    drag : true,
                    wheelEvent : false
                };
                /*
                 创建地图  pFactory.setSearchMap 会返回一个对象
                 所以$scope.allValue.mapObj是一个对象
                 这个对象中$scope.allValue.mapObj.map 是创建出来的地图 以后地图事件都用这个
                 */
                $scope.allValue.dealMapObj = pFactory.setSearchMap($scope.allValue.dealMapOption);

                //================================ 加载页面是显示当前房子结束 ==================================

                //===================================== 获取学校数据 ==================================
                if($scope.allValue.allData.schoolInfo){
                    //console.log('shcool')
                    var schoolIds = [];
                    var schoolDis = {};
                    for(var i = 0,len = $scope.allValue.allData.schoolInfo.length ; i < len ; i++){
                        schoolIds.push($scope.allValue.allData.schoolInfo[i].school_id);
                        schoolDis[$scope.allValue.allData.schoolInfo[i].school_id] = $scope.allValue.allData.schoolInfo[i].min_distanct;
                    }
                    $scope.allValue.schoolIds =  JSON.stringify({'schools':schoolIds});
                    $scope.allValue.schoolData = pFactory.postData({
                        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getSchoolsBaseInfo',
                        data:$scope.allValue.schoolIds,
                        callBack:function(data) {
                            //console.log('shcool')
                            //console.log('===================学校数据====================');
                            $scope.allValue.schoolData = data.data;
                            $scope.allValue.district = [];
                            $scope.allValue.private = [];
                            for(var j = 0,len = $scope.allValue.schoolData.length ; j < len ; j++){
                                $scope.allValue.schoolData[j].minDis = schoolDis[$scope.allValue.schoolData[j]._id];
                                //给这个对象添加两个属性  一个是打印黄色星星的个数  一个是打印灰色星星的个数
                                $scope.allValue.setStar = myFactory.detail.setStar($scope.allValue.schoolData[j]);
                                //将学校分类   分为学区学校  和私人学校
                                if($scope.allValue.schoolData[j].schoolAttribute == 'School District'){
                                    $scope.allValue.district.push($scope.allValue.schoolData[j]);
                                }
                                if($scope.allValue.schoolData[j].schoolAttribute == 'Private School'){
                                    $scope.allValue.private.push($scope.allValue.schoolData[j]);
                                }
                            };
                            //学校显示最多显示三所学校
                            $scope.allValue.district = $scope.allValue.district.length > 3 ? $scope.allValue.district.slice(0,3) : $scope.allValue.district;
                            $scope.allValue.private = $scope.allValue.private.length > 3 ? $scope.allValue.private.slice(0,3) : $scope.allValue.private;
                        }
                    });
                }
                //====================================== 获取社区数据 ==================================
                if($scope.allValue.allData.meshblockNumber){
                    $scope.allValue.cummunityData = pFactory.postData({
                        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getCommunityInfoBaseInfo/',
                        data:JSON.stringify({"meshNo":$scope.allValue.allData.meshblockNumber,"tiaCode":$scope.allValue.allData.tlaCode,"areaunitCode":$scope.allValue.allData.areaunitCode,'lang':'cn'}),
                        callBack:function(data) {
                            //console.log(data.data[0]);
                            //console.log('===================社区数据====================');
                            $scope.allValue.communityData = data.data[0];

                            $scope.allValue.safeType = myFactory.detail.jugeSafe($scope.allValue.communityData.crimeRate)

                            //============================================部署图表的数据===============================
                            // 指定income图表的配置项和数据
                            $scope.allValue.incomeOption = {
                                tooltip: {},
                                grid: {
                                    left: '0',
                                    right: '4%',
                                    bottom: '16%',
                                    containLabel: true
                                },
                                legend: {
                                    data:['income']
                                },
                                xAxis: {
                                    splitLine:{show: false},
                                    data: ["Auckland",$scope.allValue.allData.suburb,$scope.allValue.allData.road],
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 25,
                                        margin: 2,
                                        textStyle: {
                                            color: "#222"
                                        }
                                    }
                                },
                                splitLine:{show: false},
                                yAxis :{
                                    splitLine:{show: false},
                                    axisLabel: {
                                        show: false
                                    }
                                },
                                series: [{
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: '#fee100',
                                            label: {
                                                show: true,
                                                position: 'top',
                                                formatter: '${c}',
                                                textStyle : {
                                                    color:'#000',
                                                    fontSize:14
                                                }
                                            }
                                        }
                                    },
                                    barWidth:50,
                                    data: [$scope.allValue.communityData.familyIncomeForRegion.toFixed(0),$scope.allValue.communityData.familyIncomeForCity.toFixed(0),$scope.allValue.communityData.familyIncome.toFixed(0)]
                                }]
                            };
                            $scope.allValue.incomeChart.myChart.setOption($scope.allValue.incomeOption);
                            $scope.allValue.incomeChart.myChart.hideLoading();

                            //设置education图表的参数
                            $scope.allValue.educationOption = {
                                tooltip: {},
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '16%',
                                    containLabel: true
                                },
                                legend: {
                                    data:['education']
                                },
                                xAxis: {
                                    splitLine:{show: false},
                                    type : 'category',
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 25,
                                        margin: 2,
                                        textStyle: {
                                            color: "#222"
                                        }
                                    },
                                    data: [data.data[0].degree[0].name,data.data[0].degree[1].name,data.data[0].degree[2].name,data.data[0].degree[3].name]
                                },
                                splitLine:{show: false},
                                yAxis :{
                                    splitLine:{show: false},
                                    axisLabel: {
                                        show: false
                                    }
                                },
                                series: [{
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: '#fee100',
                                            label: {
                                                show: true,
                                                position: 'top',
                                                formatter: '{c}%',
                                                textStyle : {
                                                    color:'#000',
                                                    fontSize:14
                                                }
                                            }
                                        }
                                    },
                                    barWidth:50,
                                    data: [
                                        ($scope.allValue.communityData.degree[0].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                        ($scope.allValue.communityData.degree[1].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                        ($scope.allValue.communityData.degree[2].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                        ($scope.allValue.communityData.degree[3].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2)
                                    ]
                                }]
                            };
                            $scope.allValue.educationChart.myChart.setOption($scope.allValue.educationOption);
                            $scope.allValue.educationChart.myChart.hideLoading();

                            //设置rate参数
                            var publicNum = $scope.allValue.communityData.households[0].number == -1 ? 1 : $scope.allValue.communityData.households[0].number;
                            var holdNum = $scope.allValue.communityData.households[1].number == -1 ? 3 : $scope.allValue.communityData.households[1].number;
                            $scope.allValue.rateOption = {
                                tooltip: {},
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '16%',
                                    containLabel: true
                                },
                                legend: {
                                    data:['education','ccc']
                                },
                                xAxis: {
                                    splitLine:{show: false},
                                    data: [data.data[0].households[0].name,data.data[0].households[1].name],
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 25,
                                        margin: 2,
                                        textStyle: {
                                            color: "#222",
                                        }
                                    }
                                },
                                splitLine:{show: false},
                                yAxis :{
                                    splitLine:{show: false},
                                    axisLabel: {
                                        show: false
                                    }
                                },
                                series: [{
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: '#fee100',
                                            label: {
                                                show: true,
                                                position: 'top',
                                                formatter: '{c}%',
                                                textStyle : {
                                                    color:'#000',
                                                    fontSize:14
                                                }
                                            }
                                        }
                                    },
                                    barWidth:50,
                                    data: [
                                        {
                                            name : 'b',
                                            value : holdNum.toFixed(2)
                                        },
                                        {
                                            name : 'a',
                                            value : publicNum.toFixed(2)
                                        }
                                    ]
                                }]
                            };
                            $scope.allValue.rateChart.myChart.setOption($scope.allValue.rateOption);
                            $scope.allValue.rateChart.myChart.hideLoading();

                            var regionName = [];
                            var regionNum = [];
                            for(var re = 0,len = data.data[0].religions.length; re < len; re++){
                                if(data.data[0].religions[re].number != 0){
                                    regionName.push(data.data[0].religions[re].name);
                                    var a = {};
                                    a.value = (100*$scope.allValue.communityData.religions[re].number/$scope.allValue.communityData.allReligions).toFixed(2);
                                    a.name = data.data[0].religions[re].name;
                                    regionNum.push(a);
                                }
                            }

                            //设置Religious Affiliation参数
                            $scope.allValue.livingOption = {
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{b}:\n{c}%"
                                },
                                color:['#bcf360','#37c73a','#ffd655','#dce0c0','#ffd900','#6059f0','#fd6840','#fb40fd','#ff0000'],
                                legend: {
                                    orient: 'vertical',
                                    x: 4.5*parseFloat(document.documentElement.style.fontSize)+'px',
                                    y: 'middle',
                                    data:regionName
                                },
                                series: [
                                    {
                                        type:'pie',
                                        radius: ['45%', '65%'],
                                        avoidLabelOverlap: true,
                                        data:regionNum
                                    }
                                ]
                            };
                            $scope.allValue.livingChart.myChart.setOption($scope.allValue.livingOption);
                            $scope.allValue.livingChart.myChart.hideLoading();

                            //设置人口种族参数 并生成饼状图


                            var kpName = [];
                            var kpNum = [];
                            for(var kp = 0,len = data.data[0].ethnic.length; kp < len; kp++){
                                if(data.data[0].ethnic[kp].number != 0){
                                    kpName.push(data.data[0].ethnic[kp].name);
                                    var a = {};
                                    a.value = (100*$scope.allValue.communityData.ethnic[kp].number/$scope.allValue.communityData.allEthnicCount).toFixed(2);
                                    a.name = data.data[0].ethnic[kp].name;
                                    kpNum.push(a);
                                }
                            }



                            $scope.allValue.representationOption = {
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{b}:\n{c}%"
                                },
                                color:['#bcf360','#ffd900','#37c73a','#ffd655','#dce0c0','#6059f0'],
                                legend: {
                                    orient: 'vertical',
                                    x: 4.5*parseFloat(document.documentElement.style.fontSize)+'px',
                                    y: 'middle',
                                    data:kpName
                                },
                                series: [
                                    {
                                        type:'pie',
                                        radius: ['45%', '65%'],
                                        avoidLabelOverlap: true,
                                        data:kpNum
                                    }
                                ]
                            }
                            $scope.allValue.representationChart.myChart.setOption($scope.allValue.representationOption);
                            $scope.allValue.representationChart.myChart.hideLoading();
                            //===============================================图表数据设置结束============================
                        }
                    })
                };
                //==================================== 获取附近房源信息 =====================================
                $scope.allValue.nearby = pFactory.postData({
                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyHouse',
                    data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                    callBack : function(data){
                        //============================附近房源信息=======================;
                        $scope.allValue.nearbyHouse = data.data;
                        //console.log(data)
                        var info = new google.maps.InfoWindow({maxWidth: 550});

                        for(var i = 0,len = data.data.length; i < len; i++){
                            data.data[i].houseCreateTime = myFactory.timeFormat(data.data[i].listedDate)
                        }
                        //console.log(data.data)
                        $scope.allValue.setNearbyHouseMap = myFactory.detail.setNearbyHouseIcon($scope.allValue.nearbyHouse,$scope.allValue.mapObj.map,$scope.allValue.allData.basePoint,info,$scope.imgDomain);
                        //附近房源li点击事件   在地图上显示信息框
                        $scope.allValue.nearbyHouseClick = function (obj){
                            //console.log(obj)
                            var contentString = '<a href="/detail_cn?'+ obj._id +'&'+ obj.streetAddress +'&'+ obj.addressCity +'" class="mapInfo" target="_blank"><div>' +
                                '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+obj.houseMainImagePath+'"/></div>' +
                                '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                                '<p class="map_info_price">'+obj.housePrice+'</p>' +
                                '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                                '<ul><li><span class="map_info_bed"></span><span>'+obj.bedRoom+'</span><span class="map_info_bath"></span><span>'+obj.bathRoom+'</span></li></ul>' +
                                '</div></div>' +
                                '</a>';

                            info.setContent(contentString);
                            for(var c = 0,len = $scope.allValue.setNearbyHouseMap.length ; c < len ; c++){
                                if($scope.allValue.setNearbyHouseMap[c].markerPosition == obj._id){
                                    info.open($scope.allValue.mapObj.map, $scope.allValue.setNearbyHouseMap[c].name);
                                }
                            }
                        }
                    }
                });
                //==================================== zw 获取附近成交房源信息 =============================
                $scope.allValue.nearbyDealed = pFactory.postData({
                    url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyDealedHouse',
                    data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                    callBack : function(data){
                        // 处理各个数据的格式
                        for(var i = 0,len = data.data.length; i < len; i++){
                            data.data[i].dealHouseTime = myFactory.timeFormat(data.data[i].createTime);
                            data.data[i].price = data.data[i].price/1;
                        }
                        // 全部分页数据
                        $scope.allValue.paginationData = pFactory.paginationData(data.data);
                        // 当前页数
                        $scope.allValue.paginationData.pageNow = 0 / 1;
                        // 页面默认第0页数据
                        $scope.allValue.dealHouse = $scope.allValue.paginationData[$scope.allValue.paginationData.pageNow];
                        // 左翻页事件
                        $scope.allValue.paginationEventLeft = function(pageNow) {
                            if (pageNow > 0) {
                                $scope.allValue.paginationData.pageNow = pageNow - 1;
                                $scope.allValue.dealHouse = $scope.allValue.paginationData[$scope.allValue.paginationData.pageNow];
                            }
                        }
                        // 右翻页事件
                        $scope.allValue.paginationEventRight = function(pageNow) {
                            if (pageNow < $scope.allValue.paginationData.pageAll - 1) {
                                $scope.allValue.paginationData.pageNow = pageNow + 1;
                                $scope.allValue.dealHouse = $scope.allValue.paginationData[$scope.allValue.paginationData.pageNow];
                            }
                        }
                    }
                })

            }
        }
    });

    //地图导航添加样式
    $scope.allValue.mapNavAdd = function(n){
        myFactory.addClassName({
            itemSmall : '.daii_surrounding_nav>li',
            name : 'mapnav',
            num : n,
            nextEvent : false
        });
        myFactory.addClassName({
            itemSmall : '.daii_surrounding_info',
            name : 'daii_showMap',
            num : n,
            nextEvent : false
        });
        if(n == 1 &&  $scope.allValue.jugeFootMap){
            //=================================== 获取附近成交房源信息 ===================================
            $scope.allValue.nearby = pFactory.postData({
                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyDealedHouse',
                data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                callBack : function(data){
                    $scope.allValue.dealHouse = data.data;
                    for(var i = 0,len = $scope.allValue.dealHouse.length; i < len; i++){
                        $scope.allValue.dealHouse[i].dealHouseTime = myFactory.timeFormat($scope.allValue.dealHouse[i].createTime);
                        $scope.allValue.dealHouse[i].price = $scope.allValue.dealHouse[i].price/1;
                    }
                    //$scope.allValue.dealMapObj
                    var info2 = new google.maps.InfoWindow({maxWidth: 550});
                    $scope.allValue.setDealHouseMap = myFactory.detail.setDealHouseIcon($scope.allValue.dealHouse,$scope.allValue.dealMapObj.map,$scope.allValue.allData.basePoint,info2,$scope.imgDomain);
                    //附近房源li点击事件   在地图上显示信息框
                    $scope.allValue.dealHouseClick = function (obj){
                        var contentString = '<a href="javascript:void(0)" class="mapInfo"><div>' +
                            '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+obj.coverImgPath+'"/></div>' +
                            '<div class="map_dis_wrap"><h4 title="'+ obj.dealHouseTime +'">Sold Time:'+obj.dealHouseTime+'</h4>' +
                            '<p class="map_info_price">$'+obj.price+'</p>' +
                            '<p class="map_info_addr">'+obj.hougardenAddress+'</p>' +
                            '<ul><li><span class="map_info_bed"></span><span>'+obj.bedrooms+'</span><span class="map_info_bath"></span><span>'+obj.bathrooms+'</span></li></ul>' +
                            '</div></div>' +
                            '</a>';

                        info2.setContent(contentString);
                        for(var c = 0,len = $scope.allValue.setDealHouseMap.length ; c < len ; c++){
                            if($scope.allValue.setDealHouseMap[c].markerName == obj._id){
                                info2.open($scope.allValue.dealMapObj.map, $scope.allValue.setDealHouseMap[c].name);
                            }
                        }
                    }
                }
            });
            $scope.allValue.jugeFootMap = false;
        }
    };
    $scope.allValue.duringName = '';
    //点击下面的小图实现轮播
    $scope.allValue.stopTurn = function(n){
        $scope.allValue.showTurnMap = false;
        //$('.dsie_left_up').addClass('zIndex');
        //$('#dsie_left_map').removeClass('zIndex');
        var currentN = -Math.round(parseFloat($('.dsiel_down_smallimgs').css('left')) / (1.29*parseFloat(document.documentElement.style.fontSize)));
        var currentType = (n != currentN ) ? 'add' : 'minus';

        img_index_num = n;
        angular.element('.desiel_scale_img').removeClass('showImage');
        angular.element('.desiel_scale_img').eq(n).addClass('showImage');

        //停止轮播后点击那个小图标给那个添加样式
        $scope.allValue.stopAdd = myFactory.addClassName({
            itemSmall : '.dsiel_down_small>.dsiel_down_smallimgs>img',
            name : 'onimg',
            num : n,
            nextEvent : true,
            eventName: 'smallWrapMove',
            nextEventOption : {
                moveType : currentType,
                moveClass : '.dsiel_down_smallimgs',
                direct : 'left',
                currentNum : 0,
                maxN : $scope.allValue.allImg.length
            }
        });
        //点击小图标后上面大图的轮播
        $scope.allValue.sT = myFactory.detail.stopTurn(n);
    };
    //学校导航 点击添加样式
    $scope.allValue.schoolNav = function(n){
        $scope.schoolDaoHang = myFactory.addClassName({
            itemSmall : '.daii_school_info>ul>li',
            name : 'schoolclicked',
            num : n,
            nextEvent : true,
            eventName : 'showDiv',
            nextEventOption : {
                eventNum : n,
                itemName : '.daiis_info_wrap>table'
            }
        })
    };
    /*   轮播地图 显示   */
    $scope.allValue.turnJpg = function(){
        //$('.dsie_left_up').removeClass('zIndex');
        //$('#dsie_left_map').addClass('zIndex');
        $scope.allValue.showTurnMap = true;
        if($scope.allValue.jugeTurnMap){
            //设置轮播的地图
            $scope.allValue.turnMap = {
                id:'dsie_left_map',
                map:'leftMap',
                position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                zoom: 19,
                drag : true,
                wheelEvent : false
            };
            //地图上打点标记当前的房子
            $scope.allValue.turnLeftMap = pFactory.setSearchMap($scope.allValue.turnMap);
            $scope.allValue.turnMapCircleHouse = pFactory.circleHouse({
                coordinate : $scope.allValue.allData.coordinateArray,
                mapName : $scope.allValue.turnLeftMap.map
            });
            $scope.allValue.turnLeftMap.name = new google.maps.Marker({
                position: $scope.allValue.turnLeftMap.position,
                icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                map: $scope.allValue.turnLeftMap.map
            });
            $scope.allValue.jugeTurnMap = false;
        }

    };

    //================================搜索框事件============================
    $scope.allValue.detailPageValue = '';
    $scope.allValue.detailSubFlag = true;
    //====================搜索框主要事件=============================
    $scope.allValue.detailSearchBar = function(){
        if($scope.allValue.detailPageValue.length != 0){
            angular.element('.detailPage_history').hide();
            angular.element('.detailPage_simple').show();
            angular.element('.detailPage_error').hide();
            $scope.allValue.detailSearchData = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.detailPageValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    $scope.allValue.detailPageData = data.data;
                    data.data.length != 0 ? angular.element('.detailPage_error').hide() : angular.element('.detailPage_error').show();

                    $scope.allValue.detailPageBtn = function(){
                        if($scope.allValue.detailPageValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return '/detail_cn?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity
                            }else{
                                return '/search_cn?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.detailPage_history').show();
            angular.element('.detailPage_simple').hide();
            angular.element('.detailPage_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                $scope.allValue.searchHistoryData = [];
                var json = {};
                for(var h = 0,len = tempArr.length; h < len; h++){
                    //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.detailBlurEvent = function(){
        $scope.allValue.detailSubFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.detailOverEvent = function () {
        $scope.allValue.detailSubFlag = false;
        $scope.allValue.detailBlurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.detailLeaveEvent = function (){
        $scope.allValue.detailBlurEvent = function(){
            $scope.allValue.detailSubFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.detailFocusEvent = function(){
        $scope.allValue.detailSubFlag = false;
        $scope.allValue.searchHistoryData = [];
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            var json = {};
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            //return '/detail_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName;
            if(obj.isSale){
                return 'detail_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }else{
                return 'house_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }
        }else{
            return '/search_cn?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(可售)' : 'House(非可售)';
                break;
        }
    };
    //添加收藏夹
    $scope.allValue.addMark = pFactory.addMark;

}]);
//==================================================== 中文非可售房源控制器 ============================
app.controller('houseCNCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory1','$interval','$timeout','publicFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$timeout,pFactory){
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;

    //挂载house的所有变量
    $scope.allValue = {};

    if(location.href.indexOf('?') == -1){
        $scope.allValue.nowIdParam = '5807187f4860e40bb24f7b32';
        $scope.allValue.houseParam = '5807187f4860e40bb24f7b32';
        $scope.allValue.currentSelectCity = "Auckland";
    }else{
        $scope.allValue.houseParam = location.href.substr(location.href.indexOf('?')+1);
        $scope.allValue.nowIdParam = location.href.substr(location.href.indexOf('?')+1).split('&')[0];
        $scope.allValue.currentSelectCity = decodeURIComponent(location.href.substr(location.href.indexOf('?')+1).split('&')[location.href.substr(location.href.indexOf('?')+1).split('&').length-1]);
    }

    angular.element('.dataSave').data('houseParam',$scope.allValue.houseParam);

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/house_cn.html?"+ $scope.allValue.houseParam;
    }

    $('.house_language_en').attr('href','/house?'+angular.element('.dataSave').data('houseParam'));
    $('.house_language_cn').attr('href','/house_cn?'+angular.element('.dataSave').data('houseParam'));

    $scope.allValue.jugeFootMap = true;
    //================================搜索框事件============================
    $scope.allValue.housePageValue = '';
    $scope.allValue.houseSubFlag = true;
//====================搜索框主要事件=============================
    $scope.allValue.houseSearchBar = function(){
        if($scope.allValue.housePageValue.length != 0){
            angular.element('.housePage_history').hide();
            angular.element('.housePage_simple').show();
            angular.element('.housePage_error').hide();
            $scope.allValue.houseSearchData = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.housePageValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    $scope.allValue.housePageData = data.data;
                    data.data.length != 0 ? angular.element('.housePage_error').hide() : angular.element('.housePage_error').show();
                    $scope.allValue.housePageBtn = function(){
                        if($scope.allValue.housePageValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return '/detail?'+ data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity
                            }else{
                                return '/search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.housePage_history').show();
            angular.element('.housePage_simple').hide();
            angular.element('.housePage_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                $scope.allValue.searchHistoryData = [];
                var json = {};
                for(var h = 0,len = tempArr.length; h < len; h++){
                    //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.houseBlurEvent = function(){
        $scope.allValue.houseSubFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.houseOverEvent = function () {
        $scope.allValue.houseSubFlag = false;
        $scope.allValue.houseBlurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.houseLeaveEvent = function (){
        $scope.allValue.houseBlurEvent = function(){
            $scope.allValue.houseSubFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.houseFocusEvent = function(){
        $scope.allValue.houseSubFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
        }
    };
    //判断跳转的页面是search页还是house页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            //return '/detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName
            if(obj.isSale){
                return 'detail_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }else{
                return 'house_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }
        }else{
            return '/search_cn?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(for sale)' : 'House(not for sale)';
                break;
        }
    };
    //导航栏的状态
    $scope.allValue.hn = myFactory.house.sc();
    //设置锚点
    $scope.allValue.jump = myFactory.house.anchor;
    //学校导航 点击添加样式
    $scope.allValue.schoolNav = function(n){
        $scope.schoolDaoHang = myFactory.addClassName({
            itemSmall : '.daii_school_info>ul>li',
            name : 'schoolclicked',
            num : n,
            nextEvent : true,
            eventName : 'showDiv',
            nextEventOption : {
                eventNum : n,
                itemName : '.daiis_info_wrap>table'
            }
        })
    };

    //========================请求房子数据==================================
    $scope.allValue.baseData = pFactory.getData({
        url: 'http://' + $rootScope.tigerDomain + '/tigerspring/rest/getGeneralHouseBaseInfo/'+ $scope.allValue.nowIdParam +'/cn',
        callBack: function (data) {
            //console.log(data)
            $scope.allValue.allData = data.data.houseGeneral;

            $scope.allValue.allData.shareData = $scope.allValue.allData.landArea ? ($scope.allValue.allData.type == "Cross Lease" ? ('1/'+$scope.allValue.allData.houseHolds + ' share ' + $scope.allValue.allData.landArea + '㎡') : $scope.allValue.allData.landArea + '㎡') : 'N/A';

            //$scope.allValue.allData.shareData =  $scope.allValue.allData.type == "Cross Lease" ?  $scope.allValue.allData.houseHolds + ' 户共享 ' + $scope.allValue.allData.landArea + '㎡' : $scope.allValue.allData.landArea + '㎡';

            $scope.allValue.midP = data.data.areaMidPrice
            $scope.allValue.grownP = data.data.areaPriceChangeByYear;

            if($scope.allValue.allData.automatedValuationModelPredictions){
                $scope.allValue.upTime = myFactory.timeFormat($scope.allValue.allData.automatedValuationModelPredictions[0].prediction_date);
            }else{
                $scope.allValue.upTime = "N/A"
            }


            //console.log($scope.allValue.allData)
            $scope.allValue.allData.titleAddr = $scope.allValue.allData.address + ', ' + $scope.allValue.allData.oldSuburb+ ', ' + $scope.allValue.allData.city

            //设置详情页中文SEO信息
            var titleStr = "新西兰房产中介," + $scope.allValue.allData.titleAddr;
            $scope.allValue.houseLogotitle = titleStr;
            $('title').text(titleStr+'|Tigerz');
            $("meta[name='keywords']").attr('content',titleStr+'奥克兰房产,新西兰买房');
            var descStr =  "免费房产评估,学校，社区等数据——" + $scope.allValue.allData.titleAddr;
            $("meta[name='description']").attr('content',descStr);

            //$scope.allValue.houseCtime = myFactory.detail.getLocalTime(data.data.cvAndSale[0].date,9);
            //$scope.allValue.houseCvPrice = data.data.cvAndSale[0].price;

            $scope.allValue.turnMap = {
                id:'house_top_map',
                map:'leftMap',
                position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                zoom: 19,
                drag : true,
                wheelEvent : false,
                type : google.maps.MapTypeId.SATELLITE
            };
            //地图上打点标记当前的房子
            $scope.allValue.turnLeftMap = pFactory.setSearchMap($scope.allValue.turnMap);
            $scope.allValue.turnMapCircleHouse = pFactory.circleHouse({
                coordinate : $scope.allValue.allData.coordinateArray,
                mapName : $scope.allValue.turnLeftMap.map
            });
            $scope.allValue.turnLeftMap.name = new google.maps.Marker({
                position: $scope.allValue.turnLeftMap.position,
                icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                map: $scope.allValue.turnLeftMap.map
            });

            //$scope.allValue.estimateValue = data.data.houseGeneral["automatedValuationModelPredictions"] ? data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction : 'N/A';

            if(data.data.houseGeneral["automatedValuationModelPredictions"] && data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction){
                $scope.allValue.estimateValue = '$' + pFactory.numFormat(data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction);
                $scope.allValue.highEstimate = '$' + pFactory.numFormat(data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction + data.data.houseGeneral["automatedValuationModelPredictions"][0].variance);
                $scope.allValue.lowEstimate = '$' + pFactory.numFormat(data.data.houseGeneral["automatedValuationModelPredictions"][0].prediction - data.data.houseGeneral["automatedValuationModelPredictions"][0].variance);
            }else{
                $scope.allValue.estimateValue = 'N/A';
                $scope.allValue.highEstimate = 'N/A';
                $scope.allValue.lowEstimate = 'N/A';
            }

            $scope.allValue.allData.landArea = $scope.allValue.allData.landArea <= 0 ? 'N/A' : ($scope.allValue.allData.landArea + '㎡');
            $scope.allValue.allData.floorArea = $scope.allValue.allData.floorArea <= 0 ? 'N/A' : ($scope.allValue.allData.floorArea +'㎡');

            //=============================注意项数据的ture或者false=============================================
            $scope.allValue.allData.tower = !($scope.allValue.allData.pylonInfo) || $scope.allValue.allData.pylonInfo.pylon_min_distance > 1000 ? true : false;
            $scope.allValue.allData.land = (!($scope.allValue.allData.nouthSouthAngel) || Math.abs($scope.allValue.allData.nouthSouthAngel/1) < 2) && (!($scope.allValue.allData.eastWestAngel) || Math.abs($scope.allValue.allData.eastWestAngel/1) < 2) ? true : false;
            $scope.allValue.allData.highway = !($scope.allValue.allData.highwayInfo) || $scope.allValue.allData.highwayInfo.highway_min_distance > 200 ? true : false;
            $scope.allValue.allData.railway = !($scope.allValue.allData.railwayInfo) || $scope.allValue.allData.railwayInfo.railway_min_distance > 300 ? true : false;
            $scope.allValue.allData.petrolStation = !($scope.allValue.allData.petrolStationsInfo) || $scope.allValue.allData.petrolStationsInfo.petrol_stations_distance > 150 ? true : false;
            $scope.allValue.allData.stream = !($scope.allValue.allData.indicativeStreamInfo) || $scope.allValue.allData.indicativeStreamInfo[0].indicative_stream_min_distance > 30 ? true : false;
            $scope.allValue.allData.tree = $scope.allValue.allData.treeInfo ? false : true;


            //===================================== 获取学校数据 ==================================
            if($scope.allValue.allData.schoolInfo){
                var schoolIds = [];
                var schoolDis = {};
                for(var i = 0,len = $scope.allValue.allData.schoolInfo.length ; i < len ; i++){
                    schoolIds.push($scope.allValue.allData.schoolInfo[i].school_id);
                    schoolDis[$scope.allValue.allData.schoolInfo[i].school_id] = $scope.allValue.allData.schoolInfo[i].min_distanct;
                }
                $scope.allValue.schoolIds =  JSON.stringify({'schools':schoolIds});
                $scope.allValue.schoolData = pFactory.postData({
                    url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getSchoolsBaseInfo',
                    data:$scope.allValue.schoolIds,
                    callBack:function(data) {
                        //console.log('===================学校数据====================');
                        $scope.allValue.schoolData = data.data;
                        $scope.allValue.district = [];
                        $scope.allValue.private = [];
                        for(var j = 0,len = $scope.allValue.schoolData.length ; j < len ; j++){
                            $scope.allValue.schoolData[j].minDis = schoolDis[$scope.allValue.schoolData[j]._id];
                            //给这个对象添加两个属性  一个是打印黄色星星的个数  一个是打印灰色星星的个数
                            $scope.allValue.setStar = myFactory.detail.setStar($scope.allValue.schoolData[j]);
                            //将学校分类   分为学区学校  和私人学校
                            if($scope.allValue.schoolData[j].schoolAttribute == 'School District'){
                                $scope.allValue.district.push($scope.allValue.schoolData[j]);
                            }
                            if($scope.allValue.schoolData[j].schoolAttribute == 'Private School'){
                                $scope.allValue.private.push($scope.allValue.schoolData[j]);
                            }
                        };
                        //学校显示最多显示三所学校
                        $scope.allValue.district = $scope.allValue.district.length > 3 ? $scope.allValue.district.slice(0,3) : $scope.allValue.district;
                        $scope.allValue.private = $scope.allValue.private.length > 3 ? $scope.allValue.private.slice(0,3) : $scope.allValue.private;
                    }
                });
            };

            //===================================== 历史成交数据 ==============================
            //==================房子的历史成交，先将时间戳转化为日期，然后赋值给一个数组，循环显示出来==========================
            $scope.allValue.cvEventData = data.data.cvAndSale;
            for(var cv = 0,len = data.data.cvAndSale.length; cv < len; cv++){
                data.data.cvAndSale[cv].cvTime = myFactory.timeFormat(data.data.cvAndSale[cv].date)
            }
            //====================================== 获取社区信息 =================================

            //=============================================生成图表部分===============================
            //生成education图表
            $scope.allValue.educationChart = pFactory.createChart({
                myChart : 'education',
                itemClass : '.daiici_education_chart'
            });
            //生成income图表
            $scope.allValue.incomeChart = pFactory.createChart({
                myChart : 'income',
                itemClass : '.daiici_income_chart'
            });
            //生成rate图表
            $scope.allValue.rateChart = pFactory.createChart({
                myChart : 'rate',
                itemClass : '.daiici_rate_chart'
            });
            //生成Religious Affiliation图表
            $scope.allValue.livingChart = pFactory.createChart({
                myChart : 'livingRate',
                itemClass : '.daiicil_left_chart'
            });
            //representation图表部分
            $scope.allValue.representationChart = pFactory.createChart({
                myChart : 'representation',
                itemClass : '.daiicil_right_chart'
            });

            //设置图标响应式和加载loading
            $scope.reRep = myFactory.detail.chartResize({
                chart1 : $scope.allValue.representationChart.myChart,
                chart2 : $scope.allValue.livingChart.myChart,
                chart3 : $scope.allValue.rateChart.myChart,
                chart4 : $scope.allValue.educationChart.myChart,
                chart5 : $scope.allValue.incomeChart.myChart
            });
            $scope.chartLoad = myFactory.detail.chartLoading({
                chart1 : $scope.allValue.representationChart.myChart,
                chart2 : $scope.allValue.livingChart.myChart,
                chart3 : $scope.allValue.rateChart.myChart,
                chart4 : $scope.allValue.educationChart.myChart,
                chart5 : $scope.allValue.incomeChart.myChart
            });
            //=========== 获取社区数据 =========
            if($scope.allValue.allData.meshblockNumber){
                $scope.allValue.cummunityData = pFactory.postData({
                    url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getCommunityInfoBaseInfo/',
                    data:JSON.stringify({"meshNo":$scope.allValue.allData.meshblockNumber,"tiaCode":$scope.allValue.allData.tlaCode,"areaunitCode":$scope.allValue.allData.areaunitCode,'lang':'en'}),
                    callBack:function(data) {
                        //console.log(data.data[0]);
                        //console.log('===================社区数据====================');
                        $scope.allValue.communityData = data.data[0];

                        $scope.allValue.safeType = myFactory.detail.jugeSafe($scope.allValue.communityData.crimeRate)

                        //============================================部署图表的数据===============================
                        // 指定income图表的配置项和数据
                        $scope.allValue.incomeOption = {
                            tooltip: {},
                            grid: {
                                left: '0',
                                right: '4%',
                                bottom: '16%',
                                containLabel: true
                            },
                            legend: {
                                data:['income']
                            },
                            xAxis: {
                                splitLine:{show: false},
                                data: ["Auckland",$scope.allValue.allData.suburb,$scope.allValue.allData.road],
                                axisLabel: {
                                    interval: 0,
                                    rotate: 25,
                                    margin: 2,
                                    textStyle: {
                                        color: "#222"
                                    }
                                }
                            },
                            splitLine:{show: false},
                            yAxis :{
                                splitLine:{show: false},
                                axisLabel: {
                                    show: false
                                }
                            },
                            series: [{
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#fee100',
                                        label: {
                                            show: true,
                                            position: 'top',
                                            formatter: '${c}',
                                            textStyle : {
                                                color:'#000',
                                                fontSize:14
                                            }
                                        }
                                    }
                                },
                                barWidth:50,
                                data: [$scope.allValue.communityData.familyIncomeForRegion.toFixed(0),$scope.allValue.communityData.familyIncomeForCity.toFixed(0),$scope.allValue.communityData.familyIncome.toFixed(0)]
                            }]
                        };
                        $scope.allValue.incomeChart.myChart.setOption($scope.allValue.incomeOption);
                        $scope.allValue.incomeChart.myChart.hideLoading();

                        //设置education图表的参数
                        $scope.allValue.educationOption = {
                            tooltip: {},
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '16%',
                                containLabel: true
                            },
                            legend: {
                                data:['education']
                            },
                            xAxis: {
                                splitLine:{show: false},
                                type : 'category',
                                axisLabel: {
                                    interval: 0,
                                    rotate: 25,
                                    margin: 2,
                                    textStyle: {
                                        color: "#222"
                                    }
                                },
                                data: [data.data[0].degree[0].name,data.data[0].degree[1].name,data.data[0].degree[2].name,data.data[0].degree[3].name]
                            },
                            splitLine:{show: false},
                            yAxis :{
                                splitLine:{show: false},
                                axisLabel: {
                                    show: false
                                }
                            },
                            series: [{
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#fee100',
                                        label: {
                                            show: true,
                                            position: 'top',
                                            formatter: '{c}%',
                                            textStyle : {
                                                color:'#000',
                                                fontSize:14
                                            }
                                        }
                                    }
                                },
                                barWidth:50,
                                data: [
                                    ($scope.allValue.communityData.degree[0].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                    ($scope.allValue.communityData.degree[1].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                    ($scope.allValue.communityData.degree[2].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2),
                                    ($scope.allValue.communityData.degree[3].number*100/$scope.allValue.communityData.allDegree || 0.1).toFixed(2)
                                ]
                            }]
                        };
                        $scope.allValue.educationChart.myChart.setOption($scope.allValue.educationOption);
                        $scope.allValue.educationChart.myChart.hideLoading();

                        //设置rate参数
                        var publicNum = $scope.allValue.communityData.households[0].number == -1 ? 1 : $scope.allValue.communityData.households[0].number;
                        var holdNum = $scope.allValue.communityData.households[1].number == -1 ? 3 : $scope.allValue.communityData.households[1].number;

                        $scope.allValue.rateOption = {
                            tooltip: {},
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '16%',
                                containLabel: true
                            },
                            legend: {
                                data:['education','ccc']
                            },
                            xAxis: {
                                splitLine:{show: false},
                                data: [data.data[0].households[0].name,data.data[0].households[1].name],
                                axisLabel: {
                                    interval: 0,
                                    rotate: 25,
                                    margin: 2,
                                    textStyle: {
                                        color: "#222",
                                    }
                                }
                            },
                            splitLine:{show: false},
                            yAxis :{
                                splitLine:{show: false},
                                axisLabel: {
                                    show: false
                                }
                            },
                            series: [{
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: '#fee100',
                                        label: {
                                            show: true,
                                            position: 'top',
                                            formatter: '{c}%',
                                            textStyle : {
                                                color:'#000',
                                                fontSize:14
                                            }
                                        }
                                    }
                                },
                                barWidth:50,
                                data: [
                                    {
                                        name : 'b',
                                        value : holdNum.toFixed(2)
                                    },
                                    {
                                        name : 'a',
                                        value : publicNum.toFixed(2)
                                    }
                                ]
                            }]
                        };
                        $scope.allValue.rateChart.myChart.setOption($scope.allValue.rateOption);
                        $scope.allValue.rateChart.myChart.hideLoading();

                        var regionName = [];
                        var regionNum = [];
                        for(var re = 0,len = data.data[0].religions.length; re < len; re++){
                            if(data.data[0].religions[re].number != 0){
                                regionName.push(data.data[0].religions[re].name);
                                var a = {};
                                a.value = (100*$scope.allValue.communityData.religions[re].number/$scope.allValue.communityData.allReligions).toFixed(2);
                                a.name = data.data[0].religions[re].name;
                                regionNum.push(a);
                            }
                        }

                        //设置Religious Affiliation参数
                        $scope.allValue.livingOption = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{b}:\n{c}%"
                            },
                            color:['#bcf360','#37c73a','#ffd655','#dce0c0','#ffd900','#6059f0','#fd6840','#fb40fd','#ff0000'],
                            legend: {
                                orient: 'vertical',
                                x: 4.5*parseFloat(document.documentElement.style.fontSize)+'px',
                                y: 'middle',
                                data:regionName
                            },
                            series: [
                                {
                                    type:'pie',
                                    radius: ['45%', '65%'],
                                    avoidLabelOverlap: true,
                                    data:regionNum
                                }
                            ]
                        };
                        $scope.allValue.livingChart.myChart.setOption($scope.allValue.livingOption);
                        $scope.allValue.livingChart.myChart.hideLoading();


                        //设置人口种族参数 并生成饼状图
                        var kpName = [];
                        var kpNum = [];
                        for(var kp = 0,len = data.data[0].ethnic.length; kp < len; kp++){
                            if(data.data[0].ethnic[kp].number != 0){
                                kpName.push(data.data[0].ethnic[kp].name);
                                var a = {};
                                a.value = (100*$scope.allValue.communityData.ethnic[kp].number/$scope.allValue.communityData.allEthnicCount).toFixed(2);
                                a.name = data.data[0].ethnic[kp].name;
                                kpNum.push(a);
                            }
                        }

                        $scope.allValue.representationOption = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{b}:\n{c}%"
                            },
                            color:['#bcf360','#ffd900','#37c73a','#ffd655','#dce0c0','#6059f0'],
                            legend: {
                                orient: 'vertical',
                                x: 4.5*parseFloat(document.documentElement.style.fontSize)+'px',
                                y: 'middle',
                                data:kpName
                            },
                            series: [
                                {
                                    type:'pie',
                                    radius: ['45%', '65%'],
                                    avoidLabelOverlap: true,
                                    data:kpNum
                                }
                            ]
                        }
                        $scope.allValue.representationChart.myChart.setOption($scope.allValue.representationOption);
                        $scope.allValue.representationChart.myChart.hideLoading();
                        //===============================================图表数据设置结束============================
                    }
                })
            };


            //==================================加载页面的时候在地图上将当前的房子显示出来======================
            //设置最下面地图的参数
            $scope.allValue.mapOption = {
                id:'detail_footer_map',
                map:'detailMap',
                position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                zoom: 17,
                drag : true,
                wheelEvent : false
            };
            /*
             创建地图  pFactory.setSearchMap 会返回一个对象
             所以$scope.allValue.mapObj是一个对象
             这个对象中$scope.allValue.mapObj.map 是创建出来的地图 以后地图事件都用这个
             */
            $scope.allValue.mapObj = pFactory.setSearchMap($scope.allValue.mapOption);
            //地图上将房子圈起来
            $scope.allValue.circleHouse = pFactory.circleHouse({
                coordinate : $scope.allValue.allData.coordinateArray,
                mapName : $scope.allValue.mapObj.map
            });
            $scope.allValue.mapOption.name = new google.maps.Marker({
                position: $scope.allValue.mapOption.position,
                icon : 'http://res.tigerz.nz/imgs/maphoused.png',
                map: $scope.allValue.mapOption.map
            });
            //=================================附近成交房子地图================================
            $scope.allValue.dealMapOption = {
                id:'detail_footer_dealmap',
                map:'detailDealMap',
                position : {lat:$scope.allValue.allData.basePoint[1],lng:$scope.allValue.allData.basePoint[0]},
                zoom: 17,
                drag : true,
                wheelEvent : false
            };
            $scope.allValue.dealMapObj = pFactory.setSearchMap($scope.allValue.dealMapOption);

            //==================================== 获取附近房源信息 =====================================
            $scope.allValue.nearby = pFactory.postData({
                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyHouse',
                data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                callBack : function(data){
                    //============================附近房源信息=======================;
                    $scope.allValue.nearbyHouse = data.data;
                    //console.log(data)
                    var info = new google.maps.InfoWindow({maxWidth: 550});

                    for(var i = 0,len = data.data.length; i < len; i++){
                        data.data[i].houseCreateTime = myFactory.timeFormat(data.data[i].listedDate)
                    }
                    //console.log(data.data)
                    $scope.allValue.setNearbyHouseMap = myFactory.detail.setNearbyHouseIcon($scope.allValue.nearbyHouse,$scope.allValue.mapObj.map,$scope.allValue.allData.basePoint,info,$scope.imgDomain);
                    //附近房源li点击事件   在地图上显示信息框
                    $scope.allValue.nearbyHouseClick = function (obj){
                        //console.log(obj)
                        var contentString = '<a href="/detail?'+ obj._id +'&'+ obj.streetAddress +'&'+ obj.addressCity +'" class="mapInfo" target="_blank"><div>' +
                            '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+obj.houseMainImagePath+'"/></div>' +
                            '<div class="map_dis_wrap"><h4 title="'+ obj.title +'">'+obj.title+'</h4>' +
                            '<p class="map_info_price">'+obj.housePrice+'</p>' +
                            '<p class="map_info_addr">'+obj.streetAddress+'</p>' +
                            '<ul><li><span class="map_info_bed"></span><span>'+obj.bedRoom+'</span><span class="map_info_bath"></span><span>'+obj.bathRoom+'</span></li></ul>' +
                            '</div></div>' +
                            '</a>';
                        info.setContent(contentString);
                        for(var c = 0,len = $scope.allValue.setNearbyHouseMap.length ; c < len ; c++){
                            if($scope.allValue.setNearbyHouseMap[c].markerPosition == obj._id){
                                info.open($scope.allValue.mapObj.map, $scope.allValue.setNearbyHouseMap[c].name);
                            }
                        }
                    }
                }
            });
        }
    });

    //地图导航添加样式
    $scope.allValue.mapNavAdd = function(n){
        myFactory.addClassName({
            itemSmall : '.daii_surrounding_nav>li',
            name : 'mapnav',
            num : n,
            nextEvent : false
        });
        myFactory.addClassName({
            itemSmall : '.daii_surrounding_info',
            name : 'daii_showMap',
            num : n,
            nextEvent : false
        });
        if(n == 1 && $scope.allValue.jugeFootMap){


            //=================================== 获取附近成交房源信息 ===================================
            $scope.allValue.nearby = pFactory.postData({
                url : 'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getNearbyDealedHouse',
                data : JSON.stringify({'basePoint':$scope.allValue.allData.basePoint}),
                callBack : function(data){
                    console.log(data)
                    $scope.allValue.dealHouse = data.data;
                    for(var i = 0,len = $scope.allValue.dealHouse.length; i < len; i++){
                        $scope.allValue.dealHouse[i].dealHouseTime = myFactory.timeFormat($scope.allValue.dealHouse[i].createTime);
                        $scope.allValue.dealHouse[i].price = $scope.allValue.dealHouse[i].price/1;
                    }
                    //$scope.allValue.dealMapObj
                    var info2 = new google.maps.InfoWindow({maxWidth: 550});
                    $scope.allValue.setDealHouseMap = myFactory.detail.setDealHouseIcon($scope.allValue.dealHouse,$scope.allValue.dealMapObj.map,$scope.allValue.allData.basePoint,info2,$scope.imgDomain);
                    //附近房源li点击事件   在地图上显示信息框
                    $scope.allValue.dealHouseClick = function (obj){
                        var contentString = '<a href="javascript:void(0)" class="mapInfo"><div>' +
                            '<div class="map_img_wrap"><img src="'+$scope.imgDomain+''+obj.coverImgPath+'"/></div>' +
                            '<div class="map_dis_wrap"><h4 title="'+ obj.dealHouseTime +'">Sold Time:'+obj.dealHouseTime+'</h4>' +
                            '<p class="map_info_price">$'+obj.price+'</p>' +
                            '<p class="map_info_addr">'+obj.hougardenAddress+'</p>' +
                            '<ul><li><span class="map_info_bed"></span><span>'+obj.bedrooms+'</span><span class="map_info_bath"></span><span>'+obj.bathrooms+'</span></li></ul>' +
                            '</div></div>' +
                            '</a>';

                        info2.setContent(contentString);
                        for(var c = 0,len = $scope.allValue.setDealHouseMap.length ; c < len ; c++){
                            if($scope.allValue.setDealHouseMap[c].markerName == obj._id){
                                info2.open($scope.allValue.dealMapObj.map, $scope.allValue.setDealHouseMap[c].name);
                            }
                        }
                    }
                }
            });
            $scope.allValue.jugeFootMap = false;
        }
    };
}]);
//==================================================== 中文估计页 ==================================
app.controller('estimateCNCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory1','$interval','$location','publicFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$location,pFactory){
    $scope.cityJson = citysJson;
    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;
    //挂载home页面所有数据
    $scope.allValue = {};
    $scope.allValue.timer = '';

    $scope.allValue.param = {};
    if(location.href.indexOf('?') == -1){
        $scope.allValue.currentSelectCity = "Auckland";
    }else{
        var paramArr = location.href.substr(location.href.indexOf('?')+1).split('&');
        console.log(paramArr);
        paramArr.forEach(function(item){
            $scope.allValue.param[item.split("=")[0]] = decodeURIComponent(item.split("=")[1]);
        })
        $scope.allValue.currentSelectCity = $scope.allValue.param.city
    }

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/estimate_cn.html?city=Auckland"
    }

    //设置英文首页SEO
    var titleStr = "新西兰房产估价|老虎买房|Tigerz";
    $('title').text(titleStr);
    $("meta[name='keywords']").attr('content',titleStr+'奥克兰房产,新西兰买房');
    var descStr =  "TigerZ基于您所在地区周边房屋近期销售情况对您的房屋进行价值估算";
    $("meta[name='description']").attr('content',descStr);

    //=================================== 获取热搜词 ========================================================
    $scope.allValue.hotWords = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHotWords/en',
        callBack : function(data){
            //console.log(data);
            $scope.allValue.hotWordAll = data.data.slice(0,5);
            $scope.allValue.hotSuburb = data.data.slice(5);
        }
    });
    //========================================加载页面时候请求的数据 获取的是显示房子数量 涨幅的数据============================
    $scope.allValue.loadPage = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHouseStatistics',
        callBack : function(data){
            $scope.allValue.statics = data.data;
            var n = 0;
            if(angular.element('.dataSave').data('timerSave')){
                $interval.cancel(angular.element('.dataSave').data('timerSave'));
            }
            $scope.allValue.timer = $interval(function(){
                angular.element('.hld_static').animate({'top':-n*0.6*parseFloat(document.documentElement.style.fontSize)},300,function(){
                    n++;
                    if(n>=data.data.priceIncreaseList.length/3+1){
                        angular.element('.hld_static').css({'top':0});
                        n = 0;
                    }
                })
            },3000);
            angular.element('.dataSave').data('timerSave',$scope.allValue.timer);
        }
    });

    //搜索框要的显示数据
    $scope.allValue.subFlag = true;
    $scope.allValue.footSubFlag = true;
    $scope.allValue.currentValue = '';
    $scope.allValue.footValue = '';
    //====================================顶部搜索框内容发生改变的时候的请求数据======================
    $scope.allValue.searchBar = function(){
        if($scope.allValue.currentValue.length != 0){
            angular.element('.home_search_history').hide();
            angular.element('.home_search_simple').show();
            angular.element('.home_search_error').hide();
            $scope.allValue.searchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.currentValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    //console.log(data);
                    $scope.allValue.searchData = data.data;
                    data.data.length != 0 ? angular.element('.home_search_error').hide() : angular.element('.home_search_error').show();
                    $scope.allValue.searchBtn = function(){
                        if($scope.allValue.currentValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return 'detail?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity;
                            }else{
                                return 'search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+'&ct='+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.home_search_history').show();
            angular.element('.home_search_simple').hide();
            angular.element('.home_search_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                var json = {};
                $scope.allValue.searchHistoryData = [];
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        //console.log(obj);
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.blurEvent = function(){
        $scope.allValue.subFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.overEvent = function () {
        $scope.allValue.subFlag = false;
        $scope.allValue.blurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.leaveEvent = function (){
        $scope.allValue.blurEvent = function(){
            $scope.allValue.subFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.focusEvent = function(){
        $scope.allValue.subFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
            //console.log($scope.allValue.searchHistoryData);
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            if(obj.isSale){
                return 'detail?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }else{
                return 'house?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }

        }else{
            return 'search?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(for sale)' : 'House(not for sale)';
                break;
        }
    };

}]);
//==================================================== 中文拍卖纪录 ===========================================
app.controller('auctionCNCtrl',['citysJson','tigerzDomain','imgageDomain','$rootScope','$scope','myFactory1','$interval','$timeout','$location','publicFactory',function(citysJson,tDomain,iDomain,$rootScope,$scope,myFactory,$interval,$timeout,$location,pFactory){
    $scope.cityJson = citysJson;

    //数据请求时候的域名定义
    $rootScope.tigerDomain = tDomain;
    //请求来的照片域名和协议设置
    $scope.imgDomain = iDomain;


    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/tpls/auction.html?city=Auckland"
    }

    //挂载home页面所有数据
    $scope.allValue = {};
    $scope.allValue.timer = '';
    $scope.allValue.subFlag = true;

    $scope.allValue.param = {};
    if(location.href.indexOf('?') == -1){
        $scope.allValue.currentSelectCity = "Auckland";
    }else{
        var paramArr = location.href.substr(location.href.indexOf('?')+1).split('&');
        //console.log(paramArr);
        paramArr.forEach(function(item){
            $scope.allValue.param[item.split("=")[0]] = decodeURIComponent(item.split("=")[1]);
        })
        $scope.allValue.currentSelectCity = $scope.allValue.param.city
    }

    switch ($scope.allValue.currentSelectCity){
        case "Auckland":
            $scope.allValue.currentSelectCityCn = "奥克兰"
            break;
        case "Canterbury":
            $scope.allValue.currentSelectCityCn = "坎特伯雷"
            break;
        case "Wellington":
            $scope.allValue.currentSelectCityCn = "惠灵顿"
            break;
    }

    //切换城市
    $scope.allValue.changCityFn = function(str) {
        angular.element('.home_addr_choice').toggle(300);
        $scope.allValue.currentSelectCity = str.en;
        $scope.allValue.currentSelectCityCn = str.cn
    }

    //初始化分页
    myFactory.auction.page();


    //设置英文首页SEO
    var titleStr = "新西兰房产拍卖信息|老虎买房|Tigerz";
    $('title').text(titleStr);
    $("meta[name='keywords']").attr('content',titleStr+'奥克兰房产,新西兰买房');
    var descStr =  "新西兰最完整、最准确的房产数据";
    $("meta[name='description']").attr('content',descStr);

    //========================================加载页面时候请求的数据 获取的是显示房子数量 涨幅的数据============================
    $scope.allValue.loadPage = pFactory.getData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getHouseStatistics',
        callBack : function(data){
            $scope.allValue.statics = data.data;
            var n = 0;
            if(angular.element('.dataSave').data('timerSave')){
                $interval.cancel(angular.element('.dataSave').data('timerSave'));
            }
            $scope.allValue.timer = $interval(function(){
                angular.element('.hld_static').animate({'top':-n*0.6*parseFloat(document.documentElement.style.fontSize)},300,function(){
                    n++;
                    if(n>=data.data.priceIncreaseList.length/3+1){
                        angular.element('.hld_static').css({'top':0});
                        n = 0;
                    }
                })
            },3000);
            angular.element('.dataSave').data('timerSave',$scope.allValue.timer);
        }
    });
    //====================================顶部搜索框内容发生改变的时候的请求数据======================
    $scope.allValue.searchBar = function(){
        if($scope.allValue.currentValue.length != 0){
            angular.element('.home_search_history').hide();
            angular.element('.home_search_simple').show();
            angular.element('.home_search_error').hide();
            $scope.allValue.searchBardata = pFactory.postData({
                url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/searchInFuzzy',
                data:JSON.stringify({"content":$scope.allValue.currentValue,"scope":$scope.allValue.currentSelectCity}),
                callBack:function(data) {
                    //console.log(data);
                    $scope.allValue.searchData = data.data;
                    data.data.length != 0 ? angular.element('.home_search_error').hide() : angular.element('.home_search_error').show();
                    $scope.allValue.searchBtn = function(){
                        if($scope.allValue.currentValue.length != 0 && data.data.length != 0){
                            if(data.data[0].level == 4){
                                return 'detail_cn?'+data.data[0]._id+'&'+data.data[0].name+'&'+data.data[0].fatherName+'&'+$scope.allValue.currentSelectCity
                            }else{
                                return 'search?name='+ data.data[0].name +'&level=' + data.data[0].level +'&page=0&sort=default&isAllHouse=false&fn='+data.data[0].fatherName+'&ct='+$scope.allValue.currentSelectCity;
                            }
                        }else{
                            return 'javascript:void(0)'
                        }
                    }
                }
            })
        }else{
            angular.element('.home_search_history').show();
            angular.element('.home_search_simple').hide();
            angular.element('.home_search_error').hide();
            if(localStorage.getItem('searchHistory')){
                var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
                var json = {};
                $scope.allValue.searchHistoryData = [];
                for(var h = 0,len = tempArr.length; h < len; h++){
                    if(!json[JSON.parse(tempArr[h]).name]){
                        $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                        json[JSON.parse(tempArr[h]).name] = 1;
                    }
                }
            }
        }
    };

    $scope.allValue.historyClick = function(obj){
        //console.log(obj);
        var temp = JSON.stringify(obj);
        if(localStorage.getItem('searchHistory')){
            localStorage.setItem('searchHistory',localStorage.getItem('searchHistory')+'&'+temp);
        }else {
            localStorage.setItem('searchHistory', temp);
        }
    };
    //点击这个搜索框的其他位置  让这个搜索框下面的历史纪录和模糊信息隐藏
    $scope.allValue.blurEvent = function(){
        $scope.allValue.subFlag = true;
    };
    //当现在在这个选择li上的时候将那个点击删除
    $scope.allValue.overEvent = function () {
        $scope.allValue.subFlag = false;
        $scope.allValue.blurEvent = null;
    };
    //当离开这个弹出的框时候继续给其他点击绑定事件
    $scope.allValue.leaveEvent = function (){
        $scope.allValue.blurEvent = function(){
            $scope.allValue.subFlag = true;
        }
    };
    //当搜索框获取焦点的时候让历史纪录或者模糊出现
    $scope.allValue.focusEvent = function(){
        $scope.allValue.subFlag = false;
        $scope.allValue.searchHistoryData = [];
        var json = {};
        if(localStorage.getItem('searchHistory')){
            var tempArr = localStorage.getItem('searchHistory').split('&').reverse();
            for(var h = 0,len = tempArr.length; h < len; h++){
                //$scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]));
                if(!json[JSON.parse(tempArr[h]).name]){
                    $scope.allValue.searchHistoryData.push(JSON.parse(tempArr[h]))
                    json[JSON.parse(tempArr[h]).name] = 1;
                }
            }
            //console.log($scope.allValue.searchHistoryData);
        }
    };
    //判断跳转的页面是search页还是detail页
    $scope.allValue.jugePage = function(obj){
        if(obj.level == 4){
            if(obj.isSale){
                return 'detail_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }else{
                return 'house_cn?'+obj._id+'&'+obj.name+'&'+obj.fatherName+'&'+$scope.allValue.currentSelectCity;
            }

        }else{
            return 'search_cn?name='+ obj.name +'&level=' + obj.level +'&page=0&sort=default&isAllHouse=false&fn='+obj.fatherName+'&ct='+$scope.allValue.currentSelectCity;
        }
    };
    //判断当前的level确定是house，city，suburb，region
    $scope.allValue.jugeLevel = function(n,s){
        switch (n/1){
            case 1:
                return 'Region';
                break;
            case  2:
                return 'City';
                break;
            case 3:
                return 'Suburb';
                break;
            case 4:
                return s ? 'House(在售)' : 'House(非在售)';
                break;
        }
    };
    //判断在售还是非在售确定跳转
    $scope.allValue.auctionJage = function(obj){
        if(obj.status == "Sold"){
            return "/house_cn?"+obj.houseId+"&"+obj.addressDetail+'&'+$scope.allValue.currentSelectCity;
        }else{
            return "/detail_cn?"+obj.sellingId+"&"+obj.addressDetail+'&'+$scope.allValue.currentSelectCity;
        }
    }

    function moveTop(){
        angular.element("html,body").animate({scrollTop:$('.home_last_info').offset().top},300);
    }
    $scope.$watch("allValue.currentSelectCity",function(){
        $scope.allValue.currentCity = "所有城市" //district
        $scope.allValue.currentArea = "所有区域"//area
        $scope.allValue.currentAgency = "所有中介"//agency
        $scope.allValue.currentStatus = "售出"//status
        var cityTemp = true;
        var areaTemp = true;
        var agencyTemp = true;
        var statusTemp = true;
        $scope.allValue.alertTimer = '';

        $scope.allValue.defaultCity = "";
        $scope.allValue.defaultSuburb = "";
        $scope.allValue.defaultAgency = "";
        $scope.allValue.defaultSold = "yes";
        $scope.allValue.defaultPage = 1;

        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        }
        //=========================================== 加载页面请求拍卖房源 ===========================================
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount;
                $scope.allValue.nowPage = data.data.curCount;
                for(x in $scope.allValue.auctionListData){
                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea + "㎡" : 'N/A';

                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }
                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                };

                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide();
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }
                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });

            }
        });
        var slectTempCity = JSON.parse(JSON.stringify($scope.cityJson[$scope.allValue.currentSelectCity].city))
        slectTempCity.unshift("所有城市");
        //$scope.cityJson[$scope.allValue.currentSelectCity].city.unshift("所有城市")
        $scope.allValue.select = {
            "city":slectTempCity,
            "suburb":$scope.cityJson[$scope.allValue.currentSelectCity].suburb
        }
    })


    $scope.allValue.agencys = ["所有中介","Bayleys","Ray White City Apartments","Harcourts","City Sales","Impression Real Estate"]

    //$scope.allValue.agencys = ["所有中介","Bayleys","Ray White City Apartments","Barfoot & Thompson","Harcourts","City Sales","Impression Real Estate"]
    $scope.allValue.statuses = ["所有类型",'售出','非售出']

    $scope.allValue.currentCity = "所有城市" //district
    $scope.allValue.currentArea = "所有区域"//area
    $scope.allValue.currentAgency = "所有中介"//agency
    $scope.allValue.currentStatus = "售出"//status
    var cityTemp = true;
    var areaTemp = true;
    var agencyTemp = true;
    var statusTemp = true;
    $scope.allValue.alertTimer = '';

    $scope.allValue.defaultCity = "";
    $scope.allValue.defaultSuburb = "";
    $scope.allValue.defaultAgency = "";
    $scope.allValue.defaultSold = "yes";
    $scope.allValue.defaultPage = 1;

    $scope.allValue.auctionParam = {
        scope:$scope.allValue.currentSelectCity,
        city:$scope.allValue.defaultCity,
        suburb:$scope.allValue.defaultSuburb,
        agency:$scope.allValue.defaultAgency,
        isSold:$scope.allValue.defaultSold,
        page:$scope.allValue.defaultPage
    }
    //=========================================== 加载页面请求拍卖房源 ===========================================
    pFactory.postData({
        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
        data:JSON.stringify($scope.allValue.auctionParam),
        callBack:function(data) {
            //console.log(data)
            $('.auction_mask').hide();
            $scope.allValue.auctionListData = data.data.auctionList;
            $scope.allValue.totalPage = data.data.pageCount;
            $scope.allValue.nowPage = data.data.curCount;
            for(x in $scope.allValue.auctionListData){
                //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea + "㎡" : 'N/A';

                if($scope.allValue.auctionListData[x].landArea){
                    if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                        $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                    }else{
                        $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                    }
                }else {
                    $scope.allValue.auctionListData[x].shareData = 'N/A'
                }
                $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
            };

            $(".tcdPageCode").empty();
            $(".tcdPageCode").append($('<div class="tcd"></div>'))

            if($.fn.createPage){
                $.fn.createPage = null;
            }
            //初始化分页
            myFactory.auction.page();
            $(".tcd").createPage({
                pageCount:$scope.allValue.totalPage/1,
                current:$scope.allValue.nowPage/1,
                backFn:function(p){
                    //console.log(p)
                    $scope.allValue.auctionParam.page = p/1;
                    $('.auction_mask').show();
                    moveTop();
                    pFactory.postData({
                        url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                        data:JSON.stringify($scope.allValue.auctionParam),
                        callBack:function(data) {
                            $('.auction_mask').hide();
                            $scope.allValue.auctionListData = data.data.auctionList;
                            for(x in $scope.allValue.auctionListData){
                                //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                                if($scope.allValue.auctionListData[x].landArea){
                                    if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                        $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                    }else{
                                        $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                    }
                                }else {
                                    $scope.allValue.auctionListData[x].shareData = 'N/A'
                                }
                                $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                            }
                        }
                    });
                }
            });

        }
    });

    $('.search_select_city').on('click',function(){
        $('.search_select_areaItem').hide();
        $('.search_select_agencyItem').hide();
        $('.search_select_statusItem').hide();

        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;

        $('.select_area_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_agency_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_status_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        if(cityTemp){
            $('.search_select_cityItem').show();
            $('.select_city_tri').css({
                'border': '5px solid transparent',
                'border-bottom':'5px solid #2b2b2b',
                'top':'10px'
            });
        }else{
            $('.search_select_cityItem').hide();
            $('.select_city_tri').css({
                'border': '5px solid transparent',
                'border-top':'5px solid #2b2b2b',
                'top':'15px'
            });
        }
        cityTemp = !cityTemp
    });
    $scope.allValue.cityClick = function(str){
        $('.auction_mask').show();
        moveTop();
        cityTemp = true;
        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $scope.allValue.PAGE = null;
        $('.search_select_cityItem').hide();
        //$('.select_city_show').text(str)
        $('.select_city_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $scope.allValue.currentCity = str;
        $scope.allValue.currentArea = '所有区域';
        if($scope.allValue.currentCity != "所有城市"){
            $scope.allValue.areas = $scope.allValue.select.suburb[$scope.allValue.currentCity];
        }

        //console.log($scope.allValue.currentCity)
        $scope.allValue.defaultCity = $scope.allValue.currentCity == "所有城市" ? "" : $scope.allValue.currentCity;
        $scope.allValue.defaultSuburb = "";

        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        }
        //console.log($scope.allValue.auctionParam)
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount/1;
                $scope.allValue.nowPage = data.data.curCount/1;
                //console.log($scope.allValue.totalPage,$scope.allValue.nowPage);
                for(x in $scope.allValue.auctionListData){
                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }
                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                }
                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)

                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide()
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }
                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });

            }
        });
    }

    $('.search_select_area').on('click',function(){
        $('.search_select_agencyItem').hide();
        $('.search_select_cityItem').hide();
        $('.search_select_statusItem').hide();
        cityTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $('.select_agency_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_city_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_status_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });

        if($scope.allValue.alertTimer) {
            $timeout.cancel($scope.allValue.alertTimer)
        }
        if($scope.allValue.currentCity == "所有城市"){
            angular.element('.select_alert').show(30);
            $scope.allValue.alertTimer = $timeout(function(){
                angular.element('.select_alert').hide(300);
            },600)
            return
        }


        if(areaTemp){
            $('.search_select_areaItem').show();
            $('.select_area_tri').css({
                'border': '5px solid transparent',
                'border-bottom':'5px solid #2b2b2b',
                'top':'10px'
            });
        }else{
            $('.search_select_areaItem').hide();
            $('.select_area_tri').css({
                'border': '5px solid transparent',
                'border-top':'5px solid #2b2b2b',
                'top':'15px'
            });
        }
        areaTemp = !areaTemp
    });
    $scope.allValue.areaClick = function(str){
        $('.auction_mask').show();
        moveTop();
        cityTemp = true;
        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $('.search_select_areaItem').hide();
        //$('.select_city_show').text(str)
        $('.select_area_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $scope.allValue.currentArea = str;


        $scope.allValue.defaultSuburb = $scope.allValue.currentArea == "所有区域" ? "" : $scope.allValue.currentArea;
        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        };
        //console.log($scope.allValue.auctionParam)
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount/1;
                $scope.allValue.nowPage = data.data.curCount/1;
                //console.log($scope.allValue.totalPage,$scope.allValue.nowPage);
                for(x in $scope.allValue.auctionListData){
                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }

                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                }

                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide();
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }
                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });

            }
        });
    }

    $('.search_select_agency').on('click',function(){
        $('.search_select_areaItem').hide();
        $('.search_select_cityItem').hide();
        $('.search_select_statusItem').hide();
        cityTemp = true;
        areaTemp = true;
        statusTemp = true;
        $('.select_area_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_city_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_status_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        if(agencyTemp){
            $('.search_select_agencyItem').show();
            $('.select_agency_tri').css({
                'border': '5px solid transparent',
                'border-bottom':'5px solid #2b2b2b',
                'top':'10px'
            });
        }else{
            $('.search_select_agencyItem').hide();
            $('.select_agency_tri').css({
                'border': '5px solid transparent',
                'border-top':'5px solid #2b2b2b',
                'top':'15px'
            });
        }
        agencyTemp = !agencyTemp
    });
    $scope.allValue.agencyClick = function(str){
        $('.auction_mask').show();
        moveTop();
        cityTemp = true;
        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $('.search_select_agencyItem').hide();
        //$('.select_city_show').text(str)
        $('.select_agency_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $scope.allValue.currentAgency = str;

        //$scope.allValue.auctionParam.city = $scope.allValue.currentCity == "All City" ? "" : $scope.allValue.currentCity;
        //$scope.allValue.auctionParam.suburb = $scope.allValue.currentArea == "All Suburb" ? "" : $scope.allValue.currentArea;
        $scope.allValue.defaultAgency = $scope.allValue.currentAgency == "所有中介" ? "" : $scope.allValue.currentAgency;
        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        };
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount/1;
                $scope.allValue.nowPage = data.data.curCount/1;
                //console.log($scope.allValue.totalPage,$scope.allValue.nowPage);
                for(x in $scope.allValue.auctionListData){
                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';

                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }
                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                }

                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide()
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';

                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }
                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });

            }
        });
    }

    $('.search_select_status').on('click',function(){
        $('.search_select_cityItem').hide();
        $('.search_select_agencyItem').hide();
        $('.search_select_areaItem').hide();

        cityTemp = true;
        agencyTemp = true;
        areaTemp = true;
        $('.select_city_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_agency_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $('.select_area_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        if(statusTemp){
            $('.search_select_statusItem').show();
            $('.select_status_tri').css({
                'border': '5px solid transparent',
                'border-bottom':'5px solid #2b2b2b',
                'top':'10px'
            });
        }else{
            $('.search_select_statusItem').hide();
            $('.select_status_tri').css({
                'border': '5px solid transparent',
                'border-top':'5px solid #2b2b2b',
                'top':'15px'
            });
        }
        statusTemp = !statusTemp
    });
    $scope.allValue.statusClick = function(str){
        $('.auction_mask').show();
        moveTop();
        cityTemp = true;
        areaTemp = true;
        agencyTemp = true;
        statusTemp = true;
        $('.search_select_statusItem').hide();
        //$('.select_city_show').text(str)
        $('.select_status_tri').css({
            'border': '5px solid transparent',
            'border-top':'5px solid #2b2b2b',
            'top':'15px'
        });
        $scope.allValue.currentStatus = str;

        $scope.allValue.defaultSold = $scope.allValue.currentStatus == "所有类型" ? "" : ($scope.allValue.currentStatus == "售出" ? "yes" : "no")


        $scope.allValue.auctionParam = {
            scope:$scope.allValue.currentSelectCity,
            city:$scope.allValue.defaultCity,
            suburb:$scope.allValue.defaultSuburb,
            agency:$scope.allValue.defaultAgency,
            isSold:$scope.allValue.defaultSold,
            page:$scope.allValue.defaultPage
        };
        pFactory.postData({
            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
            data:JSON.stringify($scope.allValue.auctionParam),
            callBack:function(data) {
                //console.log(data)
                $('.auction_mask').hide();
                $scope.allValue.auctionListData = data.data.auctionList;
                $scope.allValue.totalPage = data.data.pageCount/1;
                $scope.allValue.nowPage = data.data.curCount/1;
                //console.log($scope.allValue.totalPage,$scope.allValue.nowPage);
                for(x in $scope.allValue.auctionListData){
                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                    if($scope.allValue.auctionListData[x].landArea){
                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                        }else{
                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                        }
                    }else {
                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                    }
                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                }


                $(".tcdPageCode").empty();
                $(".tcdPageCode").append($('<div class="tcd"></div>'))

                if($.fn.createPage){
                    $.fn.createPage = null;
                }
                //初始化分页
                myFactory.auction.page();
                $(".tcd").createPage({
                    pageCount:$scope.allValue.totalPage/1,
                    current:$scope.allValue.nowPage/1,
                    backFn:function(p){
                        //console.log(p)
                        $scope.allValue.auctionParam.page = p/1;
                        $('.auction_mask').show();
                        moveTop();
                        pFactory.postData({
                            url:'http://'+ $rootScope.tigerDomain +'/tigerspring/rest/getAuctionResult',
                            data:JSON.stringify($scope.allValue.auctionParam),
                            callBack:function(data) {
                                $('.auction_mask').hide();
                                $scope.allValue.auctionListData = data.data.auctionList;
                                for(x in $scope.allValue.auctionListData){
                                    //$scope.allValue.auctionListData[x].landAreaData = $scope.allValue.auctionListData[x].landArea ? $scope.allValue.auctionListData[x].landArea : 'N/A';
                                    if($scope.allValue.auctionListData[x].landArea){
                                        if($scope.allValue.auctionListData[x].houseType == "Cross Lease"){
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].houseHolds + ' 户共享 ' + $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }else{
                                            $scope.allValue.auctionListData[x].shareData = $scope.allValue.auctionListData[x].landArea + '㎡';
                                        }
                                    }else {
                                        $scope.allValue.auctionListData[x].shareData = 'N/A'
                                    }
                                    $scope.allValue.auctionListData[x].priceShow = $scope.allValue.auctionListData[x].price ? true : false;
                                    $scope.allValue.auctionListData[x].auction_date = myFactory.timeFormat($scope.allValue.auctionListData[x].actionDate,1);
                                }
                            }
                        });
                    }
                });
            }
        });
    }

}]);
//=================================================== 中文个人中心页面 ================================================
app.controller('userCNCtrl',['$scope',function($scope){
    //console.log(window.location);
    $scope.allValue = {};
    $scope.allValue.userPhoto = "http://res.tigerz.nz/imgs/defaultphoto.png"
    $scope.allValue.currentItem = 0;
    $scope.allValue.nickname = 'My TigerZ';
    $scope.allValue.gender = 'secret';

    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }
    var username=getCookie('name');
    if(username){
        console.log(username);
    }
}]);
