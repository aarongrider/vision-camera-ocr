/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {
  View,
  Text,
  LayoutChangeEvent,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import {
  useFrameProcessor,
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';

import {useSharedValue, Worklets} from 'react-native-worklets-core';

import {scanOCR} from 'vision-camera-ocr';

export default function App() {
  const [dimensions, setDimensions] = useState({width: 1, height: 1});

  const frameWidthAndHeightRef = useSharedValue({height: 1, width: 1});

  /**
   * Camera
   */
  const [hasPermission, setHasPermission] = React.useState(false);
  const [targetFps] = useState(60);

  const [ocr, setOcr] = useState<any>();
  const setOcrJS = Worklets.createRunInJsFn(setOcr);

  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    {videoResolution: 'max'},
    {photoResolution: 'max'},
  ]);

  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    frameWidthAndHeightRef.value = {
      height: frame.height,
      width: frame.width,
    };

    const data = scanOCR(frame);
    console.log(
      '🚀 ~ file: App.tsx:68 ~ frameProcessor ~ data:',
      data.result?.blocks?.map(_ => _.text),
    );

    setOcrJS({...data});
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
        {ocr?.result?.blocks?.map((block, index) => {
          const convertedWidth =
            frameWidthAndHeightRef.value.width / dimensions.width;
          const convertedHeight =
            frameWidthAndHeightRef.value.height / dimensions.height;

          return (
            <TouchableOpacity
              key={`${index}-${block.text}+${new Date().getTime()}}`}
              onPress={() => {
                Clipboard.setString(block.text);
                Alert.alert(`"${block.text}" copied to the clipboard`);
              }}
              style={{
                position: 'absolute',
                left: block.frame.x / convertedHeight,
                top: block.frame.y / convertedWidth,
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
                  color: 'black',
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
    <>
      <Camera
        style={{width: '100%', height: '100%', flex: 1}}
        frameProcessor={frameProcessor}
        device={device}
        fps={fps}
        pixelFormat="yuv"
        isActive={true}
        photo={true}
        orientation="portrait"
        format={format}
        onLayout={(event: LayoutChangeEvent) => {
          setDimensions({
            height: event.nativeEvent.layout.height,
            width: event.nativeEvent.layout.width,
          });
        }}>
        {renderOverlay()}
      </Camera>
    </>
  ) : (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>No available cameras</Text>
    </View>
  );
}
