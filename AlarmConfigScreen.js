import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AlarmConfigScreen = ({ navigation, route }) => {
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeat, setRepeat] = useState([]);
  const [name, setName] = useState('');
  const [snoozeInterval, setSnoozeInterval] = useState(5);
  const [snoozeRepeat, setSnoozeRepeat] = useState(3);
  const [sound, setSound] = useState('Default');
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [isNameEnabled, setIsNameEnabled] = useState(false);
  const [isSnoozeEnabled, setIsSnoozeEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    if (route.params?.alarm) {
      const { alarm } = route.params;
      setTime(new Date(`1970-01-01T${alarm.time}:00`));
      setRepeat(alarm.repeat);
      setName(alarm.name);
      setSnoozeInterval(alarm.snoozeInterval || 5);
      setSnoozeRepeat(alarm.snoozeRepeat || 3);
      setSound(alarm.sound || 'Default');
      setIsRepeatEnabled(alarm.repeat.length > 0);
      setIsNameEnabled(!!alarm.name);
      setIsSnoozeEnabled(!!alarm.snoozeInterval);
      setIsSoundEnabled(alarm.sound !== 'Default');
    }
  }, [route.params?.alarm]);

  const saveAlarm = () => {
    const newAlarm = {
      id: route.params?.alarm ? route.params.alarm.id : Date.now().toString(),
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      repeat: isRepeatEnabled ? repeat : [],
      name: isNameEnabled ? name : '',
      snoozeInterval: isSnoozeEnabled ? snoozeInterval : null,
      snoozeRepeat: isSnoozeEnabled ? snoozeRepeat : null,
      sound: isSoundEnabled ? sound : 'Default',
      enabled: true,
    };
    route.params.addAlarm(newAlarm);
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
            {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, repeat.includes(day) && styles.dayButtonActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={styles.dayButtonText}>{day[0]}</Text>
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
            {['Default', 'Beep', 'Chime', 'Ring'].map((sound) => (
              <Picker.Item key={sound} label={sound} value={sound} />
            ))}
          </Picker>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={saveAlarm} />
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