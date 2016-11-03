/*
*   Title : Busking Cloud
*   Provider : Kang mi jung, Liu hui yu
*   Manager : Ha Hyeon soo
*   Copyright(C)2016 MIRO robot science group
*/
#include "Arduino.h"

#define LED_RED 5        //red color led
#define LED_GREEN 6      //green color led
#define LED_BLUE 7       //blue color ledq

void reset_light_function();     //reset light function
void red_light_function();       //red light function
void green_light_function();     //green light function
void blue_light_function();      //blue light function

void setup(){

  Serial.begin(9600);            //Serial Serial Setting
  pinMode(LED_RED, OUTPUT);      //red led output state
  pinMode(LED_GREEN, OUTPUT);    //green led output state
  pinMode(LED_BLUE, OUTPUT);     //blue led output state
  
  digitalWrite(LED_RED,HIGH);
  while(1){
   
    char recv_data = (char)Serial.read();
    
    if(recv_data == '*'){                          //Confirm

        Serial.println("D15E47EA");
        break;
    }
    
  }
  digitalWrite(LED_RED,LOW);
  delay(500);
  digitalWrite(LED_RED,HIGH);

  while(1){

    char recv_data = (char)Serial.read();
    
    if(recv_data == '*'){
    
      break;
    }
  }
  
  digitalWrite(LED_RED,LOW);
  digitalWrite(LED_GREEN,HIGH);
  
}

void loop(){

  if(Serial.available() > 0){
    
    char recv_data = (char)Serial.read();            // Recieve Char type data from Mobile

    if(recv_data == '*'){                            // User Disconnect with devices
     
      //setup(); //XXX : Must reset at here
    }
    
    
    if(recv_data == 'R' || recv_data == 'r'){        // recieve data is Red
    
      reset_light_function();
      red_light_function();
    }
    else if(recv_data == 'G' || recv_data == 'g'){   // recieve data is Green
    
      reset_light_function();
      green_light_function();
    }
    else if(recv_data == 'B' || recv_data == 'b'){   // recieve data is Blue
    
      reset_light_function();
      blue_light_function();
    }
    else{                                            // Exception Handling
    
      reset_light_function();
    }
    
  }

}

void reset_light_function(){     //reset light function

  //NOTE : Turn off all led
  digitalWrite(LED_RED, LOW);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_BLUE, LOW);
}

void red_light_function(){       //red light function

  //NOTE : Turn on Red led
  //TODO : Insert more code, if you need it
  digitalWrite(LED_RED, HIGH);
}

void green_light_function(){     //green light function

  //NOTE : Turn on Green led
  //TODO : Insert more code, if you need it
  digitalWrite(LED_GREEN, HIGH);
}

void blue_light_function(){      //blue light function
  
  //NOTE : Turn on Blue led
  //TODO : Insert more code, if you need it
  digitalWrite(LED_BLUE, HIGH);
}
