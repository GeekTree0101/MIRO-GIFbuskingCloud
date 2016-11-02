/// <reference path='../typings/tsd.d.ts' />

import express = require('express');
import * as IO from "socket.io";
import DB = require('./DB');
let io = IO.listen(8000);

var router = express.Router();

/* 버스킹 시작 및 사용자에게 알려주는 라우터 */
router.get('/', function(req : any, res, next) {
  
    let data = JSON.parse(req.headers.authorization);
    console.log("[+ 버스커 " + data.ID + " 님이 버스킹을 시작하였습니다.");

    let NFC_ID = data.NFC_ID;

    var temp = {
        user_coin : 0
    }

    // DB 검색 후 업데이트
    for(var index = 0; index < DB.length; index++){

        if(DB[index].ID == data.ID){        // ID 같은 값 찾기

                DB[index].busking_state = true;
                
                //사용자에게 버스킹 한다는 것을 알려줌 , 브로드 케스팅 
                io.emit("Start",JSON.stringify({
                     ID : data.ID,
                     Location : data.Location
                }));

        }
    }    
    
    res.end();
});


export = router;
