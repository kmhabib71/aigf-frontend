import React from "react";

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: {
    blur?: number;
    saturation?: number;
    brightness?: number;
    displacement?: number;
  };
  backgroundOpacity?: number;
  borderRadius?: string;
}

const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style,
  intensity = {
    blur: 4,
    saturation: 120,
    brightness: 115,
    displacement: 50,
  },
  backgroundOpacity = 20,
  borderRadius = "3rem",
}) => {
  const filterId = `lensFilter-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`relative bg-transparent border border-black/${backgroundOpacity} shadow-2xl ${className}`}
      style={{ borderRadius, ...style }}
    >
      {/* Glass effect layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: `blur(${intensity.blur}px)`,
          filter: `url(#${filterId}) saturate(${intensity.saturation}%) brightness(${intensity.brightness}%)`,
        }}
      ></div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity / 100})`,
          borderRadius,
        }}
      ></div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius,
          boxShadow:
            "inset 1px 1px 0 rgba(255, 255, 255, 0.75), inset 0 0 5px rgba(255, 255, 255, 0.75)",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* SVG Filter Definition */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <filter
          id={filterId}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feComponentTransfer in="SourceAlpha" result="alpha">
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blur"
            scale={intensity.displacement}
            xChannelSelector="A"
            yChannelSelector="A"
          />
        </filter>
      </svg>
    </div>
  );
};

export default GlassEffect;
