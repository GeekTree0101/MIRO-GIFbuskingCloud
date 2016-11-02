import {Component} from '@angular/core'
import {MainPage} from '../Main/Main';
import {NavController, Events, Alert} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

//HTTP protocol
import {HttpProtocalService} from '../../service/HttpProtocol';
import {localStorage_service} from '../../service/localStorage';

@Component({
  templateUrl: 'build/pages/Login/Login.html',
  providers : [HttpProtocalService, localStorage_service]
})
export class LoginPage {

  private login : any;
  private ID : string;
  private password : string;


  constructor(private nav : NavController, private http : HttpProtocalService, public event : Events, private DB : localStorage_service) 
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
    
        let data = {
        ID : "miro_master",
        user_coin : 1000,
        busker_coin : 1000,
        busker_heart : 1000
        }       
         
        let auth = this.DB.save(data,"userdata",["ID","user_coin","busker_coin","busker_heart"]);
                  
        if(auth){

           this.nav.setRoot(MainPage);
        }
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
            
            this.http.GET("JSON","http://192.168.1.9:7777/Auth", token, "login");   
            
            this.event.subscribe("login",
            
              (data) => { //Async Event
            
                    console.log("[+] Succes GET data", data);
            
                    if(data[0].ID == "error"){
                        console.log("[-] error", data[0].ID);                
                        this.Auth_alert(4);
                    }

                    else{

                            
                        let auth = this.DB.save(data,"userdata",["ID","user_coin","busker_coin","busker_heart"]);
                  
                        console.log("[+] auth data state", auth);
                        
                        if(auth){

                                this.Auth_alert(1);       
                        }
                        else{
                    
                                this.Auth_alert(2);
                        }

                              
                          
                  }
              },
              
              (err) => {
                        
                       // this.Auth_alert(3);
              }
          );
      }

}

  Auth_alert(select : number){

        let title_value : string;
        let message_content : string;

        if(select == 1){
          title_value = "Success";
          message_content = "로그인에 성공하셨습니다.";  
        }
        else if(select == 2){
          title_value = "Failed";
          message_content = "로그인에 실패하셨습니다. 다시 시도해 주십시오";
        }
        else if(select == 3){
          title_value = "Failed";
          message_content = "서버상태가 원활하지 않습니다.";
        }
        else if(select == 4){
          title_value = "Failed";
          message_content = "아이디 또는 비밀번호가 틀렸습니다."
        }

        let alert_frame = Alert.create({
              title : title_value,
              message : message_content,
              buttons : [{
                text : "OK",
                handler : (data) => {
                  
                  console.log("[+] button evented");
                  if(select == 1){

                      this.nav.setRoot(MainPage);
                  }
               } 
              }]
        });

        this.nav.present(alert_frame);
  }
  
  
}