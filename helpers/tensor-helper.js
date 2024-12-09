import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native';


import {Base64Binary} from '../utils/utils';
const BITMAP_DIMENSION = 224;


const URL = "https://teachablemachine.withgoogle.com/models/HZ5QyZmdF/";


// 0: channel from JPEG-encoded image
// 1: gray scale
// 3: RGB image
const TENSORFLOW_CHANNEL = 3;

export const getModel = async () => {
    try {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      await tf.ready();
      const modelo = await tf.loadLayersModel(modelURL, metadataURL);
      console.log('Model loaded');
      return modelo;
    } catch (error) {
      console.log('Could not load model', error);
    }
  };

export const convertBase64ToTensor = async (base64) => {
  try {
    const uIntArray = Base64Binary.decode(base64);
    
    const decodedImage = decodeJpeg(uIntArray, 3);
    
    return decodedImage.reshape([
      1,
      BITMAP_DIMENSION,
      BITMAP_DIMENSION,
      TENSORFLOW_CHANNEL,
    ]);
  } catch (error) {
    console.log('Could not convert base64 string to tesor', error);
  }
};

export const startPrediction = async (model, tensor) => {
  try {
    
    const output = await model.predict(tensor);
    
    return output.dataSync();
  } catch (error) {
    console.log('Error predicting from tesor image', error);
  }
};
