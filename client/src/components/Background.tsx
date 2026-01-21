import type { Profile } from "@shared/schema";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps {
  config: Profile["background"];
  effects: Profile["effects"];
  theme: Profile["theme"];
}

export function Background({ config, effects, theme }: BackgroundProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Convert "H S% L%" string to CSS value
  const getHsl = (color: string) => `hsl(${color})`;

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-black">
      {/* 1. Dynamic Gradient Base */}
      <div 
        className="absolute inset-0 opacity-40 animate-pulse"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, ${getHsl(theme.glowCyan)} 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, ${getHsl(theme.glowPurple)} 0%, transparent 20%),
            radial-gradient(circle at 50% 50%, ${getHsl(theme.glowPink)} 0%, transparent 30%)
          `
        }}
      />

      {/* 2. Video Background */}
      {config.src && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            videoLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            opacity: videoLoaded ? config.videoOpacity / 100 : 0,
            filter: `blur(${config.videoBlur}px)`,
          }}
        >
          <source src={config.src} type="video/mp4" />
        </video>
      )}

      {/* 3. Noise Overlay */}
      {effects.noiseEnabled && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]">
          <div 
            className="w-full h-full bg-repeat animate-grain"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}
          />
        </div>
      )}

      {/* 4. Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />
    </div>
  );
}
