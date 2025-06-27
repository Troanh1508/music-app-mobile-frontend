import { useLocalSearchParams } from 'expo-router';
import AlbumScreen from '../../../../components/AlbumScreen';
import ArtistScreen from '../../../../components/ArtistScreen';

export default function DetailPage() {
  const { type, id } = useLocalSearchParams();
  if (type === 'album') return <AlbumScreen id={id} />;
  if (type === 'artist') return <ArtistScreen id={id} />;
  return null;
}