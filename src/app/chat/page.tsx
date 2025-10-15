"use client";

import React, { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { Socket } from "socket.io-client";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import ConversationSidebar from "@/components/ConversationSidebar";
import { SmartGreeting } from "@/features/smart-greeting";
import { StreamingChat } from "@/components/StreamingChat";
import SoftGateModal from "@/components/SoftGateModal";
import Header from "@/components/layout/Header";
import { sessionService } from "@/lib/auth/sessionService";
import {
  getConversationIdFromUrl,
  setConversationIdInUrl,
  navigateToConversation,
  navigateToNewConversation,
  onConversationIdChange,
  isConversationUrl,
  isHomePage,
} from "../../lib/urlParams";
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

export default function ChatPage() {
  const { socket: globalSocket, isConnected } = useSocket(); // Use global socket
  const { user, anonymousSession } = useAuth(); // Get user ID for token tracking
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Auto-minimize persona when user starts typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Minimize persona panel when user starts typing
    if (isPersonaExpanded && e.target.value.trim()) {
      setIsPersonaExpanded(false);
      setIsPersonaMinimized(true);
    }
  };
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

  // ROMANTIC MODE STATE (Always enabled - Venice AI)
  const [nsfwMode, setNsfwMode] = useState(true);
  const [isTogglingMode, setIsTogglingMode] = useState(false);

  // PERSONA STATE
  const [persona, setPersona] = useState("");
  const [isPersonaExpanded, setIsPersonaExpanded] = useState(true);
  const [isPersonaMinimized, setIsPersonaMinimized] = useState(false);

  // SOFT GATE STATE
  const [showSoftGate, setShowSoftGate] = useState(false);
  const [anonymousMessagesUsed, setAnonymousMessagesUsed] = useState(0);

  // Ref to track latest streaming content and prevent stale closures
  const streamingContentRef = useRef("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamingChatRef = useRef<any>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

    // Cleanup on unmount
    return () => {
      globalSocket.off("connect", handleConnect);
      globalSocket.off("disconnect", handleDisconnect);
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
            data.messages.map((m: any) => m.role)
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

    // No translation needed - send message as is
    const messageToSend = userMessage;

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
            nsfwMode: true,
          }),
        });

        const data = await response.json();
        if (data.conversation) {
          currentConversationId = data.conversation.conversationId;
          setConversationId(currentConversationId);
          // Update URL to reflect the new conversation
          navigateToConversation(currentConversationId!);
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
        navigateToConversation(currentConversationId!);
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
      handleStreamingMessage(messageToSend, currentConversationId || undefined);
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

  // NEW streaming callback handlers
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

    // Normal streaming - just append chunk
    setStreamingContent((prev) => {
      const newContent = prev + incrementalChunk;
      streamingContentRef.current = newContent; // Update ref
      console.log(
        `📝 State updated: ${prev.length} → ${newContent.length} chars`
      );
      return newContent;
    });
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

    // Romantic mode is always enabled, no need to refresh
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
    setToolProcessingMessage(null);
    setLoadingState({
      phase: "idle",
      message: "",
    });

    // Focus input field after streaming completes
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);

    // Romantic mode is always enabled, no need to refresh
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
    // Keep romantic mode enabled for new conversation
    navigateToNewConversation();
  };

  // Fetch NSFW mode status and persona when conversation changes
  useEffect(() => {
    if (!conversationId) {
      // Keep romantic mode enabled, just clear persona
      setPersona("");
      return;
    }

    // Always use romantic mode (Venice AI), but still fetch to update backend if needed
    const fetchNsfwMode = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/conversations/${conversationId}/nsfw-mode`
        );
        if (response.ok) {
          const data = await response.json();
          // Always keep romantic mode enabled in frontend
          console.log(
            `🔍 Backend NSFW mode for ${conversationId}: ${
              data.nsfwMode ? "ENABLED" : "DISABLED"
            }`
          );
          // If backend has it disabled, enable it
          if (!data.nsfwMode) {
            console.log(
              `🔥 Enabling romantic mode on backend for ${conversationId}`
            );
            // Enable it on the backend
            fetch(
              `${backendUrl}/api/conversations/${conversationId}/nsfw-mode`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enable: true }),
              }
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch NSFW mode:", error);
      }
    };

    fetchNsfwMode();
    loadPersona(conversationId); // Load persona when conversation changes
  }, [conversationId]);

  // Note: Romantic mode is always enabled, this function is kept for compatibility
  const toggleNsfwMode = async () => {
    // Romantic mode is always enabled, no toggle needed
    console.log("🔥 Romantic mode is always enabled");
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
    <div className="h-screen relative bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(216, 180, 254, 0.4) 0%, rgba(233, 213, 255, 0.2) 50%, transparent 100%)",
            top: "-20%",
            right: "-10%",
          }}
        ></div>
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-20 animate-float-slow animation-delay-2000"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, rgba(252, 231, 243, 0.2) 50%, transparent 100%)",
            bottom: "-15%",
            left: "-10%",
          }}
        ></div>
      </div>

      {/* Mouse Follow Glow */}
      <div
        className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-10 transition-all duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 207, 232, 0.1) 0%, transparent 70%)",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Content Area with Sidebar and Chat */}
      <div
        className="relative z-20 flex"
        style={{ height: "calc(100vh - 80px)", marginTop: "80px" }}
      >
        {/* Conversation Sidebar */}
        <ConversationSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentConversationId={conversationId || ""}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex p-4 min-w-0">
          {/* Chat Container */}
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="w-full max-w-6xl h-full bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-2xl hover:shadow-purple-300/20 flex flex-col overflow-hidden relative">
              {/* Top Left Controls */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {/* Mobile Hamburger Menu for Sidebar */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-300/60 transition-all duration-300 hover:scale-110 md:hidden"
                  title="Open Conversations"
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Persona Button */}
                <button
                  onClick={() => {
                    if (isPersonaMinimized) {
                      setIsPersonaMinimized(false);
                      setIsPersonaExpanded(true);
                    } else if (isPersonaExpanded) {
                      setIsPersonaExpanded(false);
                      setIsPersonaMinimized(true);
                    }
                  }}
                  className={`${
                    isPersonaExpanded
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
                      : "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
                  } text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-300/60 transition-all duration-300 hover:scale-110 ${
                    persona ? "ring-2 ring-white/50" : ""
                  }`}
                  title="Toggle Persona Settings"
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

              {/* Persona Panel - Collapsible at top */}
              {isPersonaExpanded && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200 p-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
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
                        Custom Persona
                      </h3>
                      <button
                        onClick={() => {
                          setIsPersonaExpanded(false);
                          setIsPersonaMinimized(true);
                        }}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
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
                    <p className="text-sm text-purple-700 mb-3">
                      Define a custom character or persona for AI to role-play.
                      This will guide the AI's personality and behavior in this
                      conversation.
                    </p>
                    <div className="flex flex-col gap-3">
                      <textarea
                        value={persona}
                        onChange={(e) => {
                          setPersona(e.target.value);
                          savePersona(e.target.value);
                        }}
                        placeholder="Example: You are a wise mentor with 20 years of experience in software engineering. You are patient, encouraging, and provide detailed explanations."
                        className="w-full h-24 p-3 border border-purple-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-purple-600">
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

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white/50 to-purple-50/30 space-y-6">
                {/* Smart Greeting - only show if no messages or it's a new conversation */}
                {/* {messages.length === 0 && <SmartGreeting />} */}

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
                          ? "bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 text-white rounded-br-sm shadow-lg hover:shadow-purple-300/50"
                          : "bg-white/90 backdrop-blur-sm text-gray-800 border border-white/60 rounded-bl-sm shadow-lg hover:shadow-cyan-300/30"
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
                      <div
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}
                      >
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
                        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl rounded-bl-sm p-4 shadow-lg hover:shadow-cyan-300/30 max-w-[70%]">
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
              <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-white/60">
                <form onSubmit={sendMessage} className="flex gap-3">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    disabled={isStreamingInProgress}
                    className="flex-1 px-6 py-4 border-2 border-white/60 rounded-full text-lg text-gray-900 placeholder-gray-500 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200/50 transition-all disabled:opacity-50 bg-white/70 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isStreamingInProgress || !inputValue.trim()}
                    className="bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-300/60 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Soft Gate Modal */}
        <SoftGateModal
          isOpen={showSoftGate}
          onClose={() => setShowSoftGate(false)}
          type="chat"
          messagesUsed={anonymousMessagesUsed}
        />

        {/* Animations */}
        <style jsx>{`
          @keyframes float-slow {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(30px, -30px) scale(1.05);
            }
          }

          .animate-float-slow {
            animation: float-slow 20s ease-in-out infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    </div>
  );
}
