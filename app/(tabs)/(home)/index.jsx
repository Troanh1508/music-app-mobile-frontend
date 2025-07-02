import { View, Text, FlatList, ScrollView, Pressable, RefreshControl} from 'react-native';
import styles from '../../../assets/styles/home.styles';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { useMusicStore } from '../../../store/useMusicStore';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../../store/useAuthStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingSpinner from '@/components/LoadingSpinner';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { fetchSongs, songs, albums, fetchAlbums } = useMusicStore();
    const { user } = useAuthStore(); // <-- get user from auth store


    const loadData = async () => {
        try {
            setLoading(true);
            await fetchSongs();
            await fetchAlbums();

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    const renderSongItem = ({ item }) => (
        <View style={styles.Card}>
            <Link href={`(tabs)/(home)/album/${item.album._id}`}>
                <Image source={item.imageUrl} style={styles.Image} />
                <Text numberOfLines={1} style={styles.Title}>
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
                <Image source={item.imageUrl} style={styles.Image} />
                <Text style={styles.Title}>
                    {item.title}
                </Text>
            </Link>
            <Text style={styles.caption}>
                {item.artist.name}
            </Text>
        </View>
    );

    

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

    const onRefresh = async () => {
        setRefreshing(true);
        // await sleep(2000);
        await loadData();
        setRefreshing(false);
    };
    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "white" }}>Loading...</Text>
            </View>
        );
    }

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

            <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>
                    New Songs
                </Text>
                <View style={styles.container}>
                    <FlatList
                        data={songs}
                        renderItem={renderSongItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContainer}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <Text style={styles.headerTitle}>
                    New Albums
                </Text>
                <View style={styles.container}>
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