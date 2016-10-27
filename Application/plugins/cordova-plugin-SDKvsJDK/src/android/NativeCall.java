package org.apache.cordova.SDKvsJDK;

//For JNI
import android.app.Activity;
import android.widget.TextView;
import android.os.Bundle;



public class NativeCall {

   //LoadNative Module  
   static{
        System.loadLibrary("runningNative");
   }
   
   public static native int running(int value);
  
   public native int unimplementrunning(int value);
}
