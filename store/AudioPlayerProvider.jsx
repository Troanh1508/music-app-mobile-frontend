import React, { createContext, useContext, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useAudioQueueStore } from './useAudioQueueStore';

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const { queue, currentIndex, next } = useAudioQueueStore();
  const currentTrack = queue[currentIndex];
  const player = useAudioPlayer(currentTrack);

  // // Autoplay next song when current ends
  // useEffect(() => {
  //   if (!player) return;
  //   if (!player.isLoaded) return;

  //   // Listen for end of playback
  //   if (player.currentTime >= player.duration && player.duration > 0) {
  //     console.log('Track ended, moving to next');
  //     next();
  //   }
  // }, [player?.currentTime, player?.duration, player?.isLoaded]);

  return (
    <AudioPlayerContext.Provider value={player}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useSharedAudioPlayer() {
  return useContext(AudioPlayerContext);
}