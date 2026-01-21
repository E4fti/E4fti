import type { Express } from "express";
import { createServer, type Server } from "http";
import { getEnvProfile } from "./env-profile";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.profile.get.path, async (_req, res) => {
    const profile = getEnvProfile();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  // const existingProfile = await storage.getProfile();
  //
  // const profileData = {
  //   USERNAME: "E F T ",
  //     // Database logic removed for static site. No database required.
  //   pronouns: "",
  //   banner: "/assets/profilebanner.jpg",
  //   avatar: {
  //     src: "/assets/album-cover.jpg",
  //   }
  // };
}
