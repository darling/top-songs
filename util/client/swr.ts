import axios, { AxiosResponse } from 'axios';
import { getAuth } from 'firebase/auth';
import useSWR from 'swr/immutable';

export const fetcher = async (url: string) => {
	// Axios based fetch
	const auth = getAuth();

	if (auth && auth.currentUser) {
		return axios.get(url, {
			headers: {
				Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
			},
		});
	}
};

export const useNowPlaying = () => {
	const { data, error } = useSWR('/api/spotify/playing', fetcher, {
		refreshInterval: 20000,
	});

	return {
		response: data?.data as {
			currentlyPlaying: SpotifyApi.CurrentlyPlayingResponse;
			trackFeatures: SpotifyApi.AudioFeaturesResponse;
		},
		isLoading: !error && !data,
		isError: error,
	};
};

export const useSpotify = () => {
	const { data, error } = useSWR('/api/spotify', fetcher);

	return {
		response: data?.data?.profile as SpotifyApi.UsersTopTracksResponse,
		isLoading: !error && !data,
		isError: error,
	};
};

export const useSpotifyTrack = (track: string) => {
	const { data, error } = useSWR(`/api/spotify/track/${track}`, fetcher, {
		revalidateOnMount: true,
	});

	return {
		response: data?.data?.profile as SpotifyApi.TrackObjectFull,
		isLoading: !error && !data,
		isError: error,
	};
};
