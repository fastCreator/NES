var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var netHelpers = require('netHelpers');

router.get('/', function (req, res) {
    res.render('register', { title: '注册'});
});

function checkRegister(req, res, next) {
    var isTrue = true;
    if (!req.body.username || typeof req.body.username != 'string') {
        isTrue = false;
    }
    if (!req.body.email || typeof req.body.email!= 'string') {
        isTrue = false;
    }
    if (!req.body.password || typeof req.body.password != 'string') {
        isTrue = false;
    }
    if (isTrue) {
        next();
    }
    else {
        res.status(500).send('1');
    }
}
router.post('/', checkRegister);
router.post('/', function (req, res) {
    var data = {
        "username": req.body.username,
        "password": req.body.password,
        "price": 0,
        "email": req.body.email,
        "alipay": crypto.createHash('md5').update(req.body.password).digest('hex')
    }
    netHelpers.performAjaxRequest('localhost', 5500, '/api/users', 'POST', data, function (resultObject) {
        if (resultObject.error) {
            if ("Can't send mail - all recipients were rejected" == resultObject.error.message) {
                //先登录
                netHelpers.performAjaxRequest('localhost', 5500, '/api/users/login', 'POST', req.body, function (resultObject) {
                    if (resultObject.error) {
                        res.status(resultObject.error.status).send('1');
                        return;
                    }
                    var loopbackId = resultObject.id;
                    var userId = resultObject.userId;

                    //删除
                    netHelpers.performAjaxRequest('localhost', 5500, '/api/users/' + userId + '?access_token=' + loopbackId, 'DELETE', null, function (resultObject) {
                    });
                });
            }
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send('1');
    })
});

module.exports = router;
