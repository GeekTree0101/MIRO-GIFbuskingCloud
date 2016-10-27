#include <jni.h>
#include <android/log.h>

#define LOG_INFO(...) __android_log_print(ANDROID_LOG_INFO,"CordovaPluginDebug",__VA_ARGS__)


#ifndef _runningNative_h
#define _runningNative_h
#ifdef __cplusplus

extern "C" {
    
    #endif

#if defined(__arm__)
  #if defined(__ARM_ARCH_7A__)
    #if defined(__ARM_NEON__)
      #if defined(__ARM_PCS_VFP)
        #define ABI "armeabi-v7a/NEON (hard-float)"
      #else
        #define ABI "armeabi-v7a/NEON"
      #endif
    #else
      #if defined(__ARM_PCS_VFP)
        #define ABI "armeabi-v7a (hard-float)"
      #else
        #define ABI "armeabi-v7a"
      #endif
    #endif
  #else
   #define ABI "armeabi"
  #endif
#elif defined(__i386__)
   #define ABI "x86"
#elif defined(__x86_64__)
   #define ABI "x86_64"
#elif defined(__mips64)  /* mips64el-* toolchain defines __mips__ too */
   #define ABI "mips64"
#elif defined(__mips__)
   #define ABI "mips"
#elif defined(__aarch64__)
   #define ABI "arm64-v8a"
#else
   #define ABI "unknown"
#endif



    
      jint Java_org_apache_cordova_SDKvsJDK_NativeCall_running(JNIEnv * env, jobject thiz, jint value);
     
     
     
     #ifdef __cplusplus
}

#endif
#endif
