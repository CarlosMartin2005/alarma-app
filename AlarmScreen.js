import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

const AlarmScreen = ({ navigation }) => {
  const [alarms, setAlarms] = useState([]);

  const addAlarm = async () => {
    const newAlarm = { id: Date.now().toString(), time: '07:00 AM' };
    setAlarms([...alarms, newAlarm]);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alarma",
        body: "¡Es hora de despertar!",
      },
      trigger: {
        seconds: 10, // Esto es solo un ejemplo, deberías calcular el tiempo real
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarmas</Text>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.alarm}>{item.time}</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Configurar Alarma')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  alarm: {
    fontSize: 18,
    marginVertical: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 15,
  },
});

export default AlarmScreen;