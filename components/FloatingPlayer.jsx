import React, {useState, useEffect} from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { unknownTrackImageUri } from '@/constants/images';
import { colors } from '@/constants/tokens'
import { FontAwesome6 } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { AudioPro, useAudioPro } from 'react-native-audio-pro';
import { AudioProState } from 'react-native-audio-pro';
import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { MovingText } from './MovingText';

export default function FloatingPlayer({ style }) {
  const { state } = useAudioPro();
  const router = useRouter();
  const { queue, currentIndex } = useAudioQueueStore();
  const currentTrack = queue[currentIndex];

  if (!currentTrack) return null;

  const handlePlayPause = () => {
      if (state === AudioProState.PLAYING) {
        // If playing, simply pause
        AudioPro.pause();
      } 
      else {
        AudioPro.resume();
      }
    };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, style]}
      onPress={() => { router.navigate('/player') }}
    >
      <Image
        source={{ uri: currentTrack.artwork ?? unknownTrackImageUri }}
        style={styles.trackArtworkImage}
      />

      <View style={styles.trackTitleContainer}>
        
        <MovingText
						style={styles.trackTitle}
						text={currentTrack.title ?? 'unknown title'}
						animationThreshold={25}
					/>
        <MovingText
            style={styles.trackArtist}
            text={currentTrack.artist ?? 'unknown artist'}
            animationThreshold={25}
          />
      </View>

      <View style={styles.trackControlsContainer}>

  
        {state === AudioProState.LOADING ? (
						<View>
							<ActivityIndicator size="large" color="#1EB1FC" />
						</View>
					) : (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePlayPause}
        >
          <FontAwesome6 name={state === AudioProState.PLAYING ? 'pause' : 'play'} size={24} color={colors.text} />
        </TouchableOpacity>
        )}
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
  trackArtist: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '400',
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