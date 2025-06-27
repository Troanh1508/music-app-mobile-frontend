import { View, Text, Pressable, FlatList, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMusicStore } from '../../../store/useMusicStore';
import { useState, useEffect, use } from 'react';
import styles from '../../../assets/styles/home.styles';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';
import { unknownArtistImageUri } from '@/constants/images';
import { useNavigationSearch } from '@/hooks/useNavigationSearch';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';


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

  const { setQueue } = useAudioQueueStore();

  // console.log("Favorite songs: ", favoriteSongs);

  const renderSongItem = ({ item, index }) => (
        <View style={styles.Card}>
                {/* <Link href={`(tabs)/(favorite)/album/${item.album._id}`}> */}
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
                  style={styles.Card}
                >
                    <Image source={item.imageUrl } style={styles.Image}/>
                    <Text style={styles.Title}>
                        {item.title} 
                    </Text>
                {/* </Link> */}
                </Pressable>
                <Text style={styles.caption}>
                    {item.artist.name}
                </Text>
        </View>
    );
  

  return (
    <ScrollView style={{ backgroundColor: "black", flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Text style= {styles.pageHeader}>
        Favorites
      </Text>
      {/* <View>
        <Pressable style={{ margin: 10, flexDirection: 'row', alignItems: 'center' }}>
          <LinearGradient colors={['#33006F' , '#FFFFFF']} style={{ flex: 1, padding: 20, borderRadius: 10 }}
                           start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="heart" size={24} color="white" />
              <Text style={{ marginLeft: 10, color: 'white', fontSize: 18 }}>Liked Songs</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View> */}
      <View style = {{ flex: 1}}>
        <View style={ styles.container }>
            <FlatList
            data={favoriteSongs}
            renderItem={({ item, index }) => renderSongItem({ item, index })}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            />
        </View>
      </View>

      

      
    </ScrollView>
  )
}