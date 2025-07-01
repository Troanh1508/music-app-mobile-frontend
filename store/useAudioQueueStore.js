import { create } from 'zustand';
import { AudioPro } from 'react-native-audio-pro';


export const useAudioQueueStore = create((set, get) => ({
  queue: [],
  currentIndex: 0,
  setQueue: (queue, startIndex) => {
    set({ queue, currentIndex: startIndex});
  },
  setCurrentIndex: (index) => {
      set({ currentIndex: index });
  },

  // pause: () => set({ isPlaying: false }),
  // next: () => {
  //   const { currentIndex, queue } = get();
  //   if (currentIndex < queue.length - 1) set({ currentIndex: currentIndex + 1, isPlaying: true });
  // },
  // prev: () => {
  //   const { currentIndex } = get();
  //   if (currentIndex > 0) set({ currentIndex: currentIndex - 1, isPlaying: true });
  // },
}));