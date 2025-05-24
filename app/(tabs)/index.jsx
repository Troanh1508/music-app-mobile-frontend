import { View, Text, FlatList } from 'react-native';
import styles from '../../assets/styles/home.styles';
import { useState, useEffect, use } from 'react';
import { Image } from 'expo-image';
import { useMusicStore } from '../../store/useMusicStore';
import { Link } from 'expo-router';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const {fetchSongs, songs} = useMusicStore();
    
    
    useEffect(() => {
        fetchSongs();
    }, []);

    const renderSongItem = ({ item }) => (
        <View style={styles.Card}>
                <Link href={`(tabs)/album/${item.album._id}`}>
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

  return (
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
  );
};