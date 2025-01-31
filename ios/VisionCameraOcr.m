#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#import "VisionCameraOcr-Swift.h"

@interface OCRFrameProcessorPlugin (FrameProcessorPluginLoader)
@end

@implementation OCRFrameProcessorPlugin (FrameProcessorPluginLoader)

+ (void)load
{
    // vision @4.1.0
    [FrameProcessorPluginRegistry addFrameProcessorPlugin:@"scanOCR" withInitializer:^FrameProcessorPlugin * _Nonnull(VisionCameraProxyHolder * _Nonnull proxy, NSDictionary * _Nullable options) {
        return [[OCRFrameProcessorPlugin alloc] initWithProxy:proxy withOptions:options];
    }];
}

@end
