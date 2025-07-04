import { View, Text, ScrollView, FlatList, RefreshControl, StyleSheet, Pressable, Dimensions } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMusicStore } from '@/store/useMusicStore';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { colors, fontSize } from '@/constants/tokens';
import { mapSongsToQueue } from '@/helpers/mapSongsToQueue';
import { AudioPro, AudioProState, useAudioPro } from 'react-native-audio-pro';
import COLORS from '@/constants/colors';
import LoadingSpinner from '@/components/LoadingSpinner';
import SongListItem from '@/components/SongListItem';
import { favoriteStyles } from '@/assets/styles/favorite.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { homeStyles } from '@/assets/styles/home.styles';


export default function ArtistScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { songsByArtist, fetchSongsByArtist, albumsByArtist, fetchAlbumsByArtist, fetchArtistById, artist } = useMusicStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { queue, setQueue, currentIndex } = useAudioQueueStore();
    const { top, bottom } = useSafeAreaInsets();

    const windowWidth = Dimensions.get('window').width;

    const loadData = async () => {
        try {
            setLoading(true);
            await fetchArtistById(id);
            await fetchAlbumsByArtist(id);
            await fetchSongsByArtist(id);


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

    const handleSongSelect = ({ index }) => {
        const newQueue = mapSongsToQueue(songsByArtist);
        setQueue(newQueue, index);
        AudioPro.play(newQueue[index]);
    }

    const renderAlbumItem = ({ item }) => (
        <View style={homeStyles.Card}>
            <Pressable onPress={() => { router.push(`/album/${item._id}`); }}>
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

    const onRefresh = async () => {
        setRefreshing(true);
        // await sleep(2000);
        await loadData();
        setRefreshing(false);
    };

    if (loading && !refreshing) return <LoadingSpinner message="Loading..." />;

    return (
        <ScrollView style={{ backgroundColor: "black", flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={"white"}
                />
            }>

            {/* Image wrapper with absolute-positioned back icon */}
            <View style={{ position: 'relative' }}>
                <Image
                    source={artist.imageUrl}
                    style={{
                        width: windowWidth,
                        height: 200,
                        contentFit: 'cover',
                    }}
                />
                <Ionicons
                    name="arrow-back"
                    size={20}
                    color="white"
                    onPress={() => router.back()}
                    style={{
                        position: 'absolute',
                        top: top,
                        left: 20,
                        zIndex: 1,
                    }}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 100, // fade height
                    }}
                />
                <Text
                    numberOfLines={1}
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 16,
                        color: '#fff',
                        fontSize: 26,
                        fontWeight: 'bold',
                    }}
                >
                    {artist.name || 'unknown artist'}
                </Text>
                <View>

                </View>
            </View>
            <View style={{ flex:1, paddingHorizontal: 20, paddingTop: 16 }}>
                <Text style={{ ...homeStyles.headerTitle }}>
                    Albums
                </Text>
                <View style={homeStyles.container}>
                    <FlatList
                        data={albumsByArtist}
                        renderItem={renderAlbumItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={homeStyles.listContainer}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <Text style={{ ...homeStyles.headerTitle }}>
                    Songs
                </Text>

                
                        <FlatList
                          data={songsByArtist}
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

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, backgroundColor: '#000' },
    loadingContainer: {
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    artwork: { width: '100%', height: '100%', borderRadius: 12 },
    title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    artist: { color: '#aaa', fontSize: 16 },
    controls: { flexDirection: 'row', alignItems: 'center', gap: 32 },
    artworkImageContainer: {
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 11.0,
        flexDirection: 'row',
        justifyContent: 'center',
        height: '45%',
    },
});
