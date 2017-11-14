var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var url = require('url');
var os = require("os");
var request = require('request');
var Users = function Users(pcname, ip, region_code, latitude, longitude) {
    this.ip = ip;
    this.region_code = region_code;
    this.latitude = latitude;
    this.longitude = longitude;
};
var Admin = function Admin(code) {
    this.code = code;
};
// users
var userRegister = [];
var hau = new Users("RD0003FF442501", "42.119.222.181", "SG", 10.8142, 106.6438);
userRegister.push(hau);

// admin
var adminRegister = [];
var admin = new Admin("165997");
adminRegister.push(admin);

function containUser(us) {
    for (var i = 0; i < userRegister.length; i++) {
        var t = userRegister[i];
        if (t.name === us.name && t.ip === us.ip && t.region_code === us.region_code && t.latitude === us.latitude && t.longitude === us.longitude) {
            return true;
        }
    }
    return false;
}

function containAdmin(admin) {
    for (var i = 0; i < adminRegister.length; i++) {
        var t = adminRegister[i];
        if (t.code === admin.code) {
            return true;
        }
    }
    return false;
}


/* GET home page. */
router.get('/', function (req, res, next) {
    var info = req.param('info');
    var ip = JSON.parse(info);
    var hostaddress = os.hostname();
    var obj = new Users(hostaddress,ip.ip,ip.region_code,ip.latitude,ip.longitude);
    if (containUser(obj)) {
        res.json({re: 'success'});
    } else {
        res.json({re: 'fail'});
    }
});

router.get('/hostname', function (req, res, next) {
    var hostaddress = os.hostname();
    res.json({re:hostaddress});
});

router.get('/admin', function (req, res, next) {
    var code = req.param('code');
    var admin = new Admin(code);
    if (containAdmin(admin)) {
        res.json({re: 'success'});
    } else {
        res.json({re: 'fail'});
    }
});


module.exports = router;
