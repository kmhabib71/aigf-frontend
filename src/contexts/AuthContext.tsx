"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser } from '../lib/auth/authService';
import { sessionService, AnonymousSession } from '../lib/auth/sessionService';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: 'free' | 'plus' | 'pro';
  messagesUsed: number;
  messageLimit: number;
  imagesUsed: number;
  imageLimit: number;
  voiceCharsUsed: number;
  voiceCharLimit: number;
  subscriptionStatus: 'active' | 'canceled' | 'expired' | null;
  subscriptionEndsAt: Date | null;
  createdAt: Date;
  lastActive: Date;
  // Credit system (Plus/Pro users)
  creditBalance?: number;
  lastCreditRefresh?: Date | null;
  useCreditSystem?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  anonymousSession: AnonymousSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  canSendMessage: boolean;
  remainingFreeMessages: number;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [anonymousSession, setAnonymousSession] = useState<AnonymousSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [remainingFreeMessages, setRemainingFreeMessages] = useState(5);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (authUser) => {
      setUser(authUser);

      if (authUser) {
        // Sync user to database first
        await syncUserToDatabase(authUser);
        // Then fetch their profile
        await fetchUserProfile(authUser.uid);
        setAnonymousSession(null);
        setCanSendMessage(true);
      } else {
        // User is not authenticated - use anonymous session
        setUserProfile(null);
        await initializeAnonymousSession();
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sync user to database (create or update)
  const syncUserToDatabase = async (authUser: AuthUser) => {
    try {
      const idToken = await authService.getIdToken();
      if (!idToken) return;

      await fetch('http://localhost:3001/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          emailVerified: authUser.emailVerified,
        }),
      });
    } catch (error) {
      console.error('Failed to sync user to database:', error);
    }
  };

  // Initialize anonymous session for non-authenticated users
  const initializeAnonymousSession = async () => {
    try {
      const session = await sessionService.getSession();
      setAnonymousSession(session);

      const canSend = await sessionService.canSendMessage();
      setCanSendMessage(canSend);

      const remaining = await sessionService.getRemainingMessages();
      setRemainingFreeMessages(remaining);
    } catch (error) {
      console.error('Failed to initialize anonymous session:', error);
    }
  };

  // Fetch user profile from backend
  const fetchUserProfile = async (uid: string) => {
    try {
      const idToken = await authService.getIdToken();
      if (!idToken) return;

      const response = await fetch(`http://localhost:3001/api/auth/profile/${uid}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);

        // Check if user can send messages based on their plan
        const canSend = profile.messagesUsed < profile.messageLimit;
        setCanSendMessage(canSend);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    } else {
      await initializeAnonymousSession();
    }
  };

  // Auth methods
  const signInWithGoogle = async () => {
    try {
      const authUser = await authService.signInWithGoogle();

      // Migrate anonymous session messages if exists
      const session = await sessionService.getSessionForMigration();
      if (session && session.messagesUsed > 0) {
        await migrateSessionMessages(authUser.uid, session);
      }

      sessionService.clearSession();
    } catch (error: any) {
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const authUser = await authService.signInWithEmail(email, password);

      // Migrate anonymous session messages if exists
      const session = await sessionService.getSessionForMigration();
      if (session && session.messagesUsed > 0) {
        await migrateSessionMessages(authUser.uid, session);
      }

      sessionService.clearSession();
    } catch (error: any) {
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const authUser = await authService.signUpWithEmail(email, password, displayName);

      // Migrate anonymous session messages if exists
      const session = await sessionService.getSessionForMigration();
      if (session && session.messagesUsed > 0) {
        await migrateSessionMessages(authUser.uid, session);
      }

      sessionService.clearSession();
    } catch (error: any) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setUserProfile(null);
    await initializeAnonymousSession();
  };

  // Migrate anonymous session messages to user account
  const migrateSessionMessages = async (uid: string, session: AnonymousSession) => {
    try {
      const idToken = await authService.getIdToken();
      if (!idToken) return;

      await fetch('http://localhost:3001/api/auth/migrate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid,
          sessionId: session.sessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to migrate session messages:', error);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    anonymousSession,
    loading,
    isAuthenticated: !!user,
    canSendMessage,
    remainingFreeMessages,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
