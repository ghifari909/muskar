import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Player from "../components/Player";
import Queue from "../components/Queue";
import SearchBox from "../components/SearchBox";
import AdminControls from "../components/AdminControls";
import socket from "../utils/socket";

export default function Home() {
  const [song, setSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on("now_playing", (data) => setSong(data));
    socket.on("queue_updated", (q) => setQueue(q));
    socket.on("error", (e) => setError(e.message || e));

    return () => {
      socket.off("now_playing");
      socket.off("queue_updated");
      socket.off("error");
    };
  }, []);

  return (
    <Layout>
      <div className="relative">
        <AdminControls />
        <h1 className="text-3xl font-extrabold mb-6">OSKAR MUSIC</h1>

        {error && <div className="mb-4 text-red-400">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Player song={song} />
            <SearchBox />
          </div>

          <div>
            <Queue queue={queue} />
          </div>
        </div>
      </div>
    </Layout>
  );
}