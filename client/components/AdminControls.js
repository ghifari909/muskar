import { useEffect, useState } from "react";
import socket from "../utils/socket";

export default function AdminControls() {
  const [showInput, setShowInput] = useState(false);
  const [key, setKey] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("oskar_admin_key");
    if (saved) setIsAdmin(true);
  }, []);

  function handleLogin() {
    if (!key) return;
    localStorage.setItem("oskar_admin_key", key);
    setIsAdmin(true);
    setShowInput(false);
  }

  function skipSong() {
    const adminKey = localStorage.getItem("oskar_admin_key");
    socket.emit("skip_song", { key: adminKey });
  }

  function removeAt(i) {
    const adminKey = localStorage.getItem("oskar_admin_key");
    socket.emit("remove_queue", { key: adminKey, index: i });
  }

  return (
    <div className="absolute top-6 right-6 z-50">
      {!isAdmin ? (
        <div>
          <button onClick={() => setShowInput(!showInput)} className="bg-white/10 p-3 rounded-full">🔑</button>
          {showInput && (
            <div className="mt-2 p-3 bg-white/5 rounded shadow-lg w-64">
              <input value={key} onChange={(e)=>setKey(e.target.value)} type="password" placeholder="Masukkan admin key" className="w-full p-2 rounded text-black" />
              <div className="mt-2 flex gap-2">
                <button onClick={handleLogin} className="bg-green-400 px-3 py-1 rounded w-full">Masuk</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2 items-center bg-white/5 p-2 rounded">
          <button onClick={skipSong} className="px-3 py-1 bg-yellow-400 rounded">⏭ Skip</button>
          <button onClick={() => { localStorage.removeItem('oskar_admin_key'); setIsAdmin(false); }} className="px-2 py-1 bg-red-500 rounded">Logout</button>
        </div>
      )}
    </div>
  );
}