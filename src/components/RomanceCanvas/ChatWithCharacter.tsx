"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface Character {
  name: string;
  role: string;
  traits?: string[];
  emotion?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatWithCharacterProps {
  storyId: string;
  socket: Socket | null;
  characters: Character[];
}

export default function ChatWithCharacter({ storyId, socket, characters }: ChatWithCharacterProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-select first character if only one exists
  useEffect(() => {
    if (characters.length === 1 && !selectedCharacter) {
      setSelectedCharacter(characters[0].name);
    }
  }, [characters, selectedCharacter]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('character-chat-response', (data: { characterName: string; message: string; timestamp: string }) => {
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp
      }]);
      setLoading(false);
    });

    return () => {
      socket.off('character-chat-response');
    };
  }, [socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedCharacter || !socket || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);

    // Send to backend (keep last 10 messages for context)
    const recentHistory = chatHistory.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    socket.emit('character-chat-message', {
      storyId,
      characterName: selectedCharacter,
      message: message.trim(),
      chatHistory: recentHistory,
      userId: user?.uid || null
    });

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all flex items-center gap-2"
      >
        💬 Chat with Character
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <div>
            <h3 className="font-semibold text-sm">Chat with Character</h3>
            {selectedCharacter && (
              <p className="text-xs opacity-90">{selectedCharacter}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Character Selection (if multiple characters) */}
      {characters.length > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <label className="text-xs font-medium text-gray-700 mb-1 block">Select Character:</label>
          <select
            value={selectedCharacter}
            onChange={(e) => {
              setSelectedCharacter(e.target.value);
              setChatHistory([]); // Clear history when switching characters
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a character...</option>
            {characters.map((char) => (
              <option key={char.name} value={char.name}>
                {char.name} ({char.role})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            <p className="mb-2">💭</p>
            <p>Start a conversation with {selectedCharacter || 'a character'}!</p>
            <p className="text-xs mt-2 text-gray-400">They'll respond in character based on the story.</p>
          </div>
        )}

        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 border border-gray-200 px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        {!selectedCharacter ? (
          <p className="text-sm text-gray-500 text-center py-2">
            Please select a character to start chatting
          </p>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${selectedCharacter}...`}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '...' : '→'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
