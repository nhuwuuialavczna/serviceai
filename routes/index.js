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
var userRegister = [];
var hau = new Users("RD0003FF442501", "42.119.222.181", "SG", 10.8142, 106.6438);

userRegister.push(hau);

function contain(us) {
    for (var i = 0; i < userRegister.length; i++) {
        var t = userRegister[i];
        if (t.name === us.name && t.ip === us.ip && t.region_code === us.region_code && t.latitude === us.latitude && t.longitude === us.longitude) {
            return true;
        }
    }
    return false;
}


/* GET home page. */
router.get('/', function (req, res, next) {
    var ip = req.param('info');
    var hostaddress = os.hostname();
    var obj = {
        pcname: hostaddress,
        ip: ip.ip,
        region_code: ip.region_code,
        latitude: ip.latitude,
        longitude: ip.longitude
    };
    if (contain(obj)) {
        res.json({re: 'success'});
    } else {
        res.json({re: 'fail'});
    }
});



module.exports = router;
