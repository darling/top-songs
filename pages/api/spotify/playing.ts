// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'universal-cookie';
import { firebaseAdmin } from '../../../util/server/firebase';
import {
	getSpotifyCurrent,
	getSpotifyProfile,
	getSpotifyTrackFeatures,
} from '../../../util/server/spotify';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<
		| {
				currentlyPlaying: SpotifyApi.CurrentlyPlayingResponse;
				trackFeatures: SpotifyApi.AudioFeaturesResponse;
		  }
		| { message: string }
	>
) => {
	const cookies = new Cookies(req.headers.cookie);
	const potentialToken = cookies.get('token');
	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

	if (!token) {
		// Redirect to home
		res.status(302).redirect('/');
		return;
	}

	const currentlyPlaying = await getSpotifyCurrent(token.uid);

	if (!currentlyPlaying || !currentlyPlaying.item) {
		res.status(200).json({ message: 'No currently playing track' });
		return;
	}

	const trackFeatures = await getSpotifyTrackFeatures(
		token.uid,
		currentlyPlaying.item.id
	);

	if (!currentlyPlaying) {
		res.status(401).json({ message: 'No currently playing track' });
		return;
	}

	return res.status(200).json({ currentlyPlaying, trackFeatures });
};

export default handler;
