import { format } from 'date-fns';
import { map } from 'lodash';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { FC } from 'react';

import { Layout } from '../components/Layout';
import { Section, SectionContainer } from '../components/Layout/Section';
import { useAuth } from '../context/auth';
import { firebaseAdmin } from '../util/server/firebase';
import { getSpotifyUserTracks } from '../util/server/spotify';

interface ITopTracksProps {
	topTracks: SpotifyApi.UsersSavedTracksResponse;
}

const Top: FC<ITopTracksProps> = ({ topTracks }) => {
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
				<Section>
					<h1 className="text-5xl font-bold">
						Your Recently Liked Spotify Songs
					</h1>
				</Section>
				<Section>
					<div className="grid grid-cols-1 gap-4">
						{map(topTracks.items, (item) => {
							return (
								<div>
									{/* <h2 className="text-xl font-bold pb-2">
										{format(
											new Date(item.added_at),
											'MMMM dd'
										)}
									</h2> */}
									<div>
										<code>
											<span className="text-zinc-600">
												{format(
													new Date(item.added_at),
													'MMMM do'
												)}
											</span>{' '}
											-{' '}
										</code>
										{item.track.name}
									</div>
								</div>
							);
						})}
					</div>
				</Section>
			</SectionContainer>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const cookies = nookies.get(context);
	const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
	const topTracks = await getSpotifyUserTracks(token.uid, 50);

	return {
		props: {
			topTracks,
		},
	};
};

export default Top;
