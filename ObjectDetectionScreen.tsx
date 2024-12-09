import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ObjectDetectionScreen = ({ navigation }) => {
  const [selectedObject, setSelectedObject] = useState('');

  const objects = ['computadora', 'sandalia', 'Taza de café', 'pelota'];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona un objeto:</Text>
      <Picker
        selectedValue={selectedObject}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedObject(itemValue)}
      >
        {objects.map((object, index) => (
          <Picker.Item key={index} label={object} value={object} />
        ))}
      </Picker>
      {selectedObject ? (
        <Button
          title={`Buscar ${selectedObject}`}
          onPress={() => navigation.navigate('ObjectSearchScreen', { object: selectedObject })}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
});

export default ObjectDetectionScreen;