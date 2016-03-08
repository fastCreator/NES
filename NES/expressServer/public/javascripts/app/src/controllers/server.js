app.service('aServer', ['$rootScope', '$state', '$cookies', function ($rootScope, $state, $cookies) {
    this.setA = function () {
        angular.element('.search a').bind('click', function (event) {
            $rootScope.searchText = angular.element(event.target).html();
            $rootScope.$apply();
            $cookies.put('searchText',$rootScope.searchText);
            $rootScope.title = $rootScope.searchText + "推荐_NES商城";
            $rootScope.getSearch();
            $state.go("goods");
        });
    }
}]);
app.service('imgBoost', ['$rootScope', '$state', function ($rootScope, $state) {
    this.init = function (numb) {
        {
            //图片放大
            angular.element('.imgMain').bind('mousemove', function (event) {
                var x = event.offsetX + "px", y = event.offsetY + "px";
                angular.element('.boost>img').css({"transform-origin": x + " " + y, "-ms-transform-origin": x + " " + y, "-webkit-transform-origin": x + " " + y, "-moz-transform-origin": x + " " + y, "-o-transform-origin": x + " " + y});

            });
        }
        {
            //图片左右移动
            var x = 0;
            var left = angular.element('#imgLeft');
            var right = angular.element('#imgRight');
            left.bind('click', function () {
                if (x > numb * -67) {
                    angular.element('#imgul>ul').css({"transform": "translateX(" + (x -= 67) + "px)"});
                    right.css({'color': '#999999'});
                }
                else {
                    left.css({'color': '#DDDDDD'});
                }
            });
            right.bind('click', function () {
                if (x < 0) {
                    angular.element('#imgul>ul').css({"transform": "translateX(" + (x += 67) + "px)"});
                    left.css({'color': '#999999'});
                }
                else {
                    right.css({'color': '#DDDDDD'});
                }
            });
        }
        {
            //图片选择
            var elem = angular.element('#imgul>ul>li');
            elem.bind('mouseover', function (event) {
                elem.removeClass('selectImg');
                if (event.target.nodeName == "LI") {
                    var target = event.target;
                }
                else {
                    var target = event.target.parentNode;
                }
                angular.element(target).addClass('selectImg');
                var src = angular.element(target.childNodes[0]).attr("src");
                angular.element('.imgMain>img').attr("src", src);
                angular.element('.boost>img').attr("src", src);

            });
        }
        {
            //按钮加减
            var numbs = angular.element('.numbs');
            angular.element('.add').bind('click', function () {
                numbs.val(parseInt(numbs.val()) + 1);
            });
            angular.element('.reduce').bind('click', function () {
                if (parseInt(numbs.val()) > 1)
                    numbs.val(parseInt(numbs.val()) - 1);
            })
        }
        {
            //换页
            var li = angular.element('.paging>ul>li');

            li.bind('click', function (event) {
                li.removeClass('clicked');
                angular.element(event.target).addClass('clicked');
            });
        }
        {
            //page按钮FIX
          //  angular.element('.pageClick').css('position','fixed');
        }
    }
}]);