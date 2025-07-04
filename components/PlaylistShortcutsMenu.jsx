import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'
import { useMusicStore } from '@/store/useMusicStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export const PlaylistShortcutsMenu = ({ playlist, children }) => {
    const router = useRouter()
    const { user } = useAuthStore();
    const { deletePlaylist, fetchPlaylists, updatePlaylist } = useMusicStore();
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [newName, setNewName] = useState('');

    const handlePressAction = async (id) => {
        switch (id) {
            case 'delete-playlist':
                Alert.alert(
                    'Confirm Delete',
                    'Are you sure you want to delete this playlist?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                                try {
                                    await deletePlaylist(playlist._id)
                                    await fetchPlaylists(user._id)
                                } catch (err) {
                                    Alert.alert('Error', err.message);
                                }
                            },
                        },
                    ]
                );
                break
            case 'rename':
                setNewName(playlist.name);       // preload existing name
                setShowRenameModal(true);        // open modal
                break;
            case 'add-to-playlist':
                router.push({ pathname: '(modals)/addToPlaylist', params: { id: song._id }, })
                break
            case 'go-to-album':
                song.album ? router.push(`/album/${song.album._id}`) : router.push(`/single/${song._id}`)
                break
            case 'go-to-artist':
                router.push(`/artist/${song.artist._id}`)
                break
            default:
                console.warn(`Unknown menu action ${id}`)
        }
    }

    return (
        <>
            <MenuView
                onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
                actions={[
                    {
                        id: 'rename',
                        title: 'Rename playlist',
                    },
                    {
                        id: 'delete-playlist',
                        title: 'Delete playlist',
                    },
                    {
                        id: 'go-to-artist',
                        title: 'Go to artist',
                    },
                    {
                        id: 'go-to-album',
                        title: 'Go to album',
                    },
                ]}
            >
                {children}
            </MenuView>

            <Modal
                transparent
                visible={showRenameModal}
                animationType="fade"
                onRequestClose={() => setShowRenameModal(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Rename Playlist</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="New name"
                            value={newName}
                            onChangeText={setNewName}
                            placeholderTextColor="#999"
                        />
                        <View style={styles.modalActions}>
                            <Pressable onPress={() => setShowRenameModal(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={async () => {
                                    try {
                                        await updatePlaylist(playlist._id, { name: newName });
                                        await fetchPlaylists(user._id);
                                        setShowRenameModal(false);
                                    } catch (err) {
                                        Alert.alert('Error', err.message);
                                    }
                                }}
                            >
                                <Text style={styles.saveText}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

        </>
    )
}



const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 8,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 6,
        marginBottom: 16,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelText: { color: 'gray' },
    saveText: { color: 'dodgerblue' },
});