import React, { useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';

export default function FloatingPlayer1() {
  const { queue, currentIndex, isPlaying, play, pause, next, prev } = useAudioQueueStore();
  const currentTrack = queue[currentIndex];
  const player = useAudioPlayer(currentTrack);

  useEffect(() => {
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
    <View style={styles.floating}>
      <Text numberOfLines={1} style={{ flex: 1 }}>{currentTrack.title || currentTrack.uri}</Text>
      <Button title="Prev" onPress={prev} />
      <Button title={isPlaying ? "Pause" : "Play"} onPress={isPlaying ? pause : play} />
      <Button title="Next" onPress={next} />
    </View>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    zIndex: 1000,
  },
});