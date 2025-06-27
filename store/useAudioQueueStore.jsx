import { create } from 'zustand';

export const useAudioQueueStore = create((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  setQueue: (queue, startIndex = 0) => set({ queue, currentIndex: startIndex, isPlaying: true }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex < queue.length - 1) set({ currentIndex: currentIndex + 1, isPlaying: true });
  },
  prev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) set({ currentIndex: currentIndex - 1, isPlaying: true });
  },
}));