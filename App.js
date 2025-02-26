import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';

// Import Screens
import OnboardingScreen from './Screen/OnboardingScreen';
import WelcomeScreen from './Screen/WelcomeScreen';
import LoginScreen from './Screen/LoginScreen';
import SignupScreen from './Screen/SignupScreen';
import Home from './Screen/Home';
import Cards from './Screen/Cards';
import AddListModal from './Screen/AddListModal';
import FirstPage from './Screen/FirstPage';
import Habits from './Screen/Habits';
import TodoModal from './Screen/TodoModal';
import MoodTracker from './Screen/MoodTracker';
import ChatBot from './Screen/ChatBot';
import Create from './Screen/Create';
import HabitDetail from './Screen/HabitDetail';
import Profile from './Screen/Profile';

const AppStack = createStackNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    async function registerForPushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    }
    registerForPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Onboarding" component={OnboardingScreen} />
        <AppStack.Screen name="Welcome" component={WelcomeScreen} />
        <AppStack.Screen name="Signup" component={SignupScreen} />
        <AppStack.Screen name="Login" component={LoginScreen} />
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Cards" component={Cards} />
        <AppStack.Screen name="FirstPage" component={FirstPage} />
        <AppStack.Screen name="AddListModal" component={AddListModal} />
        <AppStack.Screen name="TodoModal" component={TodoModal} />
        <AppStack.Screen name="Habits" component={Habits} />
        <AppStack.Screen name="MoodTracker" component={MoodTracker} />
        <AppStack.Screen name="ChatBot" component={ChatBot} />
        <AppStack.Screen name="Create" component={Create} />
        <AppStack.Screen name="HabitDetail" component={HabitDetail} />
        <AppStack.Screen name="Profile" component={Profile} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
