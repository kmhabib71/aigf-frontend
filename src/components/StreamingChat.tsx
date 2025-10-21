"use client";

import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

interface StreamingChatProps {
  socket: Socket | null;
  conversationId: string | null;
  userId?: string | null; // Optional userId for token tracking
  onResponse: (response: string) => void;
  onError: (error: string, data?: any) => void;
  onStart: () => void;
  onComplete: (
    imageUrls?: string[],
    imageMetadata?: any,
    textContent?: string
  ) => void;
  onToolProcessing: (message: string) => void;
}

interface StreamingResponse {
  type:
    | "chunk"
    | "complete"
    | "error"
    | "tool_processing"
    | "follow_up_start"
    | "fallback_to_http"
    | "processing_started";
  content?: string;
  fullContent?: string;
  error?: string;
  message?: string;
  toolName?: string;
  conversationId: string;
  modelUsed?: string;
  toolCalls?: any[];
  finishReason?: string;
  imageUrls?: string[];
  imageMetadata?: {
    imageType: string;
    style: string;
    contentRating: string;
    quality: string;
    generatedAt: string;
  };
  requiresAuth?: boolean;
  authMessage?: string;
  trialUsed?: boolean;
  trialsUsed?: number;
  upgradeMessage?: string;
  insufficientCredits?: boolean;
  creditBalance?: number;
  rateLimitReached?: boolean;
  resetAt?: string;
  messageLimitReached?: boolean;
}

export const StreamingChat = React.forwardRef<any, StreamingChatProps>(
  (
    {
      socket,
      conversationId,
      userId,
      onResponse,
      onError,
      onStart,
      onComplete,
      onToolProcessing,
    },
    ref
  ) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");

    useEffect(() => {
      if (!socket) return;

      // Listen for streaming responses
      const handleStreamingResponse = (data: StreamingResponse) => {
        // Allow responses if conversationId matches OR if we don't have a conversationId yet (new conversation)
        if (conversationId && data.conversationId !== conversationId) {
          console.log(
            `🔍 Filtering out response for ${data.conversationId}, expecting ${conversationId}`
          );
          return;
        }

        console.log(
          `✅ Processing streaming response for conversation ${data.conversationId}`
        );

        switch (data.type) {
          case "chunk":
            // Real-time streaming chunk - pass incremental chunk to parent
            const incrementalContent = data.content || "";
            console.log(
              `📨 Received chunk (${incrementalContent.length} chars):`,
              incrementalContent.substring(0, 50)
            );
            setStreamingContent((prev) => prev + incrementalContent);
            onResponse(incrementalContent);
            break;

          case "processing_started":
            // Backend has started processing the request
            onToolProcessing("AI is thinking...");
            console.log(`🧠 Processing started (Model: ${data.modelUsed})`);
            break;

          case "complete":
            // Streaming complete
            setIsStreaming(false);
            const currentStreamingContent = streamingContent;

            console.log(`🌊 Streaming complete with model: ${data.modelUsed}`);
            if (data.imageUrls && data.imageUrls.length > 0) {
              console.log(`🖼️ Generated ${data.imageUrls.length} image(s)`);
              console.log(`🖼️ Image URLs:`, data.imageUrls);
              console.log(`🖼️ Image metadata:`, data.imageMetadata);
              console.log(
                `🖼️ First image preview (50 chars):`,
                data.imageUrls[0].substring(0, 50)
              );
            }

            // If there's content without chunks (e.g., /show command with text), pass it directly to onComplete
            if (data.content && currentStreamingContent === "") {
              console.log(
                `📝 Sending non-streaming content: "${data.content}"`
              );
              onResponse(data.content);
              // Pass text content directly to onComplete to avoid timing issues
              setTimeout(() => {
                onComplete(data.imageUrls, data.imageMetadata, data.content);
              }, 0);
            } else {
              setStreamingContent("");
              onComplete(data.imageUrls, data.imageMetadata);
            }
            break;

          case "error":
            // Streaming error
            setIsStreaming(false);
            setStreamingContent("");
            onError(data.error || "Streaming error occurred", data);
            break;

          case "tool_processing":
            // Tool processing notification with specific tool information
            const toolMessage = data.toolName
              ? `Executing: ${data.toolName}...`
              : data.message || "Processing tools...";
            onToolProcessing(toolMessage);
            console.log(`🔧 ${toolMessage} (Model: ${data.modelUsed})`);
            break;

          case "follow_up_start":
            // Follow-up response starting after tool execution
            onToolProcessing(data.message || "Generating response...");
            console.log(`🔄 ${data.message} (Model: ${data.modelUsed})`);
            break;

          case "fallback_to_http":
            // Streaming not available, falling back to HTTP
            setIsStreaming(false);
            setStreamingContent("");
            onToolProcessing(data.message || "Falling back to regular chat...");
            console.log(`🔄 Streaming fallback: ${data.message}`);

            // Give user a moment to see the fallback message, then complete
            setTimeout(() => {
              onComplete();
            }, 1500);
            break;
        }
      };

      socket.on("chat-stream-response", handleStreamingResponse);

      return () => {
        socket.off("chat-stream-response", handleStreamingResponse);
      };
    }, [
      socket,
      conversationId,
      onResponse,
      onError,
      onComplete,
      onToolProcessing,
    ]);

    const sendStreamingMessage = (message: string, conversationId: string) => {
      if (!socket || isStreaming) return;

      console.log(`🌊 Starting streaming chat for: "${message}"`);
      setIsStreaming(true);
      setStreamingContent("");
      onStart();

      // Send streaming request to backend - Venice mode is now forced for chat page
      socket.emit("chat-stream-request", {
        message,
        conversationId,
        userId: userId || null, // Include userId for token tracking (null for anonymous)
      });
    };

    // Expose methods to parent via ref
    React.useImperativeHandle(ref, () => ({
      sendStreamingMessage,
      isStreaming,
      streamingContent,
    }));

    return null; // This component doesn't render anything, just handles communication
  }
);

export default StreamingChat;
