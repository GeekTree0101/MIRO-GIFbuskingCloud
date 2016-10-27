package com.ab.cordovafloatingactivityPack;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONArray;
import org.json.JSONException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Log;




public class cordovafloatingactivity extends CordovaPlugin {

    public static final String debug = "FloatingDebug";

    
    
    cordovafloatingactivity _theApp;
    ComponentName _checkerService = null;

    

    @Override  
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

        PackageManager pm = cordova.getActivity().getPackageManager();
        Context context = cordova.getActivity().getApplicationContext();
        String packageName = "test";
        Boolean result = true;
        
        
        if (action.equals("startFloatingActivity")) {
            String name = data.getString(0);
            result = launchService(pm,context,packageName, context);
            if(result){
               callbackContext.success("success");
            }
            else{
               callbackContext.success("false");
            }
            return true;
        }
        
        else if(action.equals("stopFloatingActivity")){
            result = stopService(pm,context,packageName, context);
            return true;
        }
        
        else {
            return false;
        }
    }
    public boolean launchService(PackageManager pm, Context c, String packname , final Context con)
    {
        cordova.getActivity().startService(new Intent(cordova.getActivity().getApplication(), ChatHeadService.class));
        return true;
        
    }
    public boolean stopService(PackageManager pm, Context c, String packname , final Context con)
    {
        cordova.getActivity().stopService(new Intent(cordova.getActivity().getApplication(), ChatHeadService.class)); 
        return true;
        
    }
}
