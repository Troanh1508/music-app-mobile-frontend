import { View, Text, Pressable, FlatList, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMusicStore } from '../../../store/useMusicStore';
import { useState, useEffect, use } from 'react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';
import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images';
import { useNavigationSearch } from '@/hooks/useNavigationSearch';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { colors, fontSize } from '@/constants/tokens';
import { mapSongsToQueue } from '@/helpers/mapSongsToQueue';
import { AudioPro, useAudioPro } from 'react-native-audio-pro';
import COLORS from '@/constants/colors';

export default function Favorite() {

  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: 'Find in songs',
    },
  })

  const { fetchFavoriteSongs, favoriteSongs } = useMusicStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { queue, setQueue, currentIndex } = useAudioQueueStore();
  const { playingTrack, state } = useAudioPro();

  const loadData = async () => {
    try {
      setLoading(true);
      await fetchFavoriteSongs(user._id);

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);





  // console.log("Favorite songs: ", favoriteSongs);

  const renderSongItem = ({ item, index }) => {
    const isActiveTrack = item._id === queue[currentIndex]?.id;
    return (
      // <Link href={`(tabs)/(favorite)/album/${item.album._id}`}> 
      <Pressable
        onPress={() => {
          // Map favoriteSongs to audio sources for the queue
          const queue = mapSongsToQueue(favoriteSongs);
          setQueue(queue, index);
          AudioPro.play(queue[index]);// Set the queue and start playing from the clicked song
        }}
      >
        <View style={styles.trackItemContainer}>
          <View>
            <Image source={item.imageUrl ?? unknownTrackImageUri} style={{ ...styles.trackArtworkImage, opacity: isActiveTrack ? 0.6 : 1 }} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Track title + artist */}
            <View style={{ width: '100%' }}>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.trackTitleText,
                  color: isActiveTrack ? COLORS.primary : colors.text,
                }}
              >
                {item.title}
              </Text>

              {item.artist.name && (
                <Text numberOfLines={1} style={styles.trackArtistText}>
                  {item.artist.name}
                </Text>
              )}
            </View>


          </View>
        </View>
      </Pressable>
      // </Link>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await loadData();
    setRefreshing(false);
  };

  if (loading && !refreshing) return <ActivityIndicator />;


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
      <Text style={styles.pageHeader}>
        Favorites
      </Text>
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            data={favoriteSongs}
            renderItem={({ item, index }) => renderSongItem({ item, index })}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
            scrollEnabled={false}
          />
        </View>
      </View>




    </ScrollView>
  )
}

const styles = StyleSheet.create({
  trackItemContainer: {
    flexDirection: 'row',
    columnGap: 14,
    alignItems: 'center',
    paddingRight: 20,
  },
  trackPlayingIconIndicator: {
    position: 'absolute',
    top: 18,
    left: 16,
    width: 16,
    height: 16,
  },
  trackPausedIndicator: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  trackArtworkImage: {
    borderRadius: 8,
    width: 50,
    height: 50,
  },
  trackTitleText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    maxWidth: '90%',
  },
  trackArtistText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
})
