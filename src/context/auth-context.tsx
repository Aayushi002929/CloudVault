'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { UserProfile } from '@/types';
import { INITIAL_USER } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoUser: (role: 'student' | 'professor' | 'unauthorized') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(INITIAL_USER);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isFirebaseConfigured());

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      // Offline/Demo state
      setIsDemoMode(true);
      setProfile(INITIAL_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsDemoMode(false);
        setProfile({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Cloud User',
          email: firebaseUser.email || '',
          avatarUrl: firebaseUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
          storageQuotaBytes: 5 * 1024 * 1024 * 1024,
          storageUsedBytes: 1.42 * 1024 * 1024 * 1024,
        });
      } else {
        setUser(null);
        // Fall back to default demo profile for seamless offline preview
        setProfile(INITIAL_USER);
        setIsDemoMode(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isFirebaseConfigured() || !auth) {
      // Demo simulated login
      setProfile({
        ...INITIAL_USER,
        email,
        name: email.split('@')[0],
      });
      setIsDemoMode(true);
      return { success: true };
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    if (!isFirebaseConfigured() || !auth) {
      setProfile({
        ...INITIAL_USER,
        uid: 'usr-' + Date.now(),
        name,
        email,
      });
      setIsDemoMode(true);
      return { success: true };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await firebaseUpdateProfile(cred.user, { displayName: name });
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    if (auth && isFirebaseConfigured()) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    if (!isFirebaseConfigured() || !auth) {
      return { success: true };
    }
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset' };
    }
  };

  const switchDemoUser = (role: 'student' | 'professor' | 'unauthorized') => {
    if (role === 'student') {
      setProfile(INITIAL_USER);
    } else if (role === 'professor') {
      setProfile({
        uid: 'usr-prof-002',
        name: 'Dr. Ramesh Kumar (Project Guide)',
        email: 'guide.professor@btech.edu',
        createdAt: '2026-08-01T09:00:00Z',
        storageQuotaBytes: 10 * 1024 * 1024 * 1024,
        storageUsedBytes: 2.1 * 1024 * 1024 * 1024,
      });
    } else {
      setProfile({
        uid: 'usr-external-999',
        name: 'Unauthorized Stranger',
        email: 'stranger@external.net',
        createdAt: '2026-11-01T09:00:00Z',
        storageQuotaBytes: 1 * 1024 * 1024 * 1024,
        storageUsedBytes: 0,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemoMode,
        login,
        signup,
        logout,
        resetPassword,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
