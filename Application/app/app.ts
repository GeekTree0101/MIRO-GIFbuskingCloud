import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HTTP_PROVIDERS} from '@angular/http';

import {LoginPage} from './pages/Login/Login';
import {MainPage} from './pages/Main/Main';

import {localStorage_service} from './service/localStorage';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers : [localStorage_service]
})
export class MyApp {

  private rootPage : any;

  constructor(private platform:Platform, private DB : localStorage_service) {

    if(!this.DB.check("userdata")){                            //내부 데이터베이스 데이터 유/무체크

      let data = {
        ID : "error",                                           //사용자 아이디
        user_coin : 0,                                         //사용자 비트코인
        busker_coin : 0,                                       //사용자 버스킹 누적코인
        busker_heart : 0                                       //사용자 버스킹 누적하트
      }

      DB.create(data,"userdata");                              //데이터베이스 생성

      this.rootPage = LoginPage;                               //로그인뷰로 이동
    }
    else{
        
      this.rootPage = this.Auth();                             //인증체크
    }
    
    platform.ready().then(() => {

      StatusBar.styleDefault();                                //상태바 생성
    });
    
  }
  
  Auth() : any{                                                //인증 프로시저

    //NOTE : 자동로그인을 위한 프로시저

    let id = this.DB.load("ID","userdata");                    //로컬스토리지로 부터 토큰 획득
   


    if(id == "error" || id == undefined ){                      //초기화값 또는 없을경우
      
        return LoginPage;                                       //메인페이지로 이동
    }
    else{

        return MainPage;                                      //로그인페이지로 이동
    }

  }
  
}

ionicBootstrap(MyApp,[HTTP_PROVIDERS])                         //부트스트랩