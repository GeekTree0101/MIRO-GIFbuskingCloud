import {ViewController} from 'ionic-angular';
import {Input, Output, Component} from '@angular/core'; 

@Component({
    templateUrl : 'build/pages/Main/directive/bitcoin.html'
})
export class bitcoin_page{

    private Bit_Coin = 0;
    private Accept_Coin = JSON.parse(localStorage.getItem("userdata")).Coin;

    constructor(private ctrl :ViewController){
        
        this.Bit_Coin = this.Accept_Coin - 100;

        let sizeUp = setInterval(() => {

            this.Bit_Coin++;
            
            if(this.Bit_Coin == this.Accept_Coin){
                clearInterval(sizeUp);
            }

        }, 10);
    }

    @Input() close(){
        navigator.vibrate(200);
        this.ctrl.dismiss();
    }

    @Output() charge(){

        console.log("[+] User charging bit coin");
    }

}