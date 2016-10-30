import {Component,  AfterContentInit, HostListener} from '@angular/core'
import {ViewController, NavController, Alert, Events, Toast} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

@Component({
  templateUrl: 'build/pages/Busker/Busker.html'
})
export class BuskerPage{


    private real_time_heart = 0;
    private real_time_bitcoin = 0;
    private NFC_ID : any;
    private state_flag = false;

    constructor(private ctrl :ViewController, private nav :NavController){
        
    }

    @Input() close(){

        this.calculate();
        navigator.vibrate(200);
        this.ctrl.dismiss();
    }

    @HostListener('press',['$event']) press(event){
        navigator.vibrate(1000);
        this.bluetooth_state_check();
    }

    ngAfterContentInit(){

        this.bluetooth_state_check();
     }

    bluetooth_state_check(){

        navigator.vibrate(200);

        let bluetooth = (<any>window).bluetoothSerial;
        bluetooth.isConnected(
            (success)=>{ this.feel_the_toast()},
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
                            this.feel_the_toast();
                            this.state_flag = true;
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

        },()=>{})
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
            () => {
                this.informationAlert("cut");
                this.state_flag = false;
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

        let cut = Alert.create({
            title : "연결이 헤제되었습니다.",
            message :"디바이스와 사물간의 연결이 정상적으로 헤제 되었습니다.",
            buttons :["OK"]
        })
        
        navigator.vibrate(200);
        if(target == "fail"){        
            this.nav.present(fail);
        }
        else if(target == "pair"){           
            this.nav.present(pair);
        }
        else if(target == "cut"){
            this.nav.present(cut);
        }
        
    }


    feel_the_toast(){

        let obj = Toast.create({
            message : "사물과 연결이 되었습니다.",
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

    private Like_count = 122;
    private Coin_count = 130300;

    constructor(private ctrl :ViewController){
        
        let max = this.Like_count;
        this.Like_count = this.Like_count - 100;
        this.Coin_count = this.Coin_count - 100;

        let sizeUp = setInterval(() => {
            
            this.Like_count++;
            this.Coin_count++;
            
            if(this.Like_count == max){
                clearInterval(sizeUp);
            }

        }, 10);        
    }

    @Input() close(){
        navigator.vibrate(200);
        this.ctrl.dismiss();
    }
}