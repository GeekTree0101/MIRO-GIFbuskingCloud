import * as io from 'socket.io-client';                        //SOCKET.IO - CLINENT


export class Socket_service{

    public socket : any;
    constructor(){
        
        console.log("socket init");
        this.socket = io("https://192.168.1.9:8000");

    }

}

export class Socket_service_donation{

    public socket :any;
    constructor(){
        
        console.log("socket init");
        this.socket = io("https://192.168.1.9:9000");

    }   
}