
# vision-camera-ocr

A [VisionCamera](https://github.com/mrousavy/react-native-vision-camera) Frame Processor Plugin to preform text detection on images using [**MLKit Vision** Text Recognition](https://developers.google.com/ml-kit/vision/text-recognition).

<img style='width:200px;' src="docs/demo.gif">

## Installation

```sh
yarn add vision-camera-ocr
cd ios && pod install
```

Add the plugin to your `babel.config.js`:

```js
module.exports = {
   plugins: [['react-native-worklets-core/plugin']],
    // ...
```

> Note: You have to restart metro-bundler for changes in the `babel.config.js` file to take effect.

## Usage

```js
import {scanOCR} from 'vision-camera-ocr';

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
<https://developers.google.com/ml-kit/vision/text-recognition#text_structure>

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
