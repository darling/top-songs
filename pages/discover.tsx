import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { Layout } from '../components/Layout';
import {
	getSpotifyRecommendation,
	searchSpotify,
} from '../util/client/spotify';
import { useSpotifyRecommendations } from '../util/client/swr';

const Discover = () => {
	const [songs, setSongs] = useState<string[]>([]);
	const [newSongSearch, setNewSongSearch] = useState('');
	const [recList, setRecList] = useState<SpotifyApi.TrackObjectSimplified[]>(
		[]
	);

	const fetch = async () => {
		const response = await getSpotifyRecommendation({
			seed_tracks: songs.join(','),
			limit: 50,
		});

		setRecList(response.tracks);
	};

	return (
		<Layout>
			<div className="flex flex-col p-4 py-8">
				<h1 className="text-3xl font-bold">Discover new music</h1>
				<h2 className="text-lg">
					Tweak the parameters in the Spotify Algo to work for you.
				</h2>
			</div>
			<div>
				<p>I want music like...</p>
				<ul>
					{songs.map((song) => (
						<li key={song}>
							<p>{song}</p>
							<button
								onClick={() => {
									setSongs(songs.filter((s) => s !== song));
								}}
							>
								Remove
							</button>
						</li>
					))}
				</ul>
				<input
					value={newSongSearch}
					onChange={(e) => setNewSongSearch(e.target.value)}
					type="text"
				/>
				<button
					onClick={async () => {
						const track = await searchSpotify(newSongSearch);
						console.log(track);
						setSongs([...songs, newSongSearch]);
						setNewSongSearch('');
					}}
				>
					Add
				</button>
				<button
					onClick={() => {
						fetch();
					}}
				>
					Search
				</button>
			</div>
			<div>
				<pre>
					<code>{JSON.stringify(recList, null, 2)}</code>
				</pre>
			</div>
		</Layout>
	);
};

export default Discover;
