export function mapSongsToQueue(songs) {
  return songs.map(song => ({
    id: song._id,
    url: song.audioUrl,
    title: song.title,
    artwork: song.imageUrl,
    artist: song.artist.name,
    album: song.album.title,
    // add other fields as needed
  }));
}