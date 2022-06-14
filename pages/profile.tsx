import { motion } from 'framer-motion';
import { toString } from 'lodash';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import { mutate } from 'swr';

import { Layout } from '../components/Layout';
import { Section, SectionContainer } from '../components/Layout/Section';
import { ProfileNowPlaying } from '../components/profile/NowPlaying';
import { useAuth } from '../context/auth';
import { useTheme } from '../context/theme';
import { useNowPlaying } from '../util/client/swr';
import { generateColor } from '../util/color';

interface IProfileProps {
	// profile: SpotifyApi.UserProfileResponse;
	initialData: {
		currentlyPlaying: SpotifyApi.CurrentlyPlayingResponse | null;
		trackFeatures: SpotifyApi.AudioFeaturesResponse | null;
	};
}

const Profile: FC<IProfileProps> = ({ initialData }) => {
	const { primary } = useTheme();
	const { user } = useAuth();

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

	return (
		<Layout>
			<SectionContainer>
				<motion.div
					animate={{
						backgroundColor: primary,
					}}
					className="h-screen flex flex-col justify-center items-center py-12 z-10 text-amber-100"
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
					<ProfileNowPlaying />
				</div>
				<motion.div
					animate={{
						backgroundColor: primary,
					}}
					className="z-10 w-full py-12"
				>
					<div className="max-w-6xl mx-auto">
						<Link href={'/likes'}>
							<a className="text-amber-50 text-lg font-bold">
								View your liked songs
							</a>
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
					<div></div>
				</Section>
			</SectionContainer>
		</Layout>
	);
};

// export const getServerSideProps: GetServerSideProps<IProfileProps> = async (
// 	context
// ) => {
// 	const cookies = new Cookies(context.req.headers.cookie);
// 	const potentialToken = cookies.get('token');
// 	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

// 	// const profile = await getSpotifyProfile(token.uid);
// 	const currentlyPlaying = await getSpotifyCurrent(token.uid);

// 	if (!currentlyPlaying.item) {
// 		return {
// 			props: {
// 				// profile,
// 				initialData: {
// 					currentlyPlaying: null,
// 					trackFeatures: null,
// 				},
// 			},
// 		};
// 	}

// 	const trackFeatures = await getSpotifyTrackFeatures(
// 		token.uid,
// 		currentlyPlaying.item.id
// 	);

// 	return {
// 		props: {
// 			// profile,
// 			initialData: {
// 				currentlyPlaying,
// 				trackFeatures,
// 			},
// 		},
// 	};
// };

export default Profile;
