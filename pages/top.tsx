import { floor, map } from 'lodash';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FC } from 'react';
import Cookies from 'universal-cookie';

import { Layout } from '../components/Layout';
import { Section, SectionContainer } from '../components/Layout/Section';
import { useAuth } from '../context/auth';
import { firebaseAdmin } from '../util/server/firebase';
import { getSpotifyTopTracks } from '../util/server/spotify';

interface ITopTracksProps {
	topTracks: SpotifyApi.UsersTopTracksResponse;
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
						{user.displayName}'s Top Spotify Songs
					</h1>
				</Section>
				<Section>
					<div className="grid grid-cols-1 gap-4">
						{map(topTracks.items, (item, i) => {
							const audio = new Audio(
								item.preview_url || undefined
							);
							const duration_s = floor(item.duration_ms / 1000);
							const duration_m = floor(duration_s / 60);

							return (
								<div className="p-4 rounded-lg flex flex-row gap-4">
									<div className="w-24 h-24 overflow-hidden rounded-md flex-shrink-0">
										<img
											key={item.id}
											src={item.album.images[0].url}
											onMouseOver={() => {
												audio.play();
												audio.volume = 0.1;
											}}
											onMouseOut={() => {
												audio.pause();
											}}
											className=""
										/>
									</div>
									<div className="">
										<Link href={`/song/${item.id}`}>
											<a className="text-md font-bold">
												{item.name}
											</a>
										</Link>
										<h3>
											by{' '}
											{item.artists
												.map((a) => a.name)
												.join(', ')}
										</h3>
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
	const cookies = new Cookies(context.req.headers.cookie);
	const potentialToken = cookies.get('token');
	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

	const topTracks = await getSpotifyTopTracks(token.uid, 50);

	return {
		props: {
			topTracks,
		},
	};
};

export default Top;
