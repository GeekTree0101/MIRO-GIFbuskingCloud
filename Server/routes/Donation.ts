/// <reference path='../typings/tsd.d.ts' />

import express = require('express');
import * as IO  from 'socket.io';
import DB = require('./DB');
var io = IO.listen(9000);

var router = express.Router();

/* 사용자가 버스커에게 기부하는 라우터 POST */
router.post('/', function(req, res, next) {
  
    let data = JSON.parse(req.body);
    console.log("[+ 사용자 버스커기기 " + data.NFC_ID + " 으로 기부요청");

    var temp = {
        user_coin : 0
    }

    // DB 검색 후 업데이트
    for(var index = 0; index < DB.length; index++){

        if(DB[index].ID == data.ID){        // ID 같은 값 찾기

                var updated_coin = DB[index].user_coin - data.send_coin;
                temp.user_coin = updated_coin;
                DB[index].user_coin = updated_coin;
                
                // 버스커에게 사용자가 요구한 금액 기부 전송
                io.emit("heart", JSON.stringify({
                    NFC_ID : data.NFC_ID,             //NFC_ID
                    send_coin : temp.user_coin                //send_coin        
                }));
        }
    }    

    res.send(JSON.stringify(temp));

    res.end();
});


/**
 *   버스커가 비트코인을 받았음을 인식하는 소켓서버
 *   Donation socket
 */
io.on("heart",(data) => {

    let temp = JSON.parse(data);

    console.log("[+ 버스커 " + temp.ID + " 님이 비트코인을 받음");
    
});

export = router;
