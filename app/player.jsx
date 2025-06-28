import { View, Text } from 'react-native'
import React from 'react'
import { useAudioPlayer } from 'expo-audio'
import { useAudioQueueStore } from '@/store/useAudioQueueStore'
import { useEffect } from 'react'
import { Image } from 'expo-image'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '@/constants/tokens'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { unknownTrackImageUri } from '@/constants/images'
import { useSharedAudioPlayer } from '@/store/AudioPlayerProvider'
import { PlayerSlider }  from '@/components/PlayerSlider'



export default function PlayerScreen(){

    const { queue, currentIndex, isPlaying, play, pause, next, prev } = useAudioQueueStore();
    const currentTrack = queue[currentIndex];
    const player = useSharedAudioPlayer();

    useEffect(() => {
        if (!player) return;
        if (isPlaying) player.play();
        else player.pause();
      }, [isPlaying, player]);
    
    if (!currentTrack) {
        return (
        <View style={styles.container}>
            <Text>No track selected</Text>
        </View>
        );
    }

  return (
    <View style={styles.container}>
      {/* Artwork */}
      <Image
        source={{ uri: currentTrack.imageUrl ?? unknownTrackImageUri }}
        style={styles.artwork}
      />
      {/* Title */}
      <Text style={styles.title}>{currentTrack.title}</Text>
      {/* Artist */}
      <Text style={styles.artist}>{currentTrack.artist?.name || currentTrack.artist}</Text>
      {/* Controls */}
      <PlayerSlider style={{ marginTop: 0 }}/>
      <View style={styles.controls}>
        
        <TouchableOpacity activeOpacity={0.7} onPress={prev}>
            <Ionicons name="play-skip-back" size={30} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.trackControlsContainer}>
            <TouchableOpacity
            activeOpacity={0.85}
            onPress={isPlaying ? pause : play}
            >
            <FontAwesome6 name={isPlaying ? 'pause' : 'play'} size={48} color={colors.text} />
            </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={next}>
            <Ionicons name="play-skip-forward" size={30} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  artwork: { width: 250, height: 250, borderRadius: 16, marginBottom: 32 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  artist: { color: '#aaa', fontSize: 20, marginBottom: 32 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 32 },
});
