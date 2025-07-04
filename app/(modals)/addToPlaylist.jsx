import { View, Text, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useMusicStore } from '@/store/useMusicStore';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/constants/tokens';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AddToPlaylistModal() {
  const { id } = useLocalSearchParams(); // song ID passed in params
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchPlaylists, playlists, addSongToPlaylist } = useMusicStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchPlaylists(user._id).finally(() => setLoading(false));
    }
  }, [user]);

  const handleAdd = async (playlistId) => {
    try {
      await addSongToPlaylist(playlistId, id);
      Alert.alert('Added to playlist');
      router.back(); // close modal
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.playlistItem} onPress={() => handleAdd(item._id)}>
      <Text style={styles.playlistText}>{item.name}</Text>
      <Ionicons name="add-circle-outline" size={22} color={colors.accent} />
    </Pressable>
  );

  if (loading) return <LoadingSpinner message="Loading playlists..." />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add to Playlist</Text>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.empty}>No playlists found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  playlistText: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});