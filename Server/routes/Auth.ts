/// <reference path='../typings/tsd.d.ts' />

import express = require('express');
import DB = require('./DB');
var router = express.Router();

/* 사용자 인증 및 로그인 라우터 */
router.get('/', function(req, res, next) {
  
    //data 가공
    let data = JSON.parse(req.headers['authorization']);
    
    console.log("[+ 로그인 인증 요청] ", data.ID);

    var data_from_db = {
        ID : "error",              //없거나 실패시 이대로 감
        user_coin : 0,
        busker_coin : 0,
        busker_heart : 0
    };

    //DB에서 탐색 값 반환받음
    for(var index = 0; index < DB.length; index++){

        if(DB[index].ID == data.ID){        // ID 같은 값 찾기

            if(DB[index].Password == data.Password){   // Password 같은 값 찾기

                data_from_db.ID = DB[index].ID;
                data_from_db.user_coin = DB[index].user_coin;
                data_from_db.busker_coin = DB[index].busker_coin;
                data_from_db.busker_heart = DB[index].busker_heart;
                
            }
            else{
                //비밀번호 불일치 Error 반환
                break;
            }      
        }
    }

    //업데이트 및 전송
    res.send(JSON.stringify(data_from_db));

    res.end();
});


export = router;
