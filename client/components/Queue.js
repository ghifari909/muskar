export default function Queue({ queue }) {
  return (
    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700">
      <h3 className="font-bold text-lg mb-3">Antrian</h3>
      {queue.length === 0 ? (
        <p className="text-sm text-gray-300">Kosong — tambahkan lagu via search.</p>
      ) : (
        <ol className="list-decimal list-inside space-y-2">
          {queue.map((q, i) => (
            <li key={q.id} className="flex items-center gap-3">
              <img src={q.image || '/placeholder.png'} alt="cover" className="w-10 h-10 rounded" />
              <div className="flex-1">
                <div className="font-medium">{q.title}</div>
                <div className="text-xs text-gray-300">{q.artist}</div>
              </div>
              <div className="text-sm text-gray-400">{Math.ceil((q.duration_ms||30000)/1000)}s</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}