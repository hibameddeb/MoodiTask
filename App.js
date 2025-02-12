import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './Screen/OnboardingScreen.js';
import WelcomeScreen from './Screen/WelcomeScreen.js';
import LoginScreen from './Screen/LoginScreen.js';
import SignupScreen from './Screen/SignupScreen.js';
import Home from './Screen/Home.js';
import Cards from './Screen/Cards.js';
import Todolist from './Screen/Todolist.js';
import Exemple from './Screen/Exemple';
import AddListModal from './Screen/AddListModal.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FirstPage from './Screen/FirstPage.js';
import Habits from './Screen/Habits.js';
const AppStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const App = () => {
  
  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
      
        <AppStack.Screen name="Onboarding" component={OnboardingScreen} />
        <AppStack.Screen name="Welcome" component={WelcomeScreen} />
        <AppStack.Screen name="Signup" component={SignupScreen} />
        <AppStack.Screen name="Login" component={LoginScreen} />
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Todolist" component={Todolist} />
        <AppStack.Screen name="Cards" component={Cards} />
        <AppStack.Screen name="Exemple" component={Exemple} />
        <AppStack.Screen name="FirstPage" component={FirstPage} />
        <AppStack.Screen name="AddListModal" component={AddListModal} />
        <AppStack.Screen name="Habits" component={Habits} />
        
      </AppStack.Navigator>
      
    </NavigationContainer>
  )   
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
