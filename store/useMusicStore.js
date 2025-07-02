import {create} from 'zustand';
import {API_URL} from "../constants/api";

export const useMusicStore = create((set) => ({
    songs: [],
    songsInAlbum: [],
    albums: [],
    favoriteSongs: [],
    isLoading: false,
    error: null,
    artists: [],
    songsByArtist: [],
    

    fetchSongs: async () => {
        set({isLoading: true});
        try {
            const response = await fetch(`${API_URL}/api/songs`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch songs");

            set({songs: data, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },

    fetchSongsInAlbum: async (albumId) => {
        set({isLoading: true});
        try {
            const response = await fetch(`${API_URL}/api/songs/album/${albumId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch songs in album");

            set({songsInAlbum: data, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },

    fetchFavoriteSongs: async (userId) => {
        set({isLoading: true});
        try {
            const response = await fetch(`${API_URL}/api/favorites/mobile/${userId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch favorite songs");

            set({favoriteSongs: data, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },
    
    fetchAlbumById: async (albumId) => {
        set({isLoading: true});
        try {
            const response = await fetch(`${API_URL}/api/albums/${albumId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch album");

            set({album: data, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },

    fetchAlbums: async () => {
        set({isLoading: true});
        try {
            const response = await fetch(`${API_URL}/api/albums`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch albums");

            set({albums: data, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },

    fetchArtists: async () => {
        set({isLoading: true});
        try {
            const response = await fetch(`${API_URL}/api/artists`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch artists");

            set({artists: data, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },

    fetchSongsByArtistId: async (artistId) => {
        set({isLoading: true});
        try {
            const response = await fetch(`${API_URL}/api/songs/artist/${artistId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch songs by artist");

            set({songsByArtist: data, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },

    
}));