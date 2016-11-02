import {ViewController, NavController, Alert, Events, Toast} from 'ionic-angular';
import {Input, Output,  AfterContentInit, Component, HostListener} from '@angular/core'; 
import {localStorage_service} from "../../../service/localStorage";

//HTTP protocol
import {HttpProtocalService} from '../../../service/HttpProtocol';

@Component({
    templateUrl : 'build/pages/Main/directive/heart.html',
    providers : [HttpProtocalService, localStorage_service]
})
export class heart_page{

    private NFC_ID  = null;
    
    private NFC_FLAG = true;

    private GET_DATA = {
        flag : false,                    //Bit coin I/O controll
    }

    private custom_coin = 1000;           //User Want to send money
    private user_coin = this.DB.load("user_coin", "userdata")           //user money

    private show_state = true;

    private message : any;

    private donation_method = [
        {
            image : "image/ionic.png",
            name : "Like"
        },
        {
            image : "image/ionic.png",
            name : "100 coin"
        },
        {
            image : "image/ionic.png",
            name : "1000 coin"
        },
        {
            image : "image/ionic.png",
            name : "10000 coin"
        },
        {
            image : "image/ionic.png",
            name : " coin"
        },                        
    ]

    constructor(private view :ViewController, 
                private nav : NavController,
                private http : HttpProtocalService,
                public event : Events,
                private DB : localStorage_service
                )
    {}

    ngAfterContentInit(){

         this.NFCrun();       
         setTimeout(()=>{
             this.informationAlert("closeYourCard");
         },3000);
    }

    @Input() close(){
        navigator.vibrate(200);
    
        this.view.dismiss();
        
    }

    @Input() coin_size_up(touch : boolean, index :number){

        navigator.vibrate(200);
        this.show_state = false;
        
        if(touch){

            this.custom_coin++;
        }
        else{
            
            if(index == 0){

                this.custom_coin = 0;
                this.message = "좋아요를 기부하셨습니다.";
            }
            else{

                this.custom_coin = 0;
                this.custom_coin = index;
                this.message =  "비트코인을 " + this.custom_coin + " 만큼 기부하였습니다." ;
            }
        }
    }


    @HostListener('swipe',['$event']) delete_press_event(event){
        navigator.vibrate(50);
        this.show_state = true;
    }    

    @Output() NFCrun(){
         
        //TODO : start NFC activity
        navigator.vibrate(200);

        (<any>window).nfc.addTagDiscoveredListener(
            (data) =>{
              //callback data -> nfc infomation
              
              console.log("[+] nfc tag start")
              let ID_array = data.tag.id;
              let ID_value = "";
              
              for(var i = 0; i < ID_array.length; i++){
                    //Integer to Hex code
                    if(ID_array[i] < 0){
                        ID_array[i] = ID_array[i] + 256;   
                    }
                    ID_array[i] = ID_array[i].toString(16);
                    ID_value += ID_array[i].toUpperCase();   
              }
              
              //return nfc id to VIEW component
              this.NFC_ID = ID_value;
              
              if(this.NFC_FLAG && this.show_state == false){
                
                //console.log("[+] nfc post start");
                this.NFC_FLAG = false;
                this.POST();

              }
              else{
                this.Bit_coin_toast(false);
              }
            },
            (sucess) => {
                // nfc listenner commit!

              //  console.log("[+] nfc tag addeventlistner success", sucess);
            },
            (err) => {
                // Must Check NFC activatied!
                console.log("[-] nfc tag error", err);
                this.informationAlert("failed");
                
            }
        )
    }
    
    @Output() POST(){
        
        if(this.NFC_ID != null && this.NFC_FLAG == false){
            
            let token = {
              NFC_ID : this.NFC_ID,
              ID : this.DB.load("ID","userdata"),
              send_coin : this.custom_coin
            }

            //console.log("[+] post donation");
            this.http.POST(token, "application/json", "http://192.168.1.9:7777/Donation", "heart");   
            
            this.event.subscribe("heart",
            
            (data : any) => { //Async Event
                
                if(this.show_state == false){
                    
                    console.log("[+] update coin");
                    let check = this.DB.save(data[0], "userdata", ["user_coin"]);

                    if(check){
                        this.user_coin = this.DB.load("user_coin", "userdata");
                    }
                }

                //flag setting

                this.GET_DATA.flag = true; //Show UI

                this.Bit_coin_toast(true);
                this.NFC_FLAG = true;
                this.NFC_ID = null;
                this.show_state = true;
            },
            (err) => {
                
                console.log("NFC",err);
              //this.Bit_coin_toast(false);
            }
          )
            
        }
        else{
            this.informationAlert("closeYourCard");
        }
    }
    
    informationAlert(target){
        
        //TODO : Popup aler
     
        let failed = Alert.create({
           title : 'Confirm NFC module state',
           message : 'you must check NFC module P2P receive state!',
           buttons :[
               {
                   text: "Open",
                   handler: () => {
                       console.log("[+] open NFC module setting!");
                       (<any>window).nfc.showSettings(
                           () => {console.log("success"); },
                           () => {this.informationAlert("noNFC");}
                       );                 
                   }
               },
               {
                  text: "Cancel",
                  handler : () => {
                      console.log("[+] user don't want nfc activaty!");  
                  }
               }
           ] 
        });
        
        let closeYourCard = Alert.create({
            title : "태그해주세요~",
            message :"휴대폰으로 버스킹클라우드에 살짝 터치해주세요",
            buttons :["OK"]
        })
        
        
        let noNFC = Alert.create({
            title : "No NFC module!",
            message : "This device dose not support NFC",
            buttons : ["OK"]
        });
        
        
        navigator.vibrate(200);
        if(target == "failed"){        
            this.nav.present(failed);
        }
        else if(target == "noNFC"){           
            this.nav.present(noNFC);
        }
        else if(target == "closeYourCard"){
            this.nav.present(closeYourCard);
        }
        
    }

    Bit_coin_toast(flag : boolean){
     
      if(!flag){
     
          this.message = "원하시는 코인을 터치해주세요";
          this.custom_coin = 0;
      }
      let make = Toast.create({

          message : this.message,
          duration : 3000,
          position : 'top',
          showCloseButton : true,
          closeButtonText : "OK"
      });
      navigator.vibrate(200);
      this.nav.present(make);
    }    
}