import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('✅ Loaded user from storage:', { email: userData.email, role: userData.role });
          setUser(userData);
        }
      } catch (error) {
        console.error('❌ Error loading stored user:', error);
      }
    };
    loadStoredUser();
  }, []);

  useEffect(() => {
    let mounted = true;

    console.log('🔵 AuthContext: Setting up auth listener');

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔵 Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      console.log('🔵 Firebase User:', firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified
      } : null);
      
      if (!mounted) {
        console.log('⚠️ Component unmounted, ignoring auth change');
        return;
      }
      
      if (firebaseUser) {
        console.log('🔵 Getting user profile from database...');
        try {
          // Get user profile from Realtime Database
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists() && mounted) {
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...snapshot.val()
            };
            console.log('✅ User data loaded:', { email: userData.email, role: userData.role });
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
          } else {
            console.log('⚠️ User profile not found in database');
            // Don't sign out immediately, let user try again
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.email?.split('@')[0] || 'User',
              role: 'admin' // Default role
            });
          }
        } catch (error) {
          console.error('❌ Error getting user profile:', error);
          // Don't sign out on database error, keep basic auth
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.email?.split('@')[0] || 'User',
            role: 'admin' // Default role
          });
        }
      } else {
        console.log('🔵 User logged out, clearing data');
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      
      if (mounted) {
        setLoading(false);
        console.log('✅ Auth loading completed');
      }
    });

    return () => {
      console.log('🔵 AuthContext: Cleaning up auth listener');
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // User data will be set by onAuthStateChanged listener
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password, name, role) => {
    try {
      console.log('Starting sign up process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created in Firebase Auth:', userCredential.user.uid);
      const userId = userCredential.user.uid;
      
      // Save user profile to Realtime Database
      const userProfile = {
        name,
        role,
        email,
        createdAt: new Date().toISOString()
      };
      
      console.log('Saving user profile to database...');
      await set(ref(database, `users/${userId}`), userProfile);
      console.log('User profile saved successfully');
      
      // User data will be set by onAuthStateChanged listener
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      let errorMessage = 'Pendaftaran gagal';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah terdaftar';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Kata sandi terlalu lemah';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Tidak ada koneksi internet';
      } else {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem('user');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin: user?.role === 'admin',
      isMasyarakat: user?.role === 'masyarakat'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
