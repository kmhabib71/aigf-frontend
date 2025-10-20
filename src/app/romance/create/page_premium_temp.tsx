"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { sessionService } from "@/lib/auth/sessionService";
import { authService } from "@/lib/auth/authService";
import TropeSelector from "@/components/RomanceCanvas/TropeSelector";
import StreamingStoryCreation from "@/components/RomanceCanvas/StreamingStoryCreation";
import SoftGateModal from "@/components/SoftGateModal";
import GlassEffect from "@/components/GlassEffect";
import Header from "@/components/layout/Header";
import { backendUrl } from "@/lib/config";
export default function CreateStoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, anonymousSession } = useAuth();
  const { socket, isConnected } = useSocket(); // Use global socket

  const [prompt, setPrompt] = useState(
    "A forbidden office romance between a CEO and their new intern, filled with tension and secret glances across the boardroom."
  );
  const [title, setTitle] = useState("Forbidden Office Romance");
  const [tropes, setTropes] = useState<string[]>(["slow-burn"]);
  const [narrativeStyle, setNarrativeStyle] = useState<
    "third-person" | "first-person"
  >("third-person");
  const [storyLength, setStoryLength] = useState(1500);
  const [spiceLevel, setSpiceLevel] = useState<"soft" | "medium" | "explicit">(
    "soft"
  );
  const [characterRef, setCharacterRef] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [useStreaming, setUseStreaming] = useState(true); // Default to streaming
  const [generateImages, setGenerateImages] = useState(false); // Default to OFF for testing

  // Soft gate state
  const [showSoftGate, setShowSoftGate] = useState(false);
  const [storyScenesCreated, setStoryScenesCreated] = useState(0);

  const handleCharacterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setCharacterRef(file);
      setError("");
    }
  };

  const handleCreate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a story prompt");
      return;
    }

    if (prompt.trim().length < 10) {
      setError("Prompt must be at least 10 characters");
      return;
    }

    // Check anonymous session limits (only for non-authenticated users)
    if (!user && anonymousSession) {
      const canCreate = await sessionService.canCreateStory();
      if (!canCreate) {
        setShowSoftGate(true);
        return;
      }
    }

    setIsGenerating(true);
    setError("");

    // If streaming is enabled and socket is connected, use streaming mode
    if (useStreaming && isConnected && socket) {
      // Streaming mode will be handled by StreamingStoryCreation component
      return;
    }

    // Fallback to original HTTP-based creation
    try {
      // Get auth token or sessionId
      let idToken = null;
      let sessionId = null;

      if (user) {
        idToken = await authService.getIdToken();
        if (!idToken) {
          throw new Error("Authentication required");
        }
      } else if (anonymousSession) {
        sessionId = anonymousSession.sessionId;
      } else {
        throw new Error("Session required");
      }

      // Upload character reference if provided (optional for MVP)
      let characterRefUrl = null;
      if (characterRef) {
        // TODO: Implement image upload in Phase 2
        // For MVP, we'll skip character reference upload
        console.log("Character reference upload coming in Phase 2");
      }

      // Call API to create story
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (idToken) {
        headers["Authorization"] = `Bearer ${idToken}`;
      }

      const response = await fetch(`${backendUrl}/api/romance/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt: prompt.trim(),
          title: title.trim() || undefined,
          tropes,
          narrativeStyle,
          storyLength,
          spiceLevel,
          characterRef: characterRefUrl,
          sessionId: sessionId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create story");
      }

      console.log("✅ Story created:", data.story);

      // Increment anonymous scene count if applicable
      if (!user && anonymousSession) {
        const count = await sessionService.incrementStorySceneCount();
        setStoryScenesCreated(count);

        // Show soft gate after first scene
        if (count >= 1) {
          setShowSoftGate(true);
        }
      }

      // Redirect to canvas view
      router.push(`/romance/story/${data.story.id}`);
    } catch (err: any) {
      console.error("Story creation error:", err);
      setError(err.message || "Failed to create story. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleStreamingComplete = (storyId: string) => {
    console.log("✅ Streaming story complete, redirecting to:", storyId);
    router.push(`/romance/story/${storyId}`);
  };

  const handleStreamingError = (errorMsg: string) => {
    console.error("❌ Streaming error:", errorMsg);
    setError(errorMsg);
    setIsGenerating(false);
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
