import axios from 'axios';
import { GetServerSideProps, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Layout } from '../../components/Layout';
import { Section, SectionContainer } from '../../components/Layout/Section';
import { useSpotifyTrack } from '../../util/client/swr';
import nookies from 'nookies';
import { firebaseAdmin } from '../../util/server/firebase';
import { getSpotifyCurrent, getSpotifyTrack } from '../../util/server/spotify';

interface ISongProps {
	songData: SpotifyApi.TrackObjectFull;
}

const SongDisplay: FC<ISongProps> = ({ songData }) => {
	const usedClassNamesTailwindOverride = 'animate-spin';

	return (
		<Layout>
			<div className="w-1/4 aspect-square bg-black flex justify-center items-center rounded-full">
				<div className="h-1/3 aspect-square overflow-hidden rounded-full">
					<div
						className="h-auto w-auto"
						style={{
							animation: 'spin 8.2s linear infinite',
						}}
					>
						<img src={songData.album.images[0].url} />
					</div>
				</div>
			</div>
			<SectionContainer>
				<Section>
					<h1>Song Display</h1>
					<Link href={'/top'}>
						<a>Go Back</a>
					</Link>
				</Section>
				<Section>
					<pre>
						<code>{JSON.stringify(songData, null, 2)}</code>
					</pre>
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

	const cookies = nookies.get(context);
	const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
	const track = await getSpotifyTrack(token.uid, id as string);

	return {
		props: {
			songData: track,
		},
	};
};

export default SongDisplay;
