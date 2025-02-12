import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './Home';
import Exemple from './Exemple';
import Habits from './Habits';

const CustomDrawerContent = ({ navigation }) => {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>Menu</Text>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuText}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Habits')}>
        <Text style={styles.menuText}>👤 Habits</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Exemple')}>
        <Text style={styles.menuText}>👤 Exemple</Text>
      </TouchableOpacity>
    </View>
  );
};

const Drawer = createDrawerNavigator();

// Drawer Navigator is here, no need to wrap in another NavigationContainer
export default function FirstPage() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Exemple" component={Exemple} />
      <Drawer.Screen name="Habits" component={Habits} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 18,
  },
});
