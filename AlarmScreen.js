import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AlarmScreen = ({ navigation }) => {
  const [alarms, setAlarms] = useState([]);

  const addAlarm = () => {
    navigation.navigate('Configurar Alarma');
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
        onPress={addAlarm}
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