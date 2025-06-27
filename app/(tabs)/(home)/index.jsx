import { View, Text, FlatList, ScrollView, Pressable } from 'react-native';
import styles from '../../../assets/styles/home.styles';
import { useState, useEffect, use } from 'react';
import { Image } from 'expo-image';
import { useMusicStore } from '../../../store/useMusicStore';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../../store/useAuthStore';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const {fetchSongs, songs, albums, fetchAlbums} = useMusicStore();
    const { user } = useAuthStore(); // <-- get user from auth store

    
    
    
    useEffect(() => {
        fetchSongs(), fetchAlbums();
    }, []);

    const renderSongItem = ({ item }) => (
        <View style={styles.Card}>
                <Link href={`(tabs)/(home)/album/${item.album._id}`}>
                    <Image source={item.imageUrl } style={styles.Image}/>
                    <Text style={styles.Title}>
                        {item.title} 
                    </Text>
                </Link>
                <Text style={styles.caption}>
                    {item.artist.name}
                </Text>
        </View>
    );

    const renderAlbumItem = ({ item }) => (
        <View style={styles.Card}>
            <Link href={`(tabs)/(home)/album/${item._id}`}>
                <Image source={item.imageUrl } style={styles.Image}/>
                <Text style={styles.Title}>
                    {item.title} 
                </Text>
            </Link>
            <Text style={styles.caption}>
                {item.artist.name}
            </Text>
        </View>
    );

    if (!user) {
    return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white" }}>Loading...</Text>
            </View>
        );
    }

    const greetingMessage = () => {
        const currentTime = new Date().getHours();
        if (currentTime < 12) {
        return "Good Morning";
        } else if (currentTime < 18) {
        return "Good Afternoon";
        } else {
        return "Good Evening";
        }
    };
    const message = greetingMessage();

  return (
  
        <ScrollView style={{ backgroundColor: "black", flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    contentFit: "cover",
                }}
                source={{ uri: user.profileImage }}
                />
                <Text
                style={{
                    marginLeft: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                }}
                >
                {message}
                </Text>
            </View>

            <View style = {{ flex: 1}}>
                <View style={ styles.container }>
                    <FlatList
                    data={songs}
                    renderItem={renderSongItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    />
                </View>

                <Text style={ styles.headerTitle }>
                    New Albums
                </Text>
                <View style={ styles.container }>
                    <FlatList
                    data={albums}
                    renderItem={renderAlbumItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    />
                </View>
                
          </View>
        </ScrollView>

    
  );
};