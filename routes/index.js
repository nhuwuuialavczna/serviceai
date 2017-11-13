var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var us = function (name, pass) {
    this.name = name;
    this.pass = pass;
};
var userRegister = [];
var hau = new us("hau", "145632");
var tan = new us("tan", "123482");


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
    var name = req.param('name');
    var code = req.param('code');

    var usss = new us(name, code);
    console.log(equals(usss));
    if (equals(usss)) {
        res.json({"result": "success"});
    } else {
        res.json({"result": "fail"});
    }

});

module.exports = router;
