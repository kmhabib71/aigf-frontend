"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [character, setCharacter] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load character from localStorage
    const stored = localStorage.getItem("demoCharacter");
    if (stored) {
      setCharacter(JSON.parse(stored));
    } else {
      // Default character if none created
      setCharacter({
        name: "Sophia",
        personality: { traits: ["Empathetic", "Creative"], interests: ["Art", "Music"] }
      });
    }

    // Get or create session ID for persistent conversations
    let sid = localStorage.getItem("demoSessionId");
    if (!sid) {
      sid = `demo-session-${Date.now()}`;
      localStorage.setItem("demoSessionId", sid);
    }
    setSessionId(sid);

    // Load previous messages
    const storedMessages = localStorage.getItem("demoMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages, (key, value) => {
        if (key === "timestamp") return new Date(value);
        return value;
      }));
    } else {
      // Welcome message
      setMessages([{
        id: "welcome",
        sender: "ai",
        content: "Hey there! I'm so glad you're here. How has your day been?",
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);

    try {
      // Call backend API for REAL AI response (LangChain + Venice)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/demo/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          character: character,
          sessionId: sessionId // Include sessionId for conversation continuity
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      const response = data.response;

      // Simulate streaming by adding response word by word
      const words = response.split(" ");
      let streamedResponse = "";

      for (let i = 0; i < words.length; i++) {
        streamedResponse += (i > 0 ? " " : "") + words[i];
        const tempMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          content: streamedResponse,
          timestamp: new Date()
        };

        setMessages(prev => {
          const newMessages = prev.filter(m => m.id !== "typing");
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === "ai" && lastMessage.id.startsWith("ai-")) {
            return [...newMessages.slice(0, -1), tempMessage];
          }
          return [...newMessages, tempMessage];
        });

        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setIsTyping(false);

      // Save messages to localStorage
      const finalMessages = [...messages.filter(m => m.id !== "typing"), {
        id: `ai-${Date.now()}`,
        sender: "ai" as const,
        content: response,
        timestamp: new Date()
      }];
      localStorage.setItem("demoMessages", JSON.stringify(finalMessages));
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);

      // Fallback response on error
      const errorMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: "I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Save user message
    const updatedMessages = [...messages, userMessage];
    localStorage.setItem("demoMessages", JSON.stringify(updatedMessages));

    // Get AI response
    await simulateAIResponse(input.trim());
  };

  const clearChat = async () => {
    try {
      // Clear chat on backend
      if (sessionId) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await fetch(`${apiUrl}/api/demo/chat/history/${sessionId}`, {
          method: 'DELETE'
        });
      }

      // Clear local storage and reset messages
      setMessages([{
        id: "welcome",
        sender: "ai",
        content: "Hey there! I'm so glad you're here. How has your day been?",
        timestamp: new Date()
      }]);
      localStorage.removeItem("demoMessages");

      // Generate new session ID
      const newSessionId = `demo-session-${Date.now()}`;
      localStorage.setItem("demoSessionId", newSessionId);
      setSessionId(newSessionId);
    } catch (error) {
      console.error('Error clearing chat:', error);
      // Still clear local messages even if API call fails
      setMessages([{
        id: "welcome",
        sender: "ai",
        content: "Hey there! I'm so glad you're here. How has your day been?",
        timestamp: new Date()
      }]);
      localStorage.removeItem("demoMessages");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/demo" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white font-black text-2xl">AI</span>
            </div>
            <div>
              <div className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {character?.name || "AI Companion"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{character?.personality?.traits?.slice(0, 2).join(" • ") || "Online Now"}</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={clearChat}
              className="px-4 py-2 text-purple-300 hover:text-white font-semibold transition-all"
            >
              Clear Chat
            </button>
            <Link
              href="/demo/stories"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-pink-500/50 transition-all transform hover:scale-105"
            >
              Generate Story
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 text-white"
                } rounded-2xl px-6 py-4`}
              >
                <div className="text-base leading-relaxed">{message.content}</div>
                <div className={`text-xs mt-3 ${message.sender === "user" ? "text-purple-200" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-2xl px-6 py-4">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce shadow-lg shadow-pink-500/50" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-purple-500/20 bg-black/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <form onSubmit={handleSend} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-6 py-4 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Send
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Demo Mode - All conversations are private and secure
          </p>
        </div>
      </div>
    </div>
  );
}
