import {Component,  AfterContentInit, HostListener} from '@angular/core'
import {ViewController, NavController, Alert, Events, Toast} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 
import {localStorage_service} from "../../service/localStorage";

//HTTP protocol
import {HttpProtocalService} from './../../service/HttpProtocol';
import {Socket_service_donation} from './../../service/socket';

@Component({
  templateUrl: 'build/pages/Busker/Busker.html',
  providers : [localStorage_service, HttpProtocalService, Socket_service_donation]
})
export class BuskerPage{


    private real_time_heart = 0;
    private real_time_bitcoin = 0;
    private NFC_ID : any;
    private state_flag = false;

    constructor(private ctrl :ViewController, 
                private nav :NavController,
                private http : HttpProtocalService,
                private DB : localStorage_service,
                public event : Events,
                private IO : Socket_service_donation
                )
    {
        
        this.IO.socket.on('heart', (data) => {

            let temp = JSON.parse(data);
            
            if(temp.NFC_ID == this.NFC_ID){ // user recognization

                this.real_time_heart += 1;
                this.real_time_bitcoin += temp.send_coin;

                this.IO.socket.emit('heart', localStorage.getItem("userdata"));
            }

        })
    }

    @Input() close(){
        this.calculate();
    }

    @HostListener('press',['$event']) press(event){
        navigator.vibrate(1000);
        this.bluetooth_state_check();
    }

    ngAfterContentInit(){
        setTimeout(()=>{
            this.bluetooth_state_check();
        },2000);
     }

    bluetooth_state_check(){

        navigator.vibrate(200);

        let bluetooth = (<any>window).bluetoothSerial;
        bluetooth.isConnected(
            (success)=>{ this.feel_the_toast("이미 사물과 연결이 되어 있습니다.")},
            (err)=>{
                bluetooth.isEnabled(
                    (success) => {
                        this.bluetooth_connection();
                    },
                    (err) => {
                        this.informationAlert("fail");
                    }
                )
            })

    }

    bluetooth_connection(){

        //bluetoothSerial.list(sucess, fail);
        // [{"class": 276, "address" : "10:BF:,,,", "name" : "itead"}]
        //bluetoothSerial.connect(macAddress or uuid, success, fail)

        let bluetooth_list : any;
        let mac_address = "";

        let bluetooth = (<any>window).bluetoothSerial;
        
        bluetooth.list(
            (data)=>{ 
                bluetooth_list = data

                for(var i = 0; i < bluetooth_list.length; i++){

                    if(bluetooth_list[i].name == "itead"){
                        mac_address = bluetooth_list[i].address;
                        break;
                    }
                }

                if(mac_address.length < 5){
                    this.informationAlert("pair");
                }    
                else{
                    bluetooth.connect(
                        mac_address,                  //bluetooth mac address
                        () => {
                            this.write("*");          //send device connection
                        },                    
                        () => {
                            this.informationAlert("fail");
                        }                      
                    )
                }
            
            },

            (err)=>{ this.informationAlert("fail"); }
        )
        
    }


    read(){
        //bluetoothSerial.read(success, fail) READ DEVICE ID

        let bluetooth = (<any>window).bluetoothSerial;
        bluetooth.read((data)=>{

            if(data == "*"){

                while(true){
                
                    let temp : any;

                    bluetooth.read((data)=>{

                        temp = data;
                    })

                    if(temp == "*"){
                        break;
                    }
                    else{
                        this.NFC_ID = this.NFC_ID + temp;
                    }

                }
            }

            console.log("[+] from bluetooh", this.NFC_ID);

            let send_token = {
                ID : this.DB.load("ID","userdata"),
                NFC_ID : this.NFC_ID,
                Location : "대구광역시 북구 대학로 60 경북대학교 IT2-244"
            }        

            console.log("[+] Busking 요청");
            this.http.GET("JSON", "http://192.168.1.3:7777/Start", send_token, "busker");

            this.event.subscribe("busker", 
                (data) => {

                    console.log("[+] busking 성공");
                    this.feel_the_toast("사물과 연결이 되었습니다.");
                    this.state_flag = true;                        
                    
                },
                (err) => {

                    this.feel_the_toast("서버와의 연결이 원활하지 않습니다. 다시 시도해주세요");
                }
            );


        },
        (err)=>{
            console.log("bluetooth connection error");
        })
    }

    // R : red, G : green, B: blue *: connect with device 
    write(message : string){
        //bluetoothSerial.write(data, success, fail)

        let bluetooth = (<any>window).bluetoothSerial;

        bluetooth.write(message, 
            ()=>{ console.log("send",message)}, 
            ()=>{ 
                console.log("failed");
                this.informationAlert("fail");
            }
        )
    }

    calculate(){
        //before::close
        console.log("Heart", this.real_time_heart);
        console.log("Coin", this.real_time_bitcoin);
        this.write("*"); //disconnect
        (<any>window).bluetoothSerial.disconnect(
            (event) => {

                let user_ID = this.DB.load("ID", "userdata");
                let temp_user_coin = this.DB.load("user_coin", "userdata");
                let temp_busker_coin = this.DB.load("busker_coin", "userdata");
                let temp_busker_heart = this.DB.load("busker_heart", "userdata");

                let data = {
                    ID : user_ID,
                    user_coin : temp_user_coin + this.real_time_bitcoin,
                    busker_coin : temp_busker_coin + this.real_time_bitcoin,
                    busker_heart : temp_busker_heart + this.real_time_heart
                }

                this.http.GET("JSON", "http://192.168.1.3:7777/Update", data, "update");

                this.event.subscribe("update",
                
                    (data) => {

                        let check = this.DB.save(data, "userdata", ["ID", "user_coin", "busker_coin", "busker_heart"]);
                        if(check){
                            navigator.vibrate(200);
                            this.state_flag = false;
                            this.ctrl.dismiss();
                        }
                        else{

                            console.log("[-] DB error");
                        }
                    },

                    (err) => {

                        console.log("GET Error", data);
                    }

                )

            },
            () => {}
        )
    }

    informationAlert(target : string){
        
        //TODO : Popup aler
     
        let fail = Alert.create({
           title : '블루투스가 연결되지 않았습니다.',
           message : '설정으로가서 블루투스를 켜주세요.',
           buttons :["OK"]
        });
        
        let pair = Alert.create({
            title : "페어링이 되어있지않습니다.",
            message :"설정으로가서 페이링을 해주세요.",
            buttons :["OK"]
        })
        
        navigator.vibrate(200);
        if(target == "fail"){        
            this.nav.present(fail);
        }
        else if(target == "pair"){           
            this.nav.present(pair);
        }
    
        
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


@Component({
  templateUrl: 'build/pages/Busker/BuskerHeart.html'
})
export class BuskerHeartPage{

    private Like_count = this.DB.load("busker_heart", "userdata");
    private Coin_count = this.DB.load("busker_coin", "userdata");

    constructor(private ctrl :ViewController, private DB : localStorage_service){
        
        let max = this.Like_count;

        if(this.Like_count - 100 > 100){
            
            this.Like_count = this.Like_count - 100;
            this.Coin_count = this.Coin_count - 100;        
            let sizeUp = setInterval(() => {
            
                this.Like_count++;
                this.Coin_count++;
            
                if(this.Like_count == max){
                    clearInterval(sizeUp);
                    max = null;
                }

            }, 10);
        }

    }

    @Input() close(){

        this.Like_count = null;
        this.Coin_count = null;
        this.DB  = null;

        navigator.vibrate(200);
        this.ctrl.dismiss();
    }
}