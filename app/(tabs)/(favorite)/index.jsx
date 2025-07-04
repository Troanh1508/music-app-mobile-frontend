import { View, Text, TextInput, Pressable, FlatList, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons'
import { useMusicStore } from '@/store/useMusicStore';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/useAuthStore';
import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { colors, fontSize } from '@/constants/tokens';
import { mapSongsToQueue } from '@/helpers/mapSongsToQueue';
import { AudioPro } from 'react-native-audio-pro';
import LoadingSpinner from '@/components/LoadingSpinner';
import { searchStyles } from '@/assets/styles/search.styles';
import { favoriteStyles } from '@/assets/styles/favorite.styles';
import SongListItem from '@/components/SongListItem';


export default function Favorite() {


  const { fetchFavoriteSongs, favoriteSongs } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { queue, setQueue, currentIndex } = useAudioQueueStore();

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
    <View style={{ ...favoriteStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
  )

  // console.log("Favorite songs: ", favoriteSongs);

  const handleSongSelect = ({index}) => {
    const newQueue = mapSongsToQueue(filteredSongs);
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
      <Text style={favoriteStyles.pageHeader}>
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
          <FlatList
            data={filteredSongs}
            renderItem={({ item, index }) => (
              <SongListItem
                song={item}
                index={index}
                onSongSelect={handleSongSelect}
              />
            )}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={ItemDivider}
            ListFooterComponent={ItemDivider}
            ListEmptyComponent={
              <View>
                <Text style={favoriteStyles.emptyContentText}>No Songs</Text>
                <Image
                  source={unknownTrackImageUri}
                  style={favoriteStyles.emptyContentImage}
                />
              </View>
            }
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
            scrollEnabled={false}
          />
      </View>




    </ScrollView>
  )
}
