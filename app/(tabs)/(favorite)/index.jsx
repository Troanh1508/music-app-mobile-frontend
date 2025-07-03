import { View, Text, TextInput, Pressable, FlatList, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, Ionicons } from '@expo/vector-icons'
import { useMusicStore } from '@/store/useMusicStore';
import { useState, useEffect, use } from 'react';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/useAuthStore';
import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { colors, fontSize } from '@/constants/tokens';
import { mapSongsToQueue } from '@/helpers/mapSongsToQueue';
import { AudioPro, AudioProState, useAudioPro } from 'react-native-audio-pro';
import COLORS from '@/constants/colors';
import LoadingSpinner from '@/components/LoadingSpinner';
import { LoaderKitView, } from 'react-native-loader-kit';
import { SongShortcutsMenu } from '@/components/SongShortcutsMenu';
import { StopPropagation } from '@/components/utils/StopPropagation';
import { searchStyles } from '@/assets/styles/search.styles';


export default function Favorite() {


  const { fetchFavoriteSongs, favoriteSongs } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { queue, setQueue, currentIndex } = useAudioQueueStore();
  const { playingTrack, state } = useAudioPro();

  const filteredSongs = favoriteSongs.filter(song =>
  song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (song.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
);

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

  const ItemDivider = () => (
    <View style={{ ...styles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
  )





  // console.log("Favorite songs: ", favoriteSongs);

  const renderSongItem = ({ item, index }) => {
    const isActiveTrack = item._id === queue[currentIndex]?.id;
    return (
      // <Link href={`(tabs)/(favorite)/album/${item.album._id}`}> 
      <Pressable
        onPress={() => {
          
          const queue = mapSongsToQueue(filteredSongs);
          setQueue(queue, index);
          AudioPro.play(queue[index]);// Set the queue and start playing from the clicked song
        }}
      >

        <View style={styles.trackItemContainer}>
          <View>
            <Image source={item.imageUrl ?? unknownTrackImageUri} style={{ ...styles.trackArtworkImage, }} />
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
            <View style={{
              width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  {isActiveTrack &&
                    ((state === AudioProState.PLAYING) ? (
                      <LoaderKitView
                        style={{ width: 20, height: 20 }}
                        name={'AudioEqualizer'}
                        color={COLORS.primary}
                      />
                    ) : (
                      null
                    ))}
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.trackTitleText,
                      color: isActiveTrack ? COLORS.primary : colors.text,
                      flex: 1,
                    }}
                  >
                    {item.title}
                  </Text>

                </View>

                {item.artist.name && (
                  <Text numberOfLines={1} style={styles.trackArtistText}>
                    {item.artist.name}
                  </Text>
                )}
              </View>


              <StopPropagation>
                <SongShortcutsMenu song={item}>
                  <Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
                </SongShortcutsMenu>
              </StopPropagation>

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
      <Text style={styles.pageHeader}>
        Liked Songs
      </Text>
      <View style={{ paddingVertical: 20 }}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textMuted}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Find in Liked Songs"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
            }}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} style={searchStyles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            data={filteredSongs}
            renderItem={({ item, index }) => renderSongItem({ item, index })}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={ItemDivider}
            ListFooterComponent={ItemDivider}
            ListEmptyComponent={
              <View>
                <Text style={styles.emptyContentText}>No favorite songs</Text>

                <Image
                  source={unknownTrackImageUri}
                  style={styles.emptyContentImage}
                />
              </View>
            }
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
  itemSeparator: {
    borderColor: colors.textMuted,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.3,
  },
  emptyContentText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
  pageHeader: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 25

  }
})
