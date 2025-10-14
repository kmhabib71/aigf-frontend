// Anonymous session service for free trial (3 messages + 1 story scene)
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { backendUrl } from "@/lib/config";
export interface AnonymousSession {
  sessionId: string;
  fingerprint: string;
  messagesUsed: number;
  storyScenesCreated: number;
  createdAt: number;
  lastActive: number;
}

const SESSION_KEY = "ai-gf-session";
const MAX_FREE_MESSAGES = 3; // Updated to match landing page promise
const MAX_FREE_STORY_SCENES = 1;

class SessionService {
  private fpPromise: Promise<any> | null = null;

  constructor() {
    // Initialize fingerprint library (only in browser)
    if (typeof window !== "undefined") {
      this.fpPromise = FingerprintJS.load();
    }
  }

  // Get or create anonymous session
  async getSession(): Promise<AnonymousSession> {
    // Return dummy session on server-side
    if (typeof window === "undefined") {
      return {
        sessionId: "ssr-dummy",
        fingerprint: "ssr",
        messagesUsed: 0,
        storyScenesCreated: 0,
        createdAt: Date.now(),
        lastActive: Date.now(),
      };
    }

    try {
      // Check localStorage first
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const session: AnonymousSession = JSON.parse(stored);
        session.lastActive = Date.now();
        this.saveSession(session);
        return session;
      }

      // Create new session
      return await this.createSession();
    } catch (error) {
      console.error("Session get error:", error);
      return await this.createSession();
    }
  }

  // Create new anonymous session
  private async createSession(): Promise<AnonymousSession> {
    const fingerprint = await this.getFingerprint();
    const session: AnonymousSession = {
      sessionId: this.generateSessionId(),
      fingerprint,
      messagesUsed: 0,
      storyScenesCreated: 0,
      createdAt: Date.now(),
      lastActive: Date.now(),
    };

    this.saveSession(session);
    await this.syncSessionToBackend(session);

    return session;
  }

  // Increment message count
  async incrementMessageCount(): Promise<number> {
    const session = await this.getSession();
    session.messagesUsed += 1;
    session.lastActive = Date.now();
    this.saveSession(session);

    // Sync to backend
    await this.syncSessionToBackend(session);

    return session.messagesUsed;
  }

  // Check if user can send more messages
  async canSendMessage(): Promise<boolean> {
    const session = await this.getSession();
    return session.messagesUsed < MAX_FREE_MESSAGES;
  }

  // Get remaining free messages
  async getRemainingMessages(): Promise<number> {
    const session = await this.getSession();
    return Math.max(0, MAX_FREE_MESSAGES - session.messagesUsed);
  }

  // Check if limit reached
  async isLimitReached(): Promise<boolean> {
    const session = await this.getSession();
    return session.messagesUsed >= MAX_FREE_MESSAGES;
  }

  // Story scene tracking methods
  async incrementStorySceneCount(): Promise<number> {
    const session = await this.getSession();
    session.storyScenesCreated += 1;
    session.lastActive = Date.now();
    this.saveSession(session);

    // Sync to backend
    await this.syncSessionToBackend(session);

    return session.storyScenesCreated;
  }

  async canCreateStory(): Promise<boolean> {
    const session = await this.getSession();
    return session.storyScenesCreated < MAX_FREE_STORY_SCENES;
  }

  async getRemainingStoryScenes(): Promise<number> {
    const session = await this.getSession();
    return Math.max(0, MAX_FREE_STORY_SCENES - session.storyScenesCreated);
  }

  async isStoryLimitReached(): Promise<boolean> {
    const session = await this.getSession();
    return session.storyScenesCreated >= MAX_FREE_STORY_SCENES;
  }

  // Clear session (after signup)
  clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  // Get session for migration after signup
  async getSessionForMigration(): Promise<AnonymousSession | null> {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Private helpers
  private saveSession(session: AnonymousSession): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }

  private generateSessionId(): string {
    return `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private async getFingerprint(): Promise<string> {
    // Server-side fallback
    if (typeof window === "undefined" || !this.fpPromise) {
      return `ssr-fallback-${Date.now()}`;
    }

    try {
      const fp = await this.fpPromise;
      const result = await fp.get();
      return result.visitorId;
    } catch (error) {
      console.error("Fingerprint error:", error);
      // Fallback to basic fingerprint
      return `fallback_${navigator.userAgent}_${screen.width}x${screen.height}`;
    }
  }

  // Sync session to backend (for abuse prevention)
  private async syncSessionToBackend(session: AnonymousSession): Promise<void> {
    try {
      await fetch(`${backendUrl}/api/auth/sync-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });
    } catch (error) {
      console.error("Session sync error:", error);
      // Don't throw - session still works locally
    }
  }
}

export const sessionService = new SessionService();
export { MAX_FREE_MESSAGES, MAX_FREE_STORY_SCENES };
