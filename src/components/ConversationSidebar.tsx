"use client";

import { useState, useEffect } from "react";
import {
  navigateToConversation,
  navigateToNewConversation,
} from "../lib/urlParams";
import { backendUrl } from "@/lib/config";
import { useAuth } from "@/contexts/AuthContext";
import GlassEffect from "./GlassEffect";
interface Conversation {
  conversationId: string;
  title: string;
  lastActivity: string;
  messageCount: number;
  isActive: boolean;
}

interface ConversationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversationId: string;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
}

export default function ConversationSidebar({
  isOpen,
  onClose,
  currentConversationId,
  onConversationSelect,
  onNewConversation,
}: ConversationSidebarProps) {
  const { user, anonymousSession } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [newChatLoading, setNewChatLoading] = useState(false);

  useEffect(() => {
    // Load conversations when sidebar opens OR on component mount (for desktop)
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  // Load conversations on component mount (for desktop where sidebar is always visible)
  // Only load if user is authenticated
  useEffect(() => {
    if (user || anonymousSession) {
      loadConversations();
    }
  }, [user, anonymousSession]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      // Get user ID for filtering conversations
      const userId = user?.uid || anonymousSession?.sessionId;
      console.log(
        "Loading conversations for userId:",
        userId,
        "user:",
        !!user,
        "anonymousSession:",
        !!anonymousSession
      );

      if (!userId) {
        console.warn("No user ID available for loading conversations");
        setConversations([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${backendUrl}/api/conversations?userId=${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        console.error(
          "API response error:",
          response.status,
          response.statusText
        );
        setConversations([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Conversations loaded:", data.conversations?.length || 0);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    // Prevent multiple clicks while loading
    if (newChatLoading) return;

    setNewChatLoading(true);
    try {
      // Get user ID for new conversation
      const userId = user?.uid || anonymousSession?.sessionId;
      if (!userId) {
        console.error("No user ID available for creating new conversation");
        setNewChatLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/conversations/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Conversation",
          currentConversationId: currentConversationId || null,
          userId: userId,
        }),
      });

      const data = await response.json();
      if (data.conversation) {
        console.log(
          "✅ New conversation created:",
          data.conversation.conversationId
        );
        if (data.previousConversationEnded) {
          console.log("🔚 Previous conversation ended and data saved");
        }

        navigateToConversation(data.conversation.conversationId);
        onNewConversation();
        onConversationSelect(data.conversation.conversationId);
        loadConversations(); // Refresh the list
        onClose();
      }
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    } finally {
      setNewChatLoading(false);
    }
  };

  const handleDeleteConversation = async (
    conversationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/conversations/${conversationId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        loadConversations(); // Refresh the list

        // If we deleted the current conversation, create a new one
        if (conversationId === currentConversationId) {
          handleNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) {
        return "1 day ago";
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const formatMessages = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <GlassEffect
        className={`fixed top-20 left-0 h-[calc(100vh-80px)] w-72 sm:w-80 text-white transform transition-transform duration-300 ease-in-out z-50 flex-col overflow-hidden ${
          isOpen ? "flex translate-x-0" : "hidden -translate-x-full"
        } lg:flex lg:relative lg:top-0 lg:mt-0 lg:translate-x-0 lg:h-[calc(100vh-60px)] lg:w-80`}
        borderRadius="1rem"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/20 relative z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-white drop-shadow-lg">Conversations</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-purple-700/50 transition-colors lg:hidden"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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

        {/* New Chat Button */}
        <div className="p-3 sm:p-4 border-b border-white/20 relative z-10">
          <button
            onClick={handleNewChat}
            disabled={newChatLoading}
            className={`w-full font-semibold py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
              newChatLoading
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 cursor-wait text-white opacity-75"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-cyan-500/30"
            }`}
          >
            {newChatLoading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
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
                New Chat
              </>
            )}
          </button>
        </div>

        {/* Conversations List */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain relative z-10 scrollbar-thin"
        >
          {loading ? (
            <div className="p-3 sm:p-4 text-center text-white/80 text-sm sm:text-base">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-3 sm:p-4 text-center text-white/80 text-sm sm:text-base">
              No conversations yet
            </div>
          ) : (
            <div className="p-2 text-white drop-shadow">
              {conversations.map((conversation) => (
                <div
                  key={conversation.conversationId}
                  onClick={() => {
                    navigateToConversation(conversation.conversationId);
                    onConversationSelect(conversation.conversationId);
                    onClose();
                  }}
                  className={`p-2.5 sm:p-3 rounded-lg mb-2 cursor-pointer transition-all group ${
                    conversation.conversationId === currentConversationId
                      ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-pink-400 shadow-lg"
                      : "bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm truncate text-white drop-shadow">
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-gray-300 mt-0.5 sm:mt-1">
                        {formatDate(conversation.lastActivity)}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {formatMessages(conversation.messageCount)} messages
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            conversation.conversationId ===
                            currentConversationId
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                              : "bg-white/10 text-gray-300"
                          }`}
                        >
                          {conversation.conversationId === currentConversationId
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) =>
                        handleDeleteConversation(conversation.conversationId, e)
                      }
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/20 transition-all ml-2"
                      title="Delete conversation"
                    >
                      <svg
                        className="w-4 h-4 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/20 relative z-10">
          <div className="text-xs text-white/70 text-center drop-shadow">
            Romance Canvas © 2026
          </div>
        </div>
      </GlassEffect>
    </>
  );
}
