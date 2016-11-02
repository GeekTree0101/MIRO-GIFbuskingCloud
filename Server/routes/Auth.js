/// <reference path='../typings/tsd.d.ts' />
"use strict";
var express = require('express');
var DB = require('./DB');
var router = express.Router();
/* 사용자 인증 및 로그인 라우터 */
router.get('/', function (req, res, next) {
    //data 가공
    var data = JSON.parse(req.headers.authoraization);
    console.log("[+ 로그인 인증 요청] ", data.ID);
    var temp = {
        ID: "error",
        user_coin: 0,
        busker_coin: 0,
        busker_heart: 0
    };
    //DB에서 탐색 값 반환받음
    for (var index = 0; index < DB.length; index++) {
        if (DB[index].ID == data.ID) {
            if (DB[index].Password == data.Password) {
                temp.ID = DB[index].ID;
                temp.user_coin = DB[index].user_coin;
                temp.busker_coin = DB[index].busker_coin;
                temp.busker_heart = DB[index].busker_heart;
            }
            else {
                //비밀번호 불일치 Error 반환
                break;
            }
        }
    }
    //업데이트 및 전송
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(temp));
    res.end();
});
module.exports = router;
//# sourceMappingURL=Auth.js.map