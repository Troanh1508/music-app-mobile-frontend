
export const trackTitleFilter = (title) => (track) =>
	track.title?.toLowerCase().includes(title.toLowerCase())

export const artistNameFilter = (name) => (artist) =>
	artist.name.toLowerCase().includes(name.toLowerCase())

export const playlistNameFilter = (name) => (playlist) =>
	playlist.name.toLowerCase().includes(name.toLowerCase())
