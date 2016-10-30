import {Component} from '@angular/core'
import {MainPage} from '../Main/Main';
import {NavController, Events, Alert} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

//HTTP protocol
import {HttpProtocalService} from '../../service/HttpProtocol';

@Component({
  templateUrl: 'build/pages/Login/Login.html',
  providers : [HttpProtocalService]
})
export class LoginPage {

  private login : any;
  private ID : string;
  private password : string;


  constructor(private nav : NavController, private http : HttpProtocalService, public event : Events) 
  {
    // this tells the tabs component which Pages
    // should be each tab's root Page

    this.ID = "";
    this.password = "";
  }

  @Input() insertID(event : any){

    this.ID = event.target.value;
  }

  @Input() insertPassword(event : any){

    this.password = event.target.value;
  }

  @Output() quick_login(){
        localStorage.setItem("Auth","kakaotalk login");
        window.location.reload();
  }

  @Output() Auth_Login(){

      console.log("[+] user push login");
      console.log("[*] User ID :", this.ID);
      console.log("[*] User Password :", this.password);

      if(this.password.length < 5 || this.ID.length < 5){

          console.log("[-] Void Error");
          let alert_frame = Alert.create({
                                  title : "로그인 실패",
                                  message : "아이디나 비밀번호를 다시입력해주세요.",
                                  buttons : ["OK"]
          });

        this.nav.present(alert_frame);
      }
      else{

          //ADD : Token Storage
            let token = {
              "ID" : this.ID,
              "Password" : this.password
            }
            
            this.http.GET("JSON","http://192.168.1.13:8000/Login", token);   
            
            this.event.subscribe("GET",(data) => { //Async Event
            
                console.log("[+] Succes GET data", data);

                let recv = JSON.parse(data);

                if(recv.check == true){
                  
                  this.Auth_alert(true);
                  localStorage.setItem("Auth",data.token);
                  window.location.reload();
                }
                else{

                  this.Auth_alert(false);
                  console.log("[-] Auth Failed");
                }
            });          
      }

  }

  Auth_alert(select : boolean){

        let title_value : string;
        let message_content : string;

        if(select){
          title_value = "Success";
          message_content = "로그인에 성공하셨습니다.";  
        }
        else{
          title_value = "Failed";
          message_content = "로그인에 실패하셨습니다.";
        }

        let alert_frame = Alert.create({
              title : title_value,
              message : message_content,
              buttons : ["OK"]
        });

        this.nav.present(alert_frame);
  }
  
  
}