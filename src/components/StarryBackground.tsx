"use client";

import React, { useEffect, useState } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
}

export default function StarryBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const colors = [
      "rgba(255, 255, 255, 0.9)", // white
      "rgba(255, 200, 200, 0.8)", // soft pink
      "rgba(255, 220, 180, 0.8)", // peachy
      "rgba(255, 180, 200, 0.7)", // rose
    ];

    const generatedStars: Star[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
          }}
        />
      ))}

      {/* Shooting stars with warm glow */}
      <div className="absolute top-1/4 left-1/4 w-[2px] h-[2px] bg-rose-200 rounded-full opacity-0 animate-shooting-star shadow-[0_0_8px_rgba(251,207,232,0.8)]" />
      <div
        className="absolute top-1/3 right-1/3 w-[2px] h-[2px] bg-pink-200 rounded-full opacity-0 animate-shooting-star shadow-[0_0_8px_rgba(251,207,232,0.8)]"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute bottom-1/3 left-1/2 w-[2px] h-[2px] bg-orange-200 rounded-full opacity-0 animate-shooting-star shadow-[0_0_8px_rgba(255,220,180,0.8)]"
        style={{ animationDelay: "6s" }}
      />

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes shooting-star {
          0% {
            opacity: 0;
            transform: translate(0, 0);
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(300px, 300px);
          }
        }

        .animate-twinkle {
          animation: twinkle infinite ease-in-out;
        }

        .animate-shooting-star {
          animation: shooting-star 3s infinite;
        }
      `}</style>
    </div>
  );
}
