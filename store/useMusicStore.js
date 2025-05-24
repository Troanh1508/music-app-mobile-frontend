import {create} from 'zustand';
import {API_URL} from "../constants/api";

export const useMusicStore = create((set) => ({
    songs: [],
    isLoading: false,
    error: null,
    

    fetchSongs: async () => {
        set({isLoading: true});
        try {
            const response = await fetch(`${API_URL}/api/songs`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            set({songs: data, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },
}));