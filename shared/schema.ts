import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  bio: text("bio").notNull(),
  status: text("status").notNull(), // "online" | "offline" | "away" | "dnd"
  pronouns: text("pronouns").default(""),
  banner: text("banner").default("/assets/banner.jpg"),
  avatar: jsonb("avatar").$type<{ src: string; alt: string; useDiscord: boolean }>().notNull(),
  discord: jsonb("discord").$type<{ userId: string; showStatus: boolean; showActivity: boolean; showDecoration: boolean; serverId?: string; serverIcon?: string }>().notNull(),
  spotify: jsonb("spotify").$type<{ enabled: boolean; embedUrl: string; height: number; compact: boolean; showInDiscordStatus: boolean }>().notNull(),
  background: jsonb("background").$type<{ src: string; videoOpacity: number; videoBlur: number }>().notNull(),
  audio: jsonb("audio").$type<{ src: string; autoplay: boolean; loop: boolean; defaultVolume: number }>().notNull(),
  cursor: jsonb("cursor").$type<{ enabled: boolean; style: "dot" | "ring" | "emoji"; emoji: string; primaryColor: string; secondaryColor: string }>().notNull(),
  socialLinks: jsonb("social_links").$type<Array<{ platform: string; url: string }>>().notNull(),
  customLinks: jsonb("custom_links").$type<Array<{ title: string; description?: string; url: string; icon: string }>>().notNull(),
  badges: jsonb("badges").$type<Array<{ icon: string; label: string }>>().default([]),
  theme: jsonb("theme").$type<{ glowCyan: string; glowPurple: string; glowPink: string }>().notNull(),
  effects: jsonb("effects").$type<{ tiltEnabled: boolean; tiltMaxAngle: number; noiseEnabled: boolean; showViews: boolean; viewCount: number }>().notNull(),
  footer: jsonb("footer").$type<{ text: string; heart: boolean; brandName: string; brandUrl: string }>().notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles);

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
