var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var url = require('url');
var os = require("os");
var sql = require("mssql");
var request = require('request');
var config = {
    user: 'chat@chatser',
    password: 'Abcdabcd1',
    server: 'chatser.database.windows.net',
    database: 'chatserver',
    options: {encrypt: 'true', database: 'sensorData'}
};
var Users = function Users(name, ip, region_code, latitude, longitude) {
    this.name = name;
    this.ip = ip;
    this.region_code = region_code;
    this.latitude = latitude;
    this.longitude = longitude;
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
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into TimeLogin values('" + obj.ip + "','" + timeLogin + "')", function (err, recordset) {
            if (err) console.log(err);
            sql.close();
            sql.connect(config, function (err) {
                if (err) console.log(err);
                var request = new sql.Request();
                request.query('select * from UsersTable', function (err, recordset) {
                    if (err) console.log(err);
                    var userRegister = recordset.recordsets[0];
                    if (containUser(userRegister, obj.ip, obj.region_code, obj.latitude, obj.longitude)) {
                        res.json({re: 'success', ip: obj.ip});
                    } else {
                        res.json({re: 'fail'});
                    }
                    sql.close();
                });
            });

        });
    });
});


router.get('/admin', function (req, res, next) {
    var code = req.param('code');
    var timeLogin = req.param('timelogin');
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into TimeLogin values('admin','" + timeLogin + "')", function (err, recordset) {
            if (err) console.log(err);
            if (code === '123456') {
                res.json({re: 'success'});
            } else {
                res.json({re: 'fail'});
            }
            sql.close();
        });
    });

});


router.get('/TuVungTool/sendiem', function (req, res, next) {
    var name = req.param('name');
    var diem = req.param('diem');
    var lanCuoi = req.param('lancuoi');
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from DiemTuVungTool where name='" + name + "'", function (err, recordset) {
            if (err) console.log(err);
            request.query("insert into DiemTuVungTool values('" + name + "','" + diem + "','" + lanCuoi + "')", function (err, recordset) {
                if (err) console.log(err);
                res.send("success");
                sql.close();
            });
        });


    });
});
//hauvvv
router.get('/TuVungTool/BangXepHang', function (req, res, next) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("select * from DiemTuVungTool", function (err, recordsets) {
            if (err) res.json({re: 'fail'});
            var bangXepHang = recordsets.recordsets[0];
            res.json({re: bangXepHang});
            sql.close();
        });
    });
});


router.get('/sendmessage', function (req, res, next) {
    var ip = req.param('ip');
    var message = req.param('message');
    var time = req.param('time');
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into Message values('" + ip + "','" + message + "','" + time + "')", function (err, recordset) {
            if (err) res.json({re: 'fail'});
            res.json({re: 'success'});
            sql.close();
        });
    });

});

router.get('/doingu', function (req, res, next) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("select * from QuanTri", function (err, recordsets) {
            if (err) res.json({re: 'fail'});
            var userRegister = recordsets.recordsets[0];
            // console.log(userRegister);
            res.json({re: userRegister});
            sql.close();
        });
    });
//b40dfa18cfccc6bbd7457659cebd7f85
});

router.get('/donate', function (req, res, next) {
    var sopin = req.param('sopin');
    var soseri = req.param('soseri');
    var type_card = req.param('type_card');
    var coin1 = Math.floor((Math.random() * 989) + 1) + 10;
    var coin2 = Math.floor((Math.random() * 999) + 1);
    var coin3 = Math.floor((Math.random() * 999) + 1);
    var coin4 = Math.floor((Math.random() * 999) + 1);
    var ref_code = coin4 + coin3 * 1000 + coin2 * 1000000 + coin1 * 100000000;

    var NGANLUONG_URL_CARD_POST = 'https://www.nganluong.vn/mobile_card.api.post.v2.php';
    var r = NGANLUONG_URL_CARD_POST + "?func=CardCharge&version=2.0&" + "merchant_id=52756&"
        + "merchant_account=15130052@st.hcmuaf.edu.vn&"
        + "merchant_password=f795bfd4c4b1fab9a198e0bbd60a8128&" + "pin_card=" + sopin + "&" + "card_serial="
        + soseri + "&" + "type_card=" + type_card + "&" + "ref_code=" + ref_code + "&"
        + "client_fullname=&client_email=&client_mobile=";


    request(r, {json: true}, function (err, resss, body) {
        if (err) {
            res.json({re: "fail"});
        }
        var status = body.split('|');
        res.json({re: getErrorMessage(status[0])});
    });
});

function getErrorMessage(code) {
    var arrCode = [];
    arrCode["00"] = "Cảm ơn bạn đã ủng hộ cho chúng tôi";
    arrCode["99"] = "Lỗi, tuy nhiên lỗi chưa được định nghĩa hoặc chưa xác định được nguyên nhân";
    arrCode["01"] = "Lỗi, địa chỉ IP truy cập API của NgânLượng.vn bị từ chối";
    arrCode["02"] =
        "Lỗi, tham số gửi từ merchant tới NgânLượng.vn chưa chính xác (thường sai tên tham số hoặc thiếu tham số)";
    arrCode["03"] = "Lỗi, Mã merchant không tồn tại hoặc merchant đang bị khóa kết nối tới NgânLượng.vn";
    arrCode["04"] =
        "Lỗi, Mã checksum không chính xác (lỗi này thường xảy ra khi mật khẩu giao tiếp giữa merchant và NgânLượng.vn không chính xác, hoặc cách sắp xếp các tham số trong biến params không đúng)";
    arrCode["05"] = "Tài khoản nhận tiền nạp của merchant không tồn tại";
    arrCode["06"] =
        "Tài khoản nhận tiền nạp của merchant đang bị khóa hoặc bị phong tỏa, không thể thực hiện được giao dịch nạp tiền";
    arrCode["07"] = "Thẻ đã được sử dụng ";
    arrCode["08"] = "Thẻ bị khóa";
    arrCode["09"] = "Thẻ hết hạn sử dụng";
    arrCode["10"] = "Thẻ chưa được kích hoạt hoặc không tồn tại";
    arrCode["11"] = "Mã thẻ sai định dạng";
    arrCode["12"] = "Sai số serial của thẻ";
    arrCode["13"] = "Mã thẻ và số serial không khớp";
    arrCode["14"] = "Thẻ không tồn tại";
    arrCode["15"] = "Thẻ không sử dụng được";
    arrCode["16"] = "Số lần thử (nhập sai liên tiếp) của thẻ vượt quá giới hạn cho phép";
    arrCode["17"] = "Hệ thống Telco bị lỗi hoặc quá tải, thẻ chưa bị trừ";
    arrCode["18"] =
        "Hệ thống Telco bị lỗi hoặc quá tải, thẻ có thể bị trừ, cần phối hợp với NgânLượng.vn để tra soát";
    arrCode["19"] =
        "Kết nối từ NgânLượng.vn tới hệ thống Telco bị lỗi, thẻ chưa bị trừ (thường do lỗi kết nối giữa NgânLượng.vn với Telco, ví dụ sai tham số kết nối, mà không liên quan đến merchant)";
    arrCode["20"] = "Kết nối tới telco thành công, thẻ bị trừ nhưng chưa cộng tiền trên NgânLượng.vn";
    return arrCode[code];
}

module.exports = router;
