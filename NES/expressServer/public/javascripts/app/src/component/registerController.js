var app = angular.module('app', ['ngCookies']);
app.controller('LayoutController', ['$scope', '$http', '$window', '$cookies', '$rootScope',
    function ($scope, $http, $window, $cookies, $rootScope) {
        $scope.title = "欢迎注册_NES商城";
        $scope.data = {
            "username": "",
            "password": "",
            "email": ""
        }

        $scope.register = function () {
            $scope.myForm.$invalid = true;
            var username = angular.element('.username').val();
            var email = angular.element('.email').val();
            if (username) {
                $scope.username = username;
            }
            if (email) {
                $scope.email = email;
            }
            $http.post("/register", $scope.data)
                .success(function (data, status, headers, config) {
                    alert("注册成功请验证邮箱");
                    $window.location.href = '/login';
                })
                .error(function (data, status, headers, config) {
                    var message = data;
                    if (/Email already exists/.test(message)) {
                        alert("邮箱已经存在");
                    }
                    else if (/`email` Must provide a valid/.test(message)) {
                        alert("邮箱格式不对");
                    }
                    else if (/User already exists/.test(message)) {
                        alert("用户名已存在");
                    } else {
                        alert("不能发送邮件-所有收件人被拒绝");
                    }
                });
        }
    }
]);