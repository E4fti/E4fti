import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Profile } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  config: Profile["audio"];
}

export interface AudioPlayerHandle {
  play: () => Promise<void>;
  pause: () => void;
}

export const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(({ config }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Failed to play audio:", error);
        }
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = config.defaultVolume;
      
      // Attempt autoplay if configured - add small delay to ensure audio element is ready
      if (config.autoplay) {
        const timer = setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsPlaying(true);
                })
                .catch(() => {
                  // Auto-play was prevented by browser
                  setIsPlaying(false);
                });
            }
          }
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [config, config.autoplay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!config.src) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio
        ref={audioRef}
        src={config.src}
        loop={config.loop}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="group relative"
      >
        <button
          onClick={togglePlay}
          className={cn(
            "relative flex items-center justify-center w-12 h-12 rounded-full",
            "bg-black/40 backdrop-blur-md border border-white/10",
            "text-white shadow-lg hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300",
            isPlaying && "animate-[spin_4s_linear_infinite]"
          )}
        >
          {isPlaying ? (
            <div className="w-full h-full rounded-full border border-dashed border-white/30 absolute inset-0" />
          ) : null}
          
          <div className={cn(isPlaying && "animate-[spin_4s_linear_infinite_reverse]")}>
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </div>
        </button>

        <AnimatePresence>
          {(!hasInteracted && config.autoplay && !isPlaying) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-full right-0 mb-3 px-3 py-1.5 whitespace-nowrap bg-black/80 backdrop-blur text-xs font-medium text-white rounded-lg border border-white/10"
            >
              Click to play
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

AudioPlayer.displayName = "AudioPlayer";
