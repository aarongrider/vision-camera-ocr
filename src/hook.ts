import { useState } from 'react';
import { Frame, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import { OCRFrame, scanOCR } from './index';

export function useScanOCR(): [(frame: Frame) => void, OCRFrame | undefined] {
  const [ocrData, setOCRData] = useState<OCRFrame>();

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    const detectedOCR = scanOCR(frame);
    runOnJS(setOCRData)(detectedOCR);
  }, []);

  return [frameProcessor, ocrData];
}
