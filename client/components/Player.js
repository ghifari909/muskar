import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function Player({ song }) {
  const playerRef = useRef();
  const [seekTo, setSeekTo] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!song) return;
    // compute offset seconds
    const offset = (Date.now() - song.startTime) / 1000;
    setSeekTo(Math.max(0, Math.floor(offset)));
  }, [song]);

  if (!song) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900">
        <h3 className="text-xl font-semibold">Tidak ada lagu diputar</h3>
        <p className="text-sm text-gray-300">Tambahkan lagu lewat search.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-lg">
      <div className="flex items-center gap-4">
        <img src={song.image || '/placeholder.png'} alt="cover" className="w-20 h-20 rounded-md object-cover shadow-md"/>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{song.title}</h2>
          <p className="text-sm text-gray-200">{song.artist} — {song.album}</p>
          <div className="mt-3">
            <ReactPlayer
              ref={playerRef}
              url={song.preview || song.url}
              playing={true}
              controls={true}
              width="100%"
              height="60px"
              config={{
                youtube: { playerVars: { start: seekTo } },
                file: { attributes: { controlsList: "nodownload" } },
              }}
              onReady={() => setReady(true)}
            />
          </div>
          <p className="text-xs text-gray-300 mt-2">Offset: {seekTo}s</p>
        </div>
      </div>
    </div>
  );
}