import {Component} from '@angular/core'
import {ViewController} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

@Component({
  templateUrl: 'build/pages/Busker/Busker.html'
})
export class BuskerPage{

    constructor(private ctrl :ViewController){
        
    }

    @Input() close(){

        this.ctrl.dismiss();
    }
}