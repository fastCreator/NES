var express = require('express');
var fs = require('fs');
var router = express.Router();
var netHelpers = require('netHelpers');
var path = require('path');
var multer = require('multer');
var myID;
var nowData
//multer函数
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/shops'));
    },
    filename: function (req, file, cb) {
        var myShop = JSON.parse(req.body.myShop);
        if (myShop.myId) {
            nowData = myShop.myId;
        }
        cb(null, nowData + file.fieldname + "." + file.originalname.split(".")[1]);
    }
});
var upload = multer({ storage: storage})
var cpUpload = upload.fields([
    { name: '_1_jpg', maxCount: 1 },
    { name: '_2_jpg', maxCount: 1 },
    { name: '_3_jpg', maxCount: 1 },
    { name: '_obj', maxCount: 1 },
    { name: '_mtl', maxCount: 1 },
    { name: '_1_200x200', maxCount: 1 },
    { name: '_1_60x60', maxCount: 1 },
    { name: '_1_800x800', maxCount: 1 },
    { name: '_2_800x800', maxCount: 1 },
    { name: '_3_800x800', maxCount: 1 },
    { name: '_4_800x800', maxCount: 1 },
    { name: '_5_800x800', maxCount: 1 },
    { name: '_6_800x800', maxCount: 1 },
    { name: '_7_800x800', maxCount: 1 },
    { name: '_8_800x800', maxCount: 1 },
    { name: '_1', maxCount: 1 },
    { name: '_2', maxCount: 1 },
    { name: '_3', maxCount: 1 },
    { name: '_4', maxCount: 1 },
    { name: '_5', maxCount: 1 },
    { name: '_6', maxCount: 1 },
    { name: '_7', maxCount: 1 },
    { name: '_8', maxCount: 1 },
    { name: '_9', maxCount: 1 },
    { name: '_10', maxCount: 1 }
]);
//同步文件夹函数
//function mkdirsSync(dirpath, mode) {
//    if (!fs.existsSync(dirpath)) {
//        var pathtmp;
//        dirpath.split(path.sep).forEach(function (dirname) {
//            if (pathtmp) {
//                pathtmp = path.join(pathtmp, dirname);
//            }
//            else {
//                pathtmp = dirname;
//            }
//            if (!fs.existsSync(pathtmp)) {
//                if (!fs.mkdirSync(pathtmp, mode)) {
//                    return false;
//                }
//            }
//        });
//    }
//    return true;
//}
//检测提交商品信息是否合格
function checkShop(shop) {
    if (!shop.searchText || typeof  shop.searchText != 'string') {
        return false;
    }
    if (!shop.introduce || typeof  shop.introduce != 'string') {
        return false;
    }
    if (!shop.imgNumb || typeof  shop.imgNumb != 'number' || shop.imgNumb > 8 || shop.imgNumb < 5) {
        return false;
    }
    if (!shop.price || !parseFloat(shop.price)) {
        return false;
    }
    if (shop.link && (shop.link.constructor != Array || shop.link.length > 6)) {
        return false;
    }
    if (shop.classify && shop.classify.constructor != Array) {
        return false;
    }
    if (shop.D3Numb && typeof  shop.D3Numb != 'number') {
        return false;
    }
    if (shop.shopDetails && shop.shopDetails.constructor != Array) {
        return false;
    }
    if (shop.parameter && shop.parameter.constructor != Array) {
        return false;
    }
    if (shop.classifyNumb && shop.classifyNumb.constructor != Array) {
        return false;
    }
    if (shop.classify ^ shop.classifyNumb) {
        return false;
    }
    if (shop.select && typeof  shop.select != 'string') {
        return false;
    }
    return true;
}
//数据库提交shop信息
function shopDB(url, myShop) {
    netHelpers.performAjaxRequest("localhost", 5500, url, "POST", myShop, function (resultObject) {
    });
}
//验证用户登录
function checkLogin(req, res, next) {
    if (req.session.userId != req.cookies.enteringId + "2574") {
        req.flash('message', '非法提交');
        res.statusCode = 400;
        res.redirect('/shopuser');
        return
    }
    netHelpers.performAjaxRequest("localhost", 5500, "/api/shopuser/" + req.cookies.enteringId + "?filter=%7B%22fields%22%3A%7B%22myID%22%3Atrue%7D%7D&access_token=" + req.cookies.entering_token, "GET", null, function (resultObject) {
        if (resultObject.error) {
            req.flash('message', '请登录后提交');
            res.statusCode = 400;
            res.redirect('/shopuser#/list');
            return;
        }
        myID = resultObject;
        next();
    });
}
router.post('/upload', checkLogin);
router.post('/upload', function (req, res) {
    //获取当前时间当myID
    nowData = Date.now().toString();
    cpUpload(req, res, function (err) {
        var myShop = JSON.parse(req.body.myShop);
        if (!checkShop(myShop)) {
            req.flash('message', '上传信息不符合规则,失败');
            res.redirect('/shopuser#/add');
            return;
        }
        //创建文件夹
//        if (req.files) {
//            var dirpath = path.join(__dirname, '../public/images/shops/' + myShop.myId);
//            mkdirsSync(dirpath, 0777);
//        }

        //添加用户myID
        myID.myID.push(nowData);
        netHelpers.performAjaxRequest("localhost", 5500, "/api/shopuser/" + req.cookies.enteringId + "?filter=%7B%22fields%22%3A%7B%22myID%22%3Atrue%7D%7D&access_token=" + req.cookies.entering_token, "PUT", myID, function (resultObject) {
        });
        //往数据库上传文件
        myShop.myId = nowData;
        if (!(myShop.shopDetails[0])) {
            myShop.shopDetails[0] = nowData;
        }
        shopDB("/api/goods", myShop);
        if (err) {
            req.flash('message', '上传图片失败,请重新上传图片');
            res.redirect('/shopuser#/revise');
            return;
        }
        req.flash('message', '添加成功');
        res.redirect('/shopuser#/list');
    });
});
router.post('/update', checkLogin);
router.post('/update', function (req, res) {
    cpUpload(req, res, function (err) {
        var myShop = JSON.parse(req.body.myShop);
        if (!checkShop(myShop)) {
            req.flash('message', '上传信息不符合规则,失败');
            res.redirect('/shopuser#/revise');
            return
        }
        //往数据库上传文件
        shopDB("/api/goods/update?where=%7B%22myId%22%3A%22" + myShop.myId + "%22%7D", myShop);
        if (err) {
            req.flash('message', '上传图片失败,请重新上传图片');
            res.redirect('/shopuser#/revise');
            return
        }
        req.flash('message', '更新成功');
        res.redirect('/shopuser#/revise');
    });
});


router.get('/', function (req, res) {
    res.render('entering');
});
//获得需要快递商品
router.get('/express', checkLogin);
router.get('/express', function (req, res) {
    //获取原始数据
    netHelpers.performAjaxRequest('localhost', 5500, '/api/transport', 'GET', null, function (resultObject) {
        if (resultObject.error) {
            res.status(500).send();
            return;
        }
        //排列原始数据
        var shops = new Array(0);
        var data, shop;
        for (var i = 0; i < resultObject.length; i++) {
            shop = new Array(0);
            for (var j = 0; j < resultObject[i].shops.length; j++) {
                for (var k = 0; k < myID.myID.length; k++) {
                    //获取该商户没寄出商品
                    if (myID.myID[k] == resultObject[i].shops[j].myId && !resultObject[i].shops[j].hasPost) {
                        shop.push(resultObject[i].shops[j]);
                    }
                }
            }
            if (shop.length) {
                data = {
                    "id": resultObject[i].id,
                    "name": resultObject[i].name,
                    "fare": resultObject[i].fare,
                    "price": resultObject[i].price,
                    "remarks": resultObject[i].remarks,
                    "username": resultObject[i].username,
                    "data": resultObject[i].data,
                    "address": resultObject[i].address,
                    "phone": resultObject[i].phone,
                    "shop": shop
                }
                shops.push(data);
            }
        }
        res.status(200).send(shops);
    });
});
//更新需要快递商品
router.post('/express', checkLogin);
router.post('/express', function (req, res) {
    //获取原始数据
    var body = req.body;
    netHelpers.performAjaxRequest('localhost', 5500, '/api/transport' + '?filter=%7B%22fields%22%3A%7B%22shops%22%3Atrue%7D%2C%22where%22%3A%7B%22id%22%3A%22' + body.id + '%22%7D%7D', 'GET', null, function (resultObject) {
        if (resultObject.error) {
            res.status(500).send();
            return;
        }
        var data = resultObject[0].shops;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < body.shop.length; j++) {
                if (body.shop[j].id == data[i].id) {
                    data[i] = body.shop[j];
                    break;
                }
            }
        }
        //向数据库提交更新数据
        netHelpers.performAjaxRequest('localhost', 5500, '/api/transport/update' + '?where=%7B%22id%22%3A%22' + body.id + '%22%7D', 'POST', {'shops': data}, function (resultObject) {
            if (resultObject.error) {
                res.status(500).send();
                return;
            }

        });
        res.status(200).send();
    });
});
//删除商品
router.post('/deletShop', checkLogin);
router.post('/deletShop', function (req, res) {
    var nofind = true;
    for (var i = 0; i < myID.myID.length; i++) {
        if (myID.myID[i] == req.body.ID) {
            nofind = false;
            myID.myID.splice(i, 1);
            netHelpers.performAjaxRequest("localhost", 5500, "/api/shopuser/" + req.cookies.enteringId + "?filter=%7B%22fields%22%3A%7B%22myID%22%3Atrue%7D%7D&access_token=" + req.cookies.entering_token, "PUT", myID, function (resultObject) {
            });
            //删除文件
            var url = path.join(__dirname, '../public/images/shops');
            var dirList = fs.readdirSync(url);
            dirList.forEach(function (fileName) {
                if (req.body.ID == fileName.split("_")[0]) {
                    fs.unlinkSync(url + "/" + fileName);
                }
            });
        }
    }
    if (nofind) {
        res.status(500).send();
        return
    }
    netHelpers.performAjaxRequest('localhost', 5500, '/api/goods/' + req.body.ID, 'DELETE', null, function (resultObject) {
        if (resultObject.error) {
            res.status(500).send();
            return;
        }
        //删除成功
        res.status(200).send();
    });
});
function checkLoginInfo(req, res, next) {
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
        res.status(401).send('1');
    }
}
router.get('/login', checkLoginInfo);
router.post('/login', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/shopuser/login', 'POST', req.body, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        req.session.userId = resultObject.userId + "2574";
        res.status(200).send(resultObject);
    })
});
router.post('/logout', function (req, res) {
    ///摧毁session
    req.session.destroy(function(err){
        console.log(err);
    });
    netHelpers.performAjaxRequest('localhost', 5500, '/api/shopuser' + req.url, 'POST', req.body, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    })
});
router.get('/:vp', function (req, res) {
    netHelpers.performAjaxRequest('localhost', 5500, '/api/shopuser' + req.url, 'GET', null, function (resultObject) {
        if (resultObject.error) {
            res.status(resultObject.error.status).send(resultObject.error.message);
            return;
        }
        res.status(200).send(resultObject);
    })
});
module.exports = router;
