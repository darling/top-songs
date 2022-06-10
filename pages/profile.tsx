import { motion } from 'framer-motion';
import { round } from 'lodash';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';
import { FC } from 'react';

import { Layout } from '../components/Layout';
import { Section, SectionContainer } from '../components/Layout/Section';
import { ProfileNowPlaying } from '../components/profile/NowPlaying';
import { useAuth } from '../context/auth';
import { useNowPlaying } from '../util/client/swr';
import { generateColor } from '../util/color';
import { firebaseAdmin } from '../util/server/firebase';
import {
	getSpotifyCurrent,
	getSpotifyProfile,
	getSpotifyTrackFeatures,
} from '../util/server/spotify';

interface IProfileProps {
	profile: SpotifyApi.UserProfileResponse;
	initialData: {
		currentlyPlaying: SpotifyApi.CurrentlyPlayingResponse | null;
		trackFeatures: SpotifyApi.AudioFeaturesResponse | null;
	};
}

const Profile: FC<IProfileProps> = ({ profile, initialData }) => {
	let currentSong = initialData.currentlyPlaying?.item;
	let currentFeatures = initialData.trackFeatures;

	const { response } = useNowPlaying();
	const { user } = useAuth();

	if (response) {
		currentSong = response.currentlyPlaying.item;
		currentFeatures = response.trackFeatures;
	}

	if (!user) {
		return (
			<Layout>
				<SectionContainer>
					<Section>
						<div>You are not logged in</div>
					</Section>
				</SectionContainer>
			</Layout>
		);
	}

	if (currentSong?.type !== 'track' || !currentSong || !currentFeatures) {
		return (
			<Layout>
				<SectionContainer>
					<Section>
						<div>You are not currently listening to a song</div>
					</Section>
				</SectionContainer>
			</Layout>
		);
	}

	return (
		<Layout>
			<SectionContainer>
				<motion.div
					animate={{
						minHeight: '90vh',
						backgroundColor: generateColor(currentFeatures.energy),
					}}
					className="flex flex-col justify-center items-center py-12 z-10 text-amber-100"
				>
					<div className="rounded-full w-3/5 md:w-1/5 aspect-square overflow-hidden drop-shadow-lg">
						<img
							className="h-full w-full"
							src={user.photoURL || '/img/placeholder.png'}
						/>
					</div>
					<h1 className="text-7xl font-bold break-words">
						{user.displayName}
					</h1>
					<h2 className="text-sm">on Spotify</h2>
				</motion.div>
				<div className="">
					<ProfileNowPlaying
						nowPlaying={currentSong}
						currentFeatures={currentFeatures}
					/>
				</div>
				<motion.div
					animate={{
						backgroundColor: generateColor(currentFeatures.energy),
					}}
					className="z-10 w-full py-12"
				>
					<div className="max-w-6xl mx-auto">
						<Link href={'/likes'}>
							<a>liked songs</a>
						</Link>
					</div>
				</motion.div>
				<Section>
					<div className="flex flex-col lg:flex-row">
						<div></div>
						<div></div>
					</div>
				</Section>
				<Section>
					<motion.div
						style={{
							animation: `ping ${
								(60000 / currentFeatures.tempo) *
								currentFeatures.time_signature
							}ms cubic-bezier(0, 0, 0.2, 1) infinite`,
						}}
						className="h-2 w-2 rounded-full bg-red-500"
					/>
					<div>{(60 / (currentFeatures.tempo || 0)) * 4}</div>
					<pre>
						<code>{JSON.stringify(currentSong, null, 2)}</code>
					</pre>
					<pre>
						<code>{JSON.stringify(currentFeatures, null, 2)}</code>
					</pre>
				</Section>
			</SectionContainer>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps<IProfileProps> = async (
	context
) => {
	const cookies = nookies.get(context);
	const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
	const profile = await getSpotifyProfile(token.uid);
	const currentlyPlaying = await getSpotifyCurrent(token.uid);

	if (!currentlyPlaying.item) {
		return {
			props: {
				profile,
				initialData: {
					currentlyPlaying: null,
					trackFeatures: null,
				},
			},
		};
	}

	const trackFeatures = await getSpotifyTrackFeatures(
		token.uid,
		currentlyPlaying.item.id
	);

	return {
		props: {
			profile,
			initialData: {
				currentlyPlaying,
				trackFeatures,
			},
		},
	};
};

export default Profile;
