#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#import "VisionCameraOcr-Swift.h"

@interface OCRFrameProcessorPlugin (FrameProcessorPluginLoader)
@end

@implementation OCRFrameProcessorPlugin (FrameProcessorPluginLoader)

+ (void)load
{
    [FrameProcessorPluginRegistry addFrameProcessorPlugin:@"scanOCR" withInitializer:^FrameProcessorPlugin * _Nonnull(NSDictionary * _Nullable options) {
        return [[OCRFrameProcessorPlugin alloc] initWithOptions:options];
    }];
}

@end
