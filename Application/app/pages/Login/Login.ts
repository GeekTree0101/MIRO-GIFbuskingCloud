import {Component} from '@angular/core'
import {MainPage} from '../Main/Main';
import {NavController} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 


@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private login : any;
  private ID : string;
  private password : string;


  constructor(private nav : NavController) {
    // this tells the tabs component which Pages
    // should be each tab's root Page

    this.ID = "";
    this.password = "";
  }


  @Output() Auth_Login(){

      console.log("[+] user push login");

      if(this.password.length < 5 || this.ID.length < 5){

          console.log("[-] Void Error");

      }
      else{

          //ADD : storage ID, PW
          this.login = MainPage;
      }


  }
  
  
}