/* eslint-disable no-undef */
import type { Frame } from 'react-native-vision-camera';

/**
 * Scans OCR.
 */

export function scanOCR(frame: Frame): any {
  'worklet';
  // @ts-ignore
  return __scanOCR(frame);
}
