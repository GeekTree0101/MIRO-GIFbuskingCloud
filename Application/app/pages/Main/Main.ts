import {Component, AfterContentInit, HostListener } from '@angular/core'
import {NavController, Modal, Toast} from 'ionic-angular';
import {Input, Output} from '@angular/core'; 

import {bitcoin_page} from './service/bitcoin';
import {heart_page} from './service/heart';
import {user_page} from './service/user';
import {BuskerPage} from './../Busker/Busker';
import {BuskerListPage} from './../BuskerList/BuskerList';

@Component({
  templateUrl: 'build/pages/Main/Main.html',
  directives : [bitcoin_page, heart_page, user_page, BuskerPage, BuskerListPage]
})
export class MainPage{

    private animation_object_queue = [];                    //animation object queue

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
          {transform : 'rotateY(0deg)'},
          {transform : 'rotateY(180deg)'}
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
          {marginLeft : "200%"},
          {marginLeft : "0%"}
        ],
        "option":
        {
          duration : 2000,
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
      C : "heart_page",
      D : "BuskerListPage"      // If state is Busking mode -> BuskerPage
    }


    constructor(private nav :NavController){
        
        setInterval(() => {
          this.Busker_Toast();
        },(Math.random() * 20 + 10) * 1000);
    }

    ngAfterContentInit(){

        this.UI_component(".Coin_button", "Coin_button", true, 0);
        this.UI_component(".Coin_howl", "Coin_howl", true, 0);
        this.UI_component(".Coin_side_menu", "Coin_side_menu", false, 0);
    }

    @Output() mode_change(){

      let click = this.dynamic["Coin_touch_motion"];
      let button_effect = this.dynamic["Coin_button"];

      let target_dom = this.animation_object_queue[0];               //button DOM
      console.log("target_dom",target_dom);
      target_dom.DOM.animate(click.motion, click.option);
      target_dom.Ctrl.play();
      
      setTimeout(() => {

        target_dom.DOM.animate(button_effect.motion, button_effect.option);
        target_dom.Ctrl.play();

      }, 800);

    }

    @HostListener('press',['$event']) open_menu(){

      let target_dom = this.animation_object_queue[2];
      
      if(this.menu_hide_flag){
        this.dynamic.Coin_side_menu.option.direction = 'normal';
      }
      else{
        this.dynamic.Coin_side_menu.option.direction = 'reverse';
      }
      
      setTimeout(() => { 
        if(this.menu_hide_flag){
          this.menu_hide_flag = false;
        }
        else{
          setTimeout(() => {this.menu_hide_flag = true;}, 2000);
        }
      }, 200);

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
        console.log("dom",dom_elements);
        
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

      let target : any;

      switch(index){

        case "bitcoin_page" : target = Modal.create(bitcoin_page);
        break;
        case "heart_page" : target = Modal.create(heart_page);
        break;
        case "user_page" : target = Modal.create(user_page);
        break;
        case "BuskerPage" : target = Modal.create(BuskerPage);
        break;
        case "BuskerListPage": target = Modal.create(BuskerListPage);
        break;

      }

      this.nav.present(target);

    }

    Busker_Toast(){

      let make = Toast.create({

          message : "버스커버스커 : 대학로 60길 공연중",
          duration : 3000,
          position : 'top',
          showCloseButton : true,
          closeButtonText : "OK"
      });

      
      this.nav.present(make);
    }


}