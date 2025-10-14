// Authentication service with Firebase
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { backendUrl } from "@/lib/config";
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

class AuthService {
  // Google Sign In
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create/update user in MongoDB
      await this.syncUserToBackend(user);

      return this.formatUser(user);
    } catch (error: any) {
      console.error("Google sign in error:", error);
      throw new Error(error.message || "Failed to sign in with Google");
    }
  }

  // Email/Password Sign Up
  async signUpWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthUser> {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      // Update display name
      await updateProfile(user, { displayName });

      // Create user in MongoDB
      await this.syncUserToBackend(user, displayName);

      return this.formatUser(user);
    } catch (error: any) {
      console.error("Email sign up error:", error);
      throw new Error(error.message || "Failed to create account");
    }
  }

  // Email/Password Sign In
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update last active
      await this.syncUserToBackend(user);

      return this.formatUser(user);
    } catch (error: any) {
      console.error("Email sign in error:", error);
      throw new Error(error.message || "Invalid email or password");
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw new Error(error.message || "Failed to send reset email");
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw new Error(error.message || "Failed to sign out");
    }
  }

  // Auth State Observer
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback(this.formatUser(user));
      } else {
        callback(null);
      }
    });
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.formatUser(user) : null;
  }

  // Get Firebase ID token for API calls
  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  }

  // Sync user to backend (create or update in MongoDB)
  private async syncUserToBackend(
    user: User,
    displayName?: string
  ): Promise<void> {
    try {
      const idToken = await user.getIdToken();

      const response = await fetch(`${backendUrl}/api/auth/sync-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: displayName || user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync user to backend");
      }
    } catch (error) {
      console.error("Backend sync error:", error);
      // Don't throw - auth still works even if backend sync fails
    }
  }

  // Format Firebase user to our interface
  private formatUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }
}

export const authService = new AuthService();
