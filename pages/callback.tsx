import axios from 'axios';
import { getAuth, signInWithCustomToken, UserCredential } from 'firebase/auth';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import { firebaseApp } from '../util/client/firebase';
import { firebaseAdmin } from '../util/server/firebase';

interface ICallbackProps {
	jwt: string;
	name: string;
}

const Callback: NextPage<ICallbackProps> = ({ jwt, name }) => {
	const [user, setUser] = useState<UserCredential | undefined>(undefined);
	const auth = useAuth();
	const router = useRouter();

	if (jwt) {
		const auth = getAuth();

		signInWithCustomToken(auth, jwt).then((user) => {
			setUser(user);
		});
	}

	useEffect(() => {
		if (auth.user != null) {
			router.push('/');
		}
	}, [router, auth]);

	return (
		<div>
			<div>Hello, {name}</div>
			<div>{jwt}</div>
			<div>
				<pre>
					<code>{JSON.stringify(user, null, 2)}</code>
				</pre>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<ICallbackProps> = async (
	context
) => {
	const { query } = context;
	const { code } = query;

	// First step is to verify the code exists.
	// If it doesn't, we can't continue.

	if (!code) {
		// If no code, return error.
		return {
			notFound: true,
		};
	}

	// Second step is to exchange the code for an access token.

	const apiTokenResponse = await axios.post(
		'https://accounts.spotify.com/api/token',
		qs.stringify({
			code,
			grant_type: 'authorization_code',
			redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
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

	// Debug log the status code and body.

	console.log(apiTokenResponse.status);
	console.log(apiTokenResponse.data);

	// Verify the response is valid and good to go.

	if (apiTokenResponse.status !== 200) {
		// If not, return error.
		return {
			notFound: true,
		};
	}

	// Use the access token to get the user's profile information.

	const apiUserResponse = await axios.get<SpotifyApi.UserProfileResponse>(
		'https://api.spotify.com/v1/me',
		{
			headers: {
				Authorization: `${apiTokenResponse.data.token_type} ${apiTokenResponse.data.access_token}`,
			},
		}
	);

	// Debug log the status code and body.

	console.log(apiUserResponse.status);
	console.log(apiUserResponse.data);

	// Verify the response is valid and good to go.

	if (apiUserResponse.status !== 200) {
		// If not, return error.
		return {
			notFound: true,
		};
	}

	const spotifyUser = apiUserResponse.data;

	// Use the access token to mint a new token in firebase.

	const jwt = await firebaseAdmin.auth().createCustomToken(spotifyUser.id);

	// Check if the user exists, if not, create them.
	// If they do, update their profile.

	await firebaseAdmin
		.auth()
		.getUser(spotifyUser.id)
		.then(() => {
			firebaseAdmin.auth().updateUser(spotifyUser.id, {
				displayName: spotifyUser.display_name,
				photoURL: spotifyUser.images?.[0].url,
			});
		})
		.catch(() => {
			firebaseAdmin.auth().createUser({
				uid: spotifyUser.id,
				displayName: spotifyUser.display_name,
				photoURL: spotifyUser.images?.[0].url,
			});
		});

	// Store the access, expire time, and refresh tokens in firestore.

	await firebaseAdmin
		.firestore()
		.collection('users')
		.doc(spotifyUser.id)
		.set(
			{
				accessToken: apiTokenResponse.data.access_token,
				refreshToken: apiTokenResponse.data.refresh_token,
				// Create a firestore timestamp for when the token will expire.
				expiresAt: firebaseAdmin.firestore.Timestamp.fromDate(
					new Date(
						Date.now() + apiTokenResponse.data.expires_in * 1000
					)
				),
			},
			{ merge: true }
		);

	return {
		props: {
			jwt: jwt,
			name: spotifyUser.display_name || 'Unknown',
		},
	};
};

export default Callback;
