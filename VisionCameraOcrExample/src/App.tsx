/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';

import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  PixelRatio,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import {
  useFrameProcessor,
  Camera,
  useCameraDevice,
} from 'react-native-vision-camera';

import {VisionCameraProxy, Frame} from 'react-native-vision-camera';
import {useSharedValue} from 'react-native-worklets-core';

const plugin = VisionCameraProxy.getFrameProcessorPlugin('scanOCR');
console.log('🚀 ~ file: App.tsx:23 ~ plugin:', plugin);

/**
 * Scans scanOCR.
 */
export function scanOCR(frame: Frame): any {
  'worklet';
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin "scanFaces"!');
  }
  return plugin.call(frame);
}

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  // const [ocr, setOcr] = React.useState<any>();
  const [pixelRatio, setPixelRatio] = React.useState<number>(1);
  const [_, setToggle] = React.useState<boolean>(false);
  const device = useCameraDevice('back');
  const ocr = useSharedValue(undefined);

  useEffect(() => {
    const a = setInterval(() => {
      /**
       * Warning: this is needed to trigger the re-rendering of the overlay.
       */
      setToggle(old => !old);
    }, 500);

    return () => clearInterval(a);
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const data = scanOCR(frame);
    // console.log(
    //   '🚀 ~ file: App.tsx:31 ~ frameProcessor ~ data:',
    //   JSON.stringify(data.result.blocks.map(_ => _.text).join(','), null, 2),
    // );
    ocr.value = data;
  }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const renderOverlay = () => {
    return (
      <>
        {ocr.value?.result?.blocks?.map(block => {
          return (
            <TouchableOpacity
              key={block.text}
              onPress={() => {
                Clipboard.setString(block.text);
                Alert.alert(`"${block.text}" copied to the clipboard`);
              }}
              style={{
                position: 'absolute',
                left: block.frame.x * pixelRatio,
                top: block.frame.y * pixelRatio,
                backgroundColor: 'white',
                padding: 8,
                borderRadius: 6,
                zIndex: 100,
              }}>
              <Text
                style={{
                  fontSize: 25,
                  justifyContent: 'center',
                  textAlign: 'center',
                }}>
                {block.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  return device !== undefined && hasPermission ? (
    <View style={{flex: 1}}>
      <Camera
        style={[StyleSheet.absoluteFill]}
        frameProcessor={frameProcessor}
        device={device}
        fps={60}
        isActive={true}
        onLayout={(event: LayoutChangeEvent) => {
          setPixelRatio(
            event.nativeEvent.layout.width /
              PixelRatio.getPixelSizeForLayoutSize(
                event.nativeEvent.layout.width,
              ),
          );
        }}>
        {renderOverlay()}
      </Camera>
    </View>
  ) : (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>No available cameras</Text>
    </View>
  );
}
