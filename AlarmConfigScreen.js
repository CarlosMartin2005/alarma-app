import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Switch, ScrollView } from 'react-native';

const AlarmConfigScreen = ({ navigation }) => {
  const [time, setTime] = useState('07:00 AM');
  const [repeat, setRepeat] = useState(false);
  const [name, setName] = useState(false);
  const [snooze, setSnooze] = useState(false);
  const [sound, setSound] = useState(false);

  const saveAlarm = () => {
    // Lógica para guardar la alarma
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurar Alarma</Text>
      <TextInput
        style={styles.input}
        placeholder="Hora"
        value={time}
        onChangeText={setTime}
      />
      <View style={styles.optionContainer}>
        <Text>Repetir</Text>
        <Switch value={repeat} onValueChange={setRepeat} />
      </View>
      <View style={styles.optionContainer}>
        <Text>Nombre</Text>
        <Switch value={name} onValueChange={setName} />
      </View>
      <View style={styles.optionContainer}>
        <Text>Aplazar</Text>
        <Switch value={snooze} onValueChange={setSnooze} />
      </View>
      <View style={styles.optionContainer}>
        <Text>Sonido</Text>
        <Switch value={sound} onValueChange={setSound} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default AlarmConfigScreen;