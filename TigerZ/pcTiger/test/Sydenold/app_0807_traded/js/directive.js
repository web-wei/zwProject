/**
 * Created by jvid on 2016/10/25.
 */
//==================================app下的所有指令============================
app
    .directive('signInup',function(){
        return function(sc,ele,attr,ctrls){
            angular.element(ele).on('click', function() {
                angular.element('.login_regist').find('li').removeClass('login_active');
                angular.element(ele).addClass('login_active');
            })

        }
    })
    .directive('fileConfirm',function(){
        return function (sc,ele) {
            angular.element(ele).on('click', function () {
                angular.element(ele).hasClass('file_confirmed') ? angular.element(ele).removeClass('file_confirmed') : angular.element(ele).addClass('file_confirmed');
            })
        }
    })
    .directive('autoLogin',function(){
        return function (sc,ele) {
            angular.element(ele).on('click', function () {
                angular.element(ele).hasClass('file_confirmed') ? angular.element(ele).removeClass('file_confirmed') : angular.element(ele).addClass('file_confirmed');
                sc.allValue.autoLogin = angular.element(ele).hasClass('file_confirmed');
            })
        }
    })
    .directive('loginTri',function(){
        return function(sc,ele){
            angular.element(ele).on('click',function(){
                if(angular.element('.login_tri').hasClass('login_tri_open')){
                    angular.element('.login_tri').removeClass('login_tri_open');
                    //angular.element('.userInfo_list').hide()
                    angular.element('.userInfo_list').css({opacity:0})
                    //angular.element('.userName').hide()
                }else{
                    angular.element('.login_tri').addClass('login_tri_open');
                    //angular.element('.userInfo_list').show();
                    angular.element('.userInfo_list').css({opacity:1})

                    //angular.element('.userName').show()
                }
            })
        }
    })

    .directive('userItem',function(){
        return {
            restrict:'E',
            templateUrl:'../components/user/useritem.html?0620',
            replace:true,
            link: function(sc,ele,attr,ctrls) {
                angular.element(ele).find('li').on('click',function(){
                    angular.element('.user_item li').removeClass('current_item');
                    angular.element(this).addClass('current_item');
                    sc.allValue.currentItem = angular.element(this).index();
                    if(angular.element(this).index() == 0){
                        angular.element('.watchlist_wrap').show();
                    }else{
                        angular.element('.watchlist_wrap').hide();
                    }
                    if(angular.element(this).index() == 1){
                        angular.element('.profile_wrap').show();
                    }else{
                        angular.element('.profile_wrap').hide();
                    }
                    if(angular.element(this).index() == 2){
                        angular.element('.changepsw_wrap').show();
                    }else{
                        angular.element('.changepsw_wrap').hide();
                    }
                })
            }
        }
    })
    .directive('userProfile', function () {
        return {
            restrict:'E',
            templateUrl:'../components/user/userprofile.html?0620',
            link: function (sc,ele,attr,ctrls) {
                angular.element(ele).find('.select_wrap').on('click', function() {
                    //console.log(111);
                    if(angular.element('.gender_tri').hasClass('gender_open')){
                        angular.element('.gender_tri').removeClass('gender_open');
                        angular.element('.gender_choice').hide(300);

                    }else{
                        angular.element('.gender_choice').show(300);
                        angular.element('.gender_tri').addClass('gender_open')
                    }
                });
                angular.element(ele).find('.gender_choice li').on('click',function(){
                    sc.allValue.gender = angular.element(this).text().toLowerCase();
                    angular.element(ele).find('.gender_show').text(angular.element(this).text());
                    angular.element('.gender_choice').hide(300);
                    angular.element('.gender_tri').removeClass('gender_open');
                })
            }
        }
    })
    .directive('userPassword', function () {
        return {
            restrict:'E',
            templateUrl:'../components/user/userpassword.html?0620',
            link: function (sc,ele,attr,ctrls) {
                //console.log(sc);

            }
        }
    })
    .directive('userWatchlist', function () {
        return {
            restrict:'E',
            templateUrl:'../components/user/userwatchlist.html?0620',
            link: function (sc,ele,attr,ctrls) {
                //console.log(sc);
                //if(sc.allValue.currentItem == 0){
                //    angular.element(ele).show();
                //}else{
                //    angular.element(ele).hide();
                //}
            }
        }
    })
    .directive('userItemcn',function(){
        return {
            restrict:'E',
            templateUrl:'../components/user/useritemcn.html?0620',
            replace:true,
            link: function(sc,ele,attr,ctrls) {

                angular.element(ele).find('li').on('click',function(){
                    angular.element('.user_item li').removeClass('current_item');
                    angular.element(this).addClass('current_item');
                    sc.allValue.currentItem = angular.element(this).index();
                    if(angular.element(this).index() == 0){
                        angular.element('.watchlist_wrap').show();
                    }else{
                        angular.element('.watchlist_wrap').hide();
                    }
                    if(angular.element(this).index() == 1){
                        angular.element('.profile_wrap').show();
                    }else{
                        angular.element('.profile_wrap').hide();
                    }
                    if(angular.element(this).index() == 2){
                        angular.element('.changepsw_wrap').show();
                    }else{
                        angular.element('.changepsw_wrap').hide();
                    }
                })
            }
        }
    })
    .directive('userProfilecn', function () {
        return {
            restrict:'E',
            templateUrl:'../components/user/userprofilecn.html?0620',
            link: function (sc,ele,attr,ctrls) {
                angular.element(ele).find('.select_wrap').on('click', function() {
                    //console.log(111);
                    if(angular.element('.gender_tri').hasClass('gender_open')){
                        angular.element('.gender_tri').removeClass('gender_open');
                        angular.element('.gender_choice').hide(300);

                    }else{
                        angular.element('.gender_choice').show(300);
                        angular.element('.gender_tri').addClass('gender_open')
                    }
                });
                angular.element(ele).find('.gender_choice li').on('click',function(){
                    sc.allValue.gender = angular.element(this).text().toLowerCase();
                    angular.element(ele).find('.gender_show').text(angular.element(this).text());
                    angular.element('.gender_choice').hide(300);
                    angular.element('.gender_tri').removeClass('gender_open');
                })
            }
        }
    })
    .directive('userPasswordcn', function () {
        return {
            restrict:'E',
            templateUrl:'../components/user/userpasswordcn.html?0620',
            link: function (sc,ele,attr,ctrls) {
                //console.log(sc);

            }
        }
    })
    .directive('userWatchlistcn', function () {
        return {
            restrict:'E',
            templateUrl:'../components/user/userwatchlistcn.html?0620',
            link: function (sc,ele,attr,ctrls) {
                //console.log(sc);
                //if(sc.allValue.currentItem == 0){
                //    angular.element(ele).show();
                //}else{
                //    angular.element(ele).hide();
                //}
            }
        }
    })

    .directive('navItem',function(){
        return {
            restrict:'E',
            scope:{
              city:"="
            },
            templateUrl:'../components/common/nav.html?0620'
        }
    })
    .directive('navItemcn',function(){
        return {
            restrict:'E',
            scope:{
                city:"="
            },
            templateUrl:'../components/common/navcn.html?0620'
        }
    })

    .directive('footerItem',function(){
        return {
            restrict:'E',
            templateUrl:'../components/common/footer.html?0803'
        }
    })
    .directive('footerItemcn',function(){
        return {
            restrict:'E',
            templateUrl:'../components/common/footercn.html?0620'
        }
    })

    .directive('citySuburb',function(){
        return {
            restrict:'E',
            templateUrl:'../components/common/citySuburb.html?0620',
            replace:true,
            scope:{
                cityJson:"=",
                currentCity:"="
            },
            link:function(sc,ele,attr,ctrls){
                sc.citys = {
                    "city": sc.cityJson[sc.currentCity].city,
                    "suburb": sc.cityJson[sc.currentCity].suburb
                };
                sc.$watch('currentCity', function (newValue,oldValue) {
                    sc.citys = {
                        "city": sc.cityJson[sc.currentCity].city,
                        "suburb": sc.cityJson[sc.currentCity].suburb
                    };
                })
                sc.currentFn = sc.citys.city[0];
                sc.currentSuburbs = sc.citys.suburb[sc.currentFn];

                sc.overLiEvent = function(n,str){
                    sc.currentSuburbs = sc.citys.suburb[str];
                    sc.currentFn = str;
                    angular.element('.footer_citys>li').removeClass('overLi');
                    angular.element('.footer_citys>li').eq(n).addClass('overLi');
                };
                sc.sOverLiEvent = function(n){
                    angular.element('.footer_city_wrap>li').removeClass('overLi');
                    angular.element('.footer_city_wrap>li').eq(n).addClass('overLi');
                }
            }
        }
    })

    .directive('estimateContent',function(){
        return {
            restrict:'E',
            templateUrl:'../components/estimate/content.html?0620',
            replace:true
        }
    })
    .directive('estimateContentcn',function(){
        return {
            restrict:'E',
            templateUrl:'../components/estimate/contentcn.html?0620',
            replace:true
        }
    })

    .directive('fiveStep',function(){
        return {
            restrict:'E',
            templateUrl:'../components/home/fivestep.html?0620',
            replace:true
        }
    })
    .directive('fiveStepcn',function(){
        return {
            restrict:'E',
            templateUrl:'../components/home/fivestepcn.html?0616',
            replace:true
        }
    })

    .directive('addrSelectShow',function(){
        return function (sc,ele) {
            angular.element(ele).on('click',function(){
                 angular.element(this).next().toggle(300);
            })
        }

    })
       
    .directive('detailExpand', function (){
        return {
            restrict:'E',
            replace:true,
            templateUrl:'../components/detail/expand.html?0620'
        }
    })
    .directive('detailExpandcn', function (){
        return {
            restrict:'E',
            replace:true,
            templateUrl:'../components/detail/expandcn.html?0620'
        }
    })

    .directive('detailTurn',function(){
        return {
            restrict:'E',
            replace:true,
            templateUrl:'../components/detail/turn.html?0703'
        }
    })
    .directive('detailTurns',function(){
        return {
            restrict:'E',
            replace:true,
            templateUrl:'../components/detail/turnup.html?0620'
        }
    })
    .directive('cvSold',function(){
        return {
            restrict:'E',
            replace: true,
            templateUrl: '../components/common/cvSold.html?0620'
        }
    })
    .directive('errorSrc', function () {
        return function(sc, ele, attrs) {
            ele.bind('error', function() {
                angular.element(this).attr("src", attrs.errorSrc);
            })
         }
    })

    .directive('floatIcon',['publicFactory','myFactory','$timeout',function (pFactory,myFactory,$timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '../components/detail/float.html?07072',
            scope: {
                houseId: '=',
            },
            link: function (sc, ele, attr) {
                var defaultAgent=[{
                    agent_id:"default",
                    agent_icon:"http://res.tigerz.nz/imgs/robot.png",
                    agent_mobile:"wjc@tigerz.nz",
                    agent_name:"TigerZ",
                    agent_url:""
                }];
                
                //联系中介验证码输入正确与否
                sc.rightCode = false;
                //反馈信息验证码输入正确与否
                sc.feedrightCode = false;

                sc.emailMd = '';
                sc.feedMd = '';
                sc.emailCount = 0;
                sc.feedCount = 0;

                sc.hideFeedback = true;
                sc.showMail = false;
                sc.showFeed = false;
                sc.agentId = '';
                //获取中介信息
                pFactory.getData({
                    url:'http://api.tigerz.nz/tigerspring/rest/getHouseBaseInfo/'+sc.houseId + '/en',
                    callBack: function (res) {
                        //console.log(res);
                        //如果没有中介信息  使用默认的那个
                        sc.agentList = res.data[0].agentList && res.data[0].agentList.length != 0 ? res.data[0].agentList : defaultAgent;
                        sc.agentId = sc.agentList[0].agent_id;
                        //console.log(sc.agentList);
                    }
                });
                sc.agentChoice = function (n,id) {
                    console.log(n,id);
                    myFactory.addClassName({
                        name:"select-circled",
                        itemSmall:".agent>.agent-detail>li>i",
                        num:n,
                        nextEvent:false
                    })
                    sc.agentId = id;
                }

                var canEmail = true;
                //给中介发送消息
                sc.contactFn = function(s){
                    //s代表现在得到的用户反馈信息是否合法
                    //console.log(s);
                    console.log(sc.rightCode);
                    var userContact = angular.element('#floatUserContact').val();
                    var userName = angular.element('#floatUserName').val();
                    var userEmail = angular.element('#floatEmail').val();
                    var userTel = angular.element('#floatTel').val();
                    if(sc.agentId.length == 0){
                        angular.element('#floatServerBack').text('Please choice a agent');
                        return;
                    }
                    if(pFactory.stringTrim(userName).length == 0){
                        angular.element('#floatServerBack').text('Please input your name');
                        return;
                    }
                    if(pFactory.stringTrim(userEmail).length == 0){
                        angular.element('#floatServerBack').text('Please input your email');
                        return;
                    }
                    if(pFactory.stringTrim(userContact).length == 0){
                        angular.element('#floatServerBack').text('Please input your problem');
                        return;
                    }
                    if(!sc.rightCode){
                        angular.element('#floatServerBack').text('Please input correct verification code');
                        return;
                    }
                    angular.element('#floatServerBack').text('')
                    if(s && canEmail){
                        console.log(sc.emailMd);
                        var agentEmail = {
                            "agentId":sc.agentId,
                            "desc":userContact,
                            "phone":userTel,
                            "email":userEmail,
                            "userName":userName,
                            "houseId":sc.houseId,
                            "md5":sc.emailMd
                        }
                        canEmail = false;
                        pFactory.postData({
                            url:'http://api.tigerz.nz/tigerspring/rest/sendEmail',
                            data: JSON.stringify(agentEmail),
                            callBack:function(res){
                                //alert('Message delivery success')
                                //console.log(res);
                                sc.hideFeedback = true;
                                angular.element('#floatTel').val('');
                                angular.element('#floatUserContact').val('');
                                angular.element('#floatEmail').val('');
                                angular.element('#floatUserName').val('');

                                angular.element('#feedMes').text('Your message has been sent successfully!')
                                angular.element('.alert-mask').show();
                                angular.element('.alert-mask>.success-wrap').animate({
                                    width:'4.7rem',
                                    height:'0.54rem'
                                },300)
                                sc.emailCount += 1;
                                $timeout(function(){
                                    angular.element('.alert-mask>.success-wrap').animate({
                                        width:0,
                                        height:0
                                    },200)
                                    angular.element('.alert-mask').hide();
                                    canEmail = true;
                                    $('body').animate({'scrollTop':0});
                                },1000)
                                console.log("ok");
                            }
                        })
                    }
                }

                var canSend = true;
                //发送反馈信息
                sc.sendMes = function(s){
                    console.log(sc.feedrightCode);
                    //s 表示现在可不可以发送
                    var phone = angular.element('#feedtel').val();
                    var detail = angular.element('#feedContent').val();
                    var em = angular.element('#feedEmail').val();
                    //console.log("sss");
                    if(pFactory.stringTrim(detail).length == 0){
                        angular.element('#feedbackServer').text('Please input your problem');
                        return;
                    }
                    if(pFactory.stringTrim(em).length == 0){
                        angular.element('#feedbackServer').text('Please input your email');
                        return;
                    }
                    if(!sc.feedrightCode){
                        angular.element('#feedbackServer').text('Please input correct verification code');
                        return;
                    }
                    angular.element('#feedbackServer').text('');
                    if(s && canSend){
                        console.log(sc.feedMd);
                        var feedData = {"title":"test","detail":detail,"phone":phone,"email":em,"md5":sc.feedMd}
                        canSend = false;
                        pFactory.postData({
                            url:'http://api.tigerz.nz/tigerspring/rest/addFeedBack',
                            data: JSON.stringify(feedData),
                            callBack:function(res){
                                //alert('Message delivery success')
                                sc.hideFeedback = true;
                                angular.element('#feedtel').val('');
                                angular.element('#feedContent').val('');
                                angular.element('#feedEmail').val('');

                                angular.element('#feedMes').text('Thanks for feedback!')
                                angular.element('.alert-mask').show();
                                angular.element('.alert-mask>.success-wrap').animate({
                                    width:'2.8rem',
                                    height:'0.54rem'
                                },300)
                                sc.feedCount += 1;
                                $timeout(function(){
                                    angular.element('.alert-mask>.success-wrap').animate({
                                        width:0,
                                        height:0
                                    },200)
                                    angular.element('.alert-mask').hide();
                                    canSend = true;
                                    $('body').animate({'scrollTop':0});
                                },1000)
                                console.log("ok");
                            }
                        })
                    }
                }
                //判断滚动高度确定回到顶部是否出现
                $(window).on('scroll',function(){
                    if(document.body.scrollTop > 800){
                        angular.element('.go-top').css({"visibility":"visible","opacity":1})
                    }else{
                        angular.element('.go-top').css({"visibility":"hidden","opacity":0})
                    }
                })
                sc.goTopFn = function () {
                    $('body').animate({'scrollTop':0},300);
                }
                sc.closeFeed = function(){
                    sc.hideFeedback = true;
                    sc.showMail = false;
                    sc.showFeed = false;
                };
                sc.showMailFn = function () {
                    sc.hideFeedback = false;
                    sc.showMail = true;
                    sc.showFeed = false;
                };
                sc.showFeedFn = function () {
                    sc.hideFeedback = false;
                    sc.showMail = false;
                    sc.showFeed = true;
                    sc.emailCount -= 1;
                    sc.feedCount -= 1;
                };

                angular.element(ele).find('input').on('focus',function(){
                    angular.element(this).parent().css({'border-color':'#2dbe67'})
                })
                angular.element(ele).find('input').on('blur',function(){
                    angular.element(this).parent().css({'border-color':'#cdd1d4'})
                })
                angular.element(ele).find('textarea').on('focus',function(){
                    angular.element(this).css({'border-color':'#2dbe67'})
                })
                angular.element(ele).find('textarea').on('blur',function(){
                    angular.element(this).css({'border-color':'#cdd1d4'})
                })

                sc.emailBlur = function () {
                    sc.emailCount += 1;
                }
                sc.feedBlur = function () {
                    sc.feedCount += 1;
                }
            }
        }
    }])
    .directive('floatIconcn',['publicFactory','myFactory','$timeout',function (pFactory,myFactory,$timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '../components/detail/floatcn.html?07072',
            scope: {
                houseId: '=',
            },
            link: function (sc, ele, attr) {
                var defaultAgent=[{
                    agent_id:"default",
                    agent_icon:"http://res.tigerz.nz/imgs/robot.png",
                    agent_mobile:"wjc@tigerz.nz",
                    agent_name:"TigerZ",
                    agent_url:""
                }];
                
                //联系中介验证码输入正确与否
                sc.rightCode = false;
                //反馈信息验证码输入正确与否
                sc.feedrightCode = false;

                sc.emailMd = '';
                sc.feedMd = '';
                sc.emailCount = 0;
                sc.feedCount = 0;

                sc.hideFeedback = true;
                sc.showMail = false;
                sc.showFeed = false;
                sc.agentId = '';
                //获取中介信息
                pFactory.getData({
                    url:'http://api.tigerz.nz/tigerspring/rest/getHouseBaseInfo/'+sc.houseId + '/en',
                    callBack: function (res) {
                        //console.log(res);
                        sc.agentList = res.data[0].agentList && res.data[0].agentList.length != 0 ? res.data[0].agentList : defaultAgent;
                        sc.agentId = sc.agentList[0].agent_id;
                    }
                });
                sc.agentChoice = function (n,id) {
                    console.log(n,id);
                    myFactory.addClassName({
                        name:"select-circled",
                        itemSmall:".agent>.agent-detail>li>i",
                        num:n,
                        nextEvent:false
                    })
                    sc.agentId = id;
                }
                var canEmail = true;
                //给中介发送消息
                sc.contactFn = function(s){
                    //console.log(s);
                    console.log(sc.rightCode);
                    var userContact = angular.element('#floatUserContact').val();
                    var userName = angular.element('#floatUserName').val();
                    var userEmail = angular.element('#floatEmail').val();
                    var userTel = angular.element('#floatTel').val();
                    if(sc.agentId.length == 0){
                        angular.element('#floatServerBack').text('请选择一个经纪人');
                        return;
                    }
                    if(pFactory.stringTrim(userName).length == 0){
                        angular.element('#floatServerBack').text('请输入您的姓名');
                        return;
                    }
                    if(pFactory.stringTrim(userEmail).length == 0){
                        angular.element('#floatServerBack').text('请输入您的邮箱');
                        return;
                    }
                    if(pFactory.stringTrim(userContact).length == 0){
                        angular.element('#floatServerBack').text('请填写您的问题');
                        return;
                    }
                    if(!sc.rightCode){
                        angular.element('#floatServerBack').text('请输入正确的验证码');
                        return;
                    }
                    angular.element('#floatServerBack').text('')
                    if(s && canEmail){
                        var agentEmail = {
                            "agentId":sc.agentId,
                            "desc":userContact,
                            "phone":userTel,
                            "email":userEmail,
                            "userName":userName,
                            "houseId":sc.houseId,
                            "md5":sc.emailMd
                        }
                        canEmail = false;
                        pFactory.postData({
                            url:'http://api.tigerz.nz/tigerspring/rest/sendEmail',
                            data: JSON.stringify(agentEmail),
                            callBack:function(res){
                                //alert('Message delivery success')
                                //console.log(res);
                                sc.hideFeedback = true;
                                angular.element('#floatTel').val('');
                                angular.element('#floatUserContact').val('');
                                angular.element('#floatEmail').val('');
                                angular.element('#floatUserName').val('');

                                angular.element('#feedMes').text('提交咨询成功，请等待中介与您联系！')
                                angular.element('.alert-mask').show();
                                angular.element('.alert-mask>.success-wrap').animate({
                                    width:'4rem',
                                    height:'0.54rem'
                                },300)
                                sc.emailCount += 1;
                                $timeout(function(){
                                    angular.element('.alert-mask>.success-wrap').animate({
                                        width:0,
                                        height:0
                                    },200)
                                    angular.element('.alert-mask').hide();
                                    canEmail = true;
                                    $('body').animate({'scrollTop':0});
                                },1000)
                                console.log("ok");
                            }
                        })

                    }
                }
                
                //发送反馈信息
                sc.sendMes = function(s){
                    //s 表示现在可不可以发送
                    console.log(sc.feedrightCode);
                    var phone = angular.element('#feedtel').val();
                    var detail = angular.element('#feedContent').val();
                    var em = angular.element('#feedEmail').val();
                    //console.log("sss");
                    if(pFactory.stringTrim(detail).length == 0){
                        angular.element('#feedbackServer').text('请输填写您要反馈的问题');
                        return;
                    }
                    if(pFactory.stringTrim(em).length == 0){
                        angular.element('#feedbackServer').text('请输入您的邮箱');
                        return;
                    }
                    if(!sc.feedrightCode){
                        angular.element('#feedbackServer').text('请输入正确的验证码');
                        return;
                    }
                    angular.element('#feedbackServer').text('');
                    if(s){
                        var feedData = {"title":"test","detail":detail,"phone":phone,"email":em,"md5":sc.feedMd}
                        pFactory.postData({
                            url:'http://api.tigerz.nz/tigerspring/rest/addFeedBack',
                            data: JSON.stringify(feedData),
                            callBack:function(res){
                                //alert('Message delivery success')
                                sc.hideFeedback = true;
                                angular.element('#feedtel').val('');
                                angular.element('#feedContent').val('');
                                angular.element('#feedEmail').val('');

                                angular.element('#feedMes').text('感谢您的反馈！')
                                angular.element('.alert-mask').show();
                                angular.element('.alert-mask>.success-wrap').animate({
                                    width:'2rem',
                                    height:'0.54rem'
                                },300)
                                sc.feedCount += 1;
                                $timeout(function(){
                                    angular.element('.alert-mask>.success-wrap').animate({
                                        width:0,
                                        height:0
                                    },200)
                                    angular.element('.alert-mask').hide();
                                    $('body').animate({'scrollTop':0});
                                },1000)
                                console.log("ok");
                            }
                        })
                    }
                }
                //判断滚动高度确定回到顶部是否出现
                $(window).on('scroll',function(){
                    if(document.body.scrollTop > 800){
                        angular.element('.go-top').css({"visibility":"visible","opacity":1})
                    }else{
                        angular.element('.go-top').css({"visibility":"hidden","opacity":0})
                    }
                })
                sc.goTopFn = function () {
                    $('body').animate({'scrollTop':0},300);
                }
                sc.closeFeed = function(){
                    sc.hideFeedback = true;
                    sc.showMail = false;
                    sc.showFeed = false;
                };
                sc.showMailFn = function () {
                    sc.hideFeedback = false;
                    sc.showMail = true;
                    sc.showFeed = false;
                };
                sc.showFeedFn = function () {
                    sc.hideFeedback = false;
                    sc.showMail = false;
                    sc.showFeed = true;
                    sc.emailCount -= 1;
                    sc.feedCount -= 1;
                };

                angular.element(ele).find('input').on('focus',function(){
                    angular.element(this).parent().css({'border-color':'#2dbe67'})
                })
                angular.element(ele).find('input').on('blur',function(){
                    angular.element(this).parent().css({'border-color':'#cdd1d4'})
                })
                angular.element(ele).find('textarea').on('focus',function(){
                    angular.element(this).css({'border-color':'#2dbe67'})
                })
                angular.element(ele).find('textarea').on('blur',function(){
                    angular.element(this).css({'border-color':'#cdd1d4'})
                })

                sc.emailBlur = function () {
                    sc.emailCount += 1;
                }
                sc.feedBlur = function () {
                    sc.feedCount += 1;
                }
            }
        }
    }])

    .directive('agent',['publicFactory','myFactory','$timeout',function (pFactory,myFactory,$timeout) {
        return {
            restrict:'E',
            scope:{
                houseId: '=',
            },
            replace:true,
            templateUrl:'../components/detail/agent.html?07072',
            link: function (sc,ele,attr) {
                var defaultAgent=[{
                    agent_id:"default",
                    agent_icon:"http://res.tigerz.nz/imgs/robot.png",
                    agent_mobile:"wjc@tigerz.nz",
                    agent_name:"TigerZ",
                    agent_url:""
                }];

                sc.agentCheck = false;
                //console.log(sc.houseId);
                sc.agentId = '';
                sc.agentMd = '';
                sc.agentCount = 0;
                //获取中介信息
                pFactory.getData({
                    url:'http://api.tigerz.nz/tigerspring/rest/getHouseBaseInfo/'+sc.houseId + '/en',
                    callBack: function (res) {
                        //console.log(res);
                        sc.agentList = res.data[0].agentList && res.data[0].agentList.length != 0 ? res.data[0].agentList : defaultAgent;
                        sc.agentId = sc.agentList[0].agent_id;
                    }
                });
                sc.agentChoice = function (n,id) {
                    //console.log(n,id);
                    myFactory.addClassName({
                        name:"select-circled",
                        itemSmall:".agent-block>.agent-detail>li>i",
                        num:n,
                        nextEvent:false
                    })
                    sc.agentId = id;
                }
                var canEmail = true;
                //联系中介
                sc.contactFn = function(s){
                    //console.log(s);
                    console.log(sc.agentCheck);
                    var userContact = angular.element('#agentUserContact').val();
                    var userName = angular.element('#agentUserName').val();
                    var userEmail = angular.element('#agentEmail').val();
                    var userTel = angular.element('#agentTel').val();
                    if(sc.agentId.length == 0){
                        angular.element('#serverBack').text('Please choice a agent');
                        return;
                    }
                    if(pFactory.stringTrim(userName).length == 0){
                        angular.element('#serverBack').text('Please input your name');
                        return;
                    }
                    if(pFactory.stringTrim(userEmail).length == 0){
                        angular.element('#serverBack').text('Please input your email');
                        return;
                    }
                    if(pFactory.stringTrim(userContact).length == 0){
                        angular.element('#serverBack').text('Please input your problem');
                        return;
                    }
                    if(!sc.agentCheck){
                        angular.element('#serverBack').text('Please input correct verification code');
                        return;
                    }
                    angular.element('#serverBack').text('');

                    if(s && canEmail){
                        console.log(sc.agentMd);
                        var agentEmail = {
                            "agentId":sc.agentId,
                            "desc":userContact,
                            "phone":userTel,
                            "email":userEmail,
                            "userName":userName,
                            "houseId":sc.houseId,
                            "md5":sc.agentMd
                        }
                        canEmail = false;
                        pFactory.postData({
                            url:'http://api.tigerz.nz/tigerspring/rest/sendEmail',
                            data: JSON.stringify(agentEmail),
                            callBack:function(res){
                                sc.hideFeedback = true;
                                angular.element('#agentTel').val('');
                                angular.element('#agentUserContact').val('');
                                angular.element('#agentEmail').val('');
                                angular.element('#agentUserName').val('');

                                angular.element('#feedMes').text('Your message has been sent successfully!')
                                angular.element('.alert-mask').show();
                                angular.element('.alert-mask>.success-wrap').animate({
                                    width:'4.7rem',
                                    height:'0.54rem'
                                },300)
                                sc.agentCount += 1;
                                $timeout(function(){
                                    angular.element('.alert-mask>.success-wrap').animate({
                                        width:0,
                                        height:0
                                    },200)
                                    angular.element('.alert-mask').hide();
                                    canEmail = true;
                                    $('body').animate({'scrollTop':0});
                                },1000)
                                console.log("ok");
                            }
                        })

                    }
                }

                angular.element(ele).find('input').on('focus',function(){
                    angular.element(this).parent().css({'border-color':'#2dbe67'})
                })
                angular.element(ele).find('input').on('blur',function(){
                    angular.element(this).parent().css({'border-color':'#cdd1d4'})
                })
                angular.element(ele).find('textarea').on('focus',function(){
                    angular.element(this).css({'border-color':'#2dbe67'})
                })
                angular.element(ele).find('textarea').on('blur',function(){
                    angular.element(this).css({'border-color':'#cdd1d4'})
                })

                sc.agentBlur = function () {
                    sc.agentCount += 1;
                }
            }
        }
    }])
    .directive('agentcn',['publicFactory','myFactory','$timeout',function (pFactory,myFactory,$timeout) {
        return {
            restrict:'E',
            scope:{
                houseId: '=',
            },
            replace:true,
            templateUrl:'../components/detail/agentcn.html?07072',
            link: function (sc,ele,attr) {
                var defaultAgent=[{
                    agent_id:"default",
                    agent_icon:"http://res.tigerz.nz/imgs/robot.png",
                    agent_mobile:"wjc@tigerz.nz",
                    agent_name:"TigerZ",
                    agent_url:""
                }];
                //console.log(sc.houseId);
                sc.agentId = '';
                sc.agentMd = '';
                sc.agentCount = 0;
                sc.agentCheck = false;
                sc.agentId = ''
                //获取中介信息
                pFactory.getData({
                    url:'http://api.tigerz.nz/tigerspring/rest/getHouseBaseInfo/'+sc.houseId + '/en',
                    callBack: function (res) {
                        //console.log(res);
                        sc.agentList = res.data[0].agentList && res.data[0].agentList.length != 0 ? res.data[0].agentList : defaultAgent;
                        sc.agentId = sc.agentList[0].agent_id;
                    }
                });
                sc.agentChoice = function (n,id) {
                    //console.log(n,id);
                    myFactory.addClassName({
                        name:"select-circled",
                        itemSmall:".agent-block>.agent-detail>li>i",
                        num:n,
                        nextEvent:false
                    })
                    sc.agentId = id;
                }
                var canEmail = true;
                sc.contactFn = function(s){
                    console.log(sc.agentCheck);
                    var userContact = angular.element('#agentUserContact').val();
                    var userName = angular.element('#agentUserName').val();
                    var userEmail = angular.element('#agentEmail').val();
                    var userTel = angular.element('#agentTel').val();
                    if(sc.agentId.length == 0){
                        angular.element('#serverBack').text('请选择一个经纪人');
                        return;
                    }
                    if(pFactory.stringTrim(userName).length == 0){
                        angular.element('#serverBack').text('请输入您的姓名');
                        return;
                    }
                    if(pFactory.stringTrim(userEmail).length == 0){
                        angular.element('#serverBack').text('请输入您的邮箱');
                        return;
                    }
                    if(pFactory.stringTrim(userContact).length == 0){
                        angular.element('#serverBack').text('请填写您的问题');
                        return;
                    }
                    if(!sc.agentCheck){
                        angular.element('#serverBack').text('请输入正确的验证码');
                        return;
                    }
                    angular.element('#serverBack').text('')
                    if(s && canEmail){
                        var agentEmail = {
                            "agentId":sc.agentId,
                            "desc":userContact,
                            "phone":userTel,
                            "email":userEmail,
                            "userName":userName,
                            "houseId":sc.houseId,
                            "md5":sc.agentMd
                        }
                        canEmail = false;
                        pFactory.postData({
                            url:'http://api.tigerz.nz/tigerspring/rest/sendEmail',
                            data: JSON.stringify(agentEmail),
                            callBack:function(res){
                                //alert('Message delivery success')
                                console.log(res);
                                sc.hideFeedback = true;
                                angular.element('#agentTel').val('');
                                angular.element('#agentUserContact').val('');
                                angular.element('#agentEmail').val('');
                                angular.element('#agentUserName').val('');

                                angular.element('#feedMes').text('提交咨询成功，请等待中介与您联系！')
                                angular.element('.alert-mask').show();
                                angular.element('.alert-mask>.success-wrap').animate({
                                    width:'4rem',
                                    height:'0.54rem'
                                },300)
                                sc.agentCount += 1;
                                $timeout(function(){
                                    angular.element('.alert-mask>.success-wrap').animate({
                                        width:0,
                                        height:0
                                    },200)
                                    angular.element('.alert-mask').hide();
                                    canEmail = true;
                                    $('body').animate({'scrollTop':0});
                                },1000)
                                console.log("ok");
                            }
                        })

                    }
                }

                angular.element(ele).find('input').on('focus',function(){
                    angular.element(this).parent().css({'border-color':'#2dbe67'})
                })
                angular.element(ele).find('input').on('blur',function(){
                    angular.element(this).parent().css({'border-color':'#cdd1d4'})
                })
                angular.element(ele).find('textarea').on('focus',function(){
                    angular.element(this).css({'border-color':'#2dbe67'})
                })
                angular.element(ele).find('textarea').on('blur',function(){
                    angular.element(this).css({'border-color':'#cdd1d4'})
                })
                sc.agentBlur = function () {
                    sc.agentCount += 1;
                }
            }
        }
    }])

    .directive('safeCode',['publicFactory', function (pFactory) {
        return {
            restrict:'E',
            templateUrl:'../components/detail/code.html?0707',
            scope:{
              rightCode:'=',
              md : '=',
              count : '='  
            },
            link: function (sc,ele) {
                sc.checkres = false;
                var val = '';
                sc.imgurl = '';
                sc.imgId = '';
                sc.md = '';
                getCode();

                sc.$watch('count', function () {
                    //console.log(sc.count);
                    refreshCode();
                })

                function refreshCode(){
                    angular.element(ele).find('input').val('');
                    sc.checkres = false;
                    getCode();
                }

                function getCode(){
                    pFactory.getData({
                        url:'http://api.tigerz.nz/tigerspring/rest/getVerificationCode',
                        callBack:function(data){
                            //console.log(data);
                            sc.imgurl = data.data.img;
                            sc.imgId = data.data.imgId
                        }
                    })
                }

                sc.checkCode = function () {
                    var temp = angular.element(ele).find('input').val().toLowerCase();
                    //console.log(temp);

                    if(temp.length == 4){
                        sc.checkres = true;
                        if(temp == val){
                            return
                        }else{
                            val = temp;
                            //请求 给出sc.rightCode的值
                            //if(temp == 'dwse'){
                            //    sc.rightCode = true;
                            //}else{
                            //    sc.rightCode = false;
                            //}
                            pFactory.postData({
                                url: 'http://api.tigerz.nz/tigerspring/rest/checkVerificationCode',
                                data: JSON.stringify({"imgId":sc.imgId,"code":val}),
                                callBack: function (data) {
                                    //console.log(data);
                                    if(data.data.status == 2){
                                        sc.rightCode = false;
                                    }else if(data.data.status == 1){
                                        sc.rightCode = true;
                                        sc.md = data.data.md5;
                                    }
                                }
                            })
                        }
                    }else{
                        sc.checkres = false;
                        return;
                    }

                }

                sc.changeCode = function () {
                    //console.log(11111111111111111111);
                    refreshCode();
                }
            }
        }
    }])
    .directive('safeCodecn',['publicFactory', function (pFactory) {
        return {
            restrict:'E',
            templateUrl:'../components/detail/codecn.html?0707',
            scope:{
                rightCode:'=',
                md : '=',
                count : '='
            },
            link: function (sc,ele) {
                sc.checkres = false;
                var val = '';
                sc.imgurl = '';
                sc.imgId = '';
                sc.md = '';
                getCode();

                sc.$watch('count', function () {
                    //console.log(sc.count);
                    refreshCode();
                })

                function refreshCode(){
                    angular.element(ele).find('input').val('');
                    sc.checkres = false;
                    getCode();
                }

                function getCode(){
                    pFactory.getData({
                        url:'http://api.tigerz.nz/tigerspring/rest/getVerificationCode',
                        callBack:function(data){
                            //console.log(data);
                            sc.imgurl = data.data.img;
                            sc.imgId = data.data.imgId
                        }
                    })
                }

                sc.checkCode = function () {
                    var temp = angular.element(ele).find('input').val().toLowerCase();
                    //console.log(temp);

                    if(temp.length == 4){
                        sc.checkres = true;
                        if(temp == val){
                            return
                        }else{
                            val = temp;
                            //请求 给出sc.rightCode的值
                            //if(temp == 'dwse'){
                            //    sc.rightCode = true;
                            //}else{
                            //    sc.rightCode = false;
                            //}
                            pFactory.postData({
                                url: 'http://api.tigerz.nz/tigerspring/rest/checkVerificationCode',
                                data: JSON.stringify({"imgId":sc.imgId,"code":val}),
                                callBack: function (data) {
                                    //console.log(data);
                                    if(data.data.status == 2){
                                        sc.rightCode = false;
                                    }else if(data.data.status == 1){
                                        sc.rightCode = true;
                                        sc.md = data.data.md5;
                                    }
                                }
                            })
                        }
                    }else{
                        sc.checkres = false;
                        return;
                    }

                }

                sc.changeCode = function () {
                    //console.log(11111111111111111111);
                    refreshCode();
                }

            }
        }
    }])
    
    .directive('alertMask', function () {
        return {
            restrict:'E',
            replace:true,
            templateUrl:"../components/common/alertMask.html?0705"
        }
    })
    .directive('alertMaskcn', function () {
        return {
            restrict:'E',
            replace:true,
            templateUrl:"../components/common/alertMaskcn.html?0705"
        }
    })

    .directive('tradeHouse',['publicFactory','tigerzDomain', function (pFactory,tdomain) {
        return {
            restrict:'E',
            //replace:true,
            scope:{
                houseid:'='
            },
            controller: function ($scope) {
                //console.log($scope);
                pFactory.getData({
                    url: 'http://' +tdomain + '/tigerspring/rest/getHouseBaseInfo/' + $scope.houseid + '/en',
                    callBack: function (data) {
                        //console.log(data);
                        $scope.soldHouse = pFactory.postData({
                            url : 'http://'+ tdomain +'/tigerspring/rest/getNearbyDealedHouse',
                            data : JSON.stringify({'basePoint':data.data[0].basePoint}),
                            callBack : function(data){
                                //console.log(data);
                                $scope.dealHouse = data.data;
                            }
                        });
                    }
                })
            },
            templateUrl:"../components/detail/tradehouse.html?123",
            link: function (sc,attr) {
                //console.log(sc.basepoint);
            }
        }
    }])
    .directive('scrollAgent', function () {
        return {
            restrict:'A',
            link:function (sc,ele) {
                angular.element(ele).on('click', function () {
                    var tempHeight = ($('.dai_item_note').offset().top - 100) + 'px';
                    $('body').animate({'scrollTop':tempHeight});
                })

            }
        }
    })

app
    .filter('highlight', function () {
        return function (text, search, caseSensitive) {
            if (!angular.isString(text)) {
                return text;
            }
            if (search || angular.isNumber(search)) {
                text = text.toString();
                search = search.toString();
                if (caseSensitive) {
                    return text.split(search).join('<b class="ui-match">' + search + '</b>');
                } else {
                    return text.replace(new RegExp(search, 'gi'), '<b class="ui-match">$&</b>');
                }
            } else {
                return text;
            }
        };
    })
    .filter('priceJuge',['publicFactory',function(p){
        return function (x,s) {
            if(x == -1){
                return '-'
            }
            return s + p.numFormat(Number(x).toFixed(0));
        }
    }])