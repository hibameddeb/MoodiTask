
import { initializeApp } from "firebase/app";

import { initializeAuth} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence ,GoogleAuthProvider} from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxmji1bSCrON8RI9s85-_Fs_ypaspnjQw",
  authDomain: "project-ba120.firebaseapp.com",
  projectId: "project-ba120",
  storageBucket: "project-ba120.firebasestorage.app",
  messagingSenderId: "1037518615889",
  appId: "1:1037518615889:web:0baee0a08d66ff9f994f70",
  measurementId: "G-8FR6WT6QF8"
};
const signInWithGoogle = async (idToken) => {
  const credential = GoogleAuthProvider.credential(idToken);
  try {
    await signInWithCredential(auth, credential);
    Alert.alert('Firebase Sign-in successful!');
    navigation.navigate('Home');
  } catch (error) {
    console.error(error);
    Alert.alert('Firebase Sign-in failed');
  }};
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
const db = getFirestore(app);

export { auth };


export { db, collection, addDoc, getDocs, query, orderBy, where, onAuthStateChanged };
