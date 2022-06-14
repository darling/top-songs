import axios from 'axios';

export const getSongMetadata = async (artist: string, track: string) => {
	const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
		params: {
			method: 'track.getInfo',
			artist,
			track,
			api_key: process.env.NEXT_PUBLIC_LASTFM_API_KEY,
			format: 'json',
		},
	});

	return response.data;
};

export const getAlbumMetadata = async (artist: string, album: string) => {
	const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
		params: {
			method: 'album.getInfo',
			artist,
			album,
			api_key: process.env.NEXT_PUBLIC_LASTFM_API_KEY,
			format: 'json',
		},
	});

	return response.data;
};
