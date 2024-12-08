import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import Svg, { Circle, Line } from 'react-native-svg';

const ClockScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useState('');
  const [temperature, setTemperature] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=d749db81451a77b904be6c2521e73b02&units=metric`)
        .then((response) => response.json())
        .then((data) => {
          const timezoneOffset = data.timezone / 3600; // Convertir de segundos a horas
          const timezoneString = `GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;
          setTimezone(timezoneString);
          setTemperature(`${data.main.temp}°C`);
        })
        .catch((error) => console.error(error));
    })();

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderClock = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const secondAngle = (seconds / 60) * 360;
    const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourAngle = (hours / 12) * 360 + (minutes / 60) * 30;

    return (
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="90" stroke="black" strokeWidth="2" fill="white" />
        <Line x1="100" y1="100" x2="100" y2="30" stroke="black" strokeWidth="2" transform={`rotate(${hourAngle}, 100, 100)`} />
        <Line x1="100" y1="100" x2="100" y2="20" stroke="black" strokeWidth="2" transform={`rotate(${minuteAngle}, 100, 100)`} />
        <Line x1="100" y1="100" x2="100" y2="10" stroke="red" strokeWidth="1" transform={`rotate(${secondAngle}, 100, 100)`} />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Zona Horaria: {timezone}</Text>
      <Text style={styles.text}>Hora: {formatTime(currentTime)}</Text>
      <Text style={styles.text}>Temperatura: {temperature}</Text>
      {renderClock()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
});

export default ClockScreen;