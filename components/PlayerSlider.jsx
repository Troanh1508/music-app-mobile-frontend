import React, { useEffect, useState } from 'react';
import { colors, fontSize } from '@/constants/tokens'
import { formatSecondsToMinutes } from '@/helpers/miscellaneous'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import Slider from '@react-native-community/slider';
import { useSharedAudioPlayer } from '@/store/AudioPlayerProvider'
import { useAudioQueueStore } from '@/store/useAudioQueueStore';


export const PlayerSlider = ({ style }) => {
    const player = useSharedAudioPlayer();
	const { queue, currentIndex, isPlaying, play, pause, next, prev } = useAudioQueueStore();
	// const position = player?.currentTime ?? 0;
    const duration = player?.duration ?? 1;
	const [position, setPosition] = useState(0);

	useEffect(() => {
		// Set up a polling interval to update position
		const interval = setInterval(() => {
			if (player?.currentTime != null) {
				setPosition(player.currentTime);
			}
			if (player.currentTime >= player.duration && player.duration > 0) {
				next();
			}
		}, 500); // update every 0.5s

		return () => clearInterval(interval); // clean up on unmount
	}, [player]);

	const trackElapsedTime = formatSecondsToMinutes(position)
	const trackTotalTime = formatSecondsToMinutes(duration)

	return (
		<View style={style}>
			<Slider

                style={{width: 300 , height: 40}}
                value={position}
                minimumValue={0}
                maximumValue={duration}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor= {colors.maximumTrackTintColor}
				onSlidingComplete={async (value) => {
					if (player?.seekTo) {
						await player.seekTo(value);
						setPosition(value); // update position manually after seeking
					}
				}}
			/>

			<View style={styles.timeRow}>
				<Text style={styles.timeText}>{trackElapsedTime}</Text>

				<Text style={styles.timeText}>
					{'-'} {trackTotalTime}
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	timeRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		marginTop: 20,
	},
	timeText: {
		color: colors.text,
		opacity: 0.75,
		fontSize: fontSize.xs,
		letterSpacing: 0.7,
		fontWeight: '500',
	},
})
