import {Component, AfterViewInit} from '@angular/core';
import {NavController, Events} from 'ionic-angular';


@Component({
    selector : 'busker-list',
    templateUrl : 'build/pages/BuskerList/Directive/buskerUnit.html'
})
export class busker_unit_list{


    private data = [
        {
            name : "GeekTree",
            location : "경북대학교 대학로 60길 IT2호관",
            infomation : "비트기반 음악을 연주하는 버스커입니다.",
            image : "image/me.jpg",
            state : true
        },
         {
            name : "냉동은",
            location : "대구 중구 동성로 14-15",
            infomation : "음악 좋아하는 사람들 모여라",
            image : "image/me.jpg",
            state : true   
        },
        {
            name : "Liuhuiyu",
            location : "서울시 홍대앞 홍대놀이터",
            infomation : "저는 얼후를 연주하는 중국사람입니다.",
            image : "image/me.jpg",
            state : true
        },
         {
            name : "금성수",
            location : "대구 남구 수성동 수성못근처",
            infomation : "오늘 날씨좋네요. 오늘 하루도 음악과 함께",
            image : "image/me.jpg",
            state : true       
        },
         {
            name : "강미정미정",
            location : "대구 중구 동성로 100-2",
            infomation : "냉동은씨 음악은 쓰래기에요 여러분",
            image : "image/me.jpg",
            state : true
        },
         {
            name : "장범준",
            location : "경북대학교 일청담앞",
            infomation : "저 아시죠? ㅎㅎ 인디아님",
            image : "image/me.jpg",
            state : false                  
        }

    ];


    constructor(){


    }
}