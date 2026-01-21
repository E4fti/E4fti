import type { Profile } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  Github, Twitter, Instagram, Youtube, Twitch, 
  Linkedin, Facebook, Mail, Globe, Disc
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Map platform names to Lucide icons
const iconMap: Record<string, React.ElementType> = {
  discord: Disc,
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  twitch: Twitch,
  linkedin: Linkedin,
  facebook: Facebook,
  email: Mail,
  website: Globe,
};

interface SocialLinksProps {
  links: Profile["socialLinks"];
}

interface SocialIconImageProps {
  platform: string;
  fallback: React.ElementType;
  size?: number;
}

function SocialIconImage({ platform, fallback: Fallback, size = 24 }: SocialIconImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const platformLower = platform.toLowerCase();
    const formats = ['png', 'jpg'];
    let found = false;

    // Try each format sequentially
    const tryNextFormat = (index: number) => {
      if (index >= formats.length || found) {
        return;
      }

      const url = `/assets/${platformLower}.${formats[index]}`;
      const img = new Image();
      
      img.onload = () => {
        if (mounted && !found) {
          found = true;
          setImageUrl(url);
        }
      };
      
      img.onerror = () => {
        if (mounted && !found) {
          tryNextFormat(index + 1);
        }
      };
      
      img.src = url;
    };

    tryNextFormat(0);

    return () => {
      mounted = false;
    };
  }, [platform]);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={platform}
        style={{ width: size, height: size }}
        className="object-contain"
      />
    );
  }

  // Only show custom icons, no fallback
  return null;
}

export function SocialLinks({ links }: SocialLinksProps) {
  if (!links.length) return null;

  return (
    <div className="flex flex-row gap-3">
      {links.map((link, i) => {
        const Icon = iconMap[link.platform.toLowerCase()] || Globe;
        return (
          <motion.a
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center w-8 h-8 transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-95"
            )}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="sr-only">{link.platform}</span>
            <SocialIconImage platform={link.platform} fallback={Icon} size={24} />
          </motion.a>
        );
      })}
    </div>
  );
}
