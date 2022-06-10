// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from '../../../util/server/firebase';
import { refreshSpotifyToken } from '../../../util/server/spotify';

interface ISpotifyResponse {
	profile: any;
}

interface IFirebaseTokenStorageDocument {
	accessToken: string;
	refreshToken: string;
	expiresAt: FirebaseFirestore.Timestamp;
}

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<ISpotifyResponse | { error: string }>
) => {
	// Log request
	console.log(req.query);

	// Check for Bearer token in Authorization header
	const auth = req.headers.authorization;

	if (!auth) {
		res.status(401).json({ error: 'No authorization header' });
		return;
	}

	// Check for Bearer token in Authorization header

	const authParts = auth.split(' ');

	if (authParts.length !== 2) {
		res.status(401).json({ error: 'Invalid authorization header' });
		return;
	}

	const [scheme, token] = authParts;

	if (scheme !== 'Bearer') {
		res.status(401).json({ error: 'Invalid authorization header' });
		return;
	}

	// Check for valid token

	const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

	// Throw error if token is invalid

	if (!decodedToken) {
		res.status(401).json({ error: 'Invalid token' });
		return;
	}

	// Fetch from users collection using uid

	const user = (await firebaseAdmin
		.firestore()
		.collection('users')
		.doc(decodedToken.uid)
		.get()) as FirebaseFirestore.DocumentSnapshot<IFirebaseTokenStorageDocument>;

	// Throw error if user does not exist

	if (!user.exists) {
		res.status(401).json({ error: 'User does not exist' });
		return;
	}

	const spotifyTokenInformation = user.data();

	if (!spotifyTokenInformation) {
		res.status(401).json({ error: 'User does not exist' });
		return;
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
			.doc(decodedToken.uid)
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

	// Fetch profile information using access token

	const apiUserResponse = await axios.get<SpotifyApi.UserProfileResponse>(
		'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term',
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		}
	);

	return res.status(200).json({ profile: apiUserResponse.data });
};

export default handler;
