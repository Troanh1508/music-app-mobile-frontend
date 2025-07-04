import { View, Text, Pressable, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { LoaderKitView } from 'react-native-loader-kit';
import { StopPropagation } from '@/components/utils/StopPropagation';
import { SongShortcutsMenu } from '@/components/SongShortcutsMenu';
import { unknownTrackImageUri } from '@/constants/images';
import COLORS from '@/constants/colors';
import { colors, fontSize } from '@/constants/tokens';
import { favoriteStyles } from '@/assets/styles/favorite.styles';
import { AudioPro, useAudioPro, AudioProState } from 'react-native-audio-pro';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';

export default function SongListItem({
    song,
    index,
    onSongSelect,
}) {
    const { playingTrack, state } = useAudioPro();
    const { queue, setQueue, currentIndex } = useAudioQueueStore();
    const isActiveTrack = song._id === queue?.[currentIndex]?.id;

    return (
        <Pressable onPress={() => onSongSelect({ index })}>
            <View style={favoriteStyles.trackItemContainer}>
                <View>
                    <Image
                        source={song.imageUrl ? { uri: song.imageUrl } : unknownTrackImageUri}
                        style={favoriteStyles.trackArtworkImage}
                    /></View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                {isActiveTrack && state === 'PLAYING' && (
                                    <LoaderKitView
                                        style={{ width: 20, height: 20 }}
                                        name={'AudioEqualizer'}
                                        color={COLORS.primary}
                                    />
                                )}
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        ...favoriteStyles.trackTitleText,
                                        color: isActiveTrack ? COLORS.primary : colors.text,
                                        flex: 1,
                                    }}
                                >
                                    {song.title}
                                </Text>
                            </View>
                            {song.artist?.name && (
                                <Text numberOfLines={1} style={favoriteStyles.trackArtistText}>
                                    {song.artist.name}
                                </Text>
                            )}
                        </View>
                        <StopPropagation>
                            <SongShortcutsMenu song={song}>
                                <Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
                            </SongShortcutsMenu>
                        </StopPropagation>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}