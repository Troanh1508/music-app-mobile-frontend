import { View, Text, FlatList, ScrollView, RefreshControl, Pressable } from 'react-native';
import { homeStyles } from '@/assets/styles/home.styles';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { useMusicStore } from '@/store/useMusicStore';
import { useRouter} from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import LoadingSpinner from '@/components/LoadingSpinner';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { fetchSongs, songs, albums, fetchAlbums, artists, fetchArtists } = useMusicStore();
    const { user } = useAuthStore(); // <-- get user from auth store
    const router = useRouter();

    const loadData = async () => {
        try {
            setLoading(true);
            await fetchSongs();
            await fetchAlbums();
            await fetchArtists();

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
        <View style={homeStyles.Card}>
            <Pressable onPress={() => {
                if (item.album && item.album._id) {
                    router.push(`(tabs)/(home)/album/${item.album._id}`);
                } else {
                    router.push(`(tabs)/(home)/single/${item._id}`); // Custom screen for singles/no album
                }
            }}
        >
            
                <Image source={item.imageUrl} style={homeStyles.Image} />
                <View>
                    <Text numberOfLines={1} style={homeStyles.Title}>
                        {item.title}
                    </Text>
                </View>
            
            </Pressable>
            <Text numberOfLines={1} style={homeStyles.caption}>
                {item.artist.name}
            </Text>
        </View>
    );

    const renderAlbumItem = ({ item }) => (
        <View style={homeStyles.Card}>
            <Pressable onPress={() => { router.push(`/album/${item._id}`);}}>
                <Image source={item.imageUrl} style={homeStyles.Image} />
                <View>
                    <Text numberOfLines={1} style={homeStyles.Title}>
                        {item.title}
                    </Text>
                </View>
            </Pressable>
            <Text numberOfLines={1} style={homeStyles.caption}>
                {item.artist.name}
            </Text>
        </View>
    );

    const renderArtistItem = ({ item }) => (
        <View style={homeStyles.Card}>
            <Pressable onPress={() => { router.push(`/artist/${item._id}`); }}>
                <Image source={item.imageUrl} style={homeStyles.ArtistImage} />
                <View>
                    <Text numberOfLines={1} style={{ ...homeStyles.Title, textAlign: 'center' }}>
                        {item.name}
                    </Text>
                </View>
            </Pressable>
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
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 135 }}
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
                        marginLeft: 15,
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
                <Text style={{ ...homeStyles.headerTitle, marginLeft: 15, marginTop: 20 }}>
                    New Songs
                </Text>
                <View style={homeStyles.container}>
                    <FlatList
                        data={songs}
                        renderItem={renderSongItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={homeStyles.listContainer}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <Text style={{ ...homeStyles.headerTitle, marginLeft: 15 }}>
                    New Albums
                </Text>
                <View style={homeStyles.container}>
                    <FlatList
                        data={albums}
                        renderItem={renderAlbumItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={homeStyles.listContainer}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <Text style={{ ...homeStyles.headerTitle, marginLeft: 15 }}>
                    New Artists
                </Text>

                <View style={homeStyles.container}>
                    <FlatList
                        data={artists}
                        renderItem={renderArtistItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={homeStyles.listContainer}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

            </View>
        </ScrollView>


    );
};