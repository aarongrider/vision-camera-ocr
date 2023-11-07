/* eslint-disable no-undef */
import { VisionCameraProxy, Frame } from 'react-native-vision-camera';

type BoundingFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  boundingCenterX: number;
  boundingCenterY: number;
};

type BoundingBox = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Point = { x: number; y: number };

type TextElement = {
  text: string;
  frame?: BoundingFrame;
  boundingBox?: BoundingBox;
  cornerPoints?: Point[];
};

type TextLine = {
  text: string;
  elements: TextElement[];
  frame?: BoundingFrame;
  boundingBox?: BoundingBox;
  recognizedLanguages: string[];
  cornerPoints?: Point[];
};

type TextBlock = {
  text: string;
  lines: TextLine[];
  frame?: BoundingFrame;
  boundingBox?: BoundingBox;
  recognizedLanguages: string[];
  cornerPoints?: Point[];
};

type Text = {
  text: string;
  blocks: TextBlock[];
};

export type OCRFrame = {
  result: Text;
};

/**
 * Scans OCR.
 */
const plugin = VisionCameraProxy.initFrameProcessorPlugin('scanOCR');

export function scanOCR(frame: Frame): OCRFrame {
  'worklet';
  if (plugin == null) {
    throw new Error(
      'Failed to load Frame Processor Plugin "scanOCR"! Please check your dependencies and make sure that the plugin is linked correctly.'
    );
  }
  return plugin.call(frame) as any;
}
