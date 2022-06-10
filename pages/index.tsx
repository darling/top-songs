import { getAuth, signOut } from 'firebase/auth';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';
import { Section, SectionContainer } from '../components/Layout/Section';
import { useAuth } from '../context/auth';

import { firebaseApp } from '../util/client/firebase';

const Home: NextPage = () => {
	const auth = useAuth();

	return (
		<Layout>
			<SectionContainer>
				<Section>
					<div>{firebaseApp.options.projectId}</div>
					<a
						onClick={() => {
							window.location.assign(
								`https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_API_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}&scope=user-read-private+user-top-read+user-library-read+user-read-playback-state`
							);
						}}
					>
						Hello
					</a>
					<Link href="/top">
						<a>Top</a>
					</Link>
					<button
						onClick={() => {
							signOut(getAuth());
						}}
					>
						Sign out
					</button>
				</Section>
				<Section>
					<div>
						<pre>
							<code>{JSON.stringify(auth, null, 2)}</code>
						</pre>
					</div>
				</Section>
			</SectionContainer>
		</Layout>
	);
};

export default Home;
