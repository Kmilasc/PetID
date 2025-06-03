import { getApp, initializeApp } from '@react-native-firebase/app';

import { getFirestore } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getCrashlytics } from '@react-native-firebase/crashlytics';
import { Platform } from 'react-native';


if (Platform.OS === 'web') {
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  initializeApp(firebaseConfig)
}

const app = getApp();

const db = getFirestore(app);

const auth = getAuth(app);

const crashlytics = getCrashlytics();


export { app, db, auth, crashlytics };
