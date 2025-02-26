import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, updateDoc, doc, setDoc } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxmji1bSCrON8RI9s85-_Fs_ypaspnjQw",
  authDomain: "project-ba120.firebaseapp.com",
  projectId: "project-ba120",
  storageBucket: "project-ba120.appspot.com",
  messagingSenderId: "1037518615889",
  appId: "1:1037518615889:web:0baee0a08d66ff9f994f70",
  measurementId: "G-8FR6WT6QF8"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


const auth = getAuth(app);
const db = getFirestore(app);


const signInWithGoogle = async (idToken) => {
  const credential = GoogleAuthProvider.credential(idToken);
  try {
    await signInWithCredential(auth, credential);
    Alert.alert('Firebase Sign-in successful!');
    navigation.navigate('Home');
  } catch (error) {
    console.error(error);
    Alert.alert('Firebase Sign-in failed');
  }
};


const saveConversation = async (userId, conversation) => {
  await setDoc(doc(db, 'users', userId, 'conversations', Date.now().toString()), {
    conversation,
    timestamp: new Date(),
  });
};


export { auth, db, collection, addDoc, getDocs, query, orderBy, where, onAuthStateChanged, updateDoc, doc, setDoc };
