//View lib
import {Input, Output, Component} from '@angular/core'; 
import {ViewController, NavController, Events, Toast, Alert} from 'ionic-angular';
import {localStorage_service} from "../../../service/localStorage";

//HTTP protocol
import {HttpProtocalService} from '../../../service/HttpProtocol';


@Component({
    templateUrl : 'build/pages/Main/directive/bitcoin.html',
    providers : [localStorage_service, HttpProtocalService]
})
export class bitcoin_page{


    //NOTE : Bitcoin page / Charge coin, Show coin
    
    private Bit_Coin = 0;                                           
    private Accept_Coin = this.DB.load("user_coin", "userdata");
    
    private popup : any;
    private button_box : any;
    private user_charge_coin = 100;

    constructor(private view :ViewController,
                private nav : NavController,
                private DB : localStorage_service, 
                private http : HttpProtocalService,
                public event : Events)
    {

        //NOTE : Coin animation
        
        this.Bit_Coin = this.Accept_Coin - 100;

        if(this.Accept_Coin > 100){
            
            let sizeUp = setInterval(() => {

                this.Bit_Coin++;
            
                if(this.Bit_Coin == this.Accept_Coin){
                    clearInterval(sizeUp);
                }

            }, 10);
        }
        else{
            this.Bit_Coin = this.Accept_Coin;
        }

    }

    @Input() close(){                                   //Close View

        //console.log("coin page close");
        navigator.vibrate(200);
        this.view.dismiss();
    }

    @Output() charge(){                                 //Charge View

        //console.log("[+] User charging bit coin");
        this.button_box = Alert.create({
              title : "비트코인 충전",
              message : "충전하실 비트코인을 입력하세요",
              inputs  : [
                  {
                      name : 'coin',
                      placeholder: 'coin'
                  }
              ],
              buttons : [{
                  text : "OK",
                  handler : (money : any) => {

                    this.user_charge_coin = parseInt(money.coin);
                    //console.log("입력하신금액", money.coin);
                        
                    if(isNaN(this.user_charge_coin)){
                        this.Coin_toast("금액을 잘못된 값으로 입력하셨습니다.");
                    }
                    else{
                            
                        this.button_box.dismiss();                         //For fast view

                        let charge_money_data = { 
                            ID : this.DB.load("ID","userdata"), 
                            charge_coin : this.user_charge_coin 
                        }

                        this.http.POST(charge_money_data,"application/json","http://192.168.1.77:7777/CashSystem","bitcoin");

                        this.event.subscribe("bitcoin",
            
                            (data) => { //Async Event
            
                                    //console.log("[+] Succes POST data");

                                    // [+] UPDATE
                                    let check = this.DB.save(data[0], "userdata", ["user_coin"]);

                                    if(check){
                                         // [+] CHECK
                                         this.Bit_Coin = this.DB.load("user_coin", "userdata");
                                    }
  
                                    // [+] TOAST
                                    this.Coin_toast("+ " + this.user_charge_coin + " 만큼 충전되었습니다.")
                                                
                                    },
            
                            (err) => {
                                        //console.log("[+] Bitcoin error",err);
                                        //this.Coin_toast("서버의 상태가 원활하지 않습니다.");
                                    }
                        );
                    }
                  }
              }]
            });  // prompt end        

        if(this.nav.length() > 1){

            this.nav.last().dismiss();
        } 
        this.nav.present(this.button_box);
                   
    }

    Coin_toast(message_value : string){                 //Coin Toast

        this.popup = Toast.create({
            message : message_value,
            duration : 2000,
            position : 'bottom',
            showCloseButton : true,
            closeButtonText : "OK"            
        });

        navigator.vibrate(200);

        this.nav.present(this.popup);
    }    

}