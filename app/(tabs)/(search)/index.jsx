import { View, StyleSheet, Button } from 'react-native';
import React from 'react'
import { useAudioPlayer } from 'expo-audio';

const audioSource = { uri: 'https://res.cloudinary.com/dcykdsfrc/video/upload/v1747275427/j9gx792taapwux1p8war.mp3'};

export default function Search() {

   const player = useAudioPlayer(audioSource);

  
  return (
    <View style={styles.container}>
      <Button title="Play Sound" onPress={() => player.play()} />
        <Button title="Pause Sound" onPress={() => player.pause()} />
      <Button
        title="Replay Sound"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />
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