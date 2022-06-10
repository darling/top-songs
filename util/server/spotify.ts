import axios from 'axios';
import qs from 'qs';
import { firebaseAdmin } from './firebase';

interface ITokenRefreshResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
}

export const refreshSpotifyToken = async (refresh_token: string) => {
	const apiTokenResponse = await axios.post<ITokenRefreshResponse>(
		'https://accounts.spotify.com/api/token',
		qs.stringify({
			refresh_token,
			grant_type: 'refresh_token',
		}),
		{
			headers: {
				Authorization: `Basic ${Buffer.from(
					`${process.env.NEXT_PUBLIC_SPOTIFY_API_ID}:${process.env.SPOTIFY_API_SECRET}`
				).toString('base64')}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);

	// Check for 200

	if (apiTokenResponse.status !== 200) {
		throw new Error('Error refreshing Spotify token');
	}

	// Return access token

	return apiTokenResponse.data;
};

export const getSpotifyToken = async (uid: string) => {
	const user = await firebaseAdmin
		.firestore()
		.collection('users')
		.doc(uid)
		.get();

	// Throw error if user does not exist

	if (!user.exists) {
		throw new Error('User does not exist');
	}

	const spotifyTokenInformation = user.data();

	if (!spotifyTokenInformation) {
		throw new Error('User does not exist');
	}

	// Refresh token if it's expired

	let access_token = spotifyTokenInformation.accessToken;

	if (spotifyTokenInformation.expiresAt.toDate() < new Date()) {
		const newTokenInformation = await refreshSpotifyToken(
			spotifyTokenInformation.refreshToken
		);

		await firebaseAdmin
			.firestore()
			.collection('users')
			.doc(uid)
			.set(
				{
					accessToken: newTokenInformation.access_token,
					// Create a firestore timestamp for when the token will expire.
					expiresAt: firebaseAdmin.firestore.Timestamp.fromDate(
						new Date(
							Date.now() + newTokenInformation.expires_in * 1000
						)
					),
				},
				{ merge: true }
			);

		access_token = newTokenInformation.access_token;
	}

	// Return access token

	return access_token;
};

export const getSpotifyProfile = async (uid: string) => {
	// Get Spotify Token
	const access_token = await getSpotifyToken(uid);

	// Get Spotify Profile
	const apiProfileResponse = await axios.get<SpotifyApi.UserProfileResponse>(
		'https://api.spotify.com/v1/me',
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		}
	);

	// Check for 200

	if (apiProfileResponse.status !== 200) {
		throw new Error('Error getting Spotify profile');
	}

	// Return profile

	return apiProfileResponse.data;
};

export const getSpotifyTrack = async (uid: string, track: string) => {
	// Get Spotify Token
	const access_token = await getSpotifyToken(uid);

	// Get Spotify Track
	const apiTrackResponse = await axios.get<SpotifyApi.TrackObjectFull>(
		`https://api.spotify.com/v1/tracks/${track}`,
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		}
	);

	// Check for 200

	if (apiTrackResponse.status !== 200) {
		throw new Error('Error getting Spotify track');
	}

	// Return track

	return apiTrackResponse.data;
};

export const getSpotifyTopTracks = async (uid: string, limit: number) => {
	// Get Spotify Token
	const access_token = await getSpotifyToken(uid);

	// Get Spotify Top Tracks
	const apiTopTracksResponse =
		await axios.get<SpotifyApi.UsersTopTracksResponse>(
			'https://api.spotify.com/v1/me/top/tracks',
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
				params: {
					limit,
				},
			}
		);

	// Check for 200

	if (apiTopTracksResponse.status !== 200) {
		throw new Error('Error getting Spotify top tracks');
	}

	// Return top tracks

	return apiTopTracksResponse.data;
};

export const getSpotifyCurrent = async (uid: string) => {
	// Get Spotify Token
	const access_token = await getSpotifyToken(uid);

	// Get Spotify Top Tracks
	const apiTopTracksResponse =
		await axios.get<SpotifyApi.CurrentPlaybackResponse>(
			'https://api.spotify.com/v1/me/player/currently-playing',
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);

	// Check for 200

	if (apiTopTracksResponse.status !== 200) {
		throw new Error('Error getting Spotify currently playing');
	}

	// Return top tracks

	return apiTopTracksResponse.data;
};

export const getSpotifyUserTracks = async (uid: string, limit: number) => {
	// Get Spotify Token
	const access_token = await getSpotifyToken(uid);

	// Get Spotify Top Tracks
	const apiTopTracksResponse =
		await axios.get<SpotifyApi.UsersSavedTracksResponse>(
			'https://api.spotify.com/v1/me/tracks',
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
				params: {
					limit,
				},
			}
		);

	// Check for 200

	if (apiTopTracksResponse.status !== 200) {
		throw new Error('Error getting Spotify user tracks');
	}

	// Return top tracks

	return apiTopTracksResponse.data;
};

export const getSpotifyTrackFeatures = async (uid: string, track: string) => {
	// Get Spotify Token
	const access_token = await getSpotifyToken(uid);

	// Get Spotify Top Tracks
	const apiTopTracksResponse =
		await axios.get<SpotifyApi.AudioFeaturesResponse>(
			'https://api.spotify.com/v1/audio-features/' + track,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);

	// Check for 200

	if (apiTopTracksResponse.status !== 200) {
		throw new Error('Error getting Spotify user tracks');
	}

	// Return top tracks

	return apiTopTracksResponse.data;
};
