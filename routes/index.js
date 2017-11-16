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
// users
var userRegister = [];
var hau = new Users("Nguyễn Tấn Hậu", "42.119.222.181", "SG", 10.8142, 106.6438);
var canh = new Users("Phạm Văn Cảnh", "119.17.248.18", "HN", 21.0333, 105.85);
var anh = new Users("Phan Đức Anh", "14.161.6.231", "SG", 10.8142, 106.6438);
userRegister.push(hau);
userRegister.push(canh);
userRegister.push(anh);
// admin
var adminRegister = [];
var admin = new Admin("147258");
adminRegister.push(admin);

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

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('select * from UsersTable', function (err, recordset) {

            if (err) console.log(err);

            // send records as a response
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


function containAdmin(admin) {
    for (var i = 0; i < adminRegister.length; i++) {
        var t = adminRegister[i];
        if (t.code === admin.code) {
            return true;
        }
    }
    return false;
}
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
