import { fetcher } from './swr';

export const getSpotifyRecommendation = async (
	recQuery: SpotifyApi.RecommendationsOptionsObject
) => {
	const response = await fetcher('/api/spotify/recommend', recQuery);

	if (!response || response?.status !== 200) {
		throw new Error('Error getting Spotify recommendations');
	}

	return response?.data
		?.reccomendations as SpotifyApi.RecommendationsFromSeedsResponse;
};

export const searchSpotify = async (search: string) => {
	const response = await fetcher(`/api/spotify/search`, { search });

	if (!response || response?.status !== 200) {
		throw new Error('Error searching Spotify');
	}

	return response?.data?.results as SpotifyApi.SearchResponse;
};
