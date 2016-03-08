var app = angular.module('app', ['ngCookies']);
app.constant('authUrl', '/login');
app.constant('userUrl', '/users');
app.controller('LayoutController', [ '$scope', '$http', '$cookies', '$window', '$rootScope',
    function ($scope, $http, $cookies, $window, $rootScope) {
        $scope.title = "欢迎登陆_NES商城";
        {
            //历史记录跳到首页
            if ($cookies.get('emailVerified')) {
                $window.location.href = '/';
            }
        }
        $scope.data = {
            "username": "",
            "password": ""
        };

        $scope.login = function () {
            $http.post("/login", $scope.data, {
                withCredentials: true
            })
                .success(function (res) {
                    if ($scope.remember) {
                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                    }
                    else {
                        var expireDate = null;
                    }

                    $cookies.put('userId', res.userId, {'expires': expireDate});
                    $cookies.put('access_token', res.id, {'expires': expireDate});
                    $cookies.put('username', $scope.data.username, {'expires': expireDate});
                    $scope.email(expireDate);
                })
                .error(function (res) {
                    alert("用户名或密码错误");
                });
        };
        $scope.email = function (expireDate) {
            var url = "users" + "/" + $cookies.get('userId');
            $http.get(url, {
                params: {
                    filter: {"fields": {"emailVerified": true}},
                    access_token: $cookies.get('access_token')
                }
            })
                .success(function (data, status, headers, config) {
                    if (data.emailVerified) {
                        $cookies.put('emailVerified', true, {'expires': expireDate});
                        $window.location.href = '/';
                    } else {
                        alert("请验证邮箱");
                    }
                })
                .error(function () {
                    alert("连接loopBack失败");
                });
        };
    }
]);