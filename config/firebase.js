import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration for BNN App
const firebaseConfig = {
  apiKey: "AIzaSyC4cGLIob72wPNj8SNiEeLBsiYUbAHsT9Q",
  authDomain: "bnn-app-react.firebaseapp.com",
  databaseURL: "https://bnn-app-react-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bnn-app-react",
  storageBucket: "bnn-app-react.firebasestorage.app",
  messagingSenderId: "743625772794",
  appId: "1:743625772794:web:71a3a808089f0352da4343"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;
