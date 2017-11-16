var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var url = require('url');
var os = require("os");

var Users = function Users(name, ip, region_code, latitude, longitude,information) {
    this.name = name;
    this.ip = ip;
    this.region_code = region_code;
    this.latitude = latitude;
    this.longitude = longitude;
    this.information = information;
};
var Admin = function Admin(code) {
    this.code = code;
};

function containUser(us,userRegister) {
    for (var i = 0; i < userRegister.length; i++) {
        var t = userRegister[i];
        if (t.ip === us.ip && t.region_code === us.region_code && t.latitude === us.latitude && t.longitude === us.longitude) {
            return true;
        }
    }
    return false;
}

router.get('/', function (req, res) {
    var info = req.param('info');
    var ip = JSON.parse(info);
    var hostaddress = os.hostname();
    var obj = new Users(hostaddress,ip.ip,ip.region_code,ip.latitude,ip.longitude);
    // config for your database
    var sql = require("mssql");
    var config = {
        user: 'chat@chatser',
        password: 'Abcdabcd1',
        server: 'chatser.database.windows.net',
        database: 'chatserver',
        options: { encrypt: 'true', database: 'sensorData'}
    };

    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from UsersTable', function (err, recordset) {
            if (err) console.log(err);
            var userRegister = recordset.recordsets[0];
            if(containUser(obj,userRegister)){
                res.json({re: 'success'});
            } else {
                res.json({re: 'fail'});
            }
            sql.close();
        });
    });
});


router.get('/admin', function (req, res, next) {
    var code = req.param('code');

    if (code === '147258') {
        res.json({re: 'success'});
    } else {
        res.json({re: 'fail'});
    }
});


module.exports = router;
