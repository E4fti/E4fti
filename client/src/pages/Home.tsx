import { useProfile } from "@/hooks/use-profile";
import { BadgeGallery } from "@/components/BadgeGallery";
import { Background } from "@/components/Background";
import { CustomCursor } from "@/components/CustomCursor";
import { AudioPlayer, type AudioPlayerHandle } from "@/components/AudioPlayer";
import { DiscordWidget } from "@/components/DiscordWidget";
import { SocialLinks } from "@/components/SocialLinks";
import { Loader2, Heart, Music, Gamepad2, Globe, Mail, Link as LinkIcon, Code, Video, Camera, Eye, MapPin, Users } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanyard } from "@/hooks/use-lanyard";
import { useRef } from "react";

export default function Home() {
  const { data: profile, isLoading, error } = useProfile();
  // Fallback to VITE_USERNAME if API fails
  const fallbackUsername = import.meta.env.VITE_USERNAME || "User";

  // Provide default effects if missing to prevent runtime errors
  const defaultEffects = { tiltEnabled: true, tiltMaxAngle: 20, noiseEnabled: false, showViews: true, viewCount: 0 };
  // Type guard for profile
  const validProfile = profile as import("@shared/schema").Profile | null;
  const effects = validProfile?.effects || defaultEffects;
  const { data: lanyard } = useLanyard({ userId: validProfile?.discord?.userId });
  const audioRef = useRef<AudioPlayerHandle>(null);

  // Scroll-based tilt state
  const [scrollTilt, setScrollTilt] = useState({ x: 0, y: 0 });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [tapTilt, setTapTilt] = useState(0); // -maxAngle for left, +maxAngle for right

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxAngle = effects.tiltMaxAngle;
      const tiltMultiplier = 1.2;
      // Determine scroll direction for X tilt
      let x = 0;
      if (scrollY > lastScrollY) {
        x = maxAngle * tiltMultiplier; // Scroll down → tilt right
      } else if (scrollY < lastScrollY) {
        x = -maxAngle * tiltMultiplier; // Scroll up → tilt left
      }
      setLastScrollY(scrollY);
      // Y tilt still based on scroll position
      const y = Math.max(-maxAngle, Math.min(maxAngle, (scrollY / 100) * maxAngle * tiltMultiplier));
      setScrollTilt({ x, y });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [effects.tiltMaxAngle, lastScrollY]);

            const maxAngle = effects.tiltMaxAngle;
  const handleTiltTap = (e: React.MouseEvent) => {
    const maxAngle = effects.tiltMaxAngle;
    const tiltMultiplier = 2.5;
    const x = e.clientX;
    const width = window.innerWidth;
    // Left half → tilt left, right half → tilt right
    if (x < width / 2) {
      setTapTilt(-maxAngle * tiltMultiplier);
    } else {
      setTapTilt(maxAngle * tiltMultiplier);
    }
    // Reset after short delay for effect
    setTimeout(() => setTapTilt(0), 400);
  };

  // Play music on any click in the profile
  const handleProfileClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
          const maxAngle = effects.tiltMaxAngle;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If API fails, use fallback username for minimal display
  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white gap-4">
        <h2 className="text-xl font-bold text-red-500">Failed to load profile</h2>
        <h3 className="text-lg font-bold">{fallbackUsername}</h3>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const useDiscordAvatar = validProfile?.avatar?.useDiscord && lanyard?.discord_user;
  const avatarSrc = useDiscordAvatar 
    ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.webp?size=256`
    : validProfile?.avatar?.src;
  const decorationUrl = useDiscordAvatar && validProfile?.discord?.showDecoration && lanyard.discord_user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${lanyard.discord_user.avatar_decoration_data.asset}.png`
    : null;
  const displayUsername = import.meta.env.VITE_USERNAME || validProfile?.username || fallbackUsername;
  const bioTags = validProfile?.bio?.split(" ") || [];

  return (
    <>
      <CustomCursor config={validProfile?.cursor ?? { enabled: false, style: "dot", emoji: "", primaryColor: "#000", secondaryColor: "#fff" }} />
      <Background config={validProfile?.background ?? { src: "", videoOpacity: 1, videoBlur: 0 }} effects={validProfile?.effects || defaultEffects} theme={validProfile?.theme ?? { glowCyan: "#00fff7", glowPurple: "#a259ff", glowPink: "#ff6ec4" }} />
      <AudioPlayer ref={audioRef} config={validProfile?.audio ?? { src: "", autoplay: false, loop: false, defaultVolume: 1 }} />

      <main className="min-h-screen py-8 px-4 flex flex-col items-center justify-start relative z-10 overflow-y-auto gap-4" onClick={e => { handleProfileClick(); handleTiltTap(e); }}>
        {/* Profile UI Content */}
        <div className="flex flex-col items-center">
          {/* Main Profile Card */}
          {effects.tiltEnabled ? (
            <Tilt
              tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
              tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
              perspective={1000}
              scale={1.03}
              transitionSpeed={2000}
              gyroscope={true}
              tiltAngleXManual={tapTilt !== 0 ? tapTilt : scrollTilt.x}
              tiltAngleYManual={scrollTilt.y}
              className="w-full max-w-[400px] sm:max-w-[420px]"
            >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="glass-card rounded-[2rem] w-full relative overflow-hidden bg-[#f8fafc]/80 backdrop-blur-md border border-white/10 shadow-md"
              >
                {/* Banner */}
                <div className="h-36 w-full relative">
                  <img
                    src={typeof validProfile?.banner === "string" ? validProfile.banner : undefined}
                    className="w-full h-full object-cover brightness-50"
                    alt="Banner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]/80" />
                </div>
                <div className="px-5 pb-5 -mt-10 relative z-10">
                  {/* Avatar */}
                  <div className="relative inline-block mb-3">
                    <div className="relative w-20 h-20">
                      <div className="relative w-full h-full">
                        <img
                          src={avatarSrc}
                          alt={displayUsername}
                          className="w-full h-full rounded-full border-[3px] border-[#1a1a1a] shadow-2xl relative z-10 object-cover"
                        />
                        {decorationUrl && (
                          <img
                            src={decorationUrl}
                            alt="Decoration"
                            className="absolute top-1/3 left-1/3 w-full h-full rounded-full z-20 pointer-events-none transform -translate-x-1/3 -translate-y-1/3 border-[0px] border-transparent"
                            style={{ boxSizing: 'border-box' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Username */}
                  <motion.div variants={item} className="mb-2">
                    <h1 className="text-3xl font-bold text-white tracking-tighter uppercase text-glow-blue">
                      {displayUsername}
                    </h1>
                  </motion.div>
                    {/* Badge Gallery */}
                    <motion.div variants={item} className="mb-5">
                      <BadgeGallery />
                    </motion.div>
                  {/* Bio Tags */}
                  <motion.div variants={item} className="flex flex-wrap gap-1 mb-4 justify-left">
                    {bioTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[13px] font-extrabold text-white bio-white-stroke bio-blue-glow"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                  {/* Social Links - After Bio, aligned with bio */}
                  <motion.div variants={item} className="flex flex-wrap gap-2 justify-left mb-5 mt-2">
                    <SocialLinks
                      links={(() => {
                        let links = validProfile?.socialLinks?.filter(l => l.platform.toLowerCase() !== 'email') || [];
                        // Add Discord as the first social link if not present
                        const discordId = validProfile?.discord?.userId;
                        let discordLink: { platform: string; url: string } | undefined = undefined;
                        if (discordId && !links.some(l => l.platform.toLowerCase() === 'discord')) {
                          discordLink = { platform: 'discord', url: `https://discord.com/users/${discordId}` };
                        } else if (links.length && links[0].platform.toLowerCase() === 'discord') {
                          discordLink = links.shift();
                        }
                        // Remove Instagram and Twitter from the list
                        const instaIdx = links.findIndex(l => l.platform.toLowerCase() === 'instagram');
                        const twitterIdx = links.findIndex(l => l.platform.toLowerCase() === 'twitter');
                        const insta = instaIdx !== -1 ? links.splice(instaIdx, 1)[0] : undefined;
                        // Twitter index may change if Instagram was before it
                        const twitterIdx2 = links.findIndex(l => l.platform.toLowerCase() === 'twitter');
                        const twitter = twitterIdx2 !== -1 ? links.splice(twitterIdx2, 1)[0] : undefined;
                        // Compose the new order
                        const result: { platform: string; url: string }[] = [];
                        if (discordLink) result.push(discordLink);
                        // Fill up to 2 slots with remaining links
                        while (result.length < 2 && links.length) result.push(links.shift()!);
                        if (insta) result.push(insta);
                        if (twitter) result.push(twitter);
                        // Add the rest
                        return [...result, ...links];
                      })() as { platform: string; url: string }[]}
                    />
                  </motion.div>
                  {/* Stats Row */}
                  <motion.div variants={item} className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1 text-white/40">
                      <Eye size={12} />
                      <span className="text-[10px] font-medium">{effects.viewCount ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      <MapPin size={12} />
                      <span className="text-[10px] font-medium">Spotify</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      <Users size={12} />
                      <span className="text-[10px] font-medium">0</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Tilt>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="glass-card rounded-[2rem] w-full relative overflow-hidden bg-[#f8fafc]/80 backdrop-blur-md border border-white/10 shadow-md"
            >
              {/* Banner */}
              <div className="h-36 w-full relative">
                <img
                  src={typeof validProfile?.banner === "string" ? validProfile.banner : undefined}
                  className="w-full h-full object-cover brightness-50"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]/80" />
              </div>
              <div className="px-5 pb-5 -mt-10 relative z-10">
                {/* Avatar */}
                <div className="relative inline-block mb-3">
                  <div className="relative w-20 h-20">
                    <div className="relative w-full h-full">
                      <img
                        src={avatarSrc}
                        alt={profile.username}
                        className="w-full h-full rounded-full border-[3px] border-[#1a1a1a] shadow-2xl relative z-10 object-cover"
                      />
                      {decorationUrl && (
                        <img
                          src={decorationUrl}
                          alt="Decoration"
                          className="absolute top-1/3 left-1/3 w-full h-full rounded-full z-20 pointer-events-none transform -translate-x-1/3 -translate-y-1/3 border-[0px] border-transparent"
                          style={{ boxSizing: 'border-box' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* Username */}
                <motion.div variants={item} className="mb-2">
                  <h1 className="text-3xl font-bold text-white tracking-tighter uppercase text-glow-blue">
                    {displayUsername}
                  </h1>
                </motion.div>
                  {/* Badge Gallery */}
                  <motion.div variants={item} className="mb-3">
                    <BadgeGallery />
                  </motion.div>
                {/* Bio Tags */}
                <motion.div variants={item} className="flex flex-wrap gap-1 mb-4 justify-left">
                  {bioTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[13px] font-extrabold text-white bio-white-stroke bio-blue-glow"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
                {/* Social Links - After Bio, aligned with bio */}
                <motion.div variants={item} className="flex flex-wrap gap-2 justify-left mb-5 mt-2">
                  <SocialLinks links={validProfile?.socialLinks?.filter(l => l.platform.toLowerCase() !== 'email') || []} />
                </motion.div>
                {/* Stats Row */}
                <motion.div variants={item} className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-white/40">
                    <Eye size={12} />
                    <span className="text-[10px] font-medium">{effects.viewCount ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <MapPin size={12} />
                    <span className="text-[10px] font-medium">Spotify</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <Users size={12} />
                    <span className="text-[10px] font-medium">0</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          {/* Stacked Widgets with Tilt */}
          <div className="w-full max-w-[400px] sm:max-w-[420px] space-y-3 mt-4">
            {/* Discord Widget */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                gyroscope={true}
                tiltAngleXManual={tapTilt !== 0 ? tapTilt : scrollTilt.x}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                <DiscordWidget config={validProfile?.discord ?? { userId: "", showStatus: false, showActivity: false, showDecoration: false }} spotifyConfig={validProfile?.spotify ?? { enabled: false, embedUrl: "", height: 80, compact: false, showInDiscordStatus: false }} />
              </Tilt>
            ) : (
              <DiscordWidget config={validProfile?.discord ?? { userId: "", showStatus: false, showActivity: false, showDecoration: false }} spotifyConfig={validProfile?.spotify ?? { enabled: false, embedUrl: "", height: 80, compact: false, showInDiscordStatus: false }} />
            )}
            {/* Spotify Playlist Widget */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-[1.25rem] overflow-hidden bg-white/80 backdrop-blur-sm border border-white/10 shadow-sm flex items-center"
                  style={{ minHeight: 80, height: 80 }}
                >
                  <iframe 
                    src="https://open.spotify.com/embed/playlist/7tiPEUSHxjSiJ2C5H5UFEn" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="w-full h-full border-0 rounded-[1.25rem]"
                    style={{ minHeight: 80, height: 80, maxHeight: 100, width: '100%', borderRadius: '1.25rem' }}
                  />
                </motion.div>
              </Tilt>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-[1.25rem] overflow-hidden bg-white/80 backdrop-blur-sm border border-white/10 shadow-sm flex items-center"
                style={{ minHeight: 80, height: 80 }}
              >
                <iframe 
                  src="https://open.spotify.com/embed/playlist/7tiPEUSHxjSiJ2C5H5UFEn" 
                  frameBorder="0" 
                  allowFullScreen 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="rounded-[1.25rem] border-0 w-full h-full"
                  style={{ minHeight: 80, height: 80, maxHeight: 84, width: '100%', borderRadius: '1.25rem' }}
                />
              </motion.div>
            )}
            {/* Server Widget Mockup */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                gyroscope={true}
                tiltAngleXManual={scrollTilt.x}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                {/* Server Widget Mockup */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-[1.25rem] p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border border-white/5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-[#2b2d31] flex items-center justify-center">
                      {validProfile?.discord?.serverIcon ? (
                        <img
                          src={validProfile?.discord?.serverIcon}
                          alt="Server Icon"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#313338] flex items-center justify-center">
                          <span className="font-black text-[8px] text-center leading-tight text-white/50 uppercase px-1">No Server</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">BeyondTheBanters</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-[9px] font-bold text-white/40">
                          <div className="w-1 h-1 rounded-full bg-[#23a55a]" /> 1.4k Online
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-white/40">
                          <div className="w-1 h-1 rounded-full bg-white/10" /> 16.41k Members
                        </span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href="https://discord.gg/banters"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-[10px] font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/10 flex items-center justify-center"
                  >
                    Join Server
                  </a>
                </motion.div>
              </Tilt>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-[1.25rem] p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border border-white/5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-[#2b2d31] flex items-center justify-center">
                    {validProfile?.discord?.serverIcon ? (
                      <img
                        src={validProfile?.discord?.serverIcon}
                        alt="Server Icon"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#313338] flex items-center justify-center">
                        <span className="font-black text-[8px] text-center leading-tight text-white/50 uppercase px-1">No Server</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">BeyondTheBanters</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[9px] font-bold text-white/40">
                        <div className="w-1 h-1 rounded-full bg-[#23a55a]" /> 1.4k Online
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-white/40">
                        <div className="w-1 h-1 rounded-full bg-white/10" /> 16.41k Members
                      </span>
                    </div>
                  </div>
                </div>
                <a 
                  href="https://discord.gg/banters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-[10px] font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/10 flex items-center justify-center"
                >
                  Join Server
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
