"use client";

import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import ConversationSidebar from "@/components/ConversationSidebar";
import { StreamingChat } from "@/components/StreamingChat";
import SoftGateModal from "@/components/SoftGateModal";
import Header from "@/components/layout/Header";
import GlassEffect from "@/components/GlassEffect";
import { sessionService } from "@/lib/auth/sessionService";
import {
  getConversationIdFromUrl,
  navigateToConversation,
  navigateToNewConversation,
  onConversationIdChange,
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
  const { socket: globalSocket, isConnected } = useSocket();
  const { user, anonymousSession } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Auto-minimize persona when user starts typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
  const [tokenLimitNotification, setTokenLimitNotification] = useState<string | null>(null);

  // STREAMING STATE
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreamingInProgress, setIsStreamingInProgress] = useState(false);
  const streamingRenderTrigger = useRef(0);
  const [toolProcessingMessage, setToolProcessingMessage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<{
    phase: "idle" | "connecting" | "sending" | "processing" | "tool_execution" | "generating";
    message: string;
    detail?: string;
  }>({
    phase: "idle",
    message: "",
  });

  // ROMANTIC MODE STATE (Always enabled)
  const [nsfwMode, setNsfwMode] = useState(true);

  // PERSONA STATE
  const [persona, setPersona] = useState("");
  const [isPersonaExpanded, setIsPersonaExpanded] = useState(true);
  const [isPersonaMinimized, setIsPersonaMinimized] = useState(false);

  // SOFT GATE STATE
  const [showSoftGate, setShowSoftGate] = useState(false);
  const [anonymousMessagesUsed, setAnonymousMessagesUsed] = useState(0);

  const streamingContentRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamingChatRef = useRef<any>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Load conversation from URL
  useEffect(() => {
    const urlConversationId = getConversationIdFromUrl();
    if (urlConversationId) {
      setConversationId(urlConversationId);
      loadConversationHistory(urlConversationId);
    } else {
      setMessages([]);
    }

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

  // Auto-scroll on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-scroll on streaming content
  useEffect(() => {
    if (streamingContent) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamingContent]);

  // Socket connection
  useEffect(() => {
    if (!globalSocket) return;

    socketRef.current = globalSocket;

    const handleConnect = () => {
      console.log("🔌 Chat: Connected to server");
      if (conversationId) {
        globalSocket.emit("join-conversation", conversationId);
      }
    };

    const handleDisconnect = () => {
      console.log("🔌 Chat: Disconnected from server");
    };

    globalSocket.on("connect", handleConnect);
    globalSocket.on("disconnect", handleDisconnect);

    if (isConnected && conversationId) {
      globalSocket.emit("join-conversation", conversationId);
    }

    return () => {
      globalSocket.off("connect", handleConnect);
      globalSocket.off("disconnect", handleDisconnect);
    };
  }, [globalSocket, isConnected, conversationId]);

  // Join conversation room
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
        console.log(`✅ Loaded conversation ${id}:`, data.messages?.length || 0, "messages");
        setMessages(data.messages || []);

        if (data.stats) {
          setStats({
            messageCount: data.messages?.length || 0,
            totalProcessed: data.stats.totalProcessedMessages || 0,
            compressionChunks: data.stats.compressionChunks || 0,
            userProfileFields: data.stats.userProfileFields || 0,
          });
        }
      } else {
        console.error(`❌ Failed to load conversation ${id}:`, response.status);
        setMessages([]);
      }
    } catch (error) {
      console.error("❌ Error loading conversation history:", error);
      setMessages([]);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isStreamingInProgress) return;

    // Check anonymous session limits
    if (!user && anonymousSession) {
      const canSend = await sessionService.canSendMessage();
      if (!canSend) {
        setShowSoftGate(true);
        return;
      }
      const count = await sessionService.incrementMessageCount();
      setAnonymousMessagesUsed(count);
    }

    const userMessage = inputValue.trim();
    setInputValue("");

    // Generate conversation ID if needed
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      try {
        const response = await fetch(`${backendUrl}/api/conversations/new`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "New Conversation",
            currentConversationId: null,
            nsfwMode: true,
            userId: user?.uid || anonymousSession?.sessionId || null,
          }),
        });

        const data = await response.json();
        if (data.conversation) {
          currentConversationId = data.conversation.conversationId;
          setConversationId(currentConversationId);
          navigateToConversation(currentConversationId!);
          console.log(`🆕 Created new conversation: ${currentConversationId}`);
        } else {
          throw new Error("Failed to create conversation");
        }
      } catch (error) {
        console.error("❌ Failed to create conversation:", error);
        currentConversationId = crypto.randomUUID();
        setConversationId(currentConversationId);
        navigateToConversation(currentConversationId!);
        console.log(`🆕 Fallback conversation ID: ${currentConversationId}`);
      }
    }

    // Add user message
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Send via streaming
    if (socketRef.current) {
      handleStreamingMessage(userMessage, currentConversationId || undefined);
    } else {
      console.error("Socket not available");
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, streaming is not available. Please refresh the page.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleStreamingMessage = (userMessage: string, currentConversationId?: string) => {
    setIsStreamingInProgress(true);
    setStreamingContent("");
    streamingContentRef.current = "";
    setToolProcessingMessage(null);

    setLoadingState({
      phase: "connecting",
      message: "Connecting to AI...",
    });

    const targetConversationId = currentConversationId || conversationId;
    console.log(`🌊 Sending streaming message for conversation: ${targetConversationId}`);

    if (streamingChatRef.current && socketRef.current) {
      if (socketRef.current.connected) {
        console.log(`✅ Socket connected, sending message`);
        setLoadingState({
          phase: "sending",
          message: "Sending your message...",
        });
        streamingChatRef.current.sendStreamingMessage(userMessage, targetConversationId);
      } else {
        console.log(`🔄 Socket not connected, waiting...`);
        socketRef.current.on("connect", () => {
          console.log(`🔄 Socket reconnected, sending message`);
          setLoadingState({
            phase: "sending",
            message: "Sending your message...",
          });
          streamingChatRef.current?.sendStreamingMessage(userMessage, targetConversationId);
        });
      }
    }
  };

  const handleStreamingResponse = async (incrementalChunk: string) => {
    const isFirstChunk = streamingContent === "";

    if (isFirstChunk && incrementalChunk) {
      setTimeout(() => {
        setLoadingState({ phase: "idle", message: "" });
        setToolProcessingMessage(null);
      }, 0);
    }

    setStreamingContent((prev) => {
      const newContent = prev + incrementalChunk;
      streamingContentRef.current = newContent;
      return newContent;
    });
  };

  const handleStreamingError = async (error: string) => {
    console.error("Streaming error:", error);
    const errorMessage: Message = {
      role: "assistant",
      content: `Sorry, there was an error: ${error}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, errorMessage]);
    setIsStreamingInProgress(false);
    setStreamingContent("");
    streamingContentRef.current = "";
    setToolProcessingMessage(null);

    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  };

  const handleStreamingStart = () => {
    setIsStreamingInProgress(true);
    setStreamingContent("");
    streamingContentRef.current = "";
    setToolProcessingMessage(null);
  };

  const handleStreamingComplete = async (
    imageUrls?: string[],
    imageMetadata?: any,
    textContent?: string
  ) => {
    const finalContent = textContent || streamingContentRef.current;

    if (finalContent || (imageUrls && imageUrls.length > 0)) {
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
    streamingContentRef.current = "";
    setToolProcessingMessage(null);
    setLoadingState({
      phase: "idle",
      message: "",
    });

    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
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
    if (newConversationId === conversationId) return;

    setConversationId(newConversationId);
    navigateToConversation(newConversationId);

    setMessages([
      {
        role: "assistant",
        content: "Loading conversation...",
      },
    ]);

    loadConversationHistory(newConversationId);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setStats({
      messageCount: 0,
      totalProcessed: 0,
      compressionChunks: 0,
      userProfileFields: 0,
    });
    setTokenLimitNotification(null);
    setConversationId(null);
    navigateToNewConversation();
  };

  // Fetch persona when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setPersona("");
      return;
    }

    const fetchNsfwMode = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/conversations/${conversationId}/nsfw-mode`);
        if (response.ok) {
          const data = await response.json();
          console.log(`🔍 Backend NSFW mode: ${data.nsfwMode ? "ENABLED" : "DISABLED"}`);
          if (!data.nsfwMode) {
            console.log(`🔥 Enabling romantic mode`);
            fetch(`${backendUrl}/api/conversations/${conversationId}/nsfw-mode`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ enable: true }),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch NSFW mode:", error);
      }
    };

    fetchNsfwMode();
    loadPersona(conversationId);
  }, [conversationId]);

  const loadPersona = async (convId: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/conversations/${convId}/persona`);
      const data = await response.json();
      setPersona(data.persona || "");
    } catch (error) {
      console.error("Error loading persona:", error);
    }
  };

  const savePersona = async (personaText: string) => {
    if (!conversationId) return;

    try {
      await fetch(`${backendUrl}/api/conversations/${conversationId}/persona`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: personaText }),
      });
      console.log("🎭 Persona saved");
    } catch (error) {
      console.error("Error saving persona:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 overflow-hidden"
      style={{
        backgroundImage: 'url("/image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[500px] lg:h-[800px] rounded-full opacity-10 sm:opacity-15 lg:opacity-20 animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(216, 180, 254, 0.4) 0%, rgba(233, 213, 255, 0.2) 50%, transparent 100%)",
            top: "-20%",
            right: "-10%",
          }}
        />
        <div
          className="absolute w-[250px] sm:w-[400px] lg:w-[700px] h-[250px] sm:h-[400px] lg:h-[700px] rounded-full opacity-10 sm:opacity-15 lg:opacity-20 animate-float-slow animation-delay-2000"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, rgba(252, 231, 243, 0.2) 50%, transparent 100%)",
            bottom: "-15%",
            left: "-10%",
          }}
        />
      </div>

      {/* Mouse Glow - Desktop only */}
      <div
        className="hidden lg:block fixed w-[400px] h-[400px] rounded-full pointer-events-none z-10 transition-all duration-300"
        style={{
          background: "radial-gradient(circle, rgba(251, 207, 232, 0.1) 0%, transparent 70%)",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Container - Mobile First */}
      <div className="flex h-[calc(100vh-80px)] lg:h-[calc(100vh-60px)] mt-20 lg:mt-16 overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <ConversationSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentConversationId={conversationId || ""}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
        />

        {/* Chat Area - Full width on mobile */}
        <div className="flex-1 w-full min-w-0 p-2 sm:p-4 lg:p-6 flex flex-col overflow-hidden">
          <GlassEffect
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
            borderRadius="0.75rem"
            intensity={{
              blur: 4,
              saturation: 120,
              brightness: 115,
              displacement: 50,
            }}
            backgroundOpacity={20}
          >
            {/* Top Controls */}
            <div className="flex items-center justify-between p-2 sm:p-3 border-b border-white/10 shrink-0">
              <div className="flex gap-2">
                {/* Hamburger - Mobile only */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white p-2 rounded-full shadow-lg active:scale-95 transition-all"
                  title="Menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                  } text-white p-2 rounded-full shadow-lg active:scale-95 transition-all ${
                    persona ? "ring-2 ring-white/50" : ""
                  }`}
                  title="Persona"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Persona Panel */}
            {isPersonaExpanded && (
              <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-white/10 p-3 sm:p-4 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden sm:inline">Custom Persona</span>
                    <span className="sm:hidden">Persona</span>
                  </h3>
                  <button
                    onClick={() => {
                      setIsPersonaExpanded(false);
                      setIsPersonaMinimized(true);
                    }}
                    className="text-purple-600 hover:text-purple-800 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-purple-700 mb-2 hidden sm:block">
                  Define a custom character or persona for AI to role-play.
                </p>
                <textarea
                  value={persona}
                  onChange={(e) => {
                    setPersona(e.target.value);
                    savePersona(e.target.value);
                  }}
                  placeholder="Example: You are a wise mentor..."
                  className="w-full h-20 sm:h-24 p-2 sm:p-3 border border-purple-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm"
                  style={{ fontSize: "16px" }}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-purple-600">{persona.length} chars</span>
                  <button
                    onClick={() => {
                      setPersona("");
                      savePersona("");
                    }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-5 scrollbar-thin">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg shadow-purple-500/30"
                        : "bg-white/15 backdrop-blur-md text-gray-100 border border-white/30 shadow-lg shadow-black/20"
                    }`}
                  >
                    {/* Images */}
                    {message.imageUrls && message.imageUrls.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {message.imageUrls.map((imageUrl, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={imageUrl}
                            alt={`Image ${imgIndex + 1}`}
                            className="max-w-full h-auto rounded-lg cursor-pointer"
                            onClick={() => window.open(imageUrl, "_blank")}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className={`whitespace-pre-wrap leading-relaxed text-sm sm:text-base lg:text-lg ${
                      message.role === "user" ? "text-white drop-shadow-sm" : "text-gray-50"
                    }`}>
                      {message.content}
                    </div>
                    <div className={`text-xs sm:text-sm mt-2 ${
                      message.role === "user" ? "text-white/90" : "text-gray-300"
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming Display */}
              {isStreamingInProgress && (
                <div className="flex justify-start">
                  <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-lg shadow-black/20 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]">
                    {toolProcessingMessage ? (
                      <div className="flex items-center gap-2 text-blue-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-sm sm:text-base lg:text-lg italic">{toolProcessingMessage}</span>
                      </div>
                    ) : streamingContent ? (
                      <div className="whitespace-pre-wrap leading-relaxed text-gray-50 text-sm sm:text-base lg:text-lg">
                        {streamingContent}
                        <div className="inline-block w-2 h-5 bg-purple-400 animate-pulse ml-1" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        <span className="text-sm sm:text-base text-purple-300">{loadingState.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 lg:p-6 border-t border-white/10 shrink-0">
              <form onSubmit={sendMessage} className="flex gap-2 lg:gap-3">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={isStreamingInProgress}
                  className="flex-1 px-4 py-2 sm:py-3 lg:py-4 border-2 border-white/20 rounded-full text-black placeholder-gray-500 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200/50 transition-all disabled:opacity-50 bg-white/90 backdrop-blur-sm text-base lg:text-lg"
                  style={{ fontSize: "16px" }}
                  required
                />
                <button
                  type="submit"
                  disabled={isStreamingInProgress || !inputValue.trim()}
                  className="bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 text-white px-5 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg shadow-lg shadow-purple-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Send
                </button>
              </form>
            </div>
          </GlassEffect>
        </div>
      </div>

      {/* Streaming Chat Component */}
      <StreamingChat
        ref={streamingChatRef}
        socket={socketRef.current}
        conversationId={conversationId}
        userId={user?.uid || anonymousSession?.sessionId || null}
        onResponse={handleStreamingResponse}
        onError={handleStreamingError}
        onStart={handleStreamingStart}
        onComplete={handleStreamingComplete}
        onToolProcessing={handleToolProcessing}
      />

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
  );
}
