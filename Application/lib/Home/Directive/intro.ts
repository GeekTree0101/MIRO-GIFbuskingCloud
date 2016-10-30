/*
  AngularJS2 Directive with Ionic2
  Copyright(C) 2016 Ha Hyeon soo

*/

import {Component, AfterViewInit} from '@angular/core';
import {NavController, Events} from 'ionic-angular';


@Component({
    selector : 'hello-miro', // <directive_sample></directive_sample>
    templateUrl : 'build/pages/Home/Directive/intro.html'
})
export class introCard{
    
    private count = 0;
    private appData = [
        {
            script : "Hello World, Hello MIRO!",
            image : "image/1.png",
            show : true
        },
         {
            script : "Copyright(C) 2016 MIRO",
            image : "image/2.png",    
            show : false              
        },
         {
            script : "Advanced HTML5 Hybrid Mobile App Framework",
            image : "image/3.png" ,
            show : false
        },
         {
            script : "A  bit of add-on code tative device capabilities beyond what is available to pure web apps.",
            image : "image/4.png"   ,
            show : false                   
        },
         {
            script : "Be a Polyglot Programmer!",
            image : "image/5.png" ,
            show : false
        },
         {
            script : "Be a Hacker, Be a Hero with This application",
            image : "image/6.png" ,
            show : false                      
        }
    ]
    
    constructor(private nav : NavController, public event : Events){
    
        console.log("[+] contructor <hello-miro>",this.appData)
        this.count = 0;
    }       
            

    
    ngAfterViewInit(){
        this.event.subscribe('view',(data) => {
                console.log("[+] GET emit event data",data);
                
                if(data == "run"){
                    if(this.count < this.appData.length - 1){
                        console.log(this.appData.length + "/" + this.count)
                        let nodeData = this.appData;
                        this.count++;
                        nodeData[this.count].show = true;           
                    }
                }
                
       })

    }
    
}

