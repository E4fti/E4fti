// Loads profile data from .env and returns a profile object
import { config } from "dotenv";
config();

export function getEnvProfile() {
  return {
    username: process.env.USERNAME || process.env.VITE_USERNAME || "User",
    bio: process.env.BIO || "",
    status: process.env.STATUS || "online",
    pronouns: process.env.PRONOUNS || "",
    banner: process.env.BANNER_IMAGE || "/assets/banner.jpg",
    avatar: {
      src: process.env.AVATAR_IMAGE || "/assets/avatar.jpg",
      alt: "Profile Avatar",
      useDiscord: true
    },
    discord: {
      userId: process.env.DC_PROFILE_UID || "",
      showStatus: true,
      showActivity: true,
      showDecoration: true,
      serverId: process.env.DISCORD_SERVER_ID || "",
      serverIcon: process.env.DISCORD_SERVER_ICON || "/assets/servericon.jpg",
      serverName: process.env.DISCORD_SERVER_NAME || ""
    },
    spotify: {
      enabled: true,
      embedUrl: process.env.SPOTIFY_PLAYLIST || "",
      height: 100,
      compact: true,
      showInDiscordStatus: true
    },
    background: {
      src: process.env.BACKGROUND_VIDEO || "/assets/background.mp4",
      videoOpacity: 50,
      videoBlur: 0
    },
    audio: {
      src: process.env.AUDIO_SRC || "/assets/audio.mp3",
      autoplay: true,
      loop: true,
      defaultVolume: 1
    },
    cursor: {
      enabled: true,
      style: "dot",
      emoji: "✨",
      primaryColor: "180 100% 50%",
      secondaryColor: "300 100% 50%"
    },
    socialLinks: [
      { platform: "facebook", url: process.env.FACEBOOK_LINK || "" },
      { platform: "twitter", url: process.env.TWITTER_LINK || "" },
      { platform: "instagram", url: process.env.INSTAGRAM_LINK || "" },
      { platform: "youtube", url: process.env.YOUTUBE_LINK || "" },
      { platform: "github", url: process.env.GITHUB_LINK || "" },
      { platform: "linkedin", url: process.env.LINKEDIN_LINK || "" },
      { platform: "email", url: process.env.EMAIL_LINK || "" },
      { platform: "website", url: process.env.WEBSITE_LINK || "" }
    ],
    customLinks: [],
    badges: JSON.parse(process.env.BADGES || "[]"),
    theme: {
      glowCyan: "180 100% 50%",
      glowPurple: "270 100% 60%",
      glowPink: "320 100% 60%"
    },
    effects: {
      tiltEnabled: process.env.EFFECTS_TILT_ENABLED === undefined ? true : process.env.EFFECTS_TILT_ENABLED === 'true',
      tiltMaxAngle: process.env.EFFECTS_TILT_MAX_ANGLE !== undefined ? Number(process.env.EFFECTS_TILT_MAX_ANGLE) : 20,
      noiseEnabled: process.env.EFFECTS_NOISE_ENABLED === undefined ? false : process.env.EFFECTS_NOISE_ENABLED === 'true',
      showViews: process.env.EFFECTS_SHOW_VIEWS === undefined ? true : process.env.EFFECTS_SHOW_VIEWS === 'true',
      viewCount: Number(process.env.VIEW_COUNT) || 0
    },
    footer: {
      text: "Made with ❤️ by Efti",
      heart: true,
      brandName: "web-card-guns.lol",
      brandUrl: "https://web-card-guns.lol"
    }
  };
}
