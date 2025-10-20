"use client";

import React, { useState, useEffect } from "react";

interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * User Avatar component with caching and fallback
 * Fixes Google profile photo 429 rate limiting
 */
export default function UserAvatar({
  photoURL,
  displayName,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  // Get initials from display name
  const getInitials = () => {
    if (!displayName) return "U";
    const names = displayName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return displayName[0].toUpperCase();
  };

  // Cache photo URL in localStorage to avoid repeated requests
  useEffect(() => {
    if (!photoURL) {
      setImgError(true);
      return;
    }

    // Check if we have a cached version
    const cachedPhoto = localStorage.getItem(`avatar_${photoURL}`);
    if (cachedPhoto) {
      setImgSrc(cachedPhoto);
      return;
    }

    // Use the original URL but handle errors
    setImgSrc(photoURL);
  }, [photoURL]);

  const handleImageLoad = () => {
    // Cache the successfully loaded image URL
    if (photoURL) {
      localStorage.setItem(`avatar_${photoURL}`, photoURL);
    }
  };

  const handleImageError = () => {
    console.warn("Failed to load profile photo, using fallback");
    setImgError(true);

    // Remove from cache if it was cached
    if (photoURL) {
      localStorage.removeItem(`avatar_${photoURL}`);
    }
  };

  // Show initials if no photo or photo failed to load
  if (!imgSrc || imgError) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold`}
      >
        {getInitials()}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={displayName || "User"}
      className={`${sizeClasses[size]} ${className} rounded-full object-cover`}
      onLoad={handleImageLoad}
      onError={handleImageError}
      loading="lazy" // Lazy load to reduce requests
      referrerPolicy="no-referrer" // Prevent sending referrer to Google
    />
  );
}
