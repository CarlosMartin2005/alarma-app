import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 'auto' },
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      <Tab.Screen name="Alarma" component={AlarmScreen} />
      <Tab.Screen name="Reloj" component={ClockScreen} />
      <Tab.Screen name="Cronómetro" component={StopwatchScreen} />
      <Tab.Screen name="Temporizador" component={TimerScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Configurar Alarma"
              component={AlarmConfigScreen}
              options={{ headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
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