import { NextApiHandler } from 'next';
import Cookies from 'universal-cookie';
import { firebaseAdmin } from '../../../../util/server/firebase';
import {
	getSpotifyTrack,
	getSpotifyTrackFeatures,
} from '../../../../util/server/spotify';

const handler: NextApiHandler = async (req, res) => {
	const { id } = req.query;

	if (!id) {
		res.status(400).json({ error: 'No track id provided' });
		return;
	}

	const cookies = new Cookies(req.headers.cookie);
	const potentialToken = cookies.get('token');
	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

	if (!token) {
		res.status(401).json({ error: 'Invalid token' });
		return;
	}

	const track = await getSpotifyTrack(token.uid, id as string);
	const features = await getSpotifyTrackFeatures(token.uid, id as string);

	res.status(200).json({
		track,
		features,
	});
};

export default handler;
