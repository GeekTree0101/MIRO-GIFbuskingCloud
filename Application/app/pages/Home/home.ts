/*
  AngularJS2 Component with Ionic2
  Copyright(C) 2016 Ha Hyeon soo

*/

//Import Angular
import {Component, ViewChild} from '@angular/core';
import {OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Input, Output} from '@angular/core'; 

//Import Ionic2
import {NavController, Content, Events} from 'ionic-angular';

//Import Directive
import {introCard} from './Directive/intro';


//Component Configration section
@Component({
    templateUrl : 'build/pages/Home/home.html',
    directives : [introCard]
})

export class HomePage implements OnInit, OnDestroy{
    
    @ViewChild(Content) content: Content;
    
    
    //Variable Section
    private scrollValue : any;
    private scrollEvent : any;
    private scrollHeight : any;
    private indexContent = [1,2,3,4,5,6];
    
    
    //Constructor
    constructor(
        private nav : NavController,
        public event :Events
    ){
        //TODO: When start this Component who is first start!
        console.log("[+] Component Start ");

    }
    
    ngOnInit(){
        //TODO: After [Constructor] LifeCycle 
    }
    
    ngOnDestroy(){
       
    }
    
    ngAfterViewInit(){
        console.log("[+] View Init");

    }
    
   @Output() doInfinite(event){
        console.log("begin operate");
        setTimeout(() => {
            this.event.publish('view',"run");
            event.complete();
        },500)   
   }
}