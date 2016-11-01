/// <reference path='../typings/tsd.d.ts' />
"use strict";
var express = require('express');
var IO = require("socket.io");
var io = IO.listen(8000);
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    var data = req.headers;
    console.log("[+] GET : name", data);
    console.log("io", io);
    res.send("GET 200 : OK");
});
module.exports = router;
//# sourceMappingURL=Start.js.map