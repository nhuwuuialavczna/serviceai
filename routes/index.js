var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var url = require('url');
var os = require("os");
var request = require('request');
var Users = function Users(id, region_code, region_name) {

};
var userRegister = [];
var hau = new Users("hau", "145632");
var tan = new Users("tan", "123482");


userRegister.push(hau);
userRegister.push(tan);

function equals(us) {
    for (var i = 0; i < userRegister.length; i++) {
        var t = userRegister[i];
        if (t.name === us.name && t.pass === us.pass) {
            return true;
        }
    }
    return false;
}


/* GET home page. */
router.get('/', function (req, res, next) {
    // var name = req.param('name');
    // var code = req.param('code');

    // request.get(
    //     'https://freegeoip.net/json/',
    //     {json: {key: 'value'}},
    //     function (error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //
    //             res.json({"result": {hostaddress:hostaddress,ip:body}});
    //         }
    //     }
    // );
    var ip = res.param('ip');
    var hostaddress = os.hostname();
    res.json({"result": {hostaddress:hostaddress,ip:ip}});

    // var usss = new Users(name, code);
    // console.log(equals(usss));
    // if (equals(usss)) {
    //     res.json({"result": "success"});
    // } else {
    //     res.json({"result": "fail"});
    // }

});

module.exports = router;
