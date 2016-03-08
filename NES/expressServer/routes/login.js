var express = require('express');
var router = express.Router();
var http = require('http');
var netHelpers = require('netHelpers');

var request = require('request');
var qs = require('querystring');
router.get('/', function (req, res) {
    res.render('login', { title: '登陆'});
});

function checkLogin(req, res, next) {
    var isTrue = true;
    if (!req.body.username || typeof  req.body.username != 'string') {
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
router.post('/', checkLogin);
router.post('/', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/users/login', 'POST', req.body, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send('1');
            return;
        }
        req.session.loopbackId = resultObject.id;
        req.session.userId = resultObject.userId;
        res.status(200).send(resultObject);
    });
});

router.post('/signup', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/users', 'POST', req.body, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send('Success!');
    })
});

router.get('/github', function (req, res) {


    var url = 'http://github.com/login/oauth/access_token?client_id=60afaeb8fac0ed512bbc&client_secret=804b8597d6bd14bbabdac301fd7857710cd11f97&code=' + req.query.code;
    var hostname = 'github.com';
    var path = '/login/oauth/access_token?client_id=60afaeb8fac0ed512bbc&client_secret=804b8597d6bd14bbabdac301fd7857710cd11f97&code=' + req.query.code;
    request.get(url, function (err, response, data) {

        var x = qs.parse(data);
        var url = 'https://api.github.com/user?access_token=' + x.access_token;
        request.get({url: url, headers: {
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36"
        }}, function (err, response, data) {
            var a = JSON.parse(data)
            req.flash('username', a.login);
            req.flash('message', a.email);
            res.statusCode = 400;
            res.redirect('/register');
        })
    })

});
module.exports = router;
