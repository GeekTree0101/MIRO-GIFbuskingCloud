/// <reference path='../typings/tsd.d.ts' />
"use strict";
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    var data = req.headers;
    console.log("[+] GET : name", data);
    res.send("GET 200 : OK");
});
module.exports = router;
//# sourceMappingURL=Update.js.map