import {Component} from '@angular/core'
import {ViewController} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

@Component({
  templateUrl: 'build/pages/BuskerList/BuskerList.html'
})
export class BuskerListPage{
    constructor(private ctrl :ViewController){
        
    }

    @Input() close(){

        this.ctrl.dismiss();
    }
}