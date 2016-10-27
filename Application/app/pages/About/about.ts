/*
  AngularJS2 Component with Ionic2
  Copyright(C) 2016 Ha Hyeon soo

*/

//Import Angular
import {Component} from '@angular/core';
import {Input, Output} from '@angular/core'; 

//Import Ionic2
import {NavController, Events} from 'ionic-angular';


//Component Configration section
@Component({
    templateUrl : 'build/pages/About/about.html'
})

export class AboutPage{
    
    
    //Variable Section
    
    //Constructor
    constructor(private nav : NavController){
        //TODO: When start this Component who is first start!
        
        console.log("[+] Component Start ")
    }
    
    @Output() openPage(){
        navigator.vibrate([500,200,500]);
        console.log("[+] Open Github to GeekTree0101");
        window.open("https://github.com/GeekTree0101/MIRO_Interaction_Lab", "_blank",'location=no');
    }
 
}