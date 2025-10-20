"use client";

import React, { ReactNode } from "react";

interface PremiumGlassCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  noPadding?: boolean;
}

export default function PremiumGlassCard({
  children,
  title,
  subtitle,
  className = "",
  noPadding = false,
}: PremiumGlassCardProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Outer glow */}
      <div className="absolute -inset-[2px] bg-gradient-to-br from-rose-400/40 via-pink-400/30 to-orange-400/40 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Border glow */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-rose-300/50 via-pink-300/40 to-orange-300/50 rounded-[2rem] group-hover:from-rose-400/60 group-hover:via-pink-400/50 group-hover:to-orange-400/60 transition-all duration-500" />

      {/* Glass content */}
      <div className="relative backdrop-blur-3xl bg-white/[0.03] border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden">
        {/* Top shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.15] via-transparent to-transparent opacity-50 pointer-events-none" />

        {/* Side highlight */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-orange-500/5" />
        </div>

        {/* Content */}
        <div className={`relative z-10 ${noPadding ? "" : "p-6 sm:p-8"}`}>
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-2xl mb-2 tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-white/70 drop-shadow-lg text-sm sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
