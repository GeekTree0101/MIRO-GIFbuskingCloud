/*
  AngularJS2 Directive with Ionic2
  Copyright(C) 2016 Ha Hyeon soo

  [CAUTION]
  IF YOU USE [ES5 JAVASCRIPT EXTERNAL LIB]
  Follow this!
  
  1. npm install -d [NAME] --verbose
  2. typings search [NAME]
  3. typings install registry:dt/[NAME] --global --save
  4. import * as [MODULE_NAME] from [NAME_ON_NPM_MODULES]


*/

import {Component, AfterContentInit } from '@angular/core';
import {ElementRef, HostListener, Input, Output} from '@angular/core';
import {ViewController, Alert, NavController, Events} from 'ionic-angular';
import * as PIXI from 'pixi.js';
import * as THREE from 'three';

//HTTP protocol
import {HttpProtocalService} from '../../../service/HttpProtocol';


/*************************************
 * 
 * Compare Module
 *  
**************************************/
@Component({
    templateUrl : 'build/pages/List/Application/view/compare.html'
})
export class Compare{
    
    private appData = [
        {
            name : "Java Running",
            outputValue : 0,
            target : 0,
            state : "start",
            flag : true
        },
        {
            name : "Native C++ Running",
            outputValue : 0,
            target : 1,
            state : "start",
            flag : true
        },
        {
            name : "JavaScript Running",
            outputValue : 0,
            target : 2,
            state : "start",
            flag : true
        }
    ]
    
    private selectValue : number;
    
    constructor(
        private ctrl : ViewController,
        private nav : NavController
       
    ){
        this.selectValue = 1000000;
        console.log("[+] Component for Directive Sample Init");
    }
    
    @Output() close(){
        navigator.vibrate(200);
        this.ctrl.dismiss();
    }
    
    @Output() Run(target){
        console.log("[+] operating target ",target);
        
        navigator.vibrate(200);
        if(this.appData[target].flag){
        
            this.appData[target].state = "Calculating...";
            this.appData[target].flag = false;
            console.log(this.appData[target].state)
        
            if(target == 0){
                //TODO: Java
                console.log("[+] Java Activaty");
                (<any>window).nativeCall.runJava(this.selectValue,(data) => {
                    this.appData[0].outputValue = data;
                    this.doAlert();
                    this.appData[0].state = "start";
                    this.appData[0].flag = true;                    
                });            
            }
            else if(target == 1){
                 //TODO: C++
                console.log("[+] Native Activaty");
                (<any>window).nativeCall.runNative(this.selectValue,(data) => {
                    this.appData[1].outputValue = data;
                    this.doAlert();
                    this.appData[1].state = "start";
                    this.appData[1].flag = true;
                });            
            }
            else{
                //TODO: javascript    
                console.log("[+] JavaScript Activaty");
                this.javaScriptTask(this.selectValue, (data)=>{
                    console.log("[+] Javascript Callback",data);
                    this.appData[2].outputValue =data;
                    this.appData[2].state = "start";
                    this.appData[2].flag = true;
                    this.doAlert();                    
                })            
            }

        }
    }
    
    doAlert(){
        
        //TODO : Popup aler
     
        let sucess = Alert.create({
            title: 'Success!',
            message : 'Check your content output result card!',
            buttons: ['OK']
        })
        
        navigator.vibrate(200);
        this.nav.present(sucess);
        
    }
    
    javaScriptTask(param, callback){
        
        //TODO: JavaScript Running
        var time = new Date().getTime();
        try{
            let base = 0;
            for(var i = 0; i < param; i++){
                base = base + i;
            }
        }
        finally{
            var end = new Date().getTime();
            if(typeof callback === 'function'){
                callback(end-time);
            }
        }
    }
    
}


/*************************************
 * 
 * Floating Module
 *  
**************************************/
@Component({
    templateUrl : 'build/pages/List/Application/view/floating.html'
})
export class Floating{
    
    
    constructor(
        private ctrl : ViewController,
        private nav : NavController
    ){
        console.log("[+] Component for Directive Sample Init");
    }
    
    @Output() close(){
        navigator.vibrate(200);
        try{
            this.stop();
        }
        catch(e){
            console.log(e);
        }
        this.ctrl.dismiss();
    }
    
    @Output() start(){
        //TODO : start floating activity
        
        navigator.vibrate(200);
        console.log("[+] Start Floating Activity");
       
        (<any>window).cordovafloatingactivity.startFloatingActivity(null,(ret) => {
            console.log("[+] Success : " + ret);
        }, (error) =>{
            console.log("[-] Error : " +error);
        });
    }
    
    @Output() stop(){
        //TODO : stop floating activity
       
        navigator.vibrate(200);
        console.log("[-] Stop Floating Activity");
        (<any>window).cordovafloatingactivity.stopFloatingActivity(null,(ret) => {
            console.log("[+] Success : " + ret);
        }, (error) =>{
            console.log("[-] Error : " +error);
        });        
    }
}


/*************************************
 * 
 * WebGL Module with PIXI
 *  
**************************************/
@Component({
    templateUrl : 'build/pages/List/Application/view/pixi.html'
})
export class Pixi{
    
    //TODO: Pixi Example
    private task : any;
    
        
    constructor(
        private ctrl : ViewController
    ){
        console.log("PIXI",PIXI);
        console.log("[+] Component for PIXI Init");
    }

    @Output() close(){
        navigator.vibrate(200);
        this.task = null;
        this.ctrl.dismiss();
    }
    
    @Output() run(){
        this.task = this.application();
        
    }
    
    application(){
        
        let X = window.innerWidth;
        let Y = window.innerHeight*2/3;
        
        let renderer = PIXI.autoDetectRenderer(X,Y,{backgroundColor : 0xD6E6F2});
        renderer.view.style.position = "absolute";
        renderer.view.style.left="0";
        
        let target = document.getElementById("PIXI");
        target.appendChild(renderer.view);
        
        let stage = new PIXI.Container;
        let img = PIXI.Texture.fromImage('image/ionic.png');   
        
        var obj = new PIXI.Sprite(img);
        
        //option
        obj.anchor.x = 0.5;
        obj.anchor.y = 0.5;
        
        obj.position.x = X/2;
        obj.position.y = Y/2;
        
        //app run
        stage.addChild(obj);
        
        animate();
        function animate(){
            
            requestAnimationFrame(animate);
            obj.rotation += 0.1;
            renderer.render(stage);
        }
    }
   
}

/*************************************
 * 
 * NFC Module
 *  
**************************************/
@Component({
    templateUrl : 'build/pages/List/Application/view/nfcView.html',
    providers : [HttpProtocalService]
})
export class NFCmodule{
    
    
    private NFC_ID : any;
    private GET_DATA = {
        flag : false,
        data : null
    }
    
    
    constructor(
        private ctrl : ViewController,
        private nav : NavController,
        private http : HttpProtocalService,
        public event : Events
    ){
        console.log("[+] Component for Directive Sample Init");
        this.NFC_ID = "Please pus [PUSH] button!";
    }
    
    @Output() close(){
        navigator.vibrate(200);

        this.ctrl.dismiss();
    }
    
    @Output() Run(){
         
        //TODO : start NFC activity
        navigator.vibrate(200);
        (<any>window).nfc.addTagDiscoveredListener(
            (data) =>{
              //callback data -> nfc infomation
              
              let ID_array = data.tag.id;
              let ID_value = "";
              
              for(var i = 0; i < ID_array.length; i++){
                    //Integer to Hex code
                    if(ID_array[i] < 0){
                        ID_array[i] = ID_array[i] + 256;   
                    }
                    ID_array[i] = ID_array[i].toString(16);
                    ID_value += ID_array[i].toUpperCase();   
              }
              
              //return nfc id to VIEW component
              this.NFC_ID = ID_value;
              this.informationAlert("success"); 
              
            },
            (sucess) => {
                // nfc listenner commit!
                console.log(sucess);
                this.informationAlert("closeYourCard");
            },
            (err) => {
                // Must Check NFC activatied!
                console.log(err);
                this.informationAlert("failed");
                
            }
        )
    }
    
    @Output() Get(){
        
        if(this.NFC_ID != null){
            
            let token = this.NFC_ID;
            this.http.GET("JSON","http://192.168.1.13:3000/nfc", token);   
            
            this.event.subscribe("GET",(data) => { //Async Event
                console.log("[+] Succes GET data");
                this.GET_DATA.data = data;
                this.GET_DATA.flag = true; //Show UI
            })
            
        }
        else{
            this.informationAlert("closeYourCard");
        }
    }
    
    
    informationAlert(target){
        
        //TODO : Popup aler
     
        let failed = Alert.create({
           title : 'Confirm NFC module state',
           message : 'you must check NFC module P2P receive state!',
           buttons :[
               {
                   text: "Open",
                   handler: () => {
                       console.log("[+] open NFC module setting!");
                       (<any>window).nfc.showSettings(
                           () => {console.log("success"); },
                           () => {this.informationAlert("noNFC");}
                       );                 
                   }
               },
               {
                  text: "Cancel",
                  handler : () => {
                      console.log("[+] user don't want nfc activaty!");  
                  }
               }
           ] 
        });
        
        let closeYourCard = Alert.create({
            title : "Please Tag!",
            message :"Please Tag your card on your mobile",
            buttons :["OK"]
        })
        
        let success = Alert.create({
            title : 'Success',
            message : 'NFC id is ' + this.NFC_ID,
            buttons : ["OK"]
        });
        
        let noNFC = Alert.create({
            title : "No NFC module!",
            message : "This device dose not support NFC",
            buttons : ["OK"]
        });
        
        
        navigator.vibrate(200);
        if(target == "sucess"){   
            this.nav.present(success);
        }
        else if(target == "failed"){        
            this.nav.present(failed);
        }
        else if(target == "noNFC"){           
            this.nav.present(noNFC);
        }
        else if(target == "closeYourCard"){
            this.nav.present(closeYourCard);
        }
        
    }
}



@Component({
    templateUrl : "build/pages/List/Application/view/webGL.html"
})

export class webGL{
    
    private scene : any;
    private renderer :any;
    private camera :any;
    private mesh : any;

    constructor(
        private ctrl : ViewController,
        private nav : NavController
    ){
        console.log("[+] WebGL contructor init");
        setTimeout(() => {
            this.init();
            this.createMesh();
            this.draw();
        },2000);
    }    
    
    @Output() close(){
        navigator.vibrate(200);

        this.ctrl.dismiss();
    }  
 
    init() {
        
       this.renderer = new THREE.WebGLRenderer({alpha : true});
       this.renderer.setSize((<any>window).innerWidth, (<any>window).innerHeight);
       console.log("[+] renderder info",this.renderer);
       this.renderer.setClearColor( 0xD6E6F2,1);
       document.getElementById("animation").appendChild(this.renderer.domElement);
       
       this.scene = new THREE.Scene();

       var aspect = innerWidth / innerHeight;
       this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 10000);
       this.camera.position.z = 1000;
    }

    createMesh() {
        
        var geometry = new THREE.SphereGeometry(100);
        var material = new THREE.MeshBasicMaterial({
            color: 0x3322dd,
            wireframe: true
        });
        
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    draw() {
        
        requestAnimationFrame(this.draw.bind(this));

        this.mesh.rotation.x += .01;
        this.mesh.rotation.y += .02;

        this.renderer.render(this.scene, this.camera);
    }

 

}


@Component({
    templateUrl :  "build/pages/List/Application/view/css3D.html"
})

export class css3D{

    private animateList = [];
    private personalState = [0,0,0];
    private animationData = [
        
        //animation-object
        {
            "motion" : 
            [
                {transform: 'rotateX(0deg) scale(1)' , opacity : 1, backgroundColor : "#FFFDC1"},
                {transform: 'rotateX(120deg)  scale(0.5)' , opacity : 0.5},
                {transform: 'rotateX(240deg) scale(1.6)' , opacity : 0.7},
                {transform: 'rotateX(360deg) scale(1)' , opacity : 1, backgroundColor : "#F0B775"}                   
            ],
            "option" :
            {
                duration: 1500, //milliseconds
                easing: 'curve', //'linear', a bezier curve, etc.
                delay: 10, //milliseconds
                iterations: 1, //or a number
                direction: 'alternate', //'normal', 'reverse', etc.
                fill: 'forwards' //'backwards', 'both', 'none', 'auto'                  
            }                 
        },
        //animation-object
        {
            "motion" : 
            [
                {transform: 'rotateY(0deg) scale(1)' , opacity : 1, backgroundColor : "#F0B775"},
                {transform: 'rotateY(120deg) scale(0.5)' , opacity : 0.5},
                {transform: 'rotateY(240deg)scale(1.6)' , opacity : 0.7},
                {transform: 'rotateY(360deg) scale(1)' , opacity : 1, backgroundColor : "#75B0F0"}                   
            ],
            "option" :
            {
                duration: 1500, //milliseconds
                easing: 'curve', //'linear', a bezier curve, etc.
                delay: 10, //milliseconds
                iterations: 1, //or a number
                direction: 'alternate', //'normal', 'reverse', etc.
                fill: 'forwards' //'backwards', 'both', 'none', 'auto'                  
            }                 
        },
        //animation-object
        {
            "motion" : 
            [
                {transform: 'rotateZ(0deg) scale(1)' , opacity : 1, backgroundColor : "#75B0F0"},
                {transform: 'rotateZ(120deg) scale(0.5)' , opacity : 0.5},
                {transform: 'rotateZ(240deg) scale(1.6)' , opacity : 0.7},
                {transform: 'rotateZ(360deg) scale(1)' , opacity : 1, backgroundColor : "#FFFDC1"}                   
            ],
            "option" :
            {
                duration: 1500, //milliseconds
                easing: 'curve', //'linear', a bezier curve, etc.
                delay: 10, //milliseconds
                iterations: 1, //or a number
                direction: 'alternate', //'normal', 'reverse', etc.
                fill: 'forwards' //'backwards', 'both', 'none', 'auto'                  
            }                 
        },                
        //exit-button
        {
            "motion" : 
            [
                {transform: 'scale(0)' , opacity : 0},
                {transform: 'scale(0.5)' , opacity : 0.8},
                {transform: 'scale(0.3)' , opacity : 0.5},
                {transform: 'scale(1)' , opacity : 1}                   
            ],
            "option" :
            {
                duration: 900, //milliseconds
                easing: 'linear', //'linear', a bezier curve, etc.
                delay: 2000, //milliseconds
                iterations: 1, //or a number
                direction: 'alternate', //'normal', 'reverse', etc.
                fill: 'forwards' //'backwards', 'both', 'none', 'auto'                  
            }                 
        }
   ];
    
    

 
    constructor(  private ctrl : ViewController, private nav : NavController){
       
    }
    
    
    @Output() close(){
        navigator.vibrate(200);
        this.ctrl.dismiss();
        
    }  
    
    ngAfterContentInit(){
        
        let dom = (<any>window).document.querySelectorAll(".animation-object");
      
        for(var i =0; i < dom.length; i++){
            let temp =dom[i].animate(this.animationData[0].motion,this.animationData[0].option);
            temp.pause();
            this.animateList.push(temp);
        }    

        let button_object = (<any>window).document.querySelector(".exit-button");
        this.animateList.push(button_object.animate(this.animationData[3].motion,this.animationData[3].option));


    } 
    
    @Output() act(index){
             navigator.vibrate(200);
            if(this.personalState[index-1] > 2){
                this.personalState[index-1] = 0;
            }
            
            let dom = (<any>window).document.querySelectorAll(".animation-object");
            
            let temp =dom[index-1].animate(this.animationData[this.personalState[index-1]].motion,this.animationData[this.personalState[index-1]].option);
            temp.pause();
            this.animateList[index-1] = temp;

        
            (<any>this.animateList[index-1]).play();
            
            this.personalState[index-1]++;
    }
 
 
}




@Component({
    templateUrl : "build/pages/List/Application/view/aniUI.html"
})

export class aniUI{
    
    private state = 0;
    private hide = false;
    
    private data = [
        [
                {transform: 'rotateZ(0deg)' , opacity : 1, backgroundColor : "#F6416C"},
                {transform: 'rotateZ(120deg)' , opacity : 0.5},
                {transform: 'rotateZ(240deg)' , opacity : 0.7},
                {transform: 'rotateZ(360deg)' , opacity : 1, backgroundColor : "#FF9A00"}            
        ],
        [
                {transform: 'rotateX(0deg) scale(1)' , opacity : 1, backgroundColor : "#FF9A00"},
                {transform: 'rotateX(120deg)' , opacity : 0.5},
                {transform: 'rotateX(240deg)' , opacity : 0.7},
                {transform: 'rotateX(360deg) scale(1.5)' , opacity : 1, backgroundColor : "#F6416C"}            
        ]
    ]
    
    private data2 = [
        "Hello world", "Hello AniUI"
    ]


    constructor(
        private ctrl : ViewController,
        private nav : NavController
    ){
        console.log("[+] aniUI contructor init");
    }    
    
    @Output() close(){
        navigator.vibrate(200);

        this.ctrl.dismiss();
    }  
 
    private presentData = "Click!";

    @Output() touch(){
        
         navigator.vibrate(200);
        if(!this.hide){
            this.exitAnimation();
        } 
        
        if(this.state == 1){
            //전체화면모드 헤제     
            document.webkitExitFullscreen();
        } 
         
        if(this.state > 1){
            //전체화면모드
            document.documentElement.webkitRequestFullScreen();                
            
            console.log("[+] Act fullscreen mode");
            this.state = 0;
        }
        
        
        
        console.log("[+] touched",this.state);
        
        
        let dom = (<any>window).document.querySelector(".circle");
        
            dom.animate(this.data[this.state],{
            
                duration: 700, //milliseconds
                easing: 'ease-in-out', //'linear', a bezier curve, etc.
                delay: 10, //milliseconds
                iterations: 1, //or a number
                direction: 'alternate', //'normal', 'reverse', etc.
                fill: 'forwards' //'backwards', 'both', 'none', 'auto'  
            })
        this.presentData = this.data2[this.state];
        this.state ++;
        
    }


    exitAnimation(){
      
            this.hide = true;
            
            let dom = (<any>window).document.querySelector(".exit");
            dom.animate([
                {transform: 'scale(0)' , opacity : 0}, 
                {transform: 'scale(1)' , opacity : 1} 
            ],{
                duration: 700, //milliseconds
                easing: 'ease-in-out', //'linear', a bezier curve, etc.
                delay: 10, //milliseconds
                iterations: 1, //or a number
                direction: 'alternate', //'normal', 'reverse', etc.
                fill: 'forwards' //'backwards', 'both', 'none', 'auto'                
            })
    }


}

@Component({
    templateUrl : "build/pages/List/Application/view/svg.html"
})

export class SVG{


    private flag = false;

    constructor(
        private ctrl : ViewController,
        private nav : NavController
    ){
        console.log("[+] SVG contructor init");
    }    
    
    @Output() close(){
        navigator.vibrate(200);

        this.ctrl.dismiss();
    }  

    @Input() actSVG(){
        
        this.flag = true;
        console.log("[+] SVG animation activatied");
        setTimeout(()=>{
            this.drawing();
        },200);
    }
    
    drawing(){
        let temp = (<any>window).document.querySelector("#draw");
            
            var move = [
                'M 0 150 q 50 -200 100 0 q 50 -200 100 0 q 50 -200 100 0 q 50 -200 100 0',
                'M 0 250 q 50 -200 100 0 q 50 -200 100 0 q 50 -200 100 0 q 50 -200 100 0',
                'M 0 350 q 50 -200 100 0 q 50 -200 100 0 q 50 -200 100 0 q 50 -200 100 0'
            ]
            
            
            temp.setAttribute("d",move[0]+" "+move[1]+" "+move[2]);
                
            temp.animate([
                {'strokeDashoffset' : 1000 ,stroke: "#F6416C"}, 
                {'strokeDashoffset': 0},
                {'strokeDashoffset': 500},
                {'strokeDashoffset': 0},
                {'strokeDashoffset': 1000 ,stroke : "#FF9A00"} 
            ],{
                duration: 2000, //milliseconds
                easing: 'ease-in-out', //'linear', a bezier curve, etc.
                delay: 10, //milliseconds
                iterations: Infinity, //or a number
                direction: 'alternate', //'normal', 'reverse', etc.
                fill: 'forwards' //'backwards', 'both', 'none', 'auto'                
            })        
        
        
    }
    
    

}
