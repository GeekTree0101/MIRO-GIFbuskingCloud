/// <reference path='../typings/tsd.d.ts' />
"use strict";
var express = require('express');
var DB = require('./DB');
var router = express.Router();
/* 버스커 결산 업데이트 라우터 */
router.get('/', function (req, res, next) {
    var data = JSON.parse(req.headers.authorization);
    console.log(data.ID + " 님 버스킹 종료 : 결산 요청");
    var temp = {
        ID: "Error",
        user_coin: 0,
        busker_coin: 0,
        busker_heart: 0
    };
    //DB로 부터 버스커정보를 업데이트한다.
    // DB 검색 후 업데이트
    for (var index = 0; index < DB.length; index++) {
        if (DB[index].ID == data.ID) {
            if (DB[index].busking_state) {
                temp.ID = DB[index].ID;
                temp.user_coin = data.user_coin;
                temp.busker_coin = data.busker_coin;
                temp.busker_heart = data.busker_heart;
                DB[index].user_coin = temp.user_coin;
                DB[index].busker_coin = temp.busker_coin;
                DB[index].busker_heart = temp.busker_heart;
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify(temp));
                DB[index].busking_state = false;
            }
            else {
                res.set('Content-Type', 'text/plain');
                res.send("HACKER 인게 확실함");
            }
        }
    }
    // 업데이트 된 내용을 전송한다.
    res.end();
});
module.exports = router;
//# sourceMappingURL=Update.js.map