package org.apache.cordova.SDKvsJDK;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

//For JNI
import android.app.Activity;
import android.os.Bundle;

import android.util.Log;


public class SDKvsJDK extends CordovaPlugin {

    public static final String debugTag = "CordovaPluginDebug";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
      
        if (action.equals("runNative")) {
            Log.i(debugTag,"[+] Active run Native");
            int value = args.getInt(0);
            this.runNative(value, callbackContext);
            return true;
        }
        
        else if (action.equals("runJava")){
           Log.i(debugTag,"[+] Active run Java");
           int value = args.getInt(0);
           this.runJava(value, callbackContext);
            
           return true;           
       }
       
        return false;
    }


    private void runJava(int value, CallbackContext callbackContext){
        
        if (value > 0) {
            long start = 0;
            long end = 0;
            
            try{
                start = System.currentTimeMillis();
                int sum = 0;
                for(int i =0; i < value; i++){
                    sum = sum +i;
                }
                Log.i(debugTag,"[=] OUPUT value : JAVA = " + sum);
                end = System.currentTimeMillis();
            }
            finally{
                
                
                callbackContext.success("Java Time : " + Long.toString(end-start));
            }
            
        } else {
            callbackContext.error("Error.");
        }
    }
 
    private void runNative(int value, CallbackContext callbackContext) {
        if (value > 0) {
            
            int sum = 0;
            long start = 0;
            long end = 0;
            
            try{
               start = System.currentTimeMillis(); 
               sum = NativeCall.running(value);
               end = System.currentTimeMillis();
            }

            finally{
            
                
                callbackContext.success("Native Time : " + Long.toString(end-start));
            }
            
        } else {
            callbackContext.error("Error.");
        }
    }   

}
