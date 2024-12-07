import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlarmScreen = ({ navigation }) => {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const storedAlarms = await AsyncStorage.getItem('alarms');
        if (storedAlarms) {
          setAlarms(JSON.parse(storedAlarms));
        }
      } catch (error) {
        console.error('Failed to load alarms', error);
      }
    };

    loadAlarms();
  }, []);

  const addAlarm = (newAlarm) => {
    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    try {
      AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
    } catch (error) {
      console.error('Failed to save alarms', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarmas</Text>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.alarmContainer}>
            <Text style={styles.alarm}>{item.time}</Text>
            <Text style={styles.alarm}>{item.name}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Configurar Alarma', { addAlarm })}
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
  alarmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  alarm: {
    fontSize: 18,
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