
function jugeAgent(){
    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        window.location.href = "http://m.tigerz.nz/index.html";
    }else{
        return
    }
}
//jugeAgent();
if(window.innerWidth >= 1250){
    document.documentElement.style.fontSize = '97.66px';
}else{
    //innerWidth <= 1000 ? $('body').css({'overflowX':'scroll'}) : $('body').css({'overflowX':'hidden'});
    innerWidth <= 1000 ? document.documentElement.style.fontSize = '78.13px' : document.documentElement.style.fontSize = innerWidth / 12.8 + 'px';
}
window.onresize = function(){
    jugeAgent();
    if(window.innerWidth >= 1250){
        document.documentElement.style.fontSize = '97.66px';
    }else{
        //innerWidth <= 1000 ? $('body').css({'overflowX':'scroll'}) : $('body').css({'overflowX':'hidden'});
        innerWidth <= 1000 ? document.documentElement.style.fontSize = '78.13px' : document.documentElement.style.fontSize = innerWidth / 12.8 + 'px';
    }
};


var detectedLng = (navigator.language) ? navigator.language : navigator.userLanguage;

var indexPage;
if(detectedLng == 'zh-CN'){
    indexPage = '/home_cn'
}else{
    indexPage = '/home'
}
var app = angular.module('myApp',['ngRoute','ngSanitize','factorys','searchFactorys','ngAnimate','lazyload'])
.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/home', {templateUrl: './tpls/home.html?0621', controller: 'homeCtrl'})
        .when('/home_cn', {templateUrl: './tpls/home_cn.html?0621', controller: 'homeCNCtrl'})

        .when('/search', {templateUrl: './tpls/search.html?0616', controller: 'searchCtrl'})
        .when('/search_cn', {templateUrl: './tpls/search_cn.html?0621', controller: 'searchCNCtrl'})

        .when('/detail', {templateUrl: './tpls/detail.html?0803', controller: 'detailCtrl'})
        .when('/detail_cn', {templateUrl: './tpls/detail_cn.html?0803', controller: 'detailCNCtrl'})

        .when('/house',{templateUrl:'./tpls/house.html?0621',controller:'houseCtrl'})
        .when('/house_cn',{templateUrl:'./tpls/house_cn.html?0621',controller:'houseCNCtrl'})

        .when('/house-price-estimate',{templateUrl:'./tpls/house-price-estimate.html?0621',controller:'estimateCtrl'})
        .when('/house-price-estimate_cn',{templateUrl:'./tpls/house-price-estimate_cn.html?0621',controller:'estimateCNCtrl'})

        .when('/auction-results',{templateUrl:'./tpls/auction-results.html?0616',controller:'auctionCtrl'})
        .when('/auction-results_cn',{templateUrl:'./tpls/auction-results_cn.html?0616',controller:'auctionCNCtrl'})

        //    做注册登陆时使用的代码
        .when('/user',{templateUrl:'./tpls/user.html?0616',controller:'userCtrl'})
        .when('/user_cn',{templateUrl:'./tpls/user_cn.html?0616',controller:'userCNCtrl'})


        .otherwise({redirectTo: indexPage});
}]);