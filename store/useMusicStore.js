import { create } from 'zustand';
import { API_URL } from "../constants/api";

export const useMusicStore = create((set, get) => ({
    songById: null,
    songs: [],
    songsInAlbum: [],
    songsInPlaylist: [],
    album: null,
    artist: null,
    albums: [],
    albumsByArtist: [],
    favoriteSongs: [],
    isLoading: false,
    error: null,
    artists: [],
    songsByArtist: [],
    searchedSongs: [],
    searchedAlbums: [],
    searchedArtists: [],
    playlist: null,
    playlists: [],



    fetchSongs: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/songs`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch songs");

            set({ songs: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchSongById: async (songId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/songs/${songId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch song");

            set({ songById: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchSongsInAlbum: async (albumId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/songs/album/${albumId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch songs in album");

            set({ songsInAlbum: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchFavoriteSongs: async (userId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/favorites/mobile/${userId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch favorite songs");

            set({ favoriteSongs: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchAlbumById: async (albumId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/albums/${albumId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch album");

            set({ album: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchArtistById: async (artistId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/artists/${artistId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch album");

            set({ artist: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchAlbums: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/albums`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch albums");

            set({ albums: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchArtists: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/artists`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch artists");

            set({ artists: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchSongsByArtist: async (artistId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/songs/artist/${artistId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch songs by artist");

            set({ songsByArtist: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchSongsInPlaylist: async (playlistId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/songs/playlist/${playlistId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch songs by artist");

            set({ songsInPlaylist: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },



    fetchAlbumsByArtist: async (artistId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/albums/artist/${artistId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch songs by artist");

            set({ albumsByArtist: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    searchAll: async (q) => {
        try {
            const response = await fetch(`${API_URL}/api/search?q=${q}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to search");

            set({ searchedSongs: data.songs, searchedAlbums: data.albums, searchedArtists: data.artists });
        } catch (error) {
            set({ error: error.message });
        }

    },

    toggleFavoriteSong: async (userId, songId) => {
        try {
            const response = await fetch(`${API_URL}/api/favorites/mobile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: userId, song: songId }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to toggle favorite");

            await get().fetchFavoriteSongs(userId);

        } catch (error) {
            set({ error: error.message });
        }
    },

    createPlaylist: async (name, userId) => {
        const response = await fetch(`${API_URL}/api/playlists/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, userId }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create playlist');
        return data;
    },

    fetchPlaylists: async (userId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/playlists/${userId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch playlists");

            set({ playlists: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchPlaylistById: async (playlistId) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/api/playlists/playlist/${playlistId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch album");

            set({ playlist: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    updatePlaylist: async (playlistId, updates) => {
        try {
            const response = await fetch(`${API_URL}/api/playlists/update/${playlistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates), // { name, songIds }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update playlist');
            }
        } catch (error) {
            console.error('Update playlist error:', error.message);
            throw error;
        }
    },

    deletePlaylist: async (playlistId) => {
        try {
            const response = await fetch(`${API_URL}/api/playlists/delete/${playlistId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete playlist');
            }
        } catch (error) {
            console.error('Delete playlist error:', error.message);
            throw error;
        }
    },

    addSongToPlaylist: async (playlistId, songId) => {
        const response = await fetch(`${API_URL}/api/playlists/add/${playlistId}/${songId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add song to playlist');
        }
    },

    removeSongFromPlaylist: async (playlistId, songId) => {
        const res = await fetch(`${API_URL}/api/playlists/remove/${playlistId}/${songId}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to remove song');
    },

}));