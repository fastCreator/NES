var app = angular.module('app', ['ngRoute', 'ngCookies']);

app.controller('LayoutController', ['$scope', '$rootScope', '$http', '$cookies', '$window', function ($scope, $rootScope, $http, $cookies, $window) {

    var div = angular.element('.main>.left>a');
    $rootScope.myShop = {imgNumb: 0};
    $scope.title = "NES商城后台";
    //登录
    $rootScope.enteringId = $cookies.get('enteringId');
    $rootScope.entering_token = $cookies.get('entering_token');
    $scope.login = function () {
        $http.post('/shopuser/login', {
            "username": $scope.userName,
            "password": $scope.password
        })
            .success(function (res) {
                $cookies.put('enteringId', res.userId);
                $cookies.put('entering_token', res.id);
                $rootScope.enteringId = res.userId;
                $rootScope.entering_token = res.id;
                $scope.getInfo();
                div.removeClass('select ');
                $window.location.href = '/shopuser#/list';
            })
            .error(function () {
                alert("登录失败");
            });
    };
    $scope.logout = function () {
        $http.post('/shopuser/logout', {}, {
            params: {
                access_token: $cookies.get('entering_token')
            }
        }).success(function () {
            $cookies.remove('enteringId');
            $cookies.remove('entering_token');
            $cookies.remove('myShop_myId');
            $rootScope.enteringId = null;
            $rootScope.entering_token = null;
            $scope.shops = null;
            $scope.myShop_myId = false;
            $rootScope.myShop = null;
            div.removeClass('select');
        });
    };
    //查询用户相关信息
    $scope.getInfo = function () {
        $http.get('/shopuser/' + $rootScope.enteringId, {
            params: {
                access_token: $cookies.get('entering_token')
            }
        }).success(function (res) {
            $scope.myId = res.myId;
            $scope.allowNumb = res.allowNumb;
            $scope.numb = $scope.allowNumb.length;
            var where = new Array();
            for (var i = 0; i < res.myID.length; i++) {
                where.push({"myId": res.myID[i]});
            }
            $scope.getShop(where);

        });
    };
    //请求用户的所有商品信息
    $scope.getShop = function (where) {
        $http.get('/goods', {
            params: {
                filter: {"fields": {"myId": true, "id": true, "displayName": true, "price": true}, "where": {"or": where}}
            }
        })
            .success(function (res) {
                $scope.shops = res;
            });
    };
    //自动登录,刷新时获取信息
    if ($rootScope.enteringId) {
        $scope.getInfo();
    }
    //点击事件
    div.bind('click', function (event) {
        div.removeClass('select');
        $scope.reduceMessage = "";
        angular.element(event.target).addClass('select');
        angular.element('.message').text('');
    });
    //进入商品详情，可修改内容
    $scope.goDetailed = function (myId) {
        $cookies.put('myShop_myId', myId);
        $scope.myShop_myId = myId;
        $http.get('/goods/findOne', {
            params: {
                filter: {"where": {"myId": myId}}
            }
        })
            .success(function (res) {
                $rootScope.myShop = res;
                $window.location.href = '/shopuser#/revise';
            })
            .error(function () {
                $window.location.href = '/shopuser#/add';
            });
    };
    {
        //点击显示商品属性
        $scope.paramsShow = function (index) {
            angular.element('.none' + index).toggle();
        };
        //添加副属性数量
        $scope.addClassify = function () {
            $rootScope.myShop.classify.push(["父属性", "子属性"]);
        };
        //删除副属性
        $scope.reduceClassify = function (index) {
            $rootScope.myShop.classify.splice(index, 1);
        };
        //添加副属性
        $scope.addClass = function (index) {
            $rootScope.myShop.classify[index].push("子属性");
        };
        //表单提交
        $scope.submit = function (istrue) {
            angular.element('.message').text("正在生上传>>>>>");
            if (istrue) {
                $cookies.put('myShop', $rootScope.myShop);
            }
            else {
                $cookies.put('myShop_myId', $rootScope.myShop.myId);
            }
        };
    }
    {
        //表单数据控制
        //删除
        $scope.removeParameter = function (index) {
            $rootScope.myShop.parameter.splice(index, 2);
        };
        //添加键值对
        $scope.addParameter = function (index) {
            $rootScope.myShop.parameter[index].push("请输入属性名");
            $rootScope.myShop.parameter[index].push("请输入属性值");
        };
        //删除键值对
        $scope.removeParameterArray = function (parentIndex, index) {
            $rootScope.myShop.parameter[parentIndex].splice(index, 2);
        };
        //添加
        $scope.pushParameter = function () {
            $rootScope.myShop.parameter.push("请输入属性类别");
            $rootScope.myShop.parameter.push(["请输入属性名", "请输入属性值"]);
        };
    }
}]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/list', {templateUrl: '/views/app/list', controller: ['$scope',
            function ($scope) {
                angular.element('.main>.left>a').eq(0).addClass('select');
                $scope.getInfo();
            }
        ]}).
        when('/add', {templateUrl: '/views/app/add', controller: ['$rootScope', function ($rootScope) {
            angular.element('.main>.left>a').removeClass('select');
            angular.element('.main>.left>a').eq(2).addClass('select');

            $rootScope.myShop = {
                "myId": "",
                "D3Numb": 0,
                "searchText": "",
                "imgNumb": 5,
                "displayName": "",
                "introduce": "",
                "price": 1,
                "link": [""],
                "classify": [
                ],
                "classifyNumb": ["", ""],
                "select": "",
                "shopDetails": ["", 1],
                "parameter": ["请添加属性类型", ["请添加属性名", "请添加属性值"]]
            };

        }]}).
        when('/revise', {templateUrl: '/views/app/revise', controller: ['$scope', '$cookies', function ($scope, $cookies) {
            $scope.goDetailed($cookies.get('myShop_myId'));
            angular.element('.main>.left>a').removeClass('select');
            angular.element('.main>.left>a').eq(1).addClass('select');
        }]}).
        when('/express', {templateUrl: '/views/app/express', controller: ['$scope', '$http', function ($scope, $http) {
            angular.element('.main>.left>a').removeClass('select');
            angular.element('.main>.left>a').eq(4).addClass('select');
            $http.get('/shopuser/express').success(function (data) {
                $scope.data = data;
                $scope.none = function (event) {
                    var div = angular.element(event.target);
                    if (div.attr("class").search(/row/) == -1)
                        div = div.parent();
                    div.nextAll().toggleClass('none');
                };
                $scope.none1 = function (event) {
                    var div = angular.element(event.target);
                    if (div.attr("class").search(/row/) == -1)
                        div = div.parent();
                    div.nextAll().toggleClass('none1');
                };
                $scope.deleteOrder = function (event, index) {
                    var r = confirm("是否确认删除！");
                    if (r) {
                        for (var i = 0; i < $scope.data[index].shop.length; i++) {
                            $scope.data[index].shop[i].hasPost = true;
                        }
                        $http.post('/shopuser/express', {'id': $scope.data[index].id, 'shop': $scope.data[index].shop});
                        $scope.data.splice(index, 1);
                    }
                    $scope.none(event);
                };
                $scope.deleteShop = function (pi, ci) {
                    var r = confirm("是否确认删除！");
                    if (r) {
                        $scope.data[pi].shop[ci].hasPost = true;
                        $http.post('/shopuser/express', {'id': $scope.data[pi].id, 'shop': [$scope.data[pi].shop[ci]]});
                        $scope.data[pi].shop.splice(ci, 1);
                    }
                };
            });
        }]}).
        when('/reduce', {templateUrl: '/views/app/reduce', controller: ['$scope', '$http', function ($scope, $http) {
            angular.element('.main>.left>a').removeClass('select');
            angular.element('.main>.left>a').eq(3).addClass('select');
            $scope.reduceShop = function () {
                var ID = angular.element('.reduceID').val();
                $http.post('/shopuser/deletShop', {
                    "ID": ID
                })
                    .success(function () {
                        $scope.reduceMessage = "删除成功";
                    }).error(function () {
                        $scope.reduceMessage = "未找到改ID";
                    });
            }
        }]}).
        otherwise({redirectTo: '/list'});
}]);
app.directive('imgs', ['$rootScope', function ($rootScope) {
    return{
        restrict: 'E',
        template: function (elemt, attrs) {
            var tem = "";
            for (var i = 1; i <= attrs.minNumb; i++) {
                tem += "<input type='file' name='" + "_" + i + attrs.name + "'" + "'  accept='.jpg '/>";
            }
            for (var i = parseInt(attrs.minNumb) + 1; i <= attrs.maxNumb; i++) {
                tem += "<input type='file' name='" + "_" + i + attrs.name + "' ng-if='" + i + "<=" + attrs.bindNumb + "' accept='.jpg '/>";
            }
            return tem;
        }
    }
}])
;
//调节宽度

$(window).load(
    function () {
        if ($(window).width() < 1310) {
          $(".view").css("width", "960px");
        }
    }
);