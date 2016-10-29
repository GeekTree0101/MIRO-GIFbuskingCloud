import {ViewController} from 'ionic-angular';
import {Input, Output, Component} from '@angular/core'; 

@Component({
    templateUrl : 'build/pages/Main/directive/user.html'
})
export class user_page{

    private user_name = "GeekTree0101"

    constructor(private ctrl :ViewController){
        
    }

    @Input() close(){

        this.ctrl.dismiss();
    }

    @Output() logout(){

        console.log("[-] User Logout");
    }
}