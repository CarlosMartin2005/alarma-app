import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

const StopwatchScreen = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`;
  };

  const startStopwatch = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 10);
    }, 10);
  };

  const stopStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const lapStopwatch = () => {
    const lapTime = time;
    const lapNumber = laps.length + 1;
    const lapDifference = lapNumber === 1 ? lapTime : lapTime - laps[laps.length - 1].time;
    setLaps([...laps, { number: lapNumber, time: lapTime, difference: lapDifference }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <Button title="Iniciar" onPress={startStopwatch} />
        ) : (
          <>
            <Button title="Detener" onPress={stopStopwatch} />
            <Button title="Parcial" onPress={lapStopwatch} />
          </>
        )}
        <Button title="Reiniciar" onPress={resetStopwatch} />
      </View>
      <FlatList
        data={laps}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <View style={styles.lapContainer}>
            <Text style={styles.lapText}>{item.number}</Text>
            <Text style={styles.lapText}>{formatTime(item.time)}</Text>
            <Text style={styles.lapText}>{formatTime(item.difference)}</Text>
          </View>
        )}
      />
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  lapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  lapText: {
    fontSize: 18,
  },
});

export default StopwatchScreen;