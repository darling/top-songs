// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from 'universal-cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

import { firebaseAdmin } from '../../../util/server/firebase';
import {
	getSpotifyRecommendations,
	searchSpotify,
} from '../../../util/server/spotify';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<
		| {
				results: SpotifyApi.SearchResponse;
		  }
		| { message: string }
	>
) => {
	console.log('search', req.query.search);

	const cookies = new Cookies(req.headers.cookie);
	const potentialToken = cookies.get('token');
	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

	if (!token) {
		// Error
		res.status(401).json({ message: 'No token' });
		return;
	}

	if (!req.query.search) {
		// Error
		res.status(401).json({ message: 'No search query' });
		return;
	}

	const results = await searchSpotify(token.uid, req.query.search as string);

	if (!results) {
		res.status(401).json({ message: 'No response.' });
		return;
	}

	return res.status(200).json({ results });
};

export default handler;
