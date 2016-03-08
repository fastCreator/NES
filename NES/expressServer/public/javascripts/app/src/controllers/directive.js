layoutController.directive('logo', function () {
    return{
        restrict: 'E',
        template: '<div class="logo" title="回到首页" ui-sref="index"><img id="logoIMG" src="/images/logo.png"/><span id="logoFont">购物商城</span></div>',
        replace: true
    }
});
layoutController.directive('search', function () {
    return{
        restrict: 'E',
        template: '<div id="search"><form><span class="glyphicon glyphicon-search"></span><input type="text" id="text" ng-model="searchText" ng-keydown="search_key($event)"><input id="buttom" type="button" value="搜索" ui-sref="goods" ng-click="getSearch()"></form></div>',
        replace: true


    }
});
layoutController.directive('mynav', function () {
    return{
        restrict: 'E',
        templateUrl: '/views/partials/navBar',
        replace: true
    }
});
layoutController.directive('goodslist', ['aServer', function (aServer) {
    return{
        restrict: 'E',
        templateUrl: '/views/partials/goodsList',
        replace: true,
        link: function () {
            aServer.setA();
        }
    }
}]);

layoutController.directive('location', function () {
    return{
        restrict: 'E',
        template: '<input id="location" select-address p="p" c="c" a="a" d="d" ng-model="xxx" placeholder="请选择所在地" type="text" class="form-control" ng-required="{true}"/>',
        replace: true,
        link: function () {
            angular.bootstrap(document, ['layoutController']);
        }
    }
});
layoutController.directive('login', function () {
    return{
        restrict: 'E',
        template: '<a href="/login", ng-if="!emailVerified">请登录</a><a ng-click="loginOut()" ng-if="emailVerified">{{username}}:退出登录</a>'

    }
});
layoutController.directive('pageimgs', ['$rootScope', function ($rootScope) {
    return{
        restrict: 'E',
        template: function () {
            var tem = "";
            for (var i = 0; i < $rootScope.imgCount; i++) {
                tem += "<img src='/images/shops/" + $rootScope.imgMyID + "_" + (i + 1) + '.jpg' + "'/>";
            }
            return tem;
        }
    }
}]);

