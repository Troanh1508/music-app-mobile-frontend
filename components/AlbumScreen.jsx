import { View, Text, ScrollView, FlatList} from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
import { useMusicStore } from '../store/useMusicStore';
import { useEffect } from 'react';
import styles from '../assets/styles/home.styles';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';


export default function AlbumScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { fetchSongsInAlbum, songsInAlbum } = useMusicStore();

    const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });}

    useEffect(() => {
            fetchSongsInAlbum(id);
        }, []);

    const renderSongItem = ({ item }) => (
        <View style={styles.Card}>
                <Image source={item.imageUrl } style={styles.Image}/>
                <Text style={styles.Title}>
                    {item.title} 
                </Text>
                <Text style={styles.caption}>
                    {item.artist.name}
                </Text>
        </View>
    );

  return (
    // <ScrollView>
    <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", padding: 12 }}>
            <Ionicons
                onPress={() => router.back()}
                name="arrow-back"
                size={24}
                color="black"
            />
        </View>
        <View>
            <Text>AlbumPage for ID: {id}</Text>
        </View>
        {/* <Button
          title='Show toast'
          onPress={showToast}
        /> */}

        
        
    {/* </ScrollView> */}

        <View style={ styles.container }>
          <FlatList
          data={songsInAlbum}
          renderItem={renderSongItem}
          keyExtractor={(item) => item._id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          />
        </View>
    </View>
  )
}