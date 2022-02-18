import Vision

@objc(QRCodeFrameProcessorPlugin)
public class QRCodeFrameProcessorPlugin: NSObject, FrameProcessorPluginBase {

  @objc
  public static func callback(_ frame: Frame!, withArgs _: [Any]!) -> Any! {
    // guard let imageBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
    //   return nil
    // }

    // NSLog("ExamplePlugin!!!")
    
    
    // let orientation = frame.orientation
    // code goes here
     return [
            "example_str": "Test",
            "example_bool": true,
            "example_double": 5.3,
            "example_array": [
                "Hello",
                true,
                17.38,
            ],
        ]
  }
}
