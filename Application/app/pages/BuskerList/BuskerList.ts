import {Component} from '@angular/core'
import {ViewController} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

import {busker_unit_list} from "./Directive/buskerUnit";

@Component({
  templateUrl: 'build/pages/BuskerList/BuskerList.html',
  directives :[busker_unit_list]
})
export class BuskerListPage{
    constructor(private ctrl :ViewController){
        
    }

    @Input() close(){
        navigator.vibrate(200);

        this.ctrl.dismiss();
    }
}