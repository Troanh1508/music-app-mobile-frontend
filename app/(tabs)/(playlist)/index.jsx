import { View, Text, TextInput, Pressable, FlatList, ScrollView, StyleSheet, TouchableHighlight, RefreshControl, Modal } from 'react-native';
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons'
import { useMusicStore } from '@/store/useMusicStore';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/useAuthStore';
import { unknownArtistImageUri, unknownTrackImageUri } from '@/constants/images';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { colors, fontSize } from '@/constants/tokens';
import LoadingSpinner from '@/components/LoadingSpinner';
import { searchStyles } from '@/assets/styles/search.styles';
import { favoriteStyles } from '@/assets/styles/favorite.styles';
import { useRouter } from 'expo-router';
import { PlaylistShortcutsMenu } from '@/components/PlaylistShortcutsMenu';
import { StopPropagation } from '@/components/utils/StopPropagation';

export default function Playlist() {

    const { createPlaylist, fetchPlaylists, playlists } = useMusicStore();
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { queue, setQueue, currentIndex } = useAudioQueueStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const router = useRouter();


    const filteredPlaylists = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onRefresh = async () => {
        setRefreshing(true);
        // await sleep(2000);
        await loadData();
        setRefreshing(false);
    };

    const loadData = async () => {
        try {
            setLoading(true);
            await fetchPlaylists(user._id);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const renderPlaylistItem = ({ item }) => (
        <TouchableHighlight
            activeOpacity={0.8}
            underlayColor="#111"
            onPress={() => { router.push(`/${item._id}`); }}
        >
            <View style={styles.playlistItemContainer}>
                <Text numberOfLines={1} style={[styles.playlistNameText, { flex: 1 }]}>
                    {item.name}
                </Text>
                <StopPropagation>
                    <PlaylistShortcutsMenu playlist={item}>
                        <Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
                    </PlaylistShortcutsMenu>
                </StopPropagation>
            </View>
        </TouchableHighlight>
    );

    const ItemDivider = () => (
        <View style={{ ...favoriteStyles.itemSeparator, marginVertical: 9 }} />
    )

    if (loading && !refreshing) return <LoadingSpinner message="Loading..." />;


    return (
        <>
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
                <View style={styles.headerRow}>


                    <Text style={favoriteStyles.pageHeader}>
                        Playlists
                    </Text>
                    <Pressable
                        style={styles.createButton}
                        onPress={() => setShowCreateModal(true)}
                    >
                        <Text style={styles.createButtonText}>+ New Playlist</Text>
                    </Pressable>
                </View>
                <View style={{ paddingVertical: 20 }}>
                    <View style={searchStyles.searchContainer}>
                        <Ionicons
                            name="search"
                            size={20}
                            color={colors.textMuted}
                            style={searchStyles.searchIcon}
                        />
                        <TextInput
                            style={searchStyles.searchInput}
                            placeholder="Find in Playlists"
                            placeholderTextColor={colors.textMuted}
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                            }}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery("")} style={searchStyles.clearButton}>
                                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                            </Pressable>
                        )}
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <FlatList
                        data={filteredPlaylists}
                        renderItem={renderPlaylistItem}
                        keyExtractor={(item) => item._id}
                        ItemSeparatorComponent={ItemDivider}
                        ListFooterComponent={ItemDivider}
                        ListEmptyComponent={
                            <View>
                                <Text style={favoriteStyles.emptyContentText}>No Playlists</Text>
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
            <Modal
                transparent
                visible={showCreateModal}
                animationType="fade"
                onRequestClose={() => setShowCreateModal(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Create New Playlist</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Playlist name"
                            placeholderTextColor="#999"
                            value={newPlaylistName}
                            onChangeText={setNewPlaylistName}
                        />
                        <View style={styles.modalActions}>
                            <Pressable onPress={() => setShowCreateModal(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={async () => {
                                    if (!newPlaylistName.trim()) return;
                                    try {
                                        await createPlaylist(newPlaylistName, user._id);
                                        await fetchPlaylists(user._id);
                                        setShowCreateModal(false);
                                        setNewPlaylistName('');
                                    } catch (err) {
                                        Alert.alert('Error', err.message);
                                    }
                                }}
                            >
                                <Text style={styles.saveText}>Create</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    playlistItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    playlistArtworkImage: {
        borderRadius: 8,
        width: 70,
        height: 70,
    },
    playlistNameText: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '600',
        maxWidth: '100%',
    },
    createButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center', // center horizontally
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#222',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20,
    },
    cancelText: { color: 'gray', fontSize: 16 },
    saveText: { color: 'dodgerblue', fontSize: 16 },
    createButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    }
})
