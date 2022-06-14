import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { mutate } from 'swr';
import useSWR from 'swr/immutable';

export const fetcher = async (url: string, params?: any) => {
	// Axios based fetch
	const auth = getAuth();

	if (!auth || !auth.currentUser) {
		return null;
	}

	const token = await auth.currentUser.getIdToken();

	if (auth && auth.currentUser) {
		return axios.get(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		});
	}
};

export const useNowPlaying = () => {
	const { data, error } = useSWR('/api/spotify/playing', fetcher, {
		refreshInterval: 20000,
		revalidateOnMount: true,
		revalidateOnFocus: true,
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
	const { data, error } = useSWR(`/api/spotify/track/${track}`, fetcher);

	return {
		response: data?.data?.profile as SpotifyApi.TrackObjectFull,
		isLoading: !error && !data,
		isError: error,
	};
};

export const useSpotifyLikes = () => {
	const { data, error } = useSWR(`/api/spotify/likes`, fetcher);

	return {
		response: data?.data?.likedSongs as SpotifyApi.UsersSavedTracksResponse,
		isLoading: !error && !data,
		isError: error,
	};
};

export const useSpotifyAlbum = (album: string) => {
	const { data, error } = useSWR(`/api/spotify/album/${album}`, fetcher);

	return {
		response: data?.data as {
			album: SpotifyApi.AlbumObjectFull;
			meta: any;
		},
		isLoading: !error && !data,
		isError: error,
	};
};

export const useSpotifyRecommendations = (
	recQuery: SpotifyApi.RecommendationsOptionsObject
) => {
	const { data, error } = useSWR(
		['/api/spotify/recommend', recQuery],
		fetcher
	);

	return {
		response: data?.data
			?.reccomendations as SpotifyApi.RecommendationsFromSeedsResponse,
		isLoading: !error && !data,
		isError: error,
	};
};
