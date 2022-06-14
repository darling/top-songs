import { format } from 'date-fns';
import { groupBy, map, round, toNumber } from 'lodash';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import { mutate } from 'swr';

import { Layout } from '../components/Layout';
import { Section, SectionContainer } from '../components/Layout/Section';
import { useAuth } from '../context/auth';
import { useSpotifyLikes } from '../util/client/swr';

// interface ITopTracksProps {
// 	topTracks: SpotifyApi.UsersSavedTracksResponse;
// }

const Track: FC<{ song: SpotifyApi.SavedTrackObject }> = ({ song }) => {
	return (
		<div
			className="rounded-sm py-2 flex flex-row w-full"
			key={song.track.id}
		>
			<div className="aspect-square w-12 flex-shrink-0 mr-2 overflow-hidden rounded-sm">
				<img src={song.track.album.images[0].url} alt="" />
			</div>
			<div>
				<Link href={'/song/' + song.track.id}>
					<a>{song.track.name}</a>
				</Link>
				<h4>by {song.track.artists.map((a) => a.name).join(', ')}</h4>
			</div>
		</div>
	);
};

const Top: FC = () => {
	const { response, isLoading, isError } = useSpotifyLikes();
	const { user } = useAuth();

	useEffect(() => {
		if (!response) {
			console.log('Grabbing Songs');
			mutate('/api/spotify/likes');
		}
	}, [response]);

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

	if (!response) {
		return (
			<Layout>
				<SectionContainer>
					<Section>
						<div
							onClick={() => {
								mutate('/api/spotify/likes');
							}}
						>
							Loading...
						</div>
					</Section>
				</SectionContainer>
			</Layout>
		);
	}

	const itemList = response.items;
	const itemsSeperatedByYearAndMonth = groupBy(itemList, (item) => {
		const date = new Date(item.added_at);
		return `${format(date, 'yyyy MM')}`;
	});

	return (
		<Layout>
			<SectionContainer>
				<Section>
					<div className="p-2 pb-0 flex flex-col gap-4">
						<h1 className="md:text-5xl text-3xl font-bold">
							Your Recently Liked Spotify Songs
						</h1>
						<div>
							You have ~{response.total} songs saved. Pick a song,
							artist, or album to start exploring.
						</div>
					</div>
				</Section>
				<Section>
					{map(itemsSeperatedByYearAndMonth, (items, section) => {
						const [year, month] = section.split(' ').map(toNumber);

						const sectionDate = new Date();

						sectionDate.setMonth(month);
						sectionDate.setFullYear(year);

						const itemsSeperatedByDay = groupBy(items, (item) => {
							const date = new Date(item.added_at);
							return `${format(date, 'dd')}`;
						});

						return (
							<div className="p-2" key={section}>
								<div className="text-center py-8">
									<h2 className="text-2xl font-bold">
										{format(sectionDate, 'MMMM yy')}
									</h2>
									<p>{items.length} songs</p>
								</div>
								<div className="grid grid-cols-1 gap-2">
									{map(
										itemsSeperatedByDay,
										(items, section) => {
											const [day] = section
												.split(' ')
												.map(toNumber);

											const sectionDate = new Date();

											sectionDate.setDate(day);

											return (
												<div key={section}>
													<h3 className="text-xl font-bold py-2">
														{format(
															sectionDate,
															'EEEE do'
														).replace(' ', ' the ')}
													</h3>
													<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
														{map(items, (item) => {
															return (
																<Track
																	song={item}
																	key={
																		item
																			.track
																			.id
																	}
																/>
															);
														})}
													</div>
												</div>
											);
										}
									)}
									{/* {map(items, (item) => {
										return (
											<div
												className="rounded-sm p-2"
												key={item.track.id}
											>
												<p>
													Added on the{' '}
													{format(
														new Date(item.added_at),
														'do'
													)}
												</p>
												<Link href={'/song/'}>
													<a>{item.track.name}</a>
												</Link>
												<h4>
													by{' '}
													{item.track.artists
														.map((a) => a.name)
														.join(', ')}
												</h4>
											</div>
										);
									})} */}
								</div>
							</div>
						);
					})}
				</Section>
				<Section>
					<pre>
						<code>
							{JSON.stringify(
								{ itemsSeperatedByYearAndMonth },
								null,
								2
							)}
						</code>
					</pre>
					{/* <pre>
						<code>{JSON.stringify({ response }, null, 2)}</code>
					</pre> */}
				</Section>
			</SectionContainer>
		</Layout>
	);
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	const cookies = new Cookies(context.req.headers.cookie);
// 	const potentialToken = cookies.get('token');
// 	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

// 	const topTracks = await getSpotifyUserTracks(token.uid, 50);

// 	return {
// 		props: {
// 			topTracks,
// 		},
// 	};
// };

export default Top;
