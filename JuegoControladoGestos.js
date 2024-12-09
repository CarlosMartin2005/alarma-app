import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Appbar, Provider as PaperProvider } from "react-native-paper";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";

// TensorFlow Camera setup
const TensorCamera = cameraWithTensors(CameraView);
const { width, height } = Dimensions.get("window");
const ballDiameter = 20;
const barWidth = 100;
const barHeight = 20;
const blockWidth = 50;
const blockHeight = 20;
const blockSpacing = 10;
const barYPosition = height - 280;
const cameraHeight = 160;
const blockStartY = cameraHeight - 150;
const ballStartY = (height - cameraHeight) / 2 - ballDiameter / 2;

function JuegoControladoGestos() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [ballPosition, setBallPosition] = useState({
    x: width / 2 - ballDiameter / 2,
    y: ballStartY,
  });
  const [ballVelocity, setBallVelocity] = useState({ vx: 3, vy: 3 });
  const [blocks, setBlocks] = useState(generateBlocks());
  const [barPosition, setBarPosition] = useState(width / 2 - barWidth / 2);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState(null);
  const barPositionRef = useRef(barPosition);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    } else if (permission.granted) {
      console.log("Camera permission granted.");
    } else {
      console.log("Camera permission denied.");
    }
  }, [permission]);

  useEffect(() => {
    async function prepare() {
      await tf.ready();
      const model = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        }
      );
      setModel(model);
      setTfReady(true);
    }
    prepare();
  }, []);

  const handleCameraStream = async (images) => {
    const loop = async () => {
      const imageTensor = images.next().value;

      if (model && imageTensor) {
        const poses = await model.estimatePoses(imageTensor);

        if (poses && poses.length > 0) {
          const keypoints = poses[0].keypoints.filter(
            (k) =>
              (k.name === "left_wrist" || k.name === "right_wrist") &&
              k.score > 0.5
          );
          if (keypoints.length > 0) {
            const wrist = keypoints[0];
            const barX = Math.max(
              0,
              Math.min(wrist.x - barWidth / 2, width - barWidth)
            );
            setBarPosition(barX);
            barPositionRef.current = barX;
          }
        }

        tf.dispose([imageTensor]);
      }

      requestAnimationFrame(loop);
    };

    loop();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBallPosition((prev) => {
        let newX = prev.x + ballVelocity.vx;
        let newY = prev.y + ballVelocity.vy;

        if (newX <= 0 || newX >= width - ballDiameter) {
          setBallVelocity((v) => ({ ...v, vx: -v.vx }));
        }
        if (newY <= blockStartY || newY >= height - ballDiameter) {
          setBallVelocity((v) => ({ ...v, vy: -v.vy }));
        }

        const barPosition = barPositionRef.current;
        if (
          newY + ballDiameter >= barYPosition &&
          newY + ballDiameter <= barYPosition + barHeight &&
          newX + ballDiameter >= barPosition &&
          newX <= barPosition + barWidth
        ) {
          setBallVelocity((v) => ({ ...v, vy: -v.vy }));
        }

        setBlocks((prevBlocks) => {
          return prevBlocks.filter((block) => {
            const hit =
              newX + ballDiameter >= block.x &&
              newX <= block.x + blockWidth &&
              newY + ballDiameter >= block.y &&
              newY <= block.y + blockHeight;
            if (hit) {
              setBallVelocity((v) => ({ ...v, vy: -v.vy }));
            }
            return !hit;
          });
        });

        if (newY >= height - ballDiameter) {
          newX = width / 2 - ballDiameter / 2;
          newY = ballStartY;
          setBallVelocity({ vx: 3, vy: 3 });
        }

        return { x: newX, y: newY };
      });
    }, 16);

    return () => {
      clearInterval(interval);
    };
  }, [ballVelocity]);

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>La aplicación necesita acceso a la cámara</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, styles.centered]}>
        <Text style={styles.message}>
          La aplicación necesita acceso a la cámara
        </Text>
        <Button onPress={requestPermission} title="Conceder Permiso" />
      </View>
    );
  }

  if (!tfReady) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Cargando modelo...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={true}
          facing={'front'}
          onReady={handleCameraStream}
        />
        <View style={styles.gameContainer}>
          {blocks.map((block, index) => (
            <View
              key={index}
              style={[styles.block, { left: block.x, top: block.y }]}
            />
          ))}
          <View
            style={[styles.ball, { left: ballPosition.x, top: ballPosition.y }]}
          />
          <View
            style={[styles.bar, { left: barPosition, top: barYPosition }]}
          />
        </View>
      </View>
    </PaperProvider>
  );
}

function generateBlocks() {
  const rows = 5;
  const cols = Math.floor((width - blockSpacing) / (blockWidth + blockSpacing));
  let blocksArray = [];
  const offsetX =
    (width - (cols * (blockWidth + blockSpacing) - blockSpacing)) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * (blockWidth + blockSpacing);
      const y = blockStartY + row * (blockHeight + blockSpacing);
      blocksArray.push({ x, y });
    }
  }
  return blocksArray;
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
    },
    permissionContainer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 2,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    camera: {
      width: "100%",
      height: cameraHeight,
    },
    gameContainer: {
      flex: 1,
      backgroundColor: "#000",
      position: "absolute",
      top: cameraHeight,
      width: "100%",
      height: height - cameraHeight,
    },
    ball: {
      width: ballDiameter,
      height: ballDiameter,
      borderRadius: ballDiameter / 2,
      backgroundColor: "red",
      position: "absolute",
    },
    bar: {
      width: barWidth,
      height: barHeight,
      backgroundColor: "white",
      position: "absolute",
    },
    block: {
      width: blockWidth,
      height: blockHeight,
      backgroundColor: "yellow",
      position: "absolute",
    },
    message: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 20,
    },
  });

export default JuegoControladoGestos;