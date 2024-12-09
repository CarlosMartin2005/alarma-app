
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ObjectFoundScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Objeto encontrado</Text>
      <Button
        title="Volver a la pantalla principal"
        onPress={() => navigation.navigate('ObjectDetectionScreen')}
      />
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
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ObjectFoundScreen;