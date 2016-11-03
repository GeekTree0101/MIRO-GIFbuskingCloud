import * as io from 'socket.io-client';                        //SOCKET.IO - CLINENT


export class Socket_service_busking{

    public socket : any;
    constructor(){
        
        console.log("socket init");
        this.socket = io.connect("http://192.168.1.77:8000",{transports:['websocket','poling','flashsocket']});

    }

}

export class Socket_service_donation{

    public socket :any;
    constructor(){
        
        console.log("socket init");
        this.socket = io("http://192.168.1.77:9000",{transports:['websocket','poling','flashsocket']});

    }   
}