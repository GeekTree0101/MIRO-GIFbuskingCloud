import {ViewController} from 'ionic-angular';
import {Input, Output, Component} from '@angular/core'; 

@Component({
    templateUrl : 'build/pages/Main/directive/heart.html'
})
export class heart_page{
    constructor(private ctrl :ViewController){
        
    }

    @Input() close(){

        this.ctrl.dismiss();
    }
}