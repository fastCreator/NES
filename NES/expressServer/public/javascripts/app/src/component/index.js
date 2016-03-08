$(function () {
    //3D相册启动
    $('#dg-container').gallery({
        autoplay: true
    });
    //11个floor定位
    for (var i = 1; i < 11; i++) {
        $("#leftNav>li:nth-child(" + i + ")").selectable(
            {stop: function (event, ui) {
                if (!$("html,body").is(':animated')) {
                    var a = event.target.getAttribute("name");
                    $('html,body').animate({scrollTop: $("#floor" + a).offset().top}, 500);
                }
            }
            });
    }
    $(".selectable-shopping-cart").selectable(
        {stop: function () {
            goShoppingCar();
        }
        });
    for (var i = 1; i < 11; i++) {
        $("#selectable-floor" + i + "1").selectable(
            {stop: function (event) {
                if (event.target.id.length == 18)
                    var a = event.target.id.charAt(16);
                else
                    var a = event.target.id.substr(16, 2);
                $("#floor" + a + ">.floor-main").removeClass("show");
                $("#floor" + a + " .tab>li:nth-child(2)").removeClass("on");
                $("#floor" + a + " .tab>li:nth-child(1)").addClass("on");
            }
            });
        $("#selectable-floor" + i + "2").selectable(
            {stop: function (event) {
                if (event.target.id.length == 18)
                    var a = event.target.id.charAt(16);
                else
                    var a = event.target.id.substr(16, 2);
                $("#floor" + a + ">.floor-main").addClass("show");
                $("#floor" + a + " .tab>li:nth-child(1)").removeClass("on");
                $("#floor" + a + " .tab>li:nth-child(2)").addClass("on");
            }
            });
    }
    scrollShow();
    $(window).on('scroll', function () {
        scrollShow();
    });
});
function scrollShow() {
    if ($(window).scrollTop() <= 550) {
        $("#leftNav").addClass("navShow");
    }
    else {
        $("#leftNav").removeClass("navShow");
    }
};
