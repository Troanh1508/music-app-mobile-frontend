import { View, Text, ScrollView, FlatList, RefreshControl, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMusicStore } from '@/store/useMusicStore';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { mapSongsToQueue } from '@/helpers/mapSongsToQueue';
import { AudioPro, } from 'react-native-audio-pro';
import LoadingSpinner from '@/components/LoadingSpinner';
import SongListItem from '@/components/SongListItem';
import { favoriteStyles } from '@/assets/styles/favorite.styles';


export default function SingleScreen() {

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { fetchSongById, songById } = useMusicStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { queue, setQueue, currentIndex } = useAudioQueueStore();

    const loadData = async () => {
    try {
      setLoading(true);
      await fetchSongById(id);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ItemDivider = () => (
    <View style={{ ...favoriteStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
  )
  const singleArray = [songById];
  const handleSongSelect = ({ index }) => {
      const newQueue = mapSongsToQueue(singleArray);
      setQueue(newQueue, index);
      AudioPro.play(newQueue[index]);
    }
  
    const onRefresh = async () => {
      setRefreshing(true);
      // await sleep(2000);
      await loadData();
      setRefreshing(false);
    };
  
    if (loading && !refreshing) return <LoadingSpinner message="Loading..." />;

  return (
    <ScrollView style={{ backgroundColor: "black", flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"white"}
            />
          }
        >
    
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              onPress={() => router.back()}
              name="arrow-back"
              size={24}
              color="white"
            />
          </View>
    
          <View
            style={{
    
              alignItems: "center",
            }}
          >
            <Image
              source={songById.imageUrl}
              style={{ width: 200, height: 200, borderRadius: 4 }}
            />
          </View>
          <View style={{ flex: 1, marginVertical: 15 }}>
    
            
            <Text numberOfLines={2} style={styles.title}>
              {songById.title || "unknown title" }
            </Text>
    
            
              <Text numberOfLines={2} style={[styles.artist, { marginTop: 6 }]}>
                {songById.artist?.name || songById.artist || "unknown artist"}
              </Text>
            
            <Text style={[styles.release, ]}>
              Single
            </Text>
    
          </View>
    
    
    
            
          <View style={{ flex: 1 }}>
            <SongListItem
                  song={songById}
                  index={0}
                  onSongSelect={handleSongSelect}
                />
              <ItemDivider/>

          </View>
    
        </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: '#000' },
  loadingContainer: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artwork: { width: '100%', height: '100%', borderRadius: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  artist: { color: '#aaa', fontSize: 16, fontWeight: 400 },
  release: { color: '#aaa', fontSize: 12, fontWeight: 400, marginTop: 6 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  artworkImageContainer: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 11.0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: '45%',
  },
});
