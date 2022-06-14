// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from 'universal-cookie';

import { firebaseAdmin } from '../../../util/server/firebase';
import { getSpotifyUserTracks } from '../../../util/server/spotify';

import type { NextApiRequest, NextApiResponse } from 'next';
const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<
		| {
				likedSongs: SpotifyApi.UsersSavedTracksResponse;
		  }
		| { message: string }
	>
) => {
	console.log('likes');

	const cookies = new Cookies(req.headers.cookie);
	const potentialToken = cookies.get('token');
	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

	if (!token) {
		// Error
		res.status(401).json({ message: 'No token' });
		return;
	}

	const likedSongs = await getSpotifyUserTracks(token.uid, 50);

	if (!likedSongs) {
		res.status(401).json({ message: 'No liked songs :(' });
		return;
	}

	return res.status(200).json({ likedSongs });
};

export default handler;
