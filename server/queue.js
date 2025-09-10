let nowPlaying = null; // { id, title, artist, preview, startTime }
let queue = [];

export function addSong(song) {
  // minimal validation
  if (!song || !song.id) return false;
  queue.push(song);
  return true;
}

export function playNext() {
  const next = queue.shift() || null;
  if (!next) {
    nowPlaying = null;
    return null;
  }
  nowPlaying = { ...next, startTime: Date.now() };
  return nowPlaying;
}

export function getNowPlaying() {
  return nowPlaying;
}

export function getQueue() {
  return queue;
}

export function forceSetNowPlaying(song) {
  nowPlaying = { ...song, startTime: Date.now() };
  return nowPlaying;
}

export function removeFromQueue(index) {
  if (index < 0 || index >= queue.length) return false;
  queue.splice(index, 1);
  return true;
}