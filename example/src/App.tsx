/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import { runOnJS } from 'react-native-reanimated';
import { StyleSheet, View, Text } from 'react-native';
import { scanOCR } from 'vision-camera-ocr';
import {
  useCameraDevices,
  useFrameProcessor,
  Camera,
} from 'react-native-vision-camera';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [ocr, setOcr] = React.useState<any>();
  const devices = useCameraDevices();
  const device = devices.front;

  React.useEffect(() => {
    console.log(ocr);
  }, [ocr]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const scannedOcr = scanOCR(frame);

    runOnJS(setOcr)(scannedOcr);
  }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  return device !== undefined && hasPermission ? (
    <Camera
      style={[
        StyleSheet.absoluteFill,
        { borderWidth: 2, borderColor: 'red', borderStyle: 'solid' },
      ]}
      frameProcessor={frameProcessor}
      device={device}
      isActive={true}
      frameProcessorFps={60}
    />
  ) : (
    <View>
      <Text>no camera devices</Text>
    </View>
  );
}
