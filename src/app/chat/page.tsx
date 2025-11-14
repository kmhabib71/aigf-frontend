"use client";

import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import ConversationSidebar from "@/components/ConversationSidebar";
import { StreamingChat } from "@/components/StreamingChat";
import SoftGateModal from "@/components/SoftGateModal";
import Header from "@/components/layout/Header";
import CharacterCreationModal from "@/components/CharacterCreationModal";

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
  const [tokenLimitNotification, setTokenLimitNotification] = useState<
    string | null
  >(null);

  // STREAMING STATE
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreamingInProgress, setIsStreamingInProgress] = useState(false);
  const streamingRenderTrigger = useRef(0);
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

  // MATURE CONTENT MODE STATE (Always enabled - Creative Freedom)
  const [nsfwMode, setNsfwMode] = useState(true);

  // PERSONA STATE
  const [persona, setPersona] = useState("");
  const [isPersonaExpanded, setIsPersonaExpanded] = useState(true);
  const [isPersonaMinimized, setIsPersonaMinimized] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  // SOFT GATE STATE
  const [showSoftGate, setShowSoftGate] = useState(false);
  const [anonymousMessagesUsed, setAnonymousMessagesUsed] = useState(0);

  // IMAGE LIMIT MODAL STATE
  const [showImageLimitModal, setShowImageLimitModal] = useState(false);
  const [imageLimitData, setImageLimitData] = useState<{
    type: "auth" | "trial" | "credits";
    message: string;
  } | null>(null);

  const streamingContentRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamingChatRef = useRef<any>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const pendingPersonaRef = useRef<string | null>(null);
  const [imagePreview, setImagePreview] = useState<{
    url: string;
    alt?: string;
  } | null>(null);
  const personaPanelRef = useRef<HTMLDivElement | null>(null);

  // Prefill persona from URL (e.g., /chat?personaPreset=sophia or ?personaText=...)
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const personaTextParam = params.get("personaText");
      const personaPreset = params.get("personaPreset");

      let presetText: string | null = null;
      if (personaTextParam && personaTextParam.trim()) {
        presetText = personaTextParam.trim();
      } else if (personaPreset) {
        const key = personaPreset.toLowerCase();
        if (key === "sophia") {
          presetText = "You are Sophia, a confident, adventurous, and empathetic AI companion. You're creative, flirty, and love romantic adventures. You build deep emotional connections and always stay in character as a caring, passionate partner.";
        }
      }

      if (presetText) {
        setPersona(presetText);
        pendingPersonaRef.current = presetText; // Save after conversation exists
        setIsPersonaExpanded(true);
        setIsPersonaMinimized(false);
      }
    } catch (_) {
      // no-op
    }
  }, []);

  // Helper function to normalize whitespace in AI responses
  const normalizeWhitespace = (text: string) => {
    if (!text) return "";
    // Replace multiple consecutive newlines (2 or more) with a single newline
    return text.replace(/\n{2,}/g, "\n");
  };

  // Helper function to render text with styled actions/narrations
  const renderStyledText = (text: string) => {
    if (!text) return null;

    const normalizedText = normalizeWhitespace(text);
    // Split text by asterisk patterns (*text*)
    const parts = normalizedText.split(/(\*[^*]+\*)/g);

    return parts.map((part, index) => {
      // Check if this part is wrapped in asterisks
      if (part.startsWith("*") && part.endsWith("*")) {
        // Remove asterisks and render as action/narration
        const actionText = part.slice(1, -1);
        return (
          <span key={index} className="text-purple-300 italic opacity-90">
            {actionText}
          </span>
        );
      }
      // Regular dialogue text - preserve line breaks
      return <span key={index}>{part}</span>;
    });
  };

  // Generate a readable conversation title from the user's first message
  const makeTitleFromMessage = (text: string) => {
    if (!text) return "New Conversation";
    let clean = text.replace(/\s+/g, " ").trim();
    // Strip a leading slash-command like /show or /see
    clean = clean.replace(/^\/[a-zA-Z]+\s*/, "");
    if (clean.length > 60) clean = clean.slice(0, 60).trim() + "…";
    return clean || "New Conversation";
  };

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
        console.log(
          `✅ Loaded conversation ${id}:`,
          data.messages?.length || 0,
          "messages"
        );
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
            title: makeTitleFromMessage(userMessage),
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

    if (currentConversationId) {
      await flushPendingPersona(currentConversationId);
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

  const handleStreamingMessage = (
    userMessage: string,
    currentConversationId?: string
  ) => {
    setIsStreamingInProgress(true);
    setStreamingContent("");
    streamingContentRef.current = "";
    setToolProcessingMessage(null);

    setLoadingState({
      phase: "connecting",
      message: "Connecting to AI...",
    });

    const targetConversationId = currentConversationId || conversationId;
    console.log(
      `🌊 Sending streaming message for conversation: ${targetConversationId}`
    );

    if (streamingChatRef.current && socketRef.current) {
      if (socketRef.current.connected) {
        console.log(`✅ Socket connected, sending message`);
        setLoadingState({
          phase: "sending",
          message: "Sending your message...",
        });
        streamingChatRef.current.sendStreamingMessage(
          userMessage,
          targetConversationId
        );
      } else {
        console.log(`🔄 Socket not connected, waiting...`);
        socketRef.current.on("connect", () => {
          console.log(`🔄 Socket reconnected, sending message`);
          setLoadingState({
            phase: "sending",
            message: "Sending your message...",
          });
          streamingChatRef.current?.sendStreamingMessage(
            userMessage,
            targetConversationId
          );
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

  const handleStreamingError = async (error: string, data?: any) => {
    console.error("Streaming error:", error, data);

    // Handle authentication required
    if (data?.requiresAuth) {
      setImageLimitData({
        type: "auth",
        message: data.authMessage || "Please sign in to generate images!",
      });
      setShowImageLimitModal(true);
      setIsStreamingInProgress(false);
      setStreamingContent("");
      streamingContentRef.current = "";
      setToolProcessingMessage(null);
      return;
    }

    // Handle trial limit reached
    if (data?.trialUsed) {
      setImageLimitData({
        type: "trial",
        message:
          data.upgradeMessage ||
          "You've used your free image trials! Upgrade to Premium for unlimited images.",
      });
      setShowImageLimitModal(true);
      setIsStreamingInProgress(false);
      setStreamingContent("");
      streamingContentRef.current = "";
      setToolProcessingMessage(null);
      return;
    }

    // Handle insufficient credits
    if (data?.insufficientCredits) {
      setImageLimitData({
        type: "credits",
        message: data.upgradeMessage || "You've run out of credits.",
      });
      setShowImageLimitModal(true);
      setIsStreamingInProgress(false);
      setStreamingContent("");
      streamingContentRef.current = "";
      setToolProcessingMessage(null);
      return;
    }

    // Handle IP rate limit reached (anonymous users)
    if (data?.rateLimitReached) {
      setImageLimitData({
        type: "auth",
        message:
          data.upgradeMessage ||
          "You've reached your daily message limit. Create a free account to continue!",
      });
      setShowImageLimitModal(true);
      setIsStreamingInProgress(false);
      setStreamingContent("");
      streamingContentRef.current = "";
      setToolProcessingMessage(null);
      return;
    }

    // Handle message limit reached (free users)
    if (data?.messageLimitReached) {
      setImageLimitData({
        type: "trial",
        message:
          data.upgradeMessage ||
          "You've reached your monthly message limit. Upgrade to Premium for unlimited messaging!",
      });
      setShowImageLimitModal(true);
      setIsStreamingInProgress(false);
      setStreamingContent("");
      streamingContentRef.current = "";
      setToolProcessingMessage(null);
      return;
    }

    // Regular error handling
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
      // If we have a pending persona from URL or prior action, keep it visible in the input
      if (!pendingPersonaRef.current) {
        setPersona("");
      }
      return;
    }

    const fetchNsfwMode = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/conversations/${conversationId}/nsfw-mode`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(
            `🔍 Backend Mature Content mode: ${
              data.nsfwMode ? "ENABLED" : "DISABLED"
            }`
          );
          if (!data.nsfwMode) {
            console.log(`🔥 Enabling creative freedom mode`);
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
        console.error("Failed to fetch Mature Content mode:", error);
      }
    };

    const pendingPersona = pendingPersonaRef.current;

    fetchNsfwMode();
    loadPersona(conversationId, pendingPersona);
  }, [conversationId]);

  const loadPersona = async (
    convId: string,
    pendingPersona?: string | null
  ) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/conversations/${convId}/persona`
      );
      if (!response.ok) {
        throw new Error(`Failed to load persona for ${convId}`);
      }
      const data = await response.json();
      const fetchedPersona = data.persona ?? "";

      if (fetchedPersona) {
        setPersona(fetchedPersona);
        pendingPersonaRef.current = null;
        return;
      }

      if (pendingPersona && pendingPersona.trim()) {
        setPersona(pendingPersona);
        await savePersona(pendingPersona, convId);
        pendingPersonaRef.current = null;
      } else {
        setPersona("");
      }
    } catch (error) {
      console.error("Error loading persona:", error);
      if (pendingPersona && pendingPersona.trim()) {
        setPersona(pendingPersona);
      }
    }
  };

  const savePersona = async (
    personaText: string,
    targetConversationId?: string | null
  ) => {
    const activeConversationId = targetConversationId ?? conversationId;
    if (!activeConversationId) return;

    try {
      await fetch(
        `${backendUrl}/api/conversations/${activeConversationId}/persona`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona: personaText }),
        }
      );
      console.log("🎭 Persona saved");
    } catch (error) {
      console.error("Error saving persona:", error);
    }
  };

  const flushPendingPersona = async (targetConversationId: string) => {
    const pendingPersona = pendingPersonaRef.current;
    if (!pendingPersona || !pendingPersona.trim()) return;

    try {
      await savePersona(pendingPersona, targetConversationId);
      pendingPersonaRef.current = null;
    } catch (error) {
      console.error("Error flushing pending persona:", error);
    }
  };

  useEffect(() => {
    if (!imagePreview) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setImagePreview(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [imagePreview]);

  const handleImagePreviewClose = () => {
    setImagePreview(null);
  };

  const handleImagePreviewOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      handleImagePreviewClose();
    }
  };

  const handlePersonaUpdate = (value: string) => {
    setPersona(value);
    if (conversationId) {
      savePersona(value);
      pendingPersonaRef.current = null;
    } else {
      pendingPersonaRef.current = value;
    }
  };

  const handleCharacterSelect = (personaText: string) => {
    handlePersonaUpdate(personaText);
    setIsPersonaExpanded(true);
    setIsPersonaMinimized(false);
  };

  useEffect(() => {
    if (!isPersonaExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        personaPanelRef.current &&
        !personaPanelRef.current.contains(event.target as Node)
      ) {
        setIsPersonaExpanded(false);
        setIsPersonaMinimized(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPersonaExpanded]);

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 overflow-hidden"
      style={{
        backgroundImage: 'url("/demo/hero-background.png")',
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
          background:
            "radial-gradient(circle, rgba(251, 207, 232, 0.1) 0%, transparent 70%)",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Container - Mobile First */}
      <div className="flex h-[calc(100dvh-72px)] sm:h-[calc(100dvh-80px)] lg:h-[calc(100dvh-64px)] mt-[72px] sm:mt-20 lg:mt-16 overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <ConversationSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentConversationId={conversationId || ""}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
        />

        {/* Chat Area - Full width on mobile */}
        <div className="flex-1 w-full min-w-0 flex flex-col overflow-hidden">
          <GlassEffect
            className="flex-1 flex flex-col min-h-0 overflow-hidden m-2 sm:m-4 lg:m-6"
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
            <div className="flex items-center justify-between p-2 sm:p-3 border-b border-white/10 shrink-0 relative z-40">
              <div className="flex gap-2 relative z-40">
                {/* Hamburger - Mobile only */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white p-2 rounded-full shadow-lg active:scale-95 transition-all"
                  title="Menu"
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
                <div className="flex gap-2">
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
                    onClick={() => setShowCharacterModal(true)}
                    className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white p-2 rounded-full shadow-lg active:scale-95 transition-all"
                    title="Create Character"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Persona Panel */}
            {isPersonaExpanded && (
              <div
                ref={personaPanelRef}
                className="grid grid-cols-1 gap-3 sm:gap-4 border-b border-white/10 p-3 sm:p-4 lg:p-5 shrink-0 bg-white/40 backdrop-blur-xl rounded-t-2xl sm:rounded-t-3xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gray-900/40">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
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
                      <span className="text-sm sm:text-base font-semibold">
                        Custom Persona
                      </span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-gray-700/80">
                      Describe the persona so the AI stays in character for this
                      chat.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsPersonaExpanded(false);
                      setIsPersonaMinimized(true);
                    }}
                    className="text-gray-900 hover:text-gray-800 transition-colors"
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
                <textarea
                  value={persona}
                  onChange={(e) => {
                    handlePersonaUpdate(e.target.value);
                  }}
                  placeholder="Example: You are a confident, flirty partner who adores romantic adventures..."
                  className="w-full min-h-[3.75rem] sm:min-h-[4.75rem] p-3 sm:p-4 border border-purple-200/60 rounded-2xl bg-white/85 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-900 text-sm sm:text-base"
                  style={{ fontSize: "15px" }}
                />
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-700/80">
                  <span>{persona.length} characters</span>
                  <button
                    onClick={() => {
                      handlePersonaUpdate("");
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    Clear persona
                  </button>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-5 lg:space-y-6 scrollbar-thin">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-[#ff6cab] via-[#ff8780] to-[#ffb36c] text-white shadow-lg shadow-pink-900/20"
                        : "bg-gradient-to-br from-[#ae1e75]/90 via-[#c93387]/85 to-[#f06aa6]/80 backdrop-blur-lg text-gray-100 border border-[#ffb1ec]/40 shadow-lg shadow-black/25"
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
                            className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg cursor-pointer"
                            onClick={() =>
                              setImagePreview({
                                url: imageUrl,
                                alt: `Image ${imgIndex + 1}`,
                              })
                            }
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div
                      className={`whitespace-pre-line leading-relaxed text-sm sm:text-base lg:text-base ${
                        message.role === "user"
                          ? "text-white drop-shadow-sm"
                          : "text-gray-50"
                      }`}
                    >
                      {message.role === "assistant"
                        ? renderStyledText(message.content)
                        : normalizeWhitespace(message.content)}
                    </div>
                    <div
                      className={`text-xs sm:text-sm mt-2 ${
                        message.role === "user"
                          ? "text-white/90"
                          : "text-gray-300"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming Display */}
              {isStreamingInProgress && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-[#ae1e75]/90 via-[#c93387]/85 to-[#f06aa6]/80 backdrop-blur-lg border border-[#ffb1ec]/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-lg shadow-black/25 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] min-h-[60px]">
                    {toolProcessingMessage ? (
                      <div className="flex items-center gap-2 text-blue-200 min-h-[40px]">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-sm sm:text-base lg:text-base italic">
                          {toolProcessingMessage}
                        </span>
                      </div>
                    ) : streamingContent ? (
                      <div className="whitespace-pre-line leading-relaxed text-gray-50 text-sm sm:text-base lg:text-base min-h-[40px]">
                        {renderStyledText(streamingContent)}
                        <div className="inline-block w-2 h-5 bg-purple-400 animate-pulse ml-1" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 min-h-[40px]">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        <span className="text-sm sm:text-base text-purple-300">
                          {loadingState.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 lg:p-4 pb-[env(safe-area-inset-bottom)] border-t border-white/10 shrink-0">
              <div className="mb-2 text-xs sm:text-sm text-white/80 text-center sm:text-left">
                Use <span className="font-semibold">/show</span> or{" "}
                <span className="font-semibold">/see</span> in your sentence to
                generate an image.
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 lg:gap-3">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={isStreamingInProgress}
                  className="flex-1 px-4 py-2 sm:py-2.5 lg:py-3 border-2 border-white/20 rounded-full text-black placeholder-gray-500 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200/50 transition-all disabled:opacity-50 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                  style={{ fontSize: "15px" }}
                  required
                />
                <button
                  type="submit"
                  disabled={isStreamingInProgress || !inputValue.trim()}
                  className="bg-gradient-to-br from-[#6f5dfa] via-[#8f6cff] to-[#c178ff] text-white px-5 sm:px-6 lg:px-7 py-2 sm:py-2.5 lg:py-3 rounded-full font-semibold text-sm sm:text-base shadow-xl shadow-purple-900/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Send
                </button>
              </form>
            </div>
          </GlassEffect>
        </div>
      </div>

      {imagePreview && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
          onMouseDown={handleImagePreviewOverlayClick}
        >
          <div className="relative max-w-5xl w-auto flex flex-col items-center gap-3">
            <button
              onClick={handleImagePreviewClose}
              className="self-end text-white/80 hover:text-white transition-colors"
              aria-label="Close image preview"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={imagePreview.url}
              alt={imagePreview.alt || "Preview"}
              className="max-h-[80vh] max-w-[90vw] w-auto rounded-3xl border border-white/20 shadow-2xl shadow-black/40"
            />
            {imagePreview.alt && (
              <p className="text-sm text-white/80">{imagePreview.alt}</p>
            )}
          </div>
        </div>
      )}

      {/* Character Creation Modal */}
      <CharacterCreationModal
        isOpen={showCharacterModal}
        onClose={() => setShowCharacterModal(false)}
        onSelectCharacter={handleCharacterSelect}
        currentPersona={persona}
      />

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

      {/* Image Limit Modal */}
      {showImageLimitModal && imageLimitData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-8 text-white text-center relative">
              {/* Animated Icons */}
              <div className="absolute top-4 right-4 text-2xl animate-bounce">
                🎨
              </div>
              <div className="absolute bottom-4 left-4 text-2xl animate-bounce animation-delay-300">
                ✨
              </div>

              {/* Emoji Icon */}
              <div className="text-6xl mb-4">
                {imageLimitData.type === "auth"
                  ? "🔐"
                  : imageLimitData.type === "trial"
                  ? "🔒"
                  : "💳"}
              </div>

              {/* Headline */}
              <h2 className="text-3xl font-black mb-2">
                {imageLimitData.type === "auth"
                  ? "Sign In Required"
                  : imageLimitData.type === "trial"
                  ? "Free Trials Used"
                  : "Out of Credits"}
              </h2>

              {/* Usage Info */}
              <p className="text-sm opacity-90">
                {imageLimitData.type === "auth"
                  ? "Create images with a free account"
                  : imageLimitData.type === "trial"
                  ? "You've used your 2 free image trials"
                  : "Your monthly credits have been used"}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-gray-700 text-lg text-center mb-6">
                {imageLimitData.message}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Unlimited AI-generated images</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Uncensored romantic content</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Priority generation speed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>HD quality images</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {imageLimitData.type === "auth" ? (
                  <>
                    <button
                      onClick={() =>
                        (window.location.href = "/login?redirect=/chat")
                      }
                      className="w-full px-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      🔐 Sign In to Generate Images
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = "/signup?redirect=/chat")
                      }
                      className="w-full px-6 py-3 rounded-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                      Create Free Account
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => (window.location.href = "/pricing")}
                      className="w-full px-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      ✨ Upgrade to Premium
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowImageLimitModal(false)}
                  className="w-full px-6 py-3 rounded-2xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  Maybe Later
                </button>
              </div>

              {/* Reset Info */}
              {imageLimitData.type === "trial" && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Upgrade for unlimited image generation
                </p>
              )}
              {imageLimitData.type === "credits" && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Your credits will refresh on the 1st of each month
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
