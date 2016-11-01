
import {Injectable} from '@angular/core';

@Injectable()

export class localStorage_service{

    create(data : any, target : string){

        localStorage.setItem(target ,JSON.stringify(data));
    }

    check(target :string){
        return localStorage.hasOwnProperty(target);
    }
    save(data : any, target : string, select : any){

        try{
            let temp : any;

            if(typeof(data) == "string"){
                temp = JSON.parse(data[0]);
            }
            else{
                temp = data;
            }
            
            let set = JSON.parse(localStorage.getItem(target));

            for(var i = 0; i < select.length; i++){

                try{
                    set[select[i]] = temp[select[i]];
                }
                catch(e){
                    console.log("Invaild data");
                    continue;
                }
            }

            localStorage.setItem(target,JSON.stringify(set));
        }
        catch(e){

            return false;
        }
        return true;
    }

    load(data : string, target : string){

        let temp = JSON.parse(localStorage.getItem(target));

        return temp[data];
    }


}