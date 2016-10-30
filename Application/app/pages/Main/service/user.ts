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
        navigator.vibrate(200);
        this.ctrl.dismiss();
    }

    @Output() logout(){
        navigator.vibrate(200);
        console.log("[-] User Logout");
        localStorage.removeItem("Auth");
        
        setTimeout(()=>{
            window.location.reload();
        },2000);
    }
}