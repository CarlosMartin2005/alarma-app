import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Camera, CameraView } from 'expo-camera';
import { CameraType, useCameraPermissions } from 'expo-camera';
import * as mobilenet from '@tensorflow-models/mobilenet';

const translateObject = (object: string) => {
  const translations: { [key: string]: string } = {
    'computadora': 'notebook',
    'sandalia': 'sandal',
    'Taza de café': 'coffee',
    'pelota': 'ball'
  };
  return translations[object] || object;
};

const ObjectSearchScreen = ({ route, navigation }) => {
  const { object } = route.params;
  const translatedObject = translateObject(object);
  const cameraRef = useRef<CameraView>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [presentedShape, setPresentedShape] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [torchOn, setTorchOn] = useState(false);
  const [isTfReady, setIsTfReady] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (result === 'Objeto encontrado') {
      navigation.navigate('ObjetoEncontradoScreen');
    }
  }, [result]);

  const toggleTorch = () => {
    if (cameraRef.current) {
      cameraRef.current.setTorchMode(torchOn ? 'off' : 'on');
      setTorchOn(!torchOn);
    }
  };

  const handleImageCapture = async () => {
    setIsProcessing(true);
    const imageDataCamara = await cameraRef.current!.takePictureAsync({
      base64: true,
      quality: 0.5
    });
    // Lee el archivo local


    // const img = require('./cat.jpg');
    try {
      if (imageDataCamara) {
        const formData = new FormData();
        formData.append('image', `${imageDataCamara.base64}`);
        const response1 = await fetch('https://api.imgbb.com/1/upload?expiration=300&key=4b8dc3a1af1cd2187e90c73753969be7', {
          method: 'POST',
          body: formData,
          headers: {
            "content-type": "multipart/form-data",
          },
        });
        const responseData = await response1.json();
        console.log("ResponseData: ", responseData); // Imprimir response en la consola

        // cargar modelo
        await tf.ready();
        const model = await mobilenet.load();
        const response = await fetch(responseData.data.medium.url, {}, { isBinary: true });
        // // console.log("Response: ", response); // Imprimir response en la consola
        const imageDataArrayBuffer = await response.arrayBuffer();
        const imageData = new Uint8Array(imageDataArrayBuffer);
        const imageTensor = decodeJpeg(imageData);
        // // console.log("Tensor: ",imageTensor); // Imprimir tensor en la consola
        const prediction = await model.classify(imageTensor);
        if (prediction && prediction.length > 0) {
            // veridicar si en alguna parte del prediction[0].className se encuentra el objeto
            // hay que hacer un split de la cadena y comparar cada palabra con el objeto
            // si se encuentra el objeto en alguna parte de la cadena entonces se muestra el resultado

            // verificar si el objeto se encuentra en la cadena
            const objectArray = prediction[0].className.split(" ");
            let found = false;
            objectArray.forEach((element: string) => {
              if (element === translatedObject) {
                found = true;
              }
              if (translatedObject === "notebook" && element === "monitor") {
                found = true;
              }
            });

            if (found) {
              setResult(
                `Objeto encontrado`
              );
            } else {
                setResult(
                    `No se encontró el objeto ${object} itentelo de nuevo`
                );
            }
        }

      }

    }
    catch (error) {
      console.log("Error: ", error);
    }

    if (imageDataCamara) {
      setCapturedImage(imageDataCamara.uri);
      // classifyImage(imageData!.base64);
    }
    setIsProcessing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleImageCapture}>
          <Text style={styles.buttonText}>Capturar imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleTorch}>
          <Text style={styles.buttonText}>{torchOn ? 'Apagar linterna' : 'Encender linterna'}</Text>
        </TouchableOpacity>
      </View>
      <CameraView ref={cameraRef} style={styles.camera} facing={'back'} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleImageCapture}>
          <Text style={styles.buttonText}>Capturar imagen</Text>
        </TouchableOpacity>
      </View>
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {capturedImage && (
        <View style={styles.imageContainer}>
          {isTfReady && result === '' && <Text>Classifying...</Text>}
          {result !== '' && <Text>{result}</Text>}
          <Image
            source={{ uri: capturedImage }}
            style={styles.image}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      position: 'absolute',
      top: 40,
      width: '100%',
      alignItems: 'center',
    },
    button: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 300,
      height: 300,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });

export default ObjectSearchScreen;