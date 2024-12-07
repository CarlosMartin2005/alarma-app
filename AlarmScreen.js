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

  const editAlarm = (alarm) => {
    navigation.navigate('Configurar Alarma', { alarm, addAlarm });
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const period = hour >= 12 ? 'p.m.' : 'a.m.';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id.toString()} // Asegurarse de que las claves sean únicas
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.alarmContainer}
            onPress={() => editAlarm(item)}
            onLongPress={() => deleteAlarm(item.id)}
          >
            <View style={styles.alarmInfo}>
              <View style={styles.timeAndDays}>
                <Text style={styles.alarmTime}>
                  {formatTime(item.time).split(' ')[0]}
                  <Text style={styles.alarmPeriod}> {formatTime(item.time).split(' ')[1]}</Text>
                </Text>
                <Text style={styles.alarmDays}>
                  {item.repeat.length > 0 ? item.repeat.map(day => day === 'Martes' ? 'Ma' : day === 'Miércoles' ? 'Mi' : day[0]).join(', ') : 'No repetir'}
                </Text>
              </View>
              <Text style={styles.alarmName}>{item.name}</Text>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  alarmInfo: {
    flex: 1,
  },
  timeAndDays: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'gray',
  },
  alarmPeriod: {
    fontSize: 18,
    color: 'gray',
  },
  alarmDays: {
    fontSize: 14,
    color: '#87CEFA',
    marginLeft: 10,
  },
  alarmName: {
    fontSize: 16,
    color: '#87CEFA',
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