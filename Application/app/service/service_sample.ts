/*
  AngularJS2 Serive with Ionic2
  Copyright(C) 2016 Ha Hyeon soo

*/
import {Injectable} from '@angular/core';


@Injectable()
export class Service_Sample{
    
    constructor(){
        console.log("[+] Service Injection Init");    
    }
    
    run(){
        console.log("[+] Running Service");   
    }
    
    stop(){
        console.log("[-] Stop Service");
    }
    
    
}