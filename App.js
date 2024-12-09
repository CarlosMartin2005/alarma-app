import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, LogBox, Platform } from 'react-native';
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
import AlarmSavedScreen from './AlarmSavedScreen';
import JuegoControladoGestos from './JuegoControladoGestos';
import DeteccionFiguras from './DeteccionFiguras'; // Importa el nuevo componente
import Constants from 'expo-constants';
import * as Device from 'expo-device';

LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreAllLogs();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
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
        tabBarLabelStyle: { fontSize: 14, color: 'gray' },
        tabBarActiveTintColor: '#1E90FF',
        tabBarPressColor: '#1E90FF',
        tabBarInactiveTintColor: 'gray',
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
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access notifications was denied');
      }
    };

    requestPermissions();

    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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
              options={{ headerTitle: 'Configurar Alarma' }}
            />
            <Stack.Screen
              name="AlarmSavedScreen"
              component={AlarmSavedScreen}
              options={{ headerTitle: 'Configura forma de desbloquear' }}
            />
            <Stack.Screen
              name="JuegoControladoGestos"
              component={JuegoControladoGestos}
              options={{ headerTitle: 'Juego Controlado por Gestos' }}
            />
            <Stack.Screen
              name="DeteccionFiguras"
              component={DeteccionFiguras} // Registro de la nueva pantalla
              options={{ headerTitle: 'Detección de Figuras' }}
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

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    try {
      const projectId = 'your-project-id'; // Reemplaza con tu Project ID
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
