import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HTTP_PROVIDERS} from '@angular/http';

import {LoginPage} from './pages/Login/Login';
import {MainPage} from './pages/Main/Main';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage : any;

  constructor(private platform:Platform) {

    this.rootPage = this.Auth();

    platform.ready().then(() => {

      StatusBar.styleDefault();
    });

  }
  
  Auth() : any{

    let flag : boolean = false;

    if(localStorage.getItem("Auth")){
      
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