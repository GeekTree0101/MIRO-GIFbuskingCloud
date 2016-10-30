/*
  AngularJS2 Component with Ionic2
  Copyright(C) 2016 Ha Hyeon soo

*/

//Import Angular
import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Input, Output} from '@angular/core'; 

//Import Ionic2
import {NavController, Events, Modal, ViewController} from 'ionic-angular';

//Import Service Module
import {Service_Sample} from '../../service/service_sample';

//Import Directive Module
import {Compare, Floating, Pixi, NFCmodule, webGL, css3D, aniUI, SVG} from './Application/application';

//Component Configration section
@Component({
    templateUrl : 'build/pages/List/list.html',
    providers : [Service_Sample],
    directives : [Compare, Floating, Pixi, NFCmodule, webGL, css3D, aniUI, SVG]
    // styleUrls: [style_sheet_file_name.css]
    // selector: target_name
    //pipes : [pipe_service_name]
})

export class ListPage implements OnInit{
    
    
    //Variable Section
    private Variable_sample : any;
    
    
    //Constructor
    constructor(
        private nav : NavController,
        private service : Service_Sample,
        private viewCtrl : ViewController
    ){
        //TODO: When start this Component who is first start!
        console.log("[+] Component Start ")
    }
    
    ngOnInit(){
        //TODO: After [Constructor] LifeCycle 
        this.Variable_sample = "Hello world";
    }
    
    
    @Output() RUN(id){
        
        let run : any;
        navigator.vibrate(200);
        switch(id){
            case 0: run = Modal.create(Compare);
            break;
            case 1: run = Modal.create(Floating);
            break;
            case 2: run = Modal.create(Pixi);
            break;
            case 3: run = Modal.create(NFCmodule);
            break;
            case 4: run = Modal.create(webGL);
            break;
            case 5: run = Modal.create(css3D);
            break;    
            case 6: run = Modal.create(aniUI);
            break;   
            case 7: run = Modal.create(SVG);
            break;                                            
        }
        
        this.nav.present(run);
        
        
    }
 
    
}