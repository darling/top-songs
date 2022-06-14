// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from 'universal-cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

import { firebaseAdmin } from '../../../util/server/firebase';
import { getSpotifyRecommendations } from '../../../util/server/spotify';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<
		| {
				reccomendations: SpotifyApi.RecommendationsFromSeedsResponse;
		  }
		| { message: string }
	>
) => {
	console.log('rec');

	const cookies = new Cookies(req.headers.cookie);
	const potentialToken = cookies.get('token');
	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

	if (!token) {
		// Error
		res.status(401).json({ message: 'No token' });
		return;
	}

	console.log('AAAA', req.query);

	const reccomendations = await getSpotifyRecommendations(
		token.uid,
		req.query
	);

	if (!reccomendations) {
		res.status(401).json({ message: 'No response.' });
		return;
	}

	return res.status(200).json({ reccomendations });
};

export default handler;
