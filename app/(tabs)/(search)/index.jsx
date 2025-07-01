import { View, StyleSheet, Button, Text } from 'react-native';
import React from 'react'
import { useAudioPro } from 'react-native-audio-pro';
import { AudioPro } from 'react-native-audio-pro';

const audioSource = { uri: 'https://res.cloudinary.com/dcykdsfrc/video/upload/v1747275427/j9gx792taapwux1p8war.mp3'};

export default function Search() {

    const { state, position, duration, playingTrack, playbackSpeed, volume, error } = useAudioPro();
    

    const track = {
      id: 'songId',
      url: 'https://res.cloudinary.com/dcykdsfrc/video/upload/v1747275427/j9gx792taapwux1p8war.mp3', // Remote file, live stream URL, or file:// URL
      title: 'song1',
      artwork: 'https://res.cloudinary.com/dcykdsfrc/image/upload/v1747275429/gaqbrdzfkujgpiem8vbf.jpg', // Remote image or file:// URL
      artist: 'test artist',
    };

    const handlePlay = () => { 
      AudioPro.play(track)}
    const handlePause = () => {
      AudioPro.pause();
    }
    const handleResume = () => {
      AudioPro.resume();
    }
    const handleVolume = (newVolume) => {
      AudioPro.setVolume(newVolume);
    }

    

  
  return (
    <View style={styles.container}>
      <Button title="Play Track" onPress={handlePlay} />
      <Button title="Pause Track" onPress={handlePause}/>
      <Button title="Resume Track" onPress={handleResume} />
      <Button title="Forward 5s" onPress={() => AudioPro.seekForward(5000)} />
      <Button
        title="Replay Sound"
        onPress={() => {
          AudioPro.seekTo(0);
          AudioPro.play(track);
        }}
      />
      <Button title="Half Volume" onPress={() => handleVolume(0.5)} />
      <Button title="Full Volume" onPress={() => handleVolume(1)} />
      <Text>Playback State: {state}</Text>
      <Text>Current Position: {position}ms</Text>
      <Text>Total Duration: {duration}ms</Text>
      <Text>Playback Speed: {playbackSpeed}x</Text>
      <Text>Volume: {Math.round(volume * 100)}%</Text>
      {error && (
        <View style={{ backgroundColor: '#ffeeee', padding: 10, borderRadius: 5 }}>
          <Text style={{ color: 'red' }}>Error: {error.error}</Text>
          <Text style={{ color: 'red' }}>Code: {error.errorCode}</Text>
        </View>
      )}
      {playingTrack && (
        <View>
          <Text>Track ID: {playingTrack.id}</Text>
          <Text>Now Playing: {playingTrack.title}</Text>
          <Text>Artist: {playingTrack.artist}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});