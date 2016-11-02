
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
            let temp = data[0];

            if(typeof(temp) == "string"){
                temp = JSON.parse(data[0]);
            }
            else if(typeof(temp) == "undefined"){
                temp = data;
            }

         
            console.log("[+] GET data :", temp);

            let set = JSON.parse(localStorage.getItem(target));

            //console.log("[+] DB data : ", set);

            for(var i = 0; i < select.length; i++){

                    set[select[i]] = temp[select[i]];
//                    console.log("[+] check state" , set[select[i]]);
//                    console.log("[+] check state", temp[select[i]]);   
            }

            //console.log("[+] after set value",set);

            localStorage.setItem(target , JSON.stringify(set));
 
            //console.log("json stringify", JSON.stringify(set));
//            console.log("[+] set itemed", localStorage.getItem("userdata"));

        }
        catch(e){

            console.log("[-] Error ", e);
            return false;
        }
        
        return true;
    }

    load(data : string, target : string){

        let temp = JSON.parse(localStorage.getItem(target));

        return temp[data];
    }


}