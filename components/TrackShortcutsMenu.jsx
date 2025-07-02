import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'

export const TrackShortcutsMenu = ({ track, children }) => {
    const router = useRouter()

    const isFavorite = 1

    const handlePressAction = async (id) => {
        // switch (id) {
        //     case 'add-to-favorites':
        //         toggleTrackFavorite(track)
        //         if (activeQueueId?.startsWith('favorites')) {
        //             await TrackPlayer.add(track)
        //         }
        //         break
        //     case 'remove-from-favorites':
        //         toggleTrackFavorite(track)
        //         if (activeQueueId?.startsWith('favorites')) {
        //             const queue = await TrackPlayer.getQueue()
        //             const trackToRemove = queue.findIndex((queueTrack) => queueTrack.url === track.url)
        //             if (trackToRemove !== -1) {
        //                 await TrackPlayer.remove(trackToRemove)
        //             }
        //         }
        //         break
        //     case 'add-to-playlist':
        //         // @ts-expect-error it should work
        //         router.push({ pathname: '(modals)/addToPlaylist', params: { trackUrl: track.url } })
        //         break
        //     default:
        //         console.warn(`Unknown menu action ${id}`)
        // }
    }

    return (
        <MenuView
            onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
            actions={[
                {
                    id: isFavorite ? 'remove-from-favorites' : 'add-to-favorites',
                    title: isFavorite ? 'Remove from favorites' : 'Add to favorites',
                    image: isFavorite ? 'star.fill' : 'star',
                },
                {
                    id: 'add-to-playlist',
                    title: 'Add to playlist',
                    image: 'plus',
                },
            ]}
        >
            {children}
        </MenuView>
    )
}