import { View, Text, FlatList } from 'react-native';
import styles from '../../assets/styles/home.styles';
import { useState, useEffect, use } from 'react';
import { Image } from 'expo-image';
import { useMusicStore } from '../../store/musicStore';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const {fetchSongs, songs} = useMusicStore();
    
    
    useEffect(() => {
        fetchSongs();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.songCard}>
                <Image source={item.imageUrl } style={styles.songImage}/>
                <Text style={styles.songTitle}>
                     {item.title} 
                </Text>
                <Text style={styles.caption}>
                    {item.artist.name}
                </Text>
        </View>
    );

  return (
    <View style={ styles.container }>
        <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        />
        
    </View>
  );
};