import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'
import { useMusicStore } from '@/store/useMusicStore'
import { useAuthStore } from '@/store/useAuthStore'

export const SongShortcutsMenu = ({ song, children }) => {
    const router = useRouter()

    const { favoriteSongs, toggleFavoriteSong } = useMusicStore();
    const { user } = useAuthStore();

    const isFavorite = favoriteSongs.some(fav => fav._id === song._id);

    const handlePressAction = async (id) => {
        switch (id) {
            case 'add-to-favorites':
                toggleFavoriteSong(user._id, song._id)
                break
            case 'remove-from-favorites':
                toggleFavoriteSong(user._id, song._id)
                break
            case 'add-to-playlist':
                router.push({ pathname: '(modals)/addToPlaylist', params: { id: song._id },  })
                break
            case 'go-to-album':
                song.album? router.push(`/album/${song.album._id}`) : router.push(`/single/${song._id}`)
                break
            case 'go-to-artist':
                router.push(`/artist/${song.artist._id}`)
                break
            default:
                console.warn(`Unknown menu action ${id}`)
        }
    }

    return (
        <MenuView
            onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
            actions={[
                {
                    id: isFavorite ? 'remove-from-favorites' : 'add-to-favorites',
                    title: isFavorite ? 'Remove from favorites' : 'Add to favorites',
                    // image: isFavorite ? 'star.fill' : 'star',
                },
                {
                    id: 'add-to-playlist',
                    title: 'Add to playlist',
                    // image: 'plus',
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
    )
}