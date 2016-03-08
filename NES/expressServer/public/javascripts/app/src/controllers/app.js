var app = angular.module('app', ['ui.router', 'ngAnimate', 'layoutController', 'indexController', 'shoppingCarController', 'goodsController', 'myGoodController', 'ngCookies']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/index');

    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: '/views/partials/index',
            controller: 'IndexController'

        })
        .state('goods', {
            url: '/goods',
            views: {
                '': {
                    templateUrl: '/views/partials/goods',
                    controller: 'GoodsController'
                },
                'main@goods': {
                    templateUrl: '/views/partials/goodsMainList'

                }
            }

        })
        .state('goods.goodDetailed', {
            url: '/detailed',
            views: {
                'main@goods': {
                    templateUrl: '/views/partials/goodDetailed',
                    controller: 'MyGoodController'
                }
            }
        })
        .state('goods.goodDetailed.page1', {
            templateUrl: '/views/partials/shopPage1'
        })
        .state('goods.goodDetailed.page2', {
            templateUrl: '/views/partials/shopPage2'
        })
        .state('goods.goodDetailed.page3', {
            templateUrl: '/views/partials/shopPage3'
        })
        .state('goods.goodDetailed.page4', {
            templateUrl: '/views/partials/shopPage4'
        })
        .state('goods.goodDetailed.page5', {
            templateUrl: '/views/partials/shopPage5'
        })
        .state('shoppingCar', {
            url: '/shoppingCar',
            views: {
                '': {
                    templateUrl: '/views/partials/shoppingCar'
                },
                'shoppingcar@shoppingCar': {
                    templateUrl: '/views/partials/shoppingCarEmpty',
                    controller: ['$rootScope', '$state', function ($rootScope, $state) {
                        $rootScope.state = 'shoppingCar';
                        if ($rootScope.items && $rootScope.items.length != 0)
                            $state.go("shoppingCar.shoppingcarFull1");
                    }]
                }
            }
        })
        .state('shoppingCar.shoppingcarEmpty', {
            url: 'Empty',
            views: {
                'shoppingcar@shoppingCar': {
                    templateUrl: '/views/partials/shoppingCarEmpty',
                    controller: 'ShoppingCarController'
                }
            }
        })
        .state('shoppingCar.shoppingcarFull1', {
            url: '1',
            views: {
                'shoppingcar@shoppingCar': {
                    templateUrl: '/views/partials/shoppingCarFull1',
                    controller: 'ShoppingCarController'
                }
            }
        })
        .state('shoppingCar.shoppingcarFull2', {
            url: '2',
            views: {
                'shoppingcar@shoppingCar': {
                    templateUrl: '/views/partials/shoppingCarFull2',
                    controller: ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
                        $scope.buy = function () {
                            $rootScope.name = $scope.name;
                            $rootScope.remarks = $scope.remarks;
                            $rootScope.phone = $scope.phone;
                            $state.go("shoppingCar.shoppingcarFull3");
                        }
                    }]
                }
            }
        })
        .state('shoppingCar.shoppingcarFull3', {
            url: '3',
            views: {
                'shoppingcar@shoppingCar': {
                    templateUrl: '/views/partials/shoppingCarFull3',
                    controller: ['$rootScope', '$scope', '$state', '$http', function ($rootScope, $scope, $state, $http) {
                        if (!$rootScope.name || !$rootScope.phone) {
                            $state.go("shoppingCar.shoppingcarFull2");
                        }
                        $scope.shop;
                        $scope.shop1;
                        var time = new Date().getTime();
                        $http.get('/users/getMoney').success(function (data) {
                            $scope.myMoney = data.price;
                        });
                        $scope.allPrice = function () {
                            //购买商品
                            $scope.shop = new Array(0);
                            //剩余商品
                            $scope.shop1 = new Array(0);
                            var all = 0;
                            for (var i = 0; i < $rootScope.items.length; i++) {
                                if ($rootScope.items[i].checked) {
                                    all += $rootScope.items[i].numb * $rootScope.items[i].price;
                                    $rootScope.items[i].hasPost = false;
                                    $rootScope.items[i].id = time + "" + i;
                                    $scope.shop.push($rootScope.items[i]);
                                }
                                else {
                                    $scope.shop1.push($rootScope.items[i]);
                                }
                            }
                            all = all.toFixed(2);
                            return parseFloat(all);
                        };
                        $rootScope.address = $rootScope.p;
                        if ($rootScope.c) {
                            $rootScope.address += "/" + $rootScope.c;
                            if ($rootScope.a) {
                                $rootScope.address += "/" + $rootScope.a;
                                if ($rootScope.d) {
                                    $rootScope.address += "/" + $rootScope.d;
                                }
                            }
                        }
                        $scope.buy = function () {
                            if ($scope.shop.length != 0) {
                                if ($scope.myMoney - $scope.allPrice() >= 0) {
                                    $http.post('/users/buy', {
                                        "password": $scope.password,
                                        "shops": $scope.shop,
                                        "fare": $rootScope.fare,
                                        "name": $rootScope.name,
                                        "phone": $rootScope.phone,
                                        "address": $rootScope.address,
                                        "remarks": $rootScope.remarks,
                                        "username": $rootScope.username
                                    }).success(function () {
                                        $rootScope.items = $scope.shop1;
                                        $state.go("shoppingCar.shoppingcarFull4");
                                    }).error(function () {
                                        $scope.message = "密码错误,请重新输入";
                                    });
                                } else {
                                    $scope.message = "账户余额不足，无法购买";
                                }
                            }
                            else {
                                $scope.message = "请选择商品后购买";
                            }
                        }
                    }]
                }
            }
        })
        .state('shoppingCar.shoppingcarFull4', {
            url: '4',
            views: {
                'shoppingcar@shoppingCar': {
                    templateUrl: '/views/partials/shoppingCarFull4',
                    controller: ['$scope', function ($scope) {
                        // $scope.message="购买成功";
                    }]
                }
            }
        })
    ;
}]);