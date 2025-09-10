import fetch from "node-fetch";
import { SPOTIFY_CONFIG } from "./config.js";

let accessToken = null;
let tokenExpiry = 0;

async function refreshToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(SPOTIFY_CONFIG.clientId + ":" + SPOTIFY_CONFIG.clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data));
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000 - 5000; // refresh sedikit lebih awal
}

export async function getToken() {
  if (!accessToken || Date.now() > tokenExpiry) {
    await refreshToken();
  }
  return accessToken;
}

export async function searchSpotify(query) {
  const token = await getToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&limit=10`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  if (!data.tracks) return [];
  return data.tracks.items.map((track) => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    url: track.external_urls.spotify,
    preview: track.preview_url, // 30s preview (may be null for some tracks)
    duration_ms: track.duration_ms,
    album: track.album.name,
    image: track.album.images && track.album.images[0] ? track.album.images[0].url : null,
  }));
}