import {Component, AfterContentInit, HostListener } from '@angular/core'
import {NavController, ViewController, Modal, Toast} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

import {bitcoin_page} from './service/bitcoin';
import {heart_page} from './service/heart';
import {user_page} from './service/user';
import {BuskerPage, BuskerHeartPage} from './../Busker/Busker';
import {BuskerListPage} from './../BuskerList/BuskerList';

import {Socket_service_busking} from './../../service/socket';

@Component({
  templateUrl: 'build/pages/Main/Main.html',
  directives : [bitcoin_page, heart_page, user_page, BuskerPage, BuskerListPage, BuskerHeartPage],
  providers : [Socket_service_busking]
})
export class MainPage{

    private animation_object_queue = [];                    //animation object queue

    private toggle_state = {
      name : "Audience",
      color_before : "#539DDB",
      color_after : "#F35B25"
    }
    
    private dynamic = {

      Coin_button : {
        "motion" :
        [
          {transform : 'scale(1)', borderRadius : "100%"},
          {transform : 'scale(1.2)', borderRadius : "100%"},
          {transform : 'scale(1)', borderRadius : "100%"}
          
        ],
        "option" :
        {
          duration: 3000, //milliseconds
          easing: 'linear', //'linear', a bezier curve, etc.
          delay: 10, //milliseconds
          iterations: Infinity, //or a number
          direction: 'normal', //'normal', 'reverse', etc.
          fill: 'forwards' //'backwards', 'both', 'none', 'auto'                  
        }       
      },

      Coin_howl : {

        "motion" : 
        [
         {transform : 'scale(1) rotateZ(0deg)', opacity : 0.5},
         {transform : 'scale(2) rotateZ(180deg)', opacity : 0.2},
         {transform : 'scale(3) rotateZ(360deg)',  opacity : 0}
        ],
        "option":{
          duration : 2000,
          easing : 'cubic-bezier(0,0.9,0.38,0.42)',
          delay : 20,
          iterations : Infinity,
          direction: 'normal',
          fill : 'forwards'
        }
      },

      Coin_touch_motion : {
        "motion" :
        [
          {transform : 'rotateY(0deg)', backgroundColor : "#539DDB"},
          {transform : 'rotateY(180deg)', backgroundColor : "#F35B25"}
        ],
        "option" :
        {
          duration : 800,
          easing : 'linear',
          delay : 20,
          iterations : 1,
          direction : 'normal',
          fill : 'forwards'
        }
      },
      
      Coin_touch_motion2 : {
        "motion" :
        [
          {transform : 'rotateY(0deg)', backgroundColor : "#F35B25"},
          {transform : 'rotateY(180deg)', backgroundColor : "#539DDB"}
        ],
        "option" :
        {
          duration : 800,
          easing : 'linear',
          delay : 20,
          iterations : 1,
          direction : 'normal',
          fill : 'forwards'
        }
      },
      Coin_side_menu : {
        "motion" :
        [
          {marginLeft : "100%", opacity : 0},
          {marginLeft : "0%", opacity : 0.8}
        ],
        "option":
        {
          duration : 800,
          easing : 'cubic-bezier(0,0.5,0.3,1)',
          delay : 20,
          iterations : 1,
          direction : 'normal',
          fill : 'forwards'
        }
      }

    }

    private menu_hide_flag = true;

    private view_list = {

      A : "user_page",
      B : "bitcoin_page",
      C : {
        name : "heart_page" // BuskerHeartPage
      },
      D : 
      {
        name : "BuskerListPage",    //Busker
        icon : "md-star"        //md-musical-notes
      }
    }


    constructor(private nav :NavController,
                private view :ViewController, 
                private IO : Socket_service_busking){
        
        this.IO.socket.on('start', (data) => {

            let temp_data = JSON.parse(data);
            this.Busker_Toast(temp_data.ID, temp_data.Location);

        });
        setTimeout(()=>{
          
          this.Busker_Toast("버스킹 클라우드에 오신것을 환영합니다.", "from MIRO internet of things team");
        
        },3000);
    }

    ngAfterContentInit(){

        this.UI_component(".Coin_button", "Coin_button", true, 0);
        this.UI_component(".Coin_howl", "Coin_howl", true, 0);
        this.UI_component(".Coin_side_menu", "Coin_side_menu", false, 0);
    }

    @Output() mode_change(){
      
      navigator.vibrate(200);
      if(!this.menu_hide_flag){
          console.log("Yes",this.menu_hide_flag);
          this.open_menu();
      }
      else{
          console.log("No", this.menu_hide_flag);
      }

      let click : any;
      let button_effect = this.dynamic["Coin_button"];
      

      if(this.toggle_state.name == "Audience"){
        
        click = this.dynamic["Coin_touch_motion"];
        setTimeout(() => {
          this.view_list.C.name = "BuskerHeartPage";
          this.view_list.D.name = "BuskerPage";
          this.view_list.D.icon = "md-musical-notes";
          this.toggle_state.name = "Busking";
        },800);
      }
      else{

        click = this.dynamic["Coin_touch_motion2"];
        setTimeout(()=>{
          this.view_list.C.name = "heart_page";
          this.view_list.D.name = "BuskerListPage";
          this.view_list.D.icon = "md-star";          
          this.toggle_state.name = "Audience";
        },800);        
      }


      let target_dom = this.animation_object_queue[0];               //button DOM
      target_dom.DOM.animate(click.motion, click.option);
      target_dom.Ctrl.play();



      setTimeout(() => {

        target_dom.DOM.animate(button_effect.motion, button_effect.option);
        target_dom.Ctrl.play();

      }, 800);

    }

    @HostListener('press',['$event']) open_menu(){
      
      navigator.vibrate(200);
      let target_dom = this.animation_object_queue[2];
      
      if(this.menu_hide_flag){
        this.dynamic.Coin_side_menu.option.direction = 'normal';
        this.menu_hide_flag = false;
      }
      else{
        this.dynamic.Coin_side_menu.option.direction = 'reverse';
        this.menu_hide_flag = true;
      }

      let option_output = this.dynamic["Coin_side_menu"];
      target_dom.DOM.animate(option_output.motion, option_output.option);      
      target_dom.Ctrl.play();
    }

    /**
     *  UI_component
     *  : make UI animated component
     *  @parameter
     *  : element_class_name [string] : DOM tag name or class name
     *  : new_object_name [string] : Animati
    
    constructor(private nav :NavController){
        
    }on option name
     *  : control_flag [boolean] : Animation state control value
     */
    UI_component(element_class_name : string, new_object_name : string, control_flag : boolean, index : number){  

        let dom_elements = (<any>window).document.querySelectorAll(element_class_name);
        let animation_object = this.dynamic[new_object_name];
        
        let ctrl = dom_elements[index].animate(animation_object.motion, animation_object.option);

        if(control_flag){

          ctrl.play();            // animation paly
        }
        else{

          ctrl.pause();           // animation pause
        }

        let object_value = {
          DOM : dom_elements[index],
          Ctrl : ctrl
        }



        this.animation_object_queue.push(object_value);       // push on animation object queue
        
    }

    menu_controller(index : string){


      console.log("[+] view change");
      let target : any;

      switch(index){

        case "bitcoin_page" : target = Modal.create(bitcoin_page);
        break;
        case "heart_page" : target= Modal.create(heart_page);
        break;
        case "user_page" : target = Modal.create(user_page);
        break;
        case "BuskerPage" : target = Modal.create(BuskerPage);
        break;
        case "BuskerListPage": target = Modal.create(BuskerListPage);
        break;
        case "BuskerHeartPage" : target= Modal.create(BuskerHeartPage);
        break;

      }
      navigator.vibrate(200);

      this.nav.present(target);

  }

    Busker_Toast(who : string, location : string){

      let make = Toast.create({

          message : who + " : " +  location,
          duration : 3000,
          position : 'top',
          showCloseButton : true,
          closeButtonText : "OK"
      });

      navigator.vibrate(200);      
      this.nav.present(make);
    }


}