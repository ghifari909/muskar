import { useState } from "react";
import socket from "../utils/socket";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'}/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function addSong(song) {
    // we send a compact song object
    socket.emit("add_song", song);
  }

  return (
    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-700 to-slate-600">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Cari lagu atau judul..."
          className="flex-1 p-2 rounded text-black"
        />
        <button onClick={handleSearch} className="bg-green-400 px-4 py-2 rounded font-semibold">{loading? 'Mencari...' : 'Cari'}</button>
      </div>

      <ul className="mt-4 space-y-3">
        {results.map((r) => (
          <li key={r.id} className="flex items-center gap-3 bg-white/5 p-3 rounded">
            <img src={r.image || '/placeholder.png'} alt="cover" className="w-12 h-12 rounded" />
            <div className="flex-1">
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-gray-300">{r.artist}</div>
            </div>
            <button onClick={() => addSong(r)} className="bg-blue-500 px-3 py-1 rounded">➕ Tambah</button>
          </li>
        ))}
      </ul>
    </div>
  );
}