import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UnlockConfigScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('JuegoControladoGestos')}>
        <Text style={styles.cardText}>Juego Manipulado por gesto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DeteccionFiguras')}>
        <Text style={styles.cardText}>Detección de figura</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => { /* Acción para Detección de objetos */ }}>
        <Text style={styles.cardText}>Detección de objetos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
  },
});

export default UnlockConfigScreen;
