function shopingNavChange(i) {
    for (var j = 1; j <= i; j++) {
        $(".cart-progress>ul>li:nth-child(" + (j - 1) + ")").addClass("go");
        $(".cart-progress>ul>li:nth-child(" + j + ")").removeClass("begin");
        $(".cart-progress>ul>li:nth-child(" + j + ")").addClass("finish");
        $(".cart-progress>ul>li:nth-child(" + (j - 1) + ")>a").attr("href", "/#/shoppingCar" + (j-1));
    }

    for (var j = i; j < 4; j++) {
        $(".cart-progress>ul>li:nth-child(" + j + ")").removeClass("go");
        $(".cart-progress>ul>li:nth-child(" + (j + 1) + ")").removeClass("finish");
        $(".cart-progress>ul>li:nth-child(" + (j + 1) + ")").addClass("begin");
        $(".cart-progress>ul>li:nth-child(" + j + ")>a").removeAttr("href");
    }
};