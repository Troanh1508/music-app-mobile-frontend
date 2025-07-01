import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect} from 'react'
import { useAudioQueueStore } from '@/store/useAudioQueueStore'
import { Image } from 'expo-image'
import { colors } from '@/constants/tokens'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
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



export default function PlayerScreen() {

  const { queue, currentIndex, setCurrentIndex} = useAudioQueueStore();
  const [progressInterval, setLocalProgressInterval] = useState(getProgressInterval());
  const currentTrack = queue[currentIndex];
  const { position, duration, state, playingTrack, playbackSpeed, volume, error } = useAudioPro();

  // Reset needsTrackLoad when the track actually changes
  useEffect(() => {
    if (playingTrack?.id === currentTrack?.id) {
      setNeedsTrackLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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


  return (
    <View style={styles.container}>
      {/* Artwork */}
      <Image
        source={{ uri: currentTrack.artwork ?? unknownTrackImageUri }}
        style={styles.artwork}
      />
      {/* Title */}
      <Text style={styles.title}>{currentTrack.title || "unknown title"}</Text>
      {/* Artist */}
      <Text style={styles.artist}>{currentTrack.artist?.name || currentTrack.artist || "unknown artist"}</Text>
      {/* Controls */}
      <PlayerSlider style={{ marginTop: 0 }} />
      <View style={styles.controls}>

        <TouchableOpacity activeOpacity={0.7} onPress={handlePrevious}>
          <Ionicons name="play-skip-back" size={30} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.trackControlsContainer}>

          
            <TouchableOpacity onPress={handlePlayPause}>
              <FontAwesome6 name={state === AudioProState.PLAYING ? 'pause' : 'play'} size={48} color={colors.text} />
            </TouchableOpacity>
          



          {/* <TouchableOpacity
            activeOpacity={0.85}
            onPress={isPlaying ? pause : play}
          >
            <FontAwesome6 name={isPlaying ? 'pause' : 'play'} size={48} color={colors.text} />
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={handleNext}>
          <Ionicons name="play-skip-forward" size={30} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  loadingContainer: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artwork: { width: 250, height: 250, borderRadius: 16, marginBottom: 32 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  artist: { color: '#aaa', fontSize: 20, marginBottom: 32 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 32 },
});
