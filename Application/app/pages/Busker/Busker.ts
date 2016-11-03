//Import Module
import {Component,  AfterContentInit, HostListener} from '@angular/core'
import {ViewController, NavController, Alert, Events, Toast} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

//localStorage Service Module
import {localStorage_service} from "../../service/localStorage";

//HTTP protocol Module
import {HttpProtocalService} from './../../service/HttpProtocol';

//Socket Service Module
import {Socket_service_donation} from './../../service/socket';

@Component({
  templateUrl: 'build/pages/Busker/Busker.html',
  providers : [localStorage_service, HttpProtocalService, Socket_service_donation]
})
export class BuskerPage{

    private BLUETOOTH_HOST_NAME = "itead";

    private real_time_heart = 0;
    private real_time_bitcoin = 0;
    private NFC_ID : any;
    private state_flag = false;      //false
    private calculate_flag = false;


    constructor(private view :ViewController, 
                private nav :NavController,
                private http : HttpProtocalService,
                private DB : localStorage_service,
                public event : Events,
                private IO : Socket_service_donation
                )
    {
        
        this.IO.socket.on('heart', (data) => {                  // Socket ON

            console.log("[+] Accept heart", data);
            let temp = data;                        // JSON application
            
            
            if(temp.NFC_ID == this.NFC_ID){                     // busker recognization

                console.log("[+] cont up");
                this.real_time_heart += 1;                      // data change
                this.real_time_bitcoin += temp.send_coin;       // data change
            
                this.IO.socket.emit('heart', localStorage.getItem("userdata"));   
            }

        })
    }

    @Input() close(){                             //결산처리테스크


        if(!this.state_flag){                     // 사물이 연결되지 않은상태


            let bluetooth = (<any>window).bluetoothSerial;  //call BluetoothSerial Object
            bluetooth.disconnect(
                ()=>{
                    //disconnect success
                    this.view.dismiss();                   // 그냥 종료
                },
                ()=>{}
            );
        }
        else{                                     // 사물이 연결된 상태
        
            if(!this.calculate_flag){              // 결산 안했을시
                
                this.feel_the_toast("결산처리를 해주세요.");
            }
        }
         
    }

    @Output() run_calculate(){
        this.calculate();
    }

    @HostListener('press',['$event']) press(event){    //State Check Event Handler

        navigator.vibrate(1000);
        this.bluetooth_state_check();
    }

    ngAfterContentInit(){                              //State Auto Check after View created

        setTimeout(()=>{
            this.bluetooth_state_check();
        },2000);
    }
    
    bluetooth_state_check(){                           //Bluetooth State Check

        navigator.vibrate(200);

        let bluetooth = (<any>window).bluetoothSerial;   // Bluetooth Serial Plugin

        bluetooth.isConnected(

            //NOTE : Already Bluetooth Connected
            (success)=>{ this.feel_the_toast("이미 사물과 연결이 되어 있습니다.")},
            
            //NOTE : Bluetooth Connection Error Handler

            (err)=>{

                bluetooth.isEnabled(
                
                    (success) => {
                        //NOTE : Bluetooth state is ON, so connection with IoT
                        this.bluetooth_connection();
                    },

                    (err) => {
                        //NOTE : User have to turn on Bluetooth Function
                        this.informationAlert("fail");
                    }
                )
            })

    }


    /**
     *  Bluetooth List API
     *  bluetoothSerial.list(success_callback, failed_callback);
     *  return : [list{object}] / ex :[{"class": 276, "address" : "10:BF:,,,", "name" : "itead"}]
     *  
     *  Bluetoot Connection API
     *  bluetooth.connect(MacAddress | UUID, success_callback, failed_callback)
     *  return callback_function
     */
    bluetooth_connection(){                            //Bluetooth Connection Task

        let bluetooth_list : any;
        let mac_address = "";

        let bluetooth = (<any>window).bluetoothSerial;  //call BluetoothSerial Object
        
        bluetooth.list(

            (data)=>{ 

                bluetooth_list = data

                // [+] 블루투스 리스트 값으로 부터 해당하는 디바이스 네임 탐색
                for(var i = 0; i < bluetooth_list.length; i++){

                    if(bluetooth_list[i].name == this.BLUETOOTH_HOST_NAME){

                        //NOTE : 찾았음
                        mac_address = bluetooth_list[i].address;
                        break;
                    }
                }

                // [-] 블루투스 페어링이 되어있지 않음
                if(mac_address.length < 5){
                    
                    this.informationAlert("pair");
                }    
                else{

                    // [+] 블루투스 연결
                    bluetooth.connect(
                        mac_address,                  //bluetooth mac address
                        () => {
                            this.write('*');          //send device connection
                            this.read();

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
        console.log("[+] read start");
        
        bluetooth.subscribe(
            "\n",
        
            (data)=>{
                console.log("[+] accept bluetooth data is [" + data + "].");
                this.NFC_ID = data.substring(0, data.length - 2);
                this.send_after_read();
            },
            (err)=>{

                console.log("bluetooth connection error");
            })

    }

    send_after_read(){

            let temp_id = this.DB.load("ID", "userdata");

            let token = {
                "ID" : temp_id,
                "NFC_ID" : this.NFC_ID,
                "Location" : "대구광역시 북구 대학로 60 경북대학교 IT2-244"
            }        

            console.log("[+] Busking 요청");

            this.http.POST(token, "application/json", "http://192.168.1.77:7777/Start", "busker");

            this.event.subscribe("busker",

                (data) => {
                    this.write("*");
                    console.log("[+] busking 성공");
                    this.feel_the_toast("사물과 연결이 되었습니다.");
                    this.state_flag = true;                        
                    
                },
                (err) => {
                   // this.feel_the_toast("서버와의 연결이 원활하지 않습니다. 다시 시도해주세요");
                }
            );
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

                let data = {
                    ID : user_ID,
                    accept_coin : this.real_time_bitcoin, 
                    accept_heart : this.real_time_heart  // 0 + 5
                }

                this.http.POST(data, "application/json", "http://192.168.1.77:7777/Update", "update");

                this.event.subscribe("update",
                
                    (data) => {

                        let check = this.DB.save(data, "userdata", ["ID", "user_coin", "busker_coin", "busker_heart"]);
                        if(check){
                            navigator.vibrate(200);
                            this.state_flag = false;
                            this.view.dismiss();       // 결산 후 종료
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

    constructor(private view :ViewController, private DB : localStorage_service){
        
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
        this.view.dismiss();
    }
}