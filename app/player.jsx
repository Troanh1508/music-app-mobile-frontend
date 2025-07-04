import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAudioQueueStore } from '@/store/useAudioQueueStore'
import { Image } from 'expo-image'
import { colors } from '@/constants/tokens'
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { unknownTrackImageUri } from '@/constants/images'
import { PlayerSlider } from '@/components/PlayerSlider'
import { AudioPro, useAudioPro } from 'react-native-audio-pro';
import { AudioProState } from 'react-native-audio-pro';
import {
  getCurrentTrackIndex,
  getProgressInterval,
  setCurrentTrackIndex,
  setProgressInterval,
} from '@/store/player-service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '@/constants/colors'
import { useMusicStore } from '@/store/useMusicStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'expo-router'



export default function PlayerScreen() {
  const router = useRouter();
  const { queue, currentIndex, setCurrentIndex } = useAudioQueueStore();
  const [progressInterval, setLocalProgressInterval] = useState(getProgressInterval());
  const currentTrack = queue[currentIndex];
  const { position, duration, state, playingTrack, playbackSpeed, volume, error } = useAudioPro();
  const { top, bottom } = useSafeAreaInsets()
  const { favoriteSongs, toggleFavoriteSong } = useMusicStore();
  const { user } = useAuthStore();
  // Reset needsTrackLoad when the track actually changes
  useEffect(() => {
    if (playingTrack?.id === currentTrack?.id) {
      setNeedsTrackLoad(false);
    }
    
  }, [playingTrack?.id]);

  // Track whether we need to load a new track before playing
  const [needsTrackLoad, setNeedsTrackLoad] = useState(true);

  // Track whether to autoPlay when loading a track
  const [autoPlay, setAutoPlay] = useState(true);

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text>No track selected</Text>
      </View>
    );
  }

  const handlePlayPause = () => {
    if (state === AudioProState.PLAYING) {
      // If playing, simply pause
      AudioPro.pause();
    } else if (state === AudioProState.PAUSED && !needsTrackLoad) {
      // If paused and we don't need to load a new track, resume
      AudioPro.resume();
    } else {
      AudioPro.configure({
        showNextPrevControls: true,
      });
      // If stopped, or we need to load a new track, play the current track
      AudioPro.play(currentTrack, {
        autoPlay,
        // startTimeMs: 60000,
      });
      setNeedsTrackLoad(false);
    }
  };

  const handleStop = () => {
    AudioPro.stop();
    setNeedsTrackLoad(true);
  };

  const handleClear = () => {
    AudioPro.clear();
    setNeedsTrackLoad(true);
  };

  const handleSeek = (value) => {
    AudioPro.seekTo(value);
  };

  const handleSeekBack = () => {
    AudioPro.seekBack();
  };

  const handleSeekForward = () => {
    AudioPro.seekForward();
  };

  const handlePrevious = () => {
    if (position > 5000) {
      // If we're more than 5 seconds into the track, seek to beginning
      AudioPro.seekTo(0);
    } else {
      // Otherwise, go to previous track
      const newIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;

      // Update the track index
      setCurrentIndex(newIndex);

      // If we're currently playing or paused (but loaded), immediately load the new track
      if (state === AudioProState.PLAYING || state === AudioProState.PAUSED) {
        AudioPro.play(queue[newIndex], {
          autoPlay,
        });
        setNeedsTrackLoad(false);
      } else {
        // Otherwise, mark that we need to load the track when play is pressed
        setNeedsTrackLoad(true);
      }
    }
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(newIndex);

    // If we're currently playing or paused (but loaded), immediately load the new track
    if (state === AudioProState.PLAYING || state === AudioProState.PAUSED) {
      AudioPro.play(queue[newIndex], { autoPlay });
      setNeedsTrackLoad(false);
    } else {
      // Otherwise, mark that we need to load the track when play is pressed
      setNeedsTrackLoad(true);
    }
  };

  const handleIncreaseVolume = () => {
    const newVolume = Math.min(1.0, volume + 0.1);
    AudioPro.setVolume(newVolume);
  };

  const handleDecreaseVolume = () => {
    const newVolume = Math.max(0.0, volume - 0.1);
    AudioPro.setVolume(newVolume);
  };

  // These handlers adjust how frequently progress events are emitted (in ms)
  // Changes take effect on the next call to play()
  const handleIncreaseProgressInterval = () => {
    const newInterval = Math.min(10000, progressInterval + 100);
    setProgressInterval(newInterval);
    setLocalProgressInterval(newInterval);
  };

  const handleDecreaseProgressInterval = () => {
    const newInterval = Math.max(100, progressInterval - 100);
    setProgressInterval(newInterval);
    setLocalProgressInterval(newInterval);
  };

  const isFavorite = favoriteSongs.some(song => song._id === currentTrack.id);


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Ionicons
          onPress={() => router.back()}
          name="arrow-back"
          size={24}
          color="white"
        />
      </View>
      {/* Artwork */}
      <View style={{ flex: 1, marginTop: top, marginBottom: bottom }}>
        <View style={styles.artworkImageContainer}>
          <Image
            source={{ uri: currentTrack.artwork ?? unknownTrackImageUri }}
            contentFit='cover'
            style={styles.artwork}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ marginTop: '20' }}>
            <View style={{ height: 60 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >


                {/* Title */}
                <Text style={styles.title}>
                  {currentTrack.title || "unknown title"}
                </Text>
                
                  <Pressable onPress={() => { toggleFavoriteSong(user._id, currentTrack.id)}}>
                <FontAwesome
                  name={isFavorite ? 'heart' : 'heart-o'}
                  size={22}
                  color={isFavorite ? COLORS.primary : COLORS.white}
                  style={{ marginHorizontal: 14 }}
                  
                />
                </Pressable>
              </View>
              {/* Artist */}

              <Text numberOfLines={1} style={[styles.artist, { marginTop: 6 }]}>
                {currentTrack.artist?.name || currentTrack.artist || "unknown artist"}
              </Text>
            </View>
            {/* Controls */}
            <PlayerSlider style={{ marginTop: 32 }} />

            <View style={{ marginTop: 40, width: '100%' }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>


                <TouchableOpacity activeOpacity={0.7} onPress={handlePrevious}>
                  <Ionicons name="play-skip-back" size={30} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.trackControlsContainer}>


                  <TouchableOpacity onPress={handlePlayPause}>
                    <FontAwesome6 name={state === AudioProState.PLAYING ? 'pause' : 'play'} size={48} color={colors.text} />
                  </TouchableOpacity>

                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={handleNext}>
                  <Ionicons name="play-skip-forward" size={30} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: '#000' },
  loadingContainer: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artwork: { width: '100%', height: '100%', borderRadius: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold'},
  artist: { color: '#aaa', fontSize: 20 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  artworkImageContainer: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 11.0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: '45%',
  },
});
