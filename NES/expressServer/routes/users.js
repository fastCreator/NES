var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');
var netHelpers = require('netHelpers');
//检查数据
function checkdata(data) {
    if (!data.fare || typeof  data.fare != 'number') {
        return false;
    }
    if (!data.name || typeof  data.name != 'string') {
        return false;
    }
    if (!data.phone || typeof  data.phone != 'string') {
        return false;
    }
    if (!data.address || typeof  data.address != 'string') {
        return false;
    }
    if (!data.username || typeof  data.username != 'string') {
        return false;
    }
    if (data.remarks && typeof  data.remarks != 'string') {
        return false;
    }
    if (!data.shops || data.shops.constructor != Array) {
        return false;
    }
    return true;
}

router.post('/buy', function (req, res) {
    //求密码
    var password = crypto.createHash('md5').update(req.body.password).digest('hex');
    //获取密码
    var url = "/api/users/" + req.cookies.userId + "?filter=%7B%22fields%22%3A%7B%22alipay%22%3Atrue%2C%22price%22%3Atrue%7D%7D&access_token=" + req.cookies.access_token;
    netHelpers.performAjaxRequest('localhost', 5500, url, 'GET', null, function (resultObject) {
        if (!checkdata(req.body) || password != resultObject.alipay) {
            res.status(500).send();
        } else {
            //求商品价格
            var items = req.body.shops;
            var price = 0;
            for (var i = 0; i < items.length; i++) {
                price += items[i].numb * items[i].price
            }
            price = price.toFixed(2);
            price = parseFloat(price) + req.body.fare;
            if (resultObject.price < price) {
                res.status(500).send();
                return;
            }
            else {
                //减除账户余额
                netHelpers.performAjaxRequest('localhost', 5500, url, 'PUT', {"price": resultObject.price - price}, function (resultObject) {
                });
                var data = {
                    "name": req.body.name,
                    "address": req.body.address,
                    "remarks": req.body.remarks,
                    "phone": req.body.phone,
                    "shops": req.body.shops,
                    "fare": req.body.fare,
                    "username": req.body.username,
                    "price": price,
                    "data": moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                };
                netHelpers.performAjaxRequest('localhost', 5500, '/api/transport', 'POST', data, function (resultObject) {
                    res.status(200).send();
                    return;
                });
            }
        }
    });
})
;
router.get('/getMoney', function (req, res) {
    var url = "/api/users/" + req.cookies.userId + "?filter=%7B%22fields%22%3A%7B%22price%22%3Atrue%7D%7D&access_token=" + req.cookies.access_token;
    netHelpers.performAjaxRequest('localhost', 5500, url, 'GET', null, function (resultObject) {
        res.status(200).send(resultObject);
    });
});
router.get('/:vp', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/users' + req.url, 'GET', null, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    });
});


router.post('/:vp', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/users' + req.url, 'PUT', req.body, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send("OK");
    });
});

module.exports = router;