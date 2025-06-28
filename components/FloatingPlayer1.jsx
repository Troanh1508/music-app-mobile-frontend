import React, { useEffect } from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import { unknownTrackImageUri } from '@/constants/images';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { colors } from '@/constants/tokens'
import { FontAwesome6 } from '@expo/vector-icons'
import { router } from 'expo-router';
import { useSharedAudioPlayer } from '@/store/AudioPlayerProvider';

export default function FloatingPlayer1({ style }) {
  const { queue, currentIndex, isPlaying, play, pause, next, prev } = useAudioQueueStore();
  const currentTrack = queue[currentIndex];
  const player = useSharedAudioPlayer();

  useEffect(() => {
    if (!player) return;
    if (isPlaying) player.play();
    else player.pause();
  }, [isPlaying, player]);

  // Optional: auto-next when finished (if expo-audio supports onEnded)
  // useEffect(() => {
  //   if (!player) return;
  //   const sub = player.onEnded(() => next());
  //   return () => sub?.remove();
  // }, [player, next]);

  if (!currentTrack) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, style]}
      onPress={() => { router.navigate('/player') }}
    >
      <Image
        source={{ uri: currentTrack.imageUrl ?? unknownTrackImageUri }}
        style={styles.trackArtworkImage}
      />

      <View style={styles.trackTitleContainer}>
        <Text numberOfLines={1} style={styles.trackTitle}>
          {currentTrack.title || currentTrack.uri}
        </Text>
      </View>

      <View style={styles.trackControlsContainer}>
        {/* <Button title="Prev" onPress={prev} /> */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={isPlaying ? pause : play}
        >
          <FontAwesome6 name={isPlaying ? 'pause' : 'play'} size={24} color={colors.text} />
        </TouchableOpacity>
        {/* <Button title="Next" onPress={next} /> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    padding: 8,
    borderRadius: 12,
    paddingVertical: 10,
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 78,
    elevation: 8,
    zIndex: 1000,
  },
  trackArtworkImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  trackTitleContainer: {
    flex: 1,
    overflow: 'hidden',
    marginLeft: 10,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 10,
  },
  trackControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
    marginRight: 16,
    paddingLeft: 16,
  },
});