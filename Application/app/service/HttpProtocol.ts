/*

  AngularJS2 Http Protocol service with Ionic2
  Copyright(C) 2016 Ha Hyeon soo

  How to Data passing to other services?
  > Follow me!
  
  1. import {Events} from 'ionic-angular'
  2. import {HttpProtocalService} from 'this module dir'
  3. constructor(public event : Events, private http : HttpProtocalService)
  4. this.http.GET/POST(parameter insert here!);
  5. this.event.subscribe("GET/POST", (recvData) => {
      //TODO: recvData is from GET/POST
      
  })



*/
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';

@Injectable()
export class HttpProtocalService{
    
    private returnData : any;
    
    constructor(private http : Http, public event : Events){
        console.log("[+] Http Protocol service init");
    }
    
  
    GET(type : string, url :string, userToken :Object){
        
        //TODO: Http Protocol GET Task
            
        let authHeader = new Headers();
        
        //Header append
        if(userToken != null){
            console.log("[+] User Authoraization Header appending!");
            authHeader.append('Authoraization', JSON.stringify(userToken));
        }
        else{
            console.log("[-] User avoid Authoraization! He is Hacker!");
        }
        
        //Response Data Type selection
        if(type == "JSON"){
            
            this.http.get(url,{
                 headers : authHeader
                })
                .map(res => res.text())
                .subscribe(
                         data => this.returnData = data,
                         err => this.returnData = err ,
                         () => this.event.publish("GET",this.returnData)
                );
        }
        else{
            
            this.http.get(url,{
                 headers : authHeader
                })
                .map(res => res.json())
                .subscribe(
                         data => this.returnData = data,
                         err => this.returnData = err ,
                         () => this.event.publish("GET",this.returnData)
                );            
        }
        
    }

    
    
    POST(userData : any, type: string, url :string){
        
        //TODO: Http Protocal POST Task 
        let header = new Headers();
        console.log("[+] User call POST");
        
        //Header append
        header.append('Content-Type',type);
  
        this.http.post(url,JSON.stringify(userData),{
            headers: header
        })
        .map(res => res.json())
        .subscribe(
            data => this.returnData = data,
            err => this.returnData = err ,
            () => this.event.publish("POST",this.returnData)
        )
        
  
        
    }

    
}