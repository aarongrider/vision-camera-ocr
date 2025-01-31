  package com.visioncameraocr

  import androidx.annotation.NonNull
  import com.facebook.react.ReactPackage
  import com.facebook.react.bridge.NativeModule
  import com.facebook.react.bridge.ReactApplicationContext
  import com.facebook.react.uimanager.ViewManager
  import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
  import com.mrousavy.camera.frameprocessors.VisionCameraProxy

  class VisionCameraOcrPackage : ReactPackage {
      override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
          if(!OCRFrameProcessorPlugin.isRegistered){
              OCRFrameProcessorPlugin.isRegistered = true
              // vision camera @4.1.0
              FrameProcessorPluginRegistry.addFrameProcessorPlugin("scanOCR") { proxy, options ->
                  OCRFrameProcessorPlugin(proxy, options)
              }
          }
          return emptyList()
      }

      override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
          return emptyList()
      }
  }
