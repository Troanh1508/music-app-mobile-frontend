import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images';

export function mapSongsToQueue(songs) {
  return songs.map(song => ({
    id: song._id,
    url: song.audioUrl,
    title: song.title,
    artwork: song.imageUrl ?? unknownTrackImageUri,
    artist: song.artist.name,
    album: song.album?.title ?? "Single",
    // add other fields as needed
  }));
}