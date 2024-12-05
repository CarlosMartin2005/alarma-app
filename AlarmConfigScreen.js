import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Switch } from 'react-native';

const AlarmConfigScreen = ({ navigation }) => {
  const [time, setTime] = useState('07:00 AM');
  const [repeat, setRepeat] = useState([]);
  const [name, setName] = useState('');
  const [snooze, setSnooze] = useState(false);
  const [sound, setSound] = useState('');

  const saveAlarm = () => {
    // Lógica para guardar la alarma
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar Alarma</Text>
      <TextInput
        style={styles.input}
        placeholder="Hora"
        value={time}
        onChangeText={setTime}
      />
      <Button title="Repetir" onPress={() => {}} />
      <Button title="Nombre" onPress={() => {}} />
      <Button title="Aplazar" onPress={() => {}} />
      <Button title="Sonido" onPress={() => {}} />
      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={saveAlarm} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AlarmConfigScreen;