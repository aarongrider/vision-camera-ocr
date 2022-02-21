package com.visioncameraocr

import androidx.camera.core.ImageProxy
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin


class OCRFrameProcessorPlugin: FrameProcessorPlugin("scanOCR") {

    override fun callback(image: ImageProxy, params: Array<Any>): Any? {
        val result = WritableNativeMap()
        result.putString("text", "Test Text")

        val blocks = WritableNativeArray()
        result.putArray("blocks", blocks)

        val data = WritableNativeMap()
        data.putMap("result", result)

        return data
    }
}