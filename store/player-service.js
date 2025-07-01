import {
	AudioProContentType,
	AudioProEventType,
} from 'react-native-audio-pro';

import { useAudioQueueStore } from '@/store/useAudioQueueStore';
import { AudioPro } from 'react-native-audio-pro';

export function setupAudioPro(){
	// Configure audio settings
	AudioPro.configure({
		contentType: AudioProContentType.MUSIC,
		debug: true,
		debugIncludesProgress: false,
		progressIntervalMs: 1000,
		showNextPrevControls: true,
	});

	// Set up event listeners that persist for the app's lifetime
	AudioPro.addEventListener((event) => {
		switch (event.type) {
			case AudioProEventType.TRACK_ENDED:
				// Auto-play next track when current track ends
				playNextTrack();
				break;

			case AudioProEventType.REMOTE_NEXT:
				// Handle next button press from lock screen/notification
				playNextTrack();
				break;

			case AudioProEventType.REMOTE_PREV:
				// Handle previous button press from lock screen/notification
				playPreviousTrack();
				break;

			case AudioProEventType.PLAYBACK_ERROR:
				console.warn('Playback error:', event.payload?.error);
				break;
		}
	});
}

function playNextTrack(autoPlay = true) {
	const { queue, currentIndex, setCurrentIndex } = useAudioQueueStore.getState();
	if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
	setCurrentIndex(nextIndex);
	AudioPro.play(queue[nextIndex], { autoPlay });
}

function playPreviousTrack(autoPlay = true) {
	const { queue, currentIndex, setCurrentIndex } = useAudioQueueStore.getState();
	if (queue.length === 0) return;
	const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
	setCurrentIndex(prevIndex);
	AudioPro.play(queue[prevIndex], { autoPlay });
}

export function getCurrentTrackIndex() {
	return currentIndex;
}

export function setCurrentTrackIndex(index) {
	if (index >= 0 && index < queue.length) {
		currentIndex = index;
	}
}

export function getProgressInterval(){
	return AudioPro.getProgressInterval();
}

export function setProgressInterval(ms){
	AudioPro.setProgressInterval(ms);
}
