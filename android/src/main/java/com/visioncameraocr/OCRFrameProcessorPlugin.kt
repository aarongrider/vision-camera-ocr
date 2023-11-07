 package com.visioncameraocr

 import android.annotation.SuppressLint
 import android.graphics.Point
 import android.graphics.Rect
 import android.media.Image
 import com.google.android.gms.tasks.Task
 import com.google.android.gms.tasks.Tasks
 import com.google.mlkit.vision.common.InputImage
 import com.google.mlkit.vision.text.Text
 import com.google.mlkit.vision.text.TextRecognition
 import com.google.mlkit.vision.text.latin.TextRecognizerOptions


 import com.mrousavy.camera.frameprocessor.Frame
 import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin
 import com.mrousavy.camera.types.Orientation

 class OCRFrameProcessorPlugin(options: MutableMap<String, Any>?) : FrameProcessorPlugin(options) {

     private fun getBlockArray(blocks: MutableList<Text.TextBlock>): List<HashMap<String, Any?>> {
         val blockArray = mutableListOf<HashMap<String, Any?>>()

         for (block in blocks) {
             val blockMap = HashMap<String, Any?>()

             blockMap["text"] = block.text
             blockMap["recognizedLanguages"] = getRecognizedLanguages(block.recognizedLanguage)
             blockMap["cornerPoints"] = block.cornerPoints?.let { getCornerPoints(it) }
             blockMap["frame"] = block.boundingBox?.let { getFrame(it) }
             blockMap["boundingBox"] = block.boundingBox?.let { getBoundingBox(it) }
             blockMap["lines"] = getLineArray(block.lines)

             blockArray.add(blockMap)
         }
         return blockArray
     }

     private fun getLineArray(lines: MutableList<Text.Line>): List<HashMap<String, Any?>> {
         val lineArray = mutableListOf<HashMap<String, Any?>>()

         for (line in lines) {
             val lineMap = hashMapOf<String, Any?>()

             lineMap["text"] = line.text
             lineMap["recognizedLanguages"] = getRecognizedLanguages(line.recognizedLanguage)
             lineMap["cornerPoints"] = line.cornerPoints?.let { getCornerPoints(it) }
             lineMap["frame"] = line.boundingBox?.let { getFrame(it)  }
             lineMap["boundingBox"] = line.boundingBox?.let { getBoundingBox(it) }
             lineMap["elements"] = getElementArray(line.elements)

             lineArray.add(lineMap)
         }
         return lineArray
     }

     private fun getElementArray(elements: MutableList<Text.Element>): List<HashMap<String, Any?>> {
         val elementArray = mutableListOf<HashMap<String, Any?>>()

         for (element in elements) {
             val elementMap = hashMapOf<String, Any?>()

             elementMap["text"] = element.text
             elementMap["cornerPoints"] = element.cornerPoints?.let { getCornerPoints(it) }
             elementMap["frame"] =  element.boundingBox?.let { getFrame(it)  }
             elementMap["boundingBox"] = element.boundingBox?.let { getBoundingBox(it) }
             elementArray.add(elementMap)

         }
         return elementArray
     }

     private fun getRecognizedLanguages(recognizedLanguage: String): List<String> {
         return  listOf(recognizedLanguage)
     }

     private fun getCornerPoints(points: Array<Point>): List<HashMap<String, Int>> {
         val cornerPoints = mutableListOf<HashMap<String, Int>>()

         for (point in points) {
             val pointMap = hashMapOf<String, Int>()
             pointMap["x"] = point.x
             pointMap["y"] = point.y
             cornerPoints.add(pointMap)
         }
         return cornerPoints
     }

     private fun getFrame(boundingBox: Rect?): HashMap<String, Any> {
         val frame = hashMapOf<String, Any>()

         if (boundingBox != null) {
             frame["x"] = boundingBox.exactCenterX().toDouble()
             frame["y"] = boundingBox.exactCenterY().toDouble()
             frame["width"] = boundingBox.width()
             frame["height"] = boundingBox.height()
             frame["boundingCenterX"] = boundingBox.centerX()
             frame["boundingCenterY"] = boundingBox.centerY()
         }
         return frame
     }

     private fun getBoundingBox(boundingBox: Rect?): HashMap<String, Any> {
         val box = hashMapOf<String,Any>()

         if (boundingBox != null) {
             box["left"] = boundingBox.left
             box["top"] = boundingBox.top
             box["right"] = boundingBox.right
             box["bottom"] = boundingBox.bottom
         }

         return box
     }

     override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
         val result = hashMapOf<String, Any>()

         val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

         @SuppressLint("UnsafeOptInUsageError")
         val mediaImage: Image? = frame.image
         val orientation = Orientation.fromUnionValue(frame.orientation)

         if (mediaImage != null && orientation!= null) {
             val image = InputImage.fromMediaImage(mediaImage, orientation.toDegrees())
             val task: Task<Text> = recognizer.process(image)
             try {
                 val text: Text = Tasks.await(task)
                 result["text"] = text.text
                 result["blocks"] = getBlockArray(text.textBlocks)
             } catch (e: Exception) {
                 return null
             }
         }

         return hashMapOf("result" to result)
     }
 }