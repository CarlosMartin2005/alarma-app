import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TimerScreen = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const intervalRef = useRef(null);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const startTimer = () => {
    const totalMilliseconds = (selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds) * 1000;
    setTime(totalMilliseconds);
    setIsRunning(true);
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
  };

  const cancelTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setSelectedHours(0);
    setSelectedMinutes(0);
    setSelectedSeconds(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatTime(time)}</Text>
      {!isRunning ? (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedHours}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedHours(itemValue)}
          >
            {[...Array(24).keys()].map((i) => (
              <Picker.Item key={i} label={i.toString()} value={i} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedMinutes}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
          >
            {[...Array(60).keys()].map((i) => (
              <Picker.Item key={i} label={i.toString()} value={i} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedSeconds}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
          >
            {[...Array(60).keys()].map((i) => (
              <Picker.Item key={i} label={i.toString()} value={i} />
            ))}
          </Picker>
        </View>
      ) : null}
      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <Button title="Iniciar" onPress={startTimer} />
        ) : (
          <>
            {isPaused ? (
              <Button title="Reanudar" onPress={resumeTimer} />
            ) : (
              <Button title="Pausar" onPress={pauseTimer} />
            )}
            <Button title="Cancelar" onPress={cancelTimer} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    width: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
});

export default TimerScreen;