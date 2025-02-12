import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';




const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'montserrat.regular': require('../assets/fonts/montserrat.regular.ttf'),
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor:"#17b198" }]}>
      <View style={styles.mainContent}>
        
        <Text style={[styles.headerText, { color: colors.text }]}>
          Let's Get Started !
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/im5.png')}
            style={{ width: 350, height: 350 }}
          />
        </View>
        <View style={styles.buttonsContainer}>
          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[styles.signupButton, ]}
          >
            <Text style={styles.signupButtonText}>Login</Text>
          </TouchableOpacity>
          </View>
          {/* Log In Section */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.text }]}>
              You don't have an account ?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              style={styles.loginButton}
            >
              <Text style={[styles.loginButtonText, { color:'#FFFFFF' }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-around',
    
  },
  headerText: {
    paddingTop:40,
    fontSize: 36,
    textAlign: 'center',
    fontWeight:'bold',
    fontFamily:'montserrat.regular'
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    
  },
  buttonsContainer: {
    marginHorizontal: 16,
  },
  signupButton: {
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor:"#e04f5f",
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  loginContainer: {
    textAlign:'center',
    justifyContent:"center",
    flexDirection:'row',
  
    gap:5,
  },
  loginText: {
    fontWeight: '600',
    marginBottom: 8,
    color:'#FFFFFF',
    fontFamily:'montserrat.regular'
  },
  loginButton: {
    
    borderRadius: 12,
    marginTop: 0,
    paddingHorizontal: 0,
  },
  loginButtonText: {
    fontWeight: '600',
    fontFamily:'montserrat.regular'
  },
});

export default WelcomeScreen;
