import dotenv from "dotenv";
dotenv.config();

export const SPOTIFY_CONFIG = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
};

export const ADMIN_KEY = process.env.ADMIN_KEY;
export const PORT = process.env.PORT || 3001;