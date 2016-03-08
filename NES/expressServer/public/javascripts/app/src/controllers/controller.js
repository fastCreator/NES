var layoutController = angular.module('layoutController', ['ngCookies', 'selectAddress']);
var indexController = angular.module('indexController', []);
var goodsController = angular.module('goodsController', ['ngCookies']);
var myGoodController = angular.module('myGoodController', ['ngCookies']);
var shoppingCarController = angular.module('shoppingCarController', []);
layoutController.controller('LayoutController', ['$scope', '$rootScope', '$cookies', '$http', '$state', function ($scope, $rootScope, $cookies, $http, $state) {
    //初始化用户信息
    $rootScope.title = "欢迎来到NES购物商城";
    //运费
    $rootScope.fare = 20;
    $rootScope.username = $cookies.get('username');
    $scope.emailVerified = $cookies.get('emailVerified');
    // 登出浏览器时
//    if (!$scope.remember) {
//        angular.element(window).on('beforeunload', function (event) {
//
//            if ($scope.emailVerified) {
//                $scope.loginOut();
//
//            }
//        });
//    }
    //退出登录
    $scope.loginOut = function () {
        $http.post('/logout', {}, {
            params: {
                access_token: $cookies.get('access_token')
            }
        });
        $rootScope.username = null;
        $scope.emailVerified = null;
        $cookies.remove('userId');
        $cookies.remove('access_token');
        $cookies.remove('username');
        $cookies.remove('emailVerified');
        $rootScope.items = null;
        //购物车时退出登录
        if ($rootScope.state == 'shoppingCar') {
            if ($rootScope.items == null || $rootScope.items == {} || $rootScope.items.length == 0)
                $state.go("shoppingCar.shoppingcarEmpty");
        }
    };
    {
        //搜索栏方法
        $rootScope.getSearch = function () {
            if (angular.element('#text').val()) {
                $rootScope.searchText = angular.element('#text').val();
            }
            $http.get('/goods', {
                params: {
                    filter: {"fields": {"myId": true, "select": true, "displayName": true, "price": true, "introduce": true}, "where": {"searchText": {"like": $scope.searchText}}}
                }
            })
                .success(function (res) {
                    if (res == [] || res == null || res.length == 0) {
                        $rootScope.shops = false;
                    } else {
                        $rootScope.shops = res;
                    }
                    ;
                    if (res.length == 0) {
                        angular.element('footer').css({'position': 'absolute', 'bottom': '-430px'});
                    } else if (res.length < 5) {
                        angular.element('footer').css({'position': 'absolute', 'bottom': '-140px'});
                    } else {
                        angular.element('footer').css({'position': 'absolute', 'bottom': '-85px'});
                    }
                });
        }
        //收索兰回车
        $rootScope.search_key = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $rootScope.getSearch();
                $state.go("goods");
            }
        }
    }
    {
        //购物车
        if ($scope.emailVerified) {
            //初始化购物车
            var url = "users" + "/" + $cookies.get('userId');
            $http.get(url, {
                params: {
                    filter: {"fields": {"shopping": true}},
                    access_token: $cookies.get('access_token')
                }
            }).success(function (res) {
                if (res.shopping)
                    $rootScope.items = res.shopping;
                else {
                    $rootScope.items = [];
                }
            });
        }

        //监视购物车变化
        $rootScope.$watch('items', function () {
            if ($rootScope.username != null) {
                //向服务器提交修改items
                var url = "users" + "/" + $cookies.get('userId');
                $http.post(url, {
                    "shopping": $rootScope.items
                }, {
                    params: {
                        access_token: $cookies.get('access_token')
                    }
                });
            }
        }, true);
    }
    //搜索3D
    {
        $scope.go3Dshop = function () {
            $rootScope.searchText = '3D';
            angular.element('#text').val($rootScope.searchText);
            $cookies.put('searchText', $rootScope.searchText);
            $rootScope.title = $rootScope.searchText + "商品展示_NES商城";
            $rootScope.getSearch();
            $state.go("goods");
        }
    }
}]);
indexController.controller('IndexController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.state = 'index';
}]);
goodsController.controller('GoodsController', ['$scope', '$rootScope', '$state', '$cookies', function ($scope, $rootScope, $state, $cookies) {
    $rootScope.state = 'goods';
    //刷新goods界面为历史cookies
    if (!$rootScope.searchText) {
        $rootScope.searchText = $cookies.get('searchText');
        angular.element('#text').val($rootScope.searchText);
        $rootScope.getSearch();
    }
//    $scope.addShop = function (index) {
//        if ($scope.emailVerified) {
//            var myId = $rootScope.shops[index].myId;
//            var price = $rootScope.shops[index].price;
//            var info1 = $rootScope.shops[index].select;
//            $rootScope.items.push({'myId': myId, 'info': info1, 'price': price, 'checked': true, 'numb': 1});
//        }
//        else {
//            alert("请登录");
//        }
//    };
    $scope.goShopdetails = function (index) {
        $rootScope.myId = $rootScope.shops[index].myId;
        $cookies.put('myId', $rootScope.myId);
        $state.go("goods.goodDetailed");
    };
}]);
myGoodController.controller('MyGoodController', ['$scope', '$rootScope', '$state', '$http', 'imgBoost', '$cookies','$timeout', function ($scope, $rootScope, $state, $http, imgBoost, $cookies,$timeout) {
    $rootScope.state = 'myGoodController';
    $scope.getMyShop = function () {
        $http.get('/goods/findOne', {
            params: {
                filter: {"where": {"myId": $cookies.get('myId')}}
            }
        })
            .success(function (res) {
                $rootScope.myId = $cookies.get('myId');
                $scope.myshop = res;
                imgBoost.init($scope.myshop.imgNumb - 5);
                $rootScope.imgMyID = $scope.myshop.shopDetails[0];
                $rootScope.imgCount = $scope.myshop.shopDetails[1];
                $state.go("goods.goodDetailed.page1");
            });
    };
    $scope.getMyShop();
    $scope.addShop = function () {
        function goShopping(){
            var navE = angular.element("#ng-nav-bar .center");
            var shopE = angular.element(".shop #Goshop");
            var top = navE.offset().top - shopE.offset().top + 30;
            var left = navE.offset().left - shopE.offset().left;
            shopE.css("visibility", "visible");
            shopE.animate(
                {top: top + "px", left: left + "px", opacity: "0"},
                {   duration: 1000,
                    queue: false,
                    complete: function () {
                        shopE.css({"top": "0", "left": "0", "opacity": "1", "visibility": "hidden"});
                    }
                });
        }
        if (!$scope.emailVerified) {
            alert("请登录");
        }
        else {
            var info2 = "";
            var go = true;
            if ($scope.myshop.classify && $scope.myshop.classify.length != 0) {
                if ($scope.classfiy) {
                    info2 += " " + $scope.classfiy
                }
                else {
                    alert("请选择" + $scope.myshop.classifyNumb[0]);
                    go = false;
                }
                if (go) {
                    if ($scope.class) {
                        info2 += " " + $scope.class
                    } else {
                        if ($scope.myshop.classifyNumb[1]) {
                            alert("请选择" + $scope.myshop.classifyNumb[1]);
                            go = false;
                        }
                    }
                    if (go && $scope.myshop.select) {
                        info2 = $scope.myshop.select + " " + info2;
                    }
                }
            }
            if (go) {
                goShopping();
                $timeout(function() {
                    var numb = angular.element('.goodsDetailed .right .numbs').val();
                    $rootScope.items.push({"myId": $scope.myshop.myId, "info": info2, "price": $scope.myshop.price, "checked": true, "numb": numb});
                }, 1000);
            }
        }
    }
    //颜色选择
    $scope.init = function (event) {
        if (event.link == $rootScope.myId) {
            angular.element('.img').eq(event.$index - 1).addClass('select');
        }
    };
    //classfiy选择
    $scope.classifyNumb = 0;
    $scope.select = function (index, event) {
        var elem = angular.element(event.target);
        $scope.classifyNumb = index;
        $scope.classfiy = elem.text();
        angular.element('.class>span>span').removeClass('select');
        elem.addClass('select');
    };
    $scope.select2 = function (event) {
        if ($scope.classfiy != null) {
            var elem = angular.element(event.target);
            $scope.class = elem.text();
            angular.element('.class2>span>span').removeClass('select');
            elem.addClass('select');
        }
    };
    //点击link是触发到其他相关商品
    $scope.goLink = function (event) {
        $cookies.put('myId', event.target.name);
        $scope.getMyShop();
        $scope.myshop = null;
    };
}]);
shoppingCarController.controller('ShoppingCarController', ['$cookies', '$http', '$timeout', '$state', '$scope', '$rootScope', function ($cookies, $http, $timeout, $state, $scope, $rootScope) {
    $rootScope.state = 'shoppingCar';
    {
        //页面后退时，页面控制
        if (!$rootScope.items || $rootScope.items.length == 0)
            $state.go("shoppingCar.shoppingcarEmpty");
    }
    {
        //去商品详情
        $scope.toshop = function (myId) {
            $rootScope.myId = myId;
            $cookies.put('myId', myId);
            $state.go("goods.goodDetailed");
        }
    }
//总价格
    $scope.allPrice = function () {
        var all = 0;
        for (var i = 0; i < $rootScope.items.length; i++) {
            if ($rootScope.items[i].checked)
                all += $rootScope.items[i].numb * $rootScope.items[i].price
        }
        all = all.toFixed(2);
        return parseFloat(all);
    };
    {
        //选择按钮
        $scope.checkAll = function () {
            for (var i = 0; i < $rootScope.items.length; i++) {
                if (!$rootScope.items[i].checked) {
                    return false;
                }
            }
            return true;

        };
        //全选按钮
        $scope.checkChange = function () {
            if ($scope.checkAll()) {
                for (var i = 0; i < $rootScope.items.length; i++) {
                    $rootScope.items[i].checked = false;
                }
            } else {
                for (var i = 0; i < $rootScope.items.length; i++) {
                    $rootScope.items[i].checked = true;
                }
            }
        };
    }

    {
        $scope.add = function (numb) {
            $rootScope.items[numb].numb++;
        };
        $scope.reduce = function (numb) {
            if ($rootScope.items[numb].numb > 0)
                $rootScope.items[numb].numb--;
        };
        $scope.delete = function (numb) {
            $rootScope.items.splice(numb, 1);
            if ($rootScope.items.length == 0) {
                $state.go("shoppingCar.shoppingcarEmpty");
            }
        };
    }
}]);