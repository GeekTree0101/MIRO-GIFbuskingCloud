/// <reference path='../typings/tsd.d.ts' />
"use strict";
var express = require('express');
var router = express.Router();
var DB = require('./DB');
/*사용자가 원하는 만큼 코인을 충전하는 라우터 */
router.post('/', function (req, res, next) {
    //let data = JSON.parse(req.body());
    var data = req.body;
    console.log("[+ 비트코인 충전 요청 ] : ", data.ID);
    var temp = {
        user_coin: 0
    };
    // DB 검색 후 업데이트
    for (var index = 0; index < DB.length; index++) {
        if (DB[index].ID == data.ID) {
            var updated_coin = DB[index].user_coin + data.charge_coin;
            temp.user_coin = updated_coin;
            DB[index].user_coin = updated_coin;
        }
    }
    // 사용자에게 업데이트 된 내용 전송
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(temp));
    res.end();
});
module.exports = router;
//# sourceMappingURL=CashSystem.js.map