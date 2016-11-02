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

    if(!this.DB.check("userdata")){

      console.log("[+] Create userdata");

      let data = {
        ID : "test",
        user_coin : 0,
        busker_coin : 0,
        busker_heart : 0
      }

      DB.create(data,"userdata");

      this.rootPage = LoginPage;
    }
    else{
        
      this.rootPage = this.Auth();
    }
    /*
    platform.ready().then(() => {

      StatusBar.styleDefault();
    });
    */
  }
  
  Auth() : any{

    let flag : boolean = false;

    let id = this.DB.load("ID","userdata");

    console.log("[+] check userdata", id );
    if(id == "test" || id == undefined ){
      
        flag = false;
    }
    else{

        flag = true;
    }

    

    if(flag){
      
      return MainPage;                   //Goto MainPage
    }
    else{

      return LoginPage;                  //Goto LoginPage
    }
  }


  
}

ionicBootstrap(MyApp,[HTTP_PROVIDERS])