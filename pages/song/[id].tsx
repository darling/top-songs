import { formatRelative } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import { omit } from 'lodash';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

import { Layout } from '../../components/Layout';
import { Section, SectionContainer } from '../../components/Layout/Section';
import { Disk } from '../../components/Music/Disk';
import { useTheme } from '../../context/theme';
import { firebaseAdmin } from '../../util/server/firebase';
import { getSongMetadata } from '../../util/server/lastfm';
import {
	getSpotifyTrack,
	getSpotifyTrackFeatures,
} from '../../util/server/spotify';

interface ISongProps {
	track: SpotifyApi.TrackObjectFull;
	features: SpotifyApi.AudioFeaturesResponse;
}

const Header: FC<{ children: string }> = ({ children }) => {
	return <h2 className="text-xl font-bold">{children}</h2>;
};

interface IRelationshipProps {
	name: string;
	id: string;
	type: string;
}

const Relationship: FC<IRelationshipProps> = ({ name, id, type }) => {
	const { primary } = useTheme();

	return (
		<div className="border border-zinc-900 w-full p-2 flex flex-col">
			<div className="pb-2">
				<p>{type}</p>
				<h2 className="font-bold tracking-wide">{name}</h2>
			</div>
			<Link href={`/${type}/${id}`}>
				<motion.a
					whileHover={{ backgroundColor: primary, cursor: 'pointer' }}
					className="p-2 border border-zinc-900"
				>
					Explore
				</motion.a>
			</Link>
		</div>
	);
};

const SongDisplay: FC<ISongProps> = ({ track, features }) => {
	const { primary, setValue } = useTheme();
	const [response, setResponse] = useState<any>({});

	useEffect(() => {
		setValue(features.energy);
		getSongMetadata(track.artists[0].name, track.name).then((res) => {
			setResponse(res);
		});
	}, [track, features.energy]);

	const bio = (
		response?.track?.wiki?.content ||
		'No information has been found for this track.'
	).replace(/<a[^>]*>([^<]+)<\/a>\./g, '');

	const duration_m = Math.floor(track.duration_ms / 60000);
	const duration_s = Math.floor((track.duration_ms % 60000) / 1000);

	const information = [
		['Artist', track.artists.map((a) => a.name).join(', ')],
		['Album', track.album.name],
		['Duration', `${duration_m}:${duration_s.toString().padStart(2, '0')}`],
		['Release', track.album.release_date],
	];

	return (
		<Layout>
			<SectionContainer>
				<div className="relative max-w-6xl w-full mx-auto py-16">
					{/* <div className="absolute z-0 bottom-0 left-0 translate-y-1/2 -translate-x-1/3 md:w-1/2 w-3/4 lg:w-1/4 hidden lg:block">
						<Disk
							imgSrc={track.album.images[0].url}
							color={primary}
						/>
					</div> */}
					<div className="absolute z-0 top-0 right-0 -translate-y-1/2 translate-x-1/3 w-3/4 md:w-1/4 lg:w-1/3">
						<Disk
							imgSrc={track.album.images[0].url}
							color={primary}
						/>
					</div>
					<div className="p-4 text-left lg:text-center flex flex-col gap-2 max-w-4xl mx-auto">
						<h1 className="z-10 text-3xl lg:text-5xl font-bold tracking-tight">
							{track.name}
						</h1>
						<h2 className="z-10 text-xl">
							{track.artists.map((a) => a.name).join(', ')}
						</h2>
					</div>
				</div>
				<Section>
					<div className="flex flex-col gap-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 bg-amber-50 gap-4 px-4">
							<div className="flex flex-col gap-4 text-md tracking-wider">
								<Header>Track Information</Header>
								<table className="table-auto">
									<tbody>
										{information.map(([key, value]) => (
											<tr key={key}>
												<td className="text-left pr-4">
													<span className="text-sm font-semibold">
														{key}
													</span>
												</td>
												<td className="text-left">
													<span className="text-sm">
														{value}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="flex flex-col gap-4">
								<Header>About this track</Header>
								<AnimatePresence exitBeforeEnter>
									<motion.p
										key={bio}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										{bio}
									</motion.p>
								</AnimatePresence>
								<a href={response?.track?.url}>
									Learn more on Last.FM
								</a>
							</div>
						</div>
						<div className="flex flex-col gap-4 px-4">
							<Header>Track Relationships</Header>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
								<Relationship
									name={track.album.name}
									type={track.album.type}
									id={track.album.id}
								/>
								{track.artists.map((artist) => {
									return (
										<Relationship
											key={artist.id}
											name={artist.name}
											type={artist.type}
											id={artist.id}
										/>
									);
								})}
							</div>
						</div>
					</div>
				</Section>
				<Section>
					<div className="z-10">
						<pre>
							<code>
								{JSON.stringify(
									omit(track.album, 'available_markets'),
									null,
									2
								)}
							</code>
						</pre>
						<pre>
							<code>
								{JSON.stringify(
									omit(
										track,
										'available_markets',
										'album',
										'artists'
									),
									null,
									2
								)}
							</code>
						</pre>
					</div>
				</Section>
			</SectionContainer>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps<ISongProps> = async (
	context
) => {
	// params id check if exist

	const { id } = context?.query;

	if (!id) {
		return {
			notFound: true,
		};
	}

	const cookies = new Cookies(context.req.headers.cookie);
	const potentialToken = cookies.get('token');
	const token = await firebaseAdmin.auth().verifyIdToken(potentialToken);

	const track = await getSpotifyTrack(token.uid, id as string);
	const features = await getSpotifyTrackFeatures(token.uid, id as string);

	return {
		props: {
			track,
			features,
		},
	};
};

export default SongDisplay;
