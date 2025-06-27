import unknownArtistImage from '@/assets/images/unknown_artist.png'
import unknownSongImage from '@/assets/images/unknown_song.png'
import { Image } from 'react-native'

export const unknownTrackImageUri = Image.resolveAssetSource(unknownSongImage).uri
export const unknownArtistImageUri = Image.resolveAssetSource(unknownArtistImage).uri
