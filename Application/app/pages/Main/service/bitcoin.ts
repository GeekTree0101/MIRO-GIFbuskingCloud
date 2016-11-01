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

    private user_charge_coin = 100;

    constructor(private ctrl :ViewController,
                private nav : NavController,
                private DB : localStorage_service, 
                private http : HttpProtocalService,
                public event : Events
    ){
        
        this.Bit_Coin = this.Accept_Coin - 100;

        let sizeUp = setInterval(() => {

            this.Bit_Coin++;
            
            if(this.Bit_Coin == this.Accept_Coin){
                clearInterval(sizeUp);
            }

        }, 10);
    }

    @Input() close(){
        
        //memory free
        this.Bit_Coin = null;
        this.Accept_Coin = null;

        navigator.vibrate(200);
        this.ctrl.dismiss();
    }

    @Output() charge(){

        console.log("[+] User charging bit coin");

        let input_box = Alert.create({
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
                  
                        this.user_charge_coin = parseInt(money);

                        if(isNaN(this.user_charge_coin)){

                            this.feel_the_toast("금액을 잘못된 값으로 입력하셨습비다.");
                        }
                        else{

                            let charge_money_data = { 
                            
                                ID : this.DB.load("ID","userdata"), 
                                charge_coin : this.user_charge_coin 
                            }

                            this.http.POST(charge_money_data,"application/json","https://192.168.1.9:7000/CashSystem");

                            this.event.subscribe("POST",
            
                                    (data) => { //Async Event
            
                                                console.log("[+] Succes POST data");

                                                let check = this.DB.save(data, "userdata", ["user_coin"]);

                                                if(check){
                    
                                                        this.Bit_Coin = this.DB.load("user_coin", "userdata");
                                                }
  
                                                this.feel_the_toast("+ " + this.user_charge_coin + " 만큼 충전되었습니다.")
                                    },
            
                                    (err) => {
                
                                                console.log(err);
                                                this.feel_the_toast("서버의 상태가 원활하지 않습니다.");
                                    }
                            );  //event end

                        }
                  }
              }]

            });  // prompt end        


        this.nav.present(input_box);                            
    }

    feel_the_toast(message_value : string){

        let obj = Toast.create({
            message : message_value,
            duration : 3000,
            position : 'bottom',
            showCloseButton : true,
            closeButtonText : "OK"            
        });
        navigator.vibrate(200);
        this.nav.present(obj);
    }    

}