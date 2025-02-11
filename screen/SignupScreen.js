import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native'; 

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = () => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };
  const { colors } = useTheme();
  const [secureEntry, setSecureEntry] = useState(true);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          Alert.alert('Success', `Welcome, ${userCredential.user.displayName}!`);
          navigation.navigate('Home'); 
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    }
  }, [response]);

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSignup = async (values) => {
    const { email, password } = values;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.BackIcon}>
        <TouchableOpacity style={styles.backButtonWrapper}>
          <Ionicons name={"arrow-back-outline"} style={{ color: "#000000" }} size={33} onPress={handleGoBack} />
        </TouchableOpacity>
      </View>
      <View style={styles.viewcontainer}>
        <Text style={styles.headingText}>Create your</Text>
        <Text style={styles.headingText}>Account to</Text>
        <Text style={styles.headingText}>Join our family</Text>
      </View>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formcontainer}>
            
            <View style={styles.inputWrapper}>
              <Ionicons name={"mail-outline"} size={20} />
              <TextInput
                placeholder="Enter your email"
                style={styles.input}
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
            </View>
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Password Field */}
            <View style={styles.inputWrapper}>
              <SimpleLineIcons name={"lock"} size={20} />
              <TextInput
                placeholder="Enter your password"
                style={styles.input}
                secureTextEntry={secureEntry}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                <SimpleLineIcons name={secureEntry ? "eye" : "eye-off"} size={20} />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Confirm Password Field */}
            <View style={styles.inputWrapper}>
              <SimpleLineIcons name={"lock"} size={20} />
              <TextInput
                placeholder="Confirm your password"
                style={styles.input}
                secureTextEntry={secureEntry}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
              />
              <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                <SimpleLineIcons name={secureEntry ? "eye" : "eye-off"} size={20} />
              </TouchableOpacity>
            </View>
            {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            {/* Signup Button */}
            <View style={styles.SignupButtomContain}>
              <TouchableOpacity style={[styles.SignupButtomWrapper, { backgroundColor: "#17b198" }]} onPress={() => handleGoBack()}>
                <Text style={[styles.SignupButtomText, { color: "#FFFFFF" }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.SignupButtomWrapper} onPress={handleSubmit}>
                <Text style={[styles.SignupButtomText, { color: "#17b198" }]}>Sign-Up</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.connectText}> Or Connect With </Text>
            <TouchableOpacity style={styles.googleButtomWrapper} onPress={() => promptAsync()}>
              <Image style={styles.imagegoogle} source={require("../assets/google.png")} />
              <Text style={styles.googleButtomText}>Google</Text>
            </TouchableOpacity>

            <View style={styles.SignButtomWrapper}>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.SignButtomText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f7',
    padding: 20,
  },
  viewcontainer: {
    marginTop: 20,
  },
  BackIcon: {
    paddingVertical: 5,
  },
  backButtonWrapper: {
    height: 35,
    width: 35,
    backgroundColor: '#f1f3f7',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    fontSize: 34,
    color: '#17b198',
    fontFamily: 'montserrat.regular',
  },
  formcontainer: {
    marginTop: 25,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 9,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
  SignupButtomContain: {
    flexDirection: 'row',
    borderRadius: 100,
    marginTop: 40,
    height: 50,
    borderWidth: 2,
    borderColor: '#17b198',
  },
  SignupButtomWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 100,
  },
  SignupButtomText: {
    fontSize: 20,
  },
  connectText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 13,
  },
  googleButtomWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#17b198',
    borderRadius: 100,
    justifyContent: "center",
    padding: 10,
    gap: 10,
  },
  googleButtomText: {
    fontSize: 20,
  },
  imagegoogle: {
    height: 16,
    width: 16,
  },
  SignButtomWrapper: {
    textAlign: 'center',
    justifyContent: "center",
    flexDirection: 'row',
    marginVertical: 30,
    gap: 5,
  },
  SignButtomText: {
    color: '#17b198',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
