var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var url = require('url');
var os = require("os");
var sql = require("mssql");
var config = {
    user: 'chat@chatser',
    password: 'Abcdabcd1',
    server: 'chatser.database.windows.net',
    database: 'chatserver',
    options: {encrypt: 'true', database: 'sensorData'}
};
var Users = function Users(name, ip, region_code, latitude, longitude, information) {
    this.name = name;
    this.ip = ip;
    this.region_code = region_code;
    this.latitude = latitude;
    this.longitude = longitude;
    this.information = information;
};


function containUser(userRegister, ip, region_code, latitude, longitude) {
    for (var i = 0; i < userRegister.length; i++) {
        var t = userRegister[i];
        if (t.ip === ip && t.region_code === region_code && t.latitude === latitude && t.longitude === longitude) {
            return true;
        }
    }
    return false;
}

router.get('/', function (req, res) {
    var info = req.param('info');
    var timeLogin = req.param('timelogin');
    var ip = JSON.parse(info);
    var hostaddress = os.hostname();
    var obj = new Users(hostaddress, ip.ip, ip.region_code, ip.latitude, ip.longitude);
    themVaoBangDangNhap(obj.ip,timeLogin);
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from UsersTable', function (err, recordset) {
            if (err) console.log(err);
            var userRegister = recordset.recordsets[0];
            if (containUser(userRegister, obj.ip, obj.region_code, obj.latitude, obj.longitude)) {

                res.json({re: 'success'});
            } else {
                res.json({re: 'fail:'});
            }
            sql.close();
        });
    });
});
var themVaoBangDangNhap = function (ip, time) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into TimeLogin values('" + ip + "','" + time + "')", function (err, recordset) {
            if (err) console.log(err);
            sql.close();
        });
    });
};

router.get('/admin', function (req, res, next) {
    var code = req.param('code');
    if (code === '147258') {
        res.json({re: 'success'});
    } else {
        res.json({re: 'fail'});
    }
});

router.get('/login', function (req, res, next) {
    var infologin = req.param('infologin');
    var us = JSON.parse(infologin);
    themVaoBangDangNhap(us);
    res.json({re: 'success'});
});

module.exports = router;
