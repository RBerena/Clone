// Import AsyncStorage for React Native storage persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Firebase functions to initialize app, auth with persistence, and Firestore database
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object with keys and identifiers for your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBfLiQt_qbtCyrm45BeUZWZ2ZHLtmGk2Uk",
  authDomain: "casaplanta-afd69.firebaseapp.com",
  projectId: "casaplanta-afd69",
  storageBucket: "casaplanta-afd69.appspot.com",
  messagingSenderId: "429752689393",
  appId: "1:429752689393:web:67f80782041d44f976bf50",
  measurementId: "G-TK6WZ681ZN"
};

// Initialize Firebase app instance with configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with React Native persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore database instance from the app
const db = getFirestore(app);

// Export auth and db instances for use in other parts of the app
export { auth, db };

