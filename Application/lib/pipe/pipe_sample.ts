/*
  AngularJS2 Pipe with Ionic2
  Copyright(C) 2016 Ha Hyeon soo

*/

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name : 'pipeSample'
})
export class Pipe_Sample implements PipeTransform{
    
    transform(TargetValue : number, Params : string){
        console.log("[+] Pipe Tramsforming");
        let intVal = parseInt(Params);
        return intVal * TargetValue;
    }
    
    
}