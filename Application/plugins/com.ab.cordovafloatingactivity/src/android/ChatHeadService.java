package com.ab.cordovafloatingactivityPack;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.IBinder;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import java.io.InputStream;
import java.net.URL;
import android.content.ComponentName;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.view.Display;
import android.util.Log;

public class ChatHeadService extends Service {
 
    private WindowManager windowManager;
	private ImageView chatHead;

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
	@Override
	public void onCreate() {
		super.onCreate();
		
		windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

		    chatHead = new ImageView(this);
            //FIXMI : you must rename package name
		    chatHead.setImageResource(com.miro.InteractionLab.R.drawable.circle);

		    final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
		        WindowManager.LayoutParams.WRAP_CONTENT,
		        WindowManager.LayoutParams.WRAP_CONTENT,
		        WindowManager.LayoutParams.TYPE_PHONE,
		        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
		        PixelFormat.TRANSLUCENT);
        
		    //params.gravity = Gravity.TOP | Gravity.LEFT;
		    params.height = 250;  
       		params.width = 250; 
            params.x = 100; 
		    params.y = 100;

		    windowManager.addView(chatHead, params);
		    
		    chatHead.setOnTouchListener(new View.OnTouchListener() {
		    	  private int initialX;
		    	  private int initialY;
		    	  private float initialTouchX;
		    	  private float initialTouchY;
		    	  int flag = 0;

		    	  @Override public boolean onTouch(View v, MotionEvent event) {
		    	    switch (event.getAction()) {
		    	      case MotionEvent.ACTION_DOWN:
		    	        initialX = params.x;
		    	        initialY = params.y;
		    	        initialTouchX = event.getRawX();
		    	        initialTouchY = event.getRawY();
                        params.height = 400;
                        params.width = 400;
		    	        return true;
		    	      case MotionEvent.ACTION_UP:
                        params.height = 250;
                        params.width = 250;
		    	    	params.x = initialX + (int) (event.getRawX() - initialTouchX);
		    	        params.y = initialY + (int) (event.getRawY() - initialTouchY);
		    	        windowManager.updateViewLayout(chatHead, params);
		    	        return true;
		    	      case MotionEvent.ACTION_MOVE:
		    	    	flag = 1;
		    	        params.x = initialX + (int) (event.getRawX() - initialTouchX);
		    	        params.y = initialY + (int) (event.getRawY() - initialTouchY);
		    	        windowManager.updateViewLayout(chatHead, params);
		    	        return true;
		    	      case MotionEvent.ACTION_CANCEL:
		    	    	return true;
		    	    }
		    	    return false;
		    	  }
		    	  

		    	});
	}
	 @Override
	  public void onDestroy() {
	    super.onDestroy();
	    if (chatHead != null) windowManager.removeView(chatHead);
	  }
	
	  
}