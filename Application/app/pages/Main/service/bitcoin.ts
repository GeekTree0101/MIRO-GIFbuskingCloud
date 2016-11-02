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

    private Bit_Coin = 0;
    private Accept_Coin = this.DB.load("user_coin", "userdata");
    
    private popup : any;
    private button_box : any;
    private user_charge_coin = 100;

    constructor(private view :ViewController,
                private nav : NavController,
                private DB : localStorage_service, 
                private http : HttpProtocalService,
                public event : Events
    ){
        
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

    @Input() close(){
        console.log("coin page close");
        navigator.vibrate(200);
        this.view.dismiss();
    }

    @Output() charge(){

        console.log("[+] User charging bit coin");

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

                        console.log("button");

                        this.user_charge_coin = parseInt(money.coin);

                        console.log("입력하신금액", money.coin);
                        
                        if(isNaN(this.user_charge_coin)){

                            this.feel_the_toast("금액을 잘못된 값으로 입력하셨습니다.");
                        }
                        else{
                            
                            this.button_box.dismiss();

                            let charge_money_data = { 
                            
                                ID : this.DB.load("ID","userdata"), 
                                charge_coin : this.user_charge_coin 
                            }

                            this.http.POST(charge_money_data,"application/json","http://192.168.1.9:7777/CashSystem","bitcoin");

                            this.event.subscribe("bitcoin",
            
                                    (data) => { //Async Event
            
                                                console.log("[+] Succes POST data");

                                                let check = this.DB.save(data[0], "userdata", ["user_coin"]);

                                                if(check){
                    
                                                        this.Bit_Coin = this.DB.load("user_coin", "userdata");
                                                }
  
                                                this.feel_the_toast("+ " + this.user_charge_coin + " 만큼 충전되었습니다.")
                                                
                                    },
            
                                    (err) => {
                
                                                console.log("[+] Bitcoin error",err);
                                     //           this.feel_the_toast("서버의 상태가 원활하지 않습니다.");
                                    }
                            );  //event end
                         
                        }
                  }
              }]

            });  // prompt end        

        if(this.nav.length() > 1){
            this.nav.last().dismiss();
        } 
        this.nav.present(this.button_box);
                   
    }

    feel_the_toast(message_value : string){

        this.popup = Toast.create({
            message : message_value,
            duration : 2000,
            position : 'top',
            showCloseButton : true,
            closeButtonText : "OK"            
        });

        navigator.vibrate(200);

        this.nav.present(this.popup);
    }    

}