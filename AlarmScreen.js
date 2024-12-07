import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Switch, Alert } from 'react-native';
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

  const toggleAlarm = (id) => {
    const updatedAlarms = alarms.map((alarm) =>
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    );
    setAlarms(updatedAlarms);
    try {
      AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
    } catch (error) {
      console.error('Failed to save alarms', error);
    }
  };

  const deleteAlarm = (id) => {
    Alert.alert(
      'Eliminar Alarma',
      '¿Estás seguro de que deseas eliminar esta alarma?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
            setAlarms(updatedAlarms);
            try {
              AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
            } catch (error) {
              console.error('Failed to save alarms', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.alarmContainer}
            onLongPress={() => deleteAlarm(item.id)}
          >
            <View style={styles.alarmInfo}>
              <Text style={styles.alarmTime}>{item.time}</Text>
              <Text style={styles.alarmName}>{item.name}</Text>
              <Text style={styles.alarmDays}>
                {item.repeat.length > 0 ? item.repeat.join(', ') : 'No repetir'}
              </Text>
            </View>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleAlarm(item.id)}
            />
          </TouchableOpacity>
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
    padding: 20,
  },
  alarmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  alarmName: {
    fontSize: 18,
    color: 'gray',
  },
  alarmDays: {
    fontSize: 14,
    color: 'gray',
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