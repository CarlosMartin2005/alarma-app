import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlarmConfigScreen = ({ navigation, route }) => {
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeat, setRepeat] = useState([]);
  const [name, setName] = useState('');
  const [snoozeInterval, setSnoozeInterval] = useState(5);
  const [snoozeRepeat, setSnoozeRepeat] = useState(3);
  const [sound, setSound] = useState('default');
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [isNameEnabled, setIsNameEnabled] = useState(false);
  const [isSnoozeEnabled, setIsSnoozeEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isTimeChanged, setIsTimeChanged] = useState(false);
  const [notificationId, setNotificationId] = useState("none");

  const notificationListener = useRef();

  useEffect(() => {
    if (route.params?.alarm) {
      const { alarm } = route.params;
      const [hour, minute] = alarm.time.split(':');
      const alarmTime = new Date();
      alarmTime.setHours(hour);
      alarmTime.setMinutes(minute);
      alarmTime.setSeconds(0);
      setTime(alarmTime);
      setRepeat(alarm.repeat);
      setName(alarm.name);
      setSnoozeInterval(alarm.snoozeInterval || 5);
      setSnoozeRepeat(alarm.snoozeRepeat || 3);
      setSound(alarm.sound || 'default');
      setIsRepeatEnabled(alarm.repeat.length > 0);
      setIsNameEnabled(!!alarm.name);
      setIsSnoozeEnabled(!!alarm.snoozeInterval);
      setIsSoundEnabled(alarm.sound !== 'default');
    }

    getData();
    notificationListener.current =
      Notifications.addNotificationResponseReceivedListener((notification) => {
        console.log(notification);
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, [route.params?.alarm]);

  const scheduleNotification = async (alarm) => {
    const trigger = new Date();
    const [hour, minute] = alarm.time.split(':');
    trigger.setHours(parseInt(hour, 10));
    trigger.setMinutes(parseInt(minute, 10));
    trigger.setSeconds(0);
  
    // Si la hora programada ya ha pasado hoy, programa para mañana
    if (trigger <= new Date()) {
      trigger.setDate(trigger.getDate() + 1);
    }
  
    // Programar la notificación
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alarma",
        body: alarm.name || "¡Es hora!",
        sound: alarm.sound !== 'default' ? alarm.sound : null, // Configurar sonido solo si no es 'default'
        vibrate: [0, 500, 200, 500], // Patrón de vibración
      },
      trigger: {
        date: trigger, // Usar el objeto Date directamente
        repeats: false, // Cambiar si la alarma debe repetirse
      },
    });
  
    setNotificationId(identifier);
    await storeData(identifier);
  };

  const saveAlarm = async () => {
    const newAlarm = {
      id: Date.now().toString(),
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      repeat: isRepeatEnabled ? repeat : [],
      name: isNameEnabled ? name : '',
      snoozeInterval: isSnoozeEnabled ? snoozeInterval : null,
      snoozeRepeat: isSnoozeEnabled ? snoozeRepeat : null,
      sound: isSoundEnabled ? sound : 'default',
      enabled: true,
    };
  
    if (route.params?.alarm) {
      // Actualizar alarma existente
      route.params.updateAlarm(newAlarm);
    } else {
      // Agregar nueva alarma
      route.params.addAlarm(newAlarm);
    }
  
    await scheduleNotification(newAlarm);
    navigation.goBack();
  };

  const toggleDay = (day) => {
    setRepeat((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
    setIsTimeChanged(true);
  };

  const storeData = async (id) => {
    try {
      const savedValues = id;
      const jsonValue = await AsyncStorage.setItem(
        "currentAlarmId",
        JSON.stringify(savedValues)
      );
      return jsonValue;
    } catch (e) {
      alert(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("currentAlarmId");
      const jsonValue2 = JSON.parse(jsonValue);
      setNotificationId(jsonValue2);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurar Alarma</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Hora"
          value={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          editable={false}
        />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <View style={styles.optionContainer}>
        <View style={styles.optionRow}>
          <Text>Repetir</Text>
          <Switch value={isRepeatEnabled} onValueChange={setIsRepeatEnabled} />
        </View>
        {isRepeatEnabled && (
          <View style={styles.daysContainer}>
            {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dayButton, repeat.includes(day) && styles.dayButtonActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={styles.dayButtonText}>
                  {day === 'Martes' ? 'Ma' : day === 'Miércoles' ? 'Mi' : day[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <View style={styles.optionContainer}>
        <View style={styles.optionRow}>
          <Text>Nombre</Text>
          <Switch value={isNameEnabled} onValueChange={setIsNameEnabled} />
        </View>
        {isNameEnabled && (
          <TextInput
            style={styles.input}
            placeholder="Nombre de la alarma"
            value={name}
            onChangeText={setName}
          />
        )}
      </View>
      <View style={styles.optionContainer}>
        <View style={styles.optionRow}>
          <Text>Aplazar</Text>
          <Switch value={isSnoozeEnabled} onValueChange={setIsSnoozeEnabled} />
        </View>
        {isSnoozeEnabled && (
          <>
            <Picker
              selectedValue={snoozeInterval}
              style={styles.picker}
              onValueChange={(itemValue) => setSnoozeInterval(itemValue)}
            >
              {[5, 10, 15, 20, 25, 30].map((interval) => (
                <Picker.Item key={interval} label={`${interval} minutos`} value={interval} />
              ))}
            </Picker>
            <Picker
              selectedValue={snoozeRepeat}
              style={styles.picker}
              onValueChange={(itemValue) => setSnoozeRepeat(itemValue)}
            >
              {[3, 5, 10, 15].map((repeat) => (
                <Picker.Item key={repeat} label={`${repeat} veces`} value={repeat} />
              ))}
            </Picker>
          </>
        )}
      </View>
      <View style={styles.optionContainer}>
        <View style={styles.optionRow}>
          <Text>Sonido</Text>
          <Switch value={isSoundEnabled} onValueChange={setIsSoundEnabled} />
        </View>
        {isSoundEnabled && (
          <Picker
            selectedValue={sound}
            style={styles.picker}
            onValueChange={(itemValue) => setSound(itemValue)}
          >
            {['default', 'Beep', 'Chime', 'Ring'].map((sound) => (
              <Picker.Item key={sound} label={sound} value={sound} />
            ))}
          </Picker>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={saveAlarm} disabled={!isTimeChanged} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  dayButtonActive: {
    backgroundColor: 'gray',
  },
  dayButtonText: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default AlarmConfigScreen;