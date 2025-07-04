import { View, Text, ScrollView, FlatList, RefreshControl} from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { Entypo,Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
import { useMusicStore } from '@/store/useMusicStore';
import { useState, useEffect } from 'react';
import styles from '@/assets/styles/home.styles';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { colors, fontSize } from '@/constants/tokens';
import { mapSongsToQueue } from '@/helpers/mapSongsToQueue';
import { AudioPro, AudioProState, useAudioPro } from 'react-native-audio-pro';
import COLORS from '@/constants/colors';
import LoadingSpinner from '@/components/LoadingSpinner';
import SongListItem from './SongListItem';
import { favoriteStyles } from '@/assets/styles/favorite.styles';

export default function AlbumScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { fetchSongsInAlbum, songsInAlbum } = useMusicStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
      const [searchQuery, setSearchQuery] = useState('');
      const { queue, setQueue, currentIndex } = useAudioQueueStore();

    const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });}

    const loadData = async () => {
    try {
      setLoading(true);
      await fetchSongsInAlbum(id);

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

    const handleSongSelect = ({index}) => {
    const newQueue = mapSongsToQueue(songsInAlbum);
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
    
        <View style={{ flexDirection: "row", padding: 12 }}>
            <Ionicons
                onPress={() => router.back()}
                name="arrow-back"
                size={24}
                color="white"
            />
        </View>
        <View>
            <Text>AlbumPage for ID: {id}</Text>
        </View>
        {/* <Button
          title='Show toast'
          onPress={showToast}
        /> */}

        
        
    

        <View style={{ flex: 1 }}>
                  <FlatList
                    data={songsInAlbum}
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
                        <Text style={favoriteStyles.emptyContentText}>No favorite songs</Text>
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