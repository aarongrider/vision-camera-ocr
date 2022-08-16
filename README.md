<div align="right">
<img align="right" src="docs/demo.gif">
</div>

# vision-camera-ocr

A [VisionCamera](https://github.com/mrousavy/react-native-vision-camera) Frame Processor Plugin to preform text detection on images using [**MLKit Vision** Text Recognition](https://developers.google.com/ml-kit/vision/text-recognition).

## Installation

```sh
yarn add vision-camera-ocr
cd ios && pod install
```

Add the plugin to your `babel.config.js`:

```js
module.exports = {
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanOCR'],
      },
    ],

    // ...
```

> Note: You have to restart metro-bundler for changes in the `babel.config.js` file to take effect.

## Optional (But Recommended) for Android:

> [From the MLKit setup instructions](https://developers.google.com/ml-kit/vision/text-recognition/android). `vision-camera-ocr` does not add this for you automatically.

You can configure your app to automatically download the ML model to the device after your app is installed from the Play Store. To do so, add the following declaration to your app's `AndroidManifest.xml` file:

```xml
<application ...>
  ...
  <meta-data
      android:name="com.google.mlkit.vision.DEPENDENCIES"
      android:value="ocr" />
  <!-- To use multiple models: android:value="ocr,model2,model3" -->
</application>
```

If you do not enable install-time model downloads, the model will be downloaded the first time you run the on-device detector. Requests you make before the download has completed will produce no results.

## Usage

```js
import { labelImage } from "vision-camera-image-labeler";

// ...
const frameProcessor = useFrameProcessor((frame) => {
  'worklet';
  const scannedOcr = scanOCR(frame);
}, []);
```

## Data

`scanOCR(frame)` returns an `OCRFrame` with the following data shape. See the example for how to use this in your app.

 ``` jsx
  OCRFrame = {
    result: {
      text: string, // Raw result text
      blocks: Block[], // Each recognized element broken into blocks
    ;
};
```

The text object closely resembles the object documented in the MLKit documents.
https://developers.google.com/ml-kit/vision/text-recognition#text_structure

```
The Text Recognizer segments text into blocks, lines, and elements. Roughly speaking:

a Block is a contiguous set of text lines, such as a paragraph or column,

a Line is a contiguous set of words on the same axis, and

an Element is a contiguous set of alphanumeric characters ("word") on the same axis in most Latin languages, or a character in others
```



## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
