import { View, Text, Pressable, FlatList, ScrollView, StyleSheet } from 'react-native';
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


export default function Favorite() {

  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: 'Find in songs',
    },
  })

  const { fetchFavoriteSongs, favoriteSongs } = useMusicStore();

  const { user } = useAuthStore(); // <-- get user from auth store
  // console.log("User in Favorite tab: ", user);

  useEffect(() => {
    fetchFavoriteSongs(user._id);
  }, []);

  const { setQueue, currentIndex } = useAudioQueueStore();

  

  // console.log("Favorite songs: ", favoriteSongs);

  const renderSongItem = ({ item, index }) => {
    const isActiveTrack = currentIndex === index;
    return (
    // <Link href={`(tabs)/(favorite)/album/${item.album._id}`}> 
    <Pressable
      onPress={() => {
        // Map favoriteSongs to audio sources for the queue
        const queue = favoriteSongs.map(song => ({
          uri: song.audioUrl,
          title: song.title,
          artist: song.artist, // or song.artist.name if populated
          imageUrl: song.imageUrl,
          duration: song.duration,
          // add other fields as needed
        }));
        setQueue(queue, index);
      }}
    >
      <View style={styles.trackItemContainer}>
        <View>
          <Image source={item.imageUrl ?? unknownTrackImageUri} style={{...styles.trackArtworkImage, opacity: isActiveTrack ? 0.6 : 1}}/>
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
								color: isActiveTrack ? colors.primary : colors.text,
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


  return (
    <ScrollView style={{ backgroundColor: "black", flex: 1 }} contentContainerStyle={{ padding: 20 }}>
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
