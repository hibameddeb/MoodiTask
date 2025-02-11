import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig'; // Assuming firebase is configured
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useAuthRequest } from 'expo-auth-session'; 
import * as Google from 'expo-auth-session';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // Google Auth request setup
  const [request, response, promptAsync] = useAuthRequest({
    clientId: '1037518615889-cm5vgrq57ll5qtf3fvrk24g77pu6jiev.apps.googleusercontent.com', // Replace with your Google Client ID
    scopes: ['openid', 'profile', 'email'],
    redirectUri: Google.makeRedirectUri({ useProxy: true }),
  });

  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      // Handle successful Google login here, sign in with Firebase
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      auth
        .signInWithCredential(credential)
        .then((userCredential) => {
          
          Alert.alert('Logged in with Google!', `Welcome, ${userCredential.user.displayName}`);
          navigation.navigate('Home'); 
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    }
  }, [response]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login successful!');
      navigation.navigate('FirstPage');
    } catch (error) {
      console.error(error);
      Alert.alert('Login failed', 'Please check your email and password');
    }
  };

  const handleForgotPassword = async () => {
    if (email === '') {
      Alert.alert('Please enter your email to reset your password');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password reset link sent', 'Check your email to reset your password');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send password reset link');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.BackIcon}>
        <TouchableOpacity style={styles.backButtonWrapper}>
          <Ionicons name={'arrow-back-outline'} style={{ color: '#000000' }} size={30} onPress={handleGoBack} />
        </TouchableOpacity>
      </View>
      <View style={styles.viewcontainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome Back </Text>
      </View>
      <View style={styles.formcontainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name={'mail-outline'} size={20} />
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputWrapper}>
          <SimpleLineIcons name={'lock'} size={20} />
          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
            <SimpleLineIcons name={'eye'} size={20} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotpasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButtomWrapper} onPress={handleLogin}>
          <Text style={styles.loginButtomText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.connectText}>Or Connect With</Text>
        <TouchableOpacity style={styles.googleButtomWrapper} onPress={() => promptAsync()}>
          <Image style={styles.imagegoogle} source={require('../assets/google.png')} />
          <Text style={styles.googleButtomText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.SignButtomWrapper}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.SignButtomText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  viewcontainer: {
    marginTop: 20,
  },
  BackIcon: {
    paddingVertical: 10,
  },
  backButtonWrapper: {
    height: 35,
    width: 35,
    backgroundColor: '#f1f3f7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 37,
    color: '#17b198',
    fontFamily: 'montserrat.regular',
  },
  formcontainer: {
    marginTop: 32,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 9,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  forgotpasswordText: {
    textAlign: 'right',
    paddingTop: 9,
    fontSize: 13,
    color: '#17b198',
  },
  loginButtomWrapper: {
    backgroundColor: '#17b198',
    borderRadius: 100,
    marginTop: 40,
  },
  loginButtomText: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },
  connectText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 13,
  },
  googleButtomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 100,
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  googleButtomText: {
    fontSize: 19,
  },
  imagegoogle: {
    height: 16,
    width: 16,
  },
  SignButtomWrapper: {
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 30,
    gap: 5,
  },
  SignButtomText: {
    color: '#17b198',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
