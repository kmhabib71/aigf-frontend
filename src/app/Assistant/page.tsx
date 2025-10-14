"use client";

import React, { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { Socket } from "socket.io-client";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import ConversationSidebar from "@/components/ConversationSidebar";
import { SmartGreeting } from "@/features/smart-greeting";
import NotesPanel from "@/features/notes-system/NotesPanel";
import { StreamingChat } from "@/components/StreamingChat";
import LanguageSelector from "@/components/LanguageSelector";
import SoftGateModal from "@/components/SoftGateModal";
import { sessionService } from "@/lib/auth/sessionService";
import {
  autoDetectLanguage,
  saveLanguagePreference,
  getAutoDetectedLanguage,
  translateText,
  translateBatch,
  extractCompleteSentences,
} from "@/lib/translationUtils";
import {
  getConversationIdFromUrl,
  setConversationIdInUrl,
  navigateToConversation,
  navigateToNewConversation,
  onConversationIdChange,
  isConversationUrl,
  isHomePage,
} from "../lib/urlParams";
import { backendUrl } from "@/lib/config";
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  imageUrls?: string[];
  imageMetadata?: {
    imageType: string;
    style: string;
    contentRating: string;
    quality: string;
    generatedAt: string;
  };
}

interface ChatStats {
  messageCount: number;
  totalProcessed: number;
  compressionChunks: number;
  userProfileFields: number;
  promptTokens?: number;
  promptUsagePercentage?: number;
  totalTokens?: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: number;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  completed: boolean;
  hasReminder: boolean;
}

interface NotesAction {
  type: string;
  action: string;
  message: string;
  note?: Note;
}

export default function Assistant() {
  const { socket: globalSocket, isConnected } = useSocket(); // Use global socket
  const { user, anonymousSession } = useAuth(); // Get user ID for token tracking
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [stats, setStats] = useState<ChatStats>({
    messageCount: 0,
    totalProcessed: 0,
    compressionChunks: 0,
    userProfileFields: 0,
    promptTokens: 0,
    promptUsagePercentage: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tokenLimitNotification, setTokenLimitNotification] = useState<
    string | null
  >(null);
  const [notesAction, setNotesAction] = useState<NotesAction | null>(null);
  const [relevantNotes, setRelevantNotes] = useState<Note[]>([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      timestamp: string;
      priority: number;
    }>
  >([]);

  // STREAMING STATE (streaming is now the only mode)
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreamingInProgress, setIsStreamingInProgress] = useState(false);
  const streamingRenderTrigger = useRef(0); // Force re-render trigger
  const [toolProcessingMessage, setToolProcessingMessage] = useState<
    string | null
  >(null);
  const [loadingState, setLoadingState] = useState<{
    phase:
      | "idle"
      | "connecting"
      | "sending"
      | "processing"
      | "tool_execution"
      | "generating";
    message: string;
    detail?: string;
  }>({
    phase: "idle",
    message: "",
  });

  // NSFW MODE STATE
  const [nsfwMode, setNsfwMode] = useState(false);
  const [isTogglingMode, setIsTogglingMode] = useState(false);

  // PERSONA STATE
  const [persona, setPersona] = useState("");
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  // TRANSLATION STATE
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [autoDetectedLanguage, setAutoDetectedLanguage] = useState<
    string | null
  >(null);
  const [sentenceBuffer, setSentenceBuffer] = useState("");
  const [showLanguageNotice, setShowLanguageNotice] = useState(false);

  // SOFT GATE STATE
  const [showSoftGate, setShowSoftGate] = useState(false);
  const [anonymousMessagesUsed, setAnonymousMessagesUsed] = useState(0);

  // Ref to track latest streaming content and prevent stale closures
  const streamingContentRef = useRef("");
  // Ref to prevent duplicate translation calls (React strict mode issue)
  const translationInProgressRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamingChatRef = useRef<any>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load conversation ID from URL parameters
    const urlConversationId = getConversationIdFromUrl();
    if (urlConversationId) {
      setConversationId(urlConversationId);
      loadConversationHistory(urlConversationId);
    } else {
      // For new conversations, start with empty messages to show SmartGreeting
      setMessages([]);
    }

    // Listen for URL parameter changes (back/forward navigation)
    const cleanup = onConversationIdChange((newConversationId) => {
      if (newConversationId !== conversationId) {
        setConversationId(newConversationId);
        if (newConversationId) {
          loadConversationHistory(newConversationId);
        } else {
          setMessages([]);
          setStats({
            messageCount: 0,
            totalProcessed: 0,
            compressionChunks: 0,
            userProfileFields: 0,
          });
        }
      }
    });

    return cleanup;
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-detect language on first load
  useEffect(() => {
    const initializeLanguage = async () => {
      const detectedLang = await autoDetectLanguage();
      const autoDetected = getAutoDetectedLanguage();

      setSelectedLanguage(detectedLang);
      setAutoDetectedLanguage(autoDetected);

      // Show one-time notice if auto-detected non-English
      if (detectedLang !== "en" && autoDetected) {
        setShowLanguageNotice(true);
        setTimeout(() => setShowLanguageNotice(false), 5000); // Hide after 5 seconds
      }
    };

    initializeLanguage();
  }, []);

  // Force scroll when streaming content updates (for real-time streaming)
  useEffect(() => {
    if (streamingContent) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamingContent]);

  // Socket.IO connection and notification handling
  useEffect(() => {
    // Use global socket connection instead of creating new one
    if (!globalSocket) return;

    socketRef.current = globalSocket;

    const handleConnect = () => {
      console.log("🔌 Chat: Connected to server");
      // Join conversation room if we have a conversation ID
      if (conversationId) {
        globalSocket.emit("join-conversation", conversationId);
      }
    };

    const handleDisconnect = () => {
      console.log("🔌 Chat: Disconnected from server");
    };

    // Register handlers
    globalSocket.on("connect", handleConnect);
    globalSocket.on("disconnect", handleDisconnect);

    // If already connected, join conversation immediately
    if (isConnected && conversationId) {
      globalSocket.emit("join-conversation", conversationId);
    }

    // Listen for reminder notifications
    const handleReminderNotification = (notification: {
      id: string;
      type: string;
      title: string;
      message: string;
      timestamp: string;
      priority: number;
      noteId: string;
    }) => {
      console.log("🔔 Received reminder notification:", notification);

      // Add to notifications state
      setNotifications((prev) => [...prev, notification]);

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
          tag: notification.id, // Prevent duplicate notifications
          requireInteraction: true, // Keep notification visible until user interacts
          silent: false, // Allow notification sound
        });

        // Optional: Handle notification click to focus the window
        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
        };
      } else if (Notification.permission === "default") {
        // Request permission if not yet granted
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(notification.title, {
              body: notification.message,
              icon: "/favicon.ico",
              tag: notification.id,
              requireInteraction: true,
            });
          }
        });
      }

      // Auto-remove notification after 10 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 10000);
    };

    globalSocket.on("reminder-notification", handleReminderNotification);

    // Request notification permission proactively
    const requestNotificationPermission = async () => {
      if ("Notification" in window && Notification.permission === "default") {
        try {
          const permission = await Notification.requestPermission();
          console.log("🔔 Notification permission:", permission);
          if (permission === "granted") {
            console.log("✅ Browser notifications enabled for reminders");
          }
        } catch (error) {
          console.error("❌ Error requesting notification permission:", error);
        }
      }
    };

    requestNotificationPermission();

    // Cleanup on unmount
    return () => {
      globalSocket.off("connect", handleConnect);
      globalSocket.off("disconnect", handleDisconnect);
      globalSocket.off("reminder-notification", handleReminderNotification);
      // Don't disconnect the global socket - it's shared across the app
    };
  }, [globalSocket, isConnected, conversationId]);

  // Separate useEffect to handle conversation room joining when conversationId changes
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected && conversationId) {
      console.log(`🏠 Joining conversation room: ${conversationId}`);
      socketRef.current.emit("join-conversation", conversationId);
    }
  }, [conversationId]);

  const loadConversationHistory = async (id: string) => {
    try {
      console.log(`📂 Loading conversation history for: ${id}`);
      const response = await fetch(`${backendUrl}/api/conversation/${id}`);

      if (response.ok) {
        const data = await response.json();
        console.log(
          `✅ Loaded conversation ${id}:`,
          data.messages?.length || 0,
          "messages"
        );

        // Debug: Log the actual messages to see what we're getting
        console.log("📋 Conversation data:", data);
        console.log("📋 Messages:", data.messages);
        if (data.messages && data.messages.length > 0) {
          console.log(
            "📋 Message roles:",
            data.messages.map((m) => m.role)
          );
        }

        // Set messages - if empty, let SmartGreeting component handle it
        setMessages(data.messages || []);

        // Update stats
        if (data.stats) {
          setStats({
            messageCount: data.messages?.length || 0,
            totalProcessed: data.stats.totalProcessedMessages || 0,
            compressionChunks: data.stats.compressionChunks || 0,
            userProfileFields: data.stats.userProfileFields || 0,
          });
        }
      } else {
        console.error(
          `❌ Failed to load conversation ${id}:`,
          response.status,
          response.statusText
        );
        // On error, show empty array to let SmartGreeting handle it
        setMessages([]);
      }
    } catch (error) {
      console.error("❌ Error loading conversation history:", error);
      // On error, show empty array to let SmartGreeting handle it
      setMessages([]);
    }
  };

  // Handle language change
  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    saveLanguagePreference(languageCode);
    console.log(`🌍 Language changed to: ${languageCode}`);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isStreamingInProgress) return;

    // Check anonymous session limits (only for non-authenticated users)
    if (!user && anonymousSession) {
      const canSend = await sessionService.canSendMessage();
      if (!canSend) {
        setShowSoftGate(true);
        return;
      }
      // Increment message count for anonymous users
      const count = await sessionService.incrementMessageCount();
      setAnonymousMessagesUsed(count);
    }

    const userMessage = inputValue.trim();
    setInputValue("");

    // Translate user input if Venice mode + non-English language
    let messageToSend = userMessage;
    const shouldTranslate = nsfwMode && selectedLanguage !== "en";

    if (shouldTranslate) {
      try {
        console.log(`🌍 Translating user input: ${selectedLanguage} → en`);
        messageToSend = await translateText(
          userMessage,
          "en",
          selectedLanguage
        );
        console.log(`✅ Translated: "${userMessage}" → "${messageToSend}"`);
      } catch (error) {
        console.error("User input translation failed:", error);
        // Fallback: send original text
      }
    }

    // Generate conversation ID if this is a new conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      // Create a new conversation via backend API (same as "New Chat" button)
      try {
        const response = await fetch(`${backendUrl}/api/conversations/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "New Conversation",
            currentConversationId: null,
          }),
        });

        const data = await response.json();
        if (data.conversation) {
          currentConversationId = data.conversation.conversationId;
          setConversationId(currentConversationId);
          // Update URL to reflect the new conversation
          navigateToConversation(currentConversationId);
          // Note: Socket room joining is now handled by useEffect
          console.log(
            `🆕 Created new conversation via API: ${currentConversationId}`
          );
        } else {
          throw new Error("Failed to create conversation");
        }
      } catch (error) {
        console.error("❌ Failed to create conversation:", error);
        // Fallback to frontend-only ID generation
        currentConversationId = crypto.randomUUID();
        setConversationId(currentConversationId);
        navigateToConversation(currentConversationId);
        // Note: Socket room joining is now handled by useEffect
        console.log(
          `🆕 Fallback: Created conversation ID: ${currentConversationId}`
        );
      }
    }

    // Add user message to UI (show original, not translated)
    const newUserMessage: Message = {
      role: "user",
      content: userMessage, // Display in user's language
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Use streaming system only (send translated message to AI)
    if (socketRef.current) {
      handleStreamingMessage(messageToSend, currentConversationId);
    } else {
      console.error("Socket not available for streaming");
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, streaming is not available. Please refresh the page and try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // NEW streaming message handler (completely separate)
  const handleStreamingMessage = (
    userMessage: string,
    currentConversationId?: string
  ) => {
    setIsStreamingInProgress(true);
    setStreamingContent("");
    streamingContentRef.current = ""; // Reset ref
    setToolProcessingMessage(null);

    // Set initial connecting state
    setLoadingState({
      phase: "connecting",
      message: "Connecting to AI...",
    });

    const targetConversationId = currentConversationId || conversationId;
    console.log(
      `🌊 Sending streaming message for conversation: ${targetConversationId}`
    );

    if (streamingChatRef.current && socketRef.current) {
      // Ensure socket is connected before sending
      if (socketRef.current.connected) {
        console.log(`✅ Socket connected, sending streaming message`);
        setLoadingState({
          phase: "sending",
          message: "Sending your message...",
        });
        streamingChatRef.current.sendStreamingMessage(
          userMessage,
          targetConversationId
        );
      } else {
        console.log(`🔄 Socket not connected, waiting for connection...`);
        // Wait for socket to connect, then send
        socketRef.current.on("connect", () => {
          console.log(`🔄 Socket reconnected, sending streaming message`);
          setLoadingState({
            phase: "sending",
            message: "Sending your message...",
          });
          // Note: Socket room joining is now handled by useEffect
          streamingChatRef.current?.sendStreamingMessage(
            userMessage,
            targetConversationId
          );
        });
      }
    }
  };

  // NEW streaming callback handlers with TRANSLATION support
  const handleStreamingResponse = async (incrementalChunk: string) => {
    console.log(`📥 Received chunk: "${incrementalChunk}"`);

    // Check if this is first chunk
    const isFirstChunk = streamingContent === "";

    // Clear loading states on first chunk
    if (isFirstChunk && incrementalChunk) {
      console.log(`🧹 Clearing loading state (first chunk received)`);
      setTimeout(() => {
        setLoadingState({ phase: "idle", message: "" });
        setToolProcessingMessage(null);
      }, 0);
    }

    // Only translate if Venice mode + non-English language
    const shouldTranslate = nsfwMode && selectedLanguage !== "en";

    if (!shouldTranslate) {
      // Normal streaming (no translation) - just append chunk
      setStreamingContent((prev) => {
        const newContent = prev + incrementalChunk;
        streamingContentRef.current = newContent; // Update ref
        console.log(
          `📝 State updated: ${prev.length} → ${newContent.length} chars`
        );
        return newContent;
      });
      return;
    }

    // VENICE TRANSLATION MODE - Sentence-based progressive translation
    setSentenceBuffer((prev) => {
      const newBuffer = prev + incrementalChunk;

      // Extract complete sentences from buffer
      const { completeSentences, remainder } =
        extractCompleteSentences(newBuffer);

      // Translate and display complete sentences (with duplicate prevention)
      if (completeSentences.length > 0 && !translationInProgressRef.current) {
        translationInProgressRef.current = true;
        translateAndDisplaySentences(completeSentences).finally(() => {
          translationInProgressRef.current = false;
        });
      }

      // Return remainder to keep buffering
      return remainder;
    });
  };

  // Translate sentences and append to display (for Venice streaming)
  const translateAndDisplaySentences = async (sentences: string[]) => {
    try {
      console.log(
        `🌍 Translating ${sentences.length} sentences: en → ${selectedLanguage}`
      );

      // Batch translate for efficiency
      const translations = await translateBatch(
        sentences,
        selectedLanguage,
        "en"
      );

      console.log(`✅ Translated ${translations.length} sentences`);

      // Append translated sentences to streaming content (for display)
      setStreamingContent((prev) => {
        const newContent = prev + translations.join(" ") + " ";
        streamingContentRef.current = newContent; // Update ref to prevent stale closure
        console.log(`📝 Translation appended: ${newContent.length} chars`);
        return newContent;
      });
    } catch (error) {
      console.error("Sentence translation failed:", error);
      // Fallback: show English if translation fails
      setStreamingContent((prev) => {
        const newContent = prev + sentences.join(" ") + " ";
        streamingContentRef.current = newContent; // Update ref even on error
        return newContent;
      });
    }
  };

  const handleStreamingError = async (error: string) => {
    console.error("Streaming error:", error);
    const errorMessage: Message = {
      role: "assistant",
      content: `Sorry, there was a streaming error: ${error}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, errorMessage]);
    setIsStreamingInProgress(false);
    setStreamingContent("");
    streamingContentRef.current = ""; // Clear ref
    setToolProcessingMessage(null);

    // Focus input field after error
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);

    // Refresh NSFW mode status even on error (in case AI switched models before error)
    if (conversationId) {
      try {
        const response = await fetch(
          `${backendUrl}/api/conversations/${conversationId}/nsfw-mode`
        );
        if (response.ok) {
          const data = await response.json();
          setNsfwMode(data.nsfwMode || false);
        }
      } catch (error) {
        console.error("Failed to refresh NSFW mode:", error);
      }
    }
  };

  const handleStreamingStart = () => {
    setIsStreamingInProgress(true);
    setStreamingContent("");
    streamingContentRef.current = ""; // Clear ref
    setToolProcessingMessage(null);
  };

  const handleStreamingComplete = async (
    imageUrls?: string[],
    imageMetadata?: any,
    textContent?: string
  ) => {
    // Translate any remaining buffer content (Venice mode)
    const shouldTranslate = nsfwMode && selectedLanguage !== "en";
    if (shouldTranslate && sentenceBuffer.trim()) {
      console.log(`🌍 Translating remaining buffer: "${sentenceBuffer}"`);
      await translateAndDisplaySentences([sentenceBuffer]);
      setSentenceBuffer("");
    }

    // Use passed textContent if available (for non-streaming responses with images),
    // otherwise use ref for streamed content
    const finalContent = textContent || streamingContentRef.current;

    // Add final streaming content to messages (or image-only message)
    if (finalContent || (imageUrls && imageUrls.length > 0)) {
      console.log(
        `💾 Saving final message: ${finalContent?.length || 0} chars, ${
          imageUrls?.length || 0
        } images`
      );
      const aiMessage: Message = {
        role: "assistant",
        content: finalContent || "Here's your image:",
        timestamp: Date.now(),
        imageUrls: imageUrls || undefined,
        imageMetadata: imageMetadata || undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }

    setIsStreamingInProgress(false);
    setStreamingContent("");
    streamingContentRef.current = ""; // Clear ref
    setSentenceBuffer("");
    setToolProcessingMessage(null);
    setLoadingState({
      phase: "idle",
      message: "",
    });

    // Focus input field after streaming completes
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);

    // Refresh NSFW mode status after response (in case AI switched models)
    if (conversationId) {
      try {
        const response = await fetch(
          `${backendUrl}/api/conversations/${conversationId}/nsfw-mode`
        );
        if (response.ok) {
          const data = await response.json();
          setNsfwMode(data.nsfwMode || false);
        }
      } catch (error) {
        console.error("Failed to refresh NSFW mode:", error);
      }
    }
  };

  const handleToolProcessing = (message: string) => {
    setToolProcessingMessage(message);
  };

  const formatTime = (timestamp?: number) => {
    return new Date(timestamp || Date.now()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConversationSelect = (newConversationId: string) => {
    console.log(
      `🔍 Selecting conversation: ${newConversationId}, current: ${conversationId}`
    );
    if (newConversationId === conversationId) return;

    setConversationId(newConversationId);
    navigateToConversation(newConversationId);

    // Clear current messages and load conversation history
    setMessages([
      {
        role: "assistant",
        content: "Loading conversation...",
      },
    ]);

    console.log(
      `📂 About to load conversation history for: ${newConversationId}`
    );
    loadConversationHistory(newConversationId);
  };

  const handleNewConversation = () => {
    // Clear current state
    setMessages([]);
    setStats({
      messageCount: 0,
      totalProcessed: 0,
      compressionChunks: 0,
      userProfileFields: 0,
    });
    setTokenLimitNotification(null);
    setConversationId(null);
    setNsfwMode(false); // Reset to safe mode for new conversation
    navigateToNewConversation();
  };

  // Fetch NSFW mode status and persona when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setNsfwMode(false);
      setPersona("");
      return;
    }

    const fetchNsfwMode = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/conversations/${conversationId}/nsfw-mode`
        );
        if (response.ok) {
          const data = await response.json();
          setNsfwMode(data.nsfwMode || false);
          console.log(
            `🔍 Loaded NSFW mode for ${conversationId}: ${
              data.nsfwMode ? "ENABLED" : "DISABLED"
            }`
          );
        }
      } catch (error) {
        console.error("Failed to fetch NSFW mode:", error);
      }
    };

    fetchNsfwMode();
    loadPersona(conversationId); // Load persona when conversation changes
  }, [conversationId]);

  // Toggle NSFW mode
  const toggleNsfwMode = async () => {
    if (isTogglingMode) return;

    setIsTogglingMode(true);
    const newMode = !nsfwMode;

    try {
      // If no conversation yet, create one first
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        const response = await fetch(`${backendUrl}/api/conversations/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "New Conversation",
            currentConversationId: null,
          }),
        });

        const data = await response.json();
        if (data.conversation) {
          currentConversationId = data.conversation.conversationId;
          setConversationId(currentConversationId);
          navigateToConversation(currentConversationId);
          console.log(
            `🆕 Created conversation for NSFW toggle: ${currentConversationId}`
          );
        }
      }

      // Toggle NSFW mode
      const response = await fetch(
        `${backendUrl}/api/conversations/${currentConversationId}/nsfw-mode`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enable: newMode }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNsfwMode(data.nsfwMode);
        console.log(
          `🔥 NSFW Mode ${data.nsfwMode ? "ENABLED" : "DISABLED"} successfully`
        );
        console.log(`🤖 Current model: ${data.currentModel}`);
      } else {
        console.error("Failed to toggle NSFW mode");
      }
    } catch (error) {
      console.error("Error toggling NSFW mode:", error);
    } finally {
      setIsTogglingMode(false);
    }
  };

  // Load persona when conversation loads
  const loadPersona = async (convId: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/conversations/${convId}/persona`
      );
      const data = await response.json();
      setPersona(data.persona || "");
    } catch (error) {
      console.error("Error loading persona:", error);
    }
  };

  // Save persona
  const savePersona = async (personaText: string) => {
    if (!conversationId) return;

    try {
      await fetch(`${backendUrl}/api/conversations/${conversationId}/persona`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ persona: personaText }),
      });
      console.log("🎭 Persona saved successfully");
    } catch (error) {
      console.error("Error saving persona:", error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex overflow-hidden">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentConversationId={conversationId || ""}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex p-4 h-full min-w-0">
        {/* Chat Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 text-white p-6 relative">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-white/20 transition-colors lg:hidden"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Title */}
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">AI Chat with Memory</h1>
                {/* <p className="text-sm opacity-90">
                  Intelligent conversation memory that remembers you
                </p> */}

                {/* STREAMING MODE INDICATOR */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-yellow-400">⚡</span>
                  <span className="text-sm opacity-75">
                    Real-time streaming chat
                  </span>
                </div>
                {/* Token Progress Bar */}
                {stats.totalTokens && stats.totalTokens > 0 && (
                  <div className="mt-2">
                    <div className="bg-white/20 rounded-full h-2 max-w-xs mx-auto">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stats.totalTokens >= 4500
                            ? "bg-red-400"
                            : stats.totalTokens >= 3500
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                        style={{
                          width: `${(stats.totalTokens / 5000) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1 opacity-75">
                      {stats.totalTokens}/5000 tokens used
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex gap-2">
                {/* Language Selector */}
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  autoDetectedLanguage={autoDetectedLanguage}
                />

                {/* Mode Switch - Always visible */}
                <div className="bg-white/10 rounded-full p-1 flex gap-1">
                  <button
                    onClick={() => !nsfwMode || toggleNsfwMode()}
                    disabled={isTogglingMode || !nsfwMode}
                    className={`${
                      !nsfwMode
                        ? "bg-white/90 text-purple-700"
                        : "text-white/70 hover:text-white"
                    } px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                      isTogglingMode ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Assistant conversation mode"
                  >
                    <span>💬</span>
                    <span>Assistant</span>
                  </button>
                  <button
                    onClick={() => nsfwMode || toggleNsfwMode()}
                    disabled={isTogglingMode || nsfwMode}
                    className={`${
                      nsfwMode
                        ? "bg-red-500/90 text-white"
                        : "text-white/70 hover:text-white"
                    } px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                      isTogglingMode ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Romantic conversation mode (Venice)"
                  >
                    <span>🔥</span>
                    <span>Romantic</span>
                  </button>
                </div>
                {/* Persona Button */}
                <button
                  onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                  className={`${
                    isPersonaOpen
                      ? "bg-white/30"
                      : "bg-white/20 hover:bg-white/30"
                  } text-white p-2 rounded-full text-sm transition-colors ${
                    persona ? "ring-2 ring-white/50" : ""
                  }`}
                  title="Set Custom Persona"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowNotesModal(true)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full text-sm transition-colors"
                  title="Notes & Reminders"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Token Limit Notification */}
            {tokenLimitNotification && (
              <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mx-6 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {tokenLimitNotification}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Language Auto-Detection Notice */}
            {showLanguageNotice && selectedLanguage !== "en" && (
              <div className="bg-blue-100 border-l-4 border-blue-400 p-4 mx-6 mt-4 rounded-r-lg animate-fade-in">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-blue-700">
                      🌍 Language set based on your location. You can change it
                      anytime using the language selector.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLanguageNotice(false)}
                    className="ml-3 text-blue-400 hover:text-blue-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
              {/* Smart Greeting - only show if no messages or it's a new conversation */}
              {messages.length === 0 && <SmartGreeting />}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-md"
                    }`}
                  >
                    {/* Message Images */}
                    {message.imageUrls && message.imageUrls.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {message.imageUrls.map((imageUrl, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <img
                              src={imageUrl}
                              alt={`Generated image ${imgIndex + 1}`}
                              className="max-w-full h-auto rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                              loading="lazy"
                              onClick={() => {
                                // Open image in new tab for full view
                                window.open(imageUrl, "_blank");
                              }}
                              onError={(e) => {
                                console.error(
                                  "Failed to load image:",
                                  imageUrl
                                );
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            {message.imageMetadata && (
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 mr-1">
                                  {message.imageMetadata.style}{" "}
                                  {message.imageMetadata.imageType}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                  {message.imageMetadata.quality} quality
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Text */}
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <div className="text-xs mt-2 opacity-60">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* STREAMING DISPLAY */}
              {isStreamingInProgress &&
                (() => {
                  console.log(
                    `🖼️ RENDERING UI - toolProcessingMessage: ${!!toolProcessingMessage}, streamingContent: ${
                      streamingContent.length
                    } chars, loadingPhase: ${loadingState.phase}`
                  );
                  return (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 shadow-md max-w-[70%]">
                        {toolProcessingMessage ? (
                          <div className="flex items-center gap-2 text-blue-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm italic">
                              {toolProcessingMessage}
                            </span>
                          </div>
                        ) : streamingContent ? (
                          <div
                            key={streamingContent.length}
                            className="whitespace-pre-wrap leading-relaxed text-gray-800"
                          >
                            {console.log(
                              `✏️ DISPLAYING CONTENT: "${streamingContent}"`
                            )}
                            {streamingContent}
                            <div className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1"></div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {loadingState.phase === "connecting" && (
                                <>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm text-blue-600">
                                    🔗 {loadingState.message}
                                  </span>
                                </>
                              )}
                              {loadingState.phase === "sending" && (
                                <>
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm text-indigo-600">
                                    📤 {loadingState.message}
                                  </span>
                                </>
                              )}
                              {loadingState.phase === "processing" && (
                                <>
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm text-purple-600">
                                    ⚙️ {loadingState.message}
                                  </span>
                                </>
                              )}
                              {loadingState.phase === "generating" && (
                                <>
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                                    <div
                                      className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                                      style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                      className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                                      style={{ animationDelay: "0.2s" }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-yellow-600">
                                    ⚡ {loadingState.message}
                                  </span>
                                </>
                              )}
                            </div>
                            {loadingState.detail && (
                              <div className="text-xs text-gray-500 ml-4">
                                {loadingState.detail}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* NEW STREAMING CHAT COMPONENT (hidden, handles backend communication) */}
              <StreamingChat
                ref={streamingChatRef}
                socket={socketRef.current}
                conversationId={conversationId}
                userId={user?.uid || anonymousSession?.sessionId || null} // Use actual user ID or session ID for token tracking
                onResponse={handleStreamingResponse}
                onError={handleStreamingError}
                onStart={handleStreamingStart}
                onComplete={handleStreamingComplete}
                onToolProcessing={handleToolProcessing}
              />

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isStreamingInProgress}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full text-lg text-gray-900 placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={isStreamingInProgress || !inputValue.trim()}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Overlay - Centered with transparent background */}
      {notifications.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
          onClick={(e) => {
            // Click on transparent background to dismiss
            if (e.target === e.currentTarget) {
              setNotifications([]);
            }
          }}
        >
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 max-w-md mx-auto transition-all duration-300 transform animate-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🔔</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {notification.title}
                    </p>
                    <p className="text-base text-gray-700 mb-3">
                      📝 {notification.message}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex">
                    <button
                      className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.filter((n) => n.id !== notification.id)
                        );
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Modal Overlay */}
      {showNotesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={(e) => {
            // Click on transparent background to dismiss
            if (e.target === e.currentTarget) {
              setShowNotesModal(false);
            }
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] m-4 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Notes & Reminders
              </h2>
              <button
                onClick={() => setShowNotesModal(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto">
              <NotesPanel
                notesAction={notesAction}
                relevantNotes={relevantNotes}
                className="h-full"
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Soft Gate Modal */}
      <SoftGateModal
        isOpen={showSoftGate}
        onClose={() => setShowSoftGate(false)}
        type="chat"
        messagesUsed={anonymousMessagesUsed}
      />

      {/* Persona Panel */}
      {isPersonaOpen && conversationId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsPersonaOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Custom Persona
              </h2>
              <button
                onClick={() => setIsPersonaOpen(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-4">
              <p className="text-gray-600 text-sm">
                Define a custom character or persona for AI to role-play. This
                will guide the AI's personality and behavior in this
                conversation. Leave empty for default behavior.
              </p>
              <textarea
                value={persona}
                onChange={(e) => {
                  setPersona(e.target.value);
                  savePersona(e.target.value);
                }}
                placeholder="Example: You are a wise mentor with 20 years of experience in software engineering. You are patient, encouraging, and provide detailed explanations."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {persona.length} characters
                </span>
                <button
                  onClick={() => {
                    setPersona("");
                    savePersona("");
                  }}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear Persona
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
