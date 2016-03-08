var express = require('express');
var router = express.Router();

var netHelpers = require('netHelpers');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'NES' });
});
router.post('/', function (req, res) {
    res.render('index', { title: 'NES' });
});
router.get('/goods', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/' + req.url, 'GET', null, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    });
});
router.get('/goods/findOne', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/' + req.url, 'GET', null, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    });
});
router.post('/logout', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/users/'+req.url, 'POST', null, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    });
});
router.get('/robots.txt', function (req, res) {
    res.render('/robots.txt');
});
module.exports = router;
