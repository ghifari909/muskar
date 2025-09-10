import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { searchSpotify } from "./spotify.js";
import {
  addSong,
  playNext,
  getNowPlaying,
  getQueue,
  forceSetNowPlaying,
  removeFromQueue,
} from "./queue.js";
import { ADMIN_KEY, PORT } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());

// simple health
app.get("/", (req, res) => res.send("Oskar Music server is up"));

// search route (frontend calls this)
app.get("/api/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Query required" });
  try {
    const results = await searchSpotify(q);
    res.json(results);
  } catch (e) {
    console.error("Spotify search error", e);
    res.status(500).json({ error: "Spotify search failed" });
  }
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true } });

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // send initial state
  socket.emit("now_playing", getNowPlaying());
  socket.emit("queue_updated", getQueue());

  // user adds song
  socket.on("add_song", (song) => {
    const ok = addSong(song);
    if (!ok) return socket.emit("error", { message: "Invalid song" });
    io.emit("queue_updated", getQueue());

    // if nothing playing -> start immediately
    if (!getNowPlaying()) {
      const np = playNext();
      io.emit("now_playing", np);
    }
  });

  // admin skip
  socket.on("skip_song", (data) => {
    if (!data || data.key !== ADMIN_KEY) {
      return socket.emit("error", { message: "Admin key salah" });
    }
    const np = playNext();
    io.emit("now_playing", np);
    io.emit("queue_updated", getQueue());
  });

  // admin remove from queue
  socket.on("remove_queue", (data) => {
    if (!data || data.key !== ADMIN_KEY) return socket.emit("error", { message: "Admin key salah" });
    const idx = data.index;
    const ok = removeFromQueue(idx);
    if (!ok) return socket.emit("error", { message: "Index invalid" });
    io.emit("queue_updated", getQueue());
  });

  // admin set now playing manually (force)
  socket.on("admin_set_now", (data) => {
    if (!data || data.key !== ADMIN_KEY) return socket.emit("error", { message: "Admin key salah" });
    const np = forceSetNowPlaying(data.song);
    io.emit("now_playing", np);
    io.emit("queue_updated", getQueue());
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => console.log(`Oskar Music server running on port ${PORT}`));