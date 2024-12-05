import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AlarmScreen from './AlarmScreen';
import ClockScreen from './ClockScreen';
import StopwatchScreen from './StopwatchScreen';
import TimerScreen from './TimerScreen';
import AlarmConfigScreen from './AlarmConfigScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AlarmStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Alarmas" component={AlarmScreen} />
      <Stack.Screen
        name="Configurar Alarma"
        component={AlarmConfigScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Alarma') {
              iconName = 'alarm';
            } else if (route.name === 'Reloj') {
              iconName = 'time';
            } else if (route.name === 'Cronómetro') {
              iconName = 'stopwatch';
            } else if (route.name === 'Temporizador') {
              iconName = 'timer';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Alarma" component={AlarmStack} />
        <Tab.Screen name="Reloj" component={ClockScreen} />
        <Tab.Screen name="Cronómetro" component={StopwatchScreen} />
        <Tab.Screen name="Temporizador" component={TimerScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});