import { keys, omit } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { mutate } from 'swr';
import { Layout } from '../../components/Layout';
import { Disk } from '../../components/Music/Disk';
import { useAuth } from '../../context/auth';
import { useTheme } from '../../context/theme';
import { useSpotifyAlbum } from '../../util/client/swr';

const Album = () => {
	const { user } = useAuth();
	const { primary } = useTheme();
	const { query } = useRouter();
	const { id } = query;
	const { response, isError, isLoading } = useSpotifyAlbum(id as string);

	useEffect(() => {
		mutate('/api/spotify/album/' + id);
	}, [id, user]);

	if (isError) {
		return <Layout>{JSON.stringify(isError)}</Layout>;
	}

	if (isLoading) {
		return <Layout>Loading...</Layout>;
	}

	const { album, meta } = response;

	// Remove a tags completely
	const bio = (
		meta?.album?.wiki?.content ||
		'No information has been found for this album.\n'
	).replace(/<a[^>]*>([^<]+)<\/a>.+/g, '\n\n');

	const releaseInformation = [
		['Date', album.release_date],
		['Type', album.album_type],
		['Label', album.label],
		['Copyright', album.copyrights.map((c) => c.text).join(', ')],
	];

	return (
		<Layout>
			<div className="relative max-w-6xl w-full mx-auto py-16">
				<div className="absolute z-0 top-0 right-0 -translate-y-1/2 translate-x-1/3 w-3/4 md:w-1/4 lg:w-1/3">
					<Disk imgSrc={album.images[0].url} color={primary} />
				</div>
				<div className="p-4 text-left lg:text-center flex flex-col gap-2 max-w-4xl mx-auto">
					<h1 className="z-10 text-3xl lg:text-5xl font-bold tracking-tight">
						{album.name}
					</h1>
					<h2 className="z-10 text-xl">
						{album.artists.map((a) => a.name).join(', ')}
					</h2>
				</div>
			</div>
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 tracking-wide text-md">
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-bold">Discover New Music</h2>
					<p>
						Select an option to start exploring music based off of
						this album.
					</p>
					<div className="flex flex-col lg:flex-row gap-4">
						<Link href={`/discover`}>
							<a className="border border-zinc-900 p-2">
								Use this album
							</a>
						</Link>
						<Link href={`/discover`}>
							<a className="border border-zinc-900 p-2">
								Use just this artist
							</a>
						</Link>
					</div>
					<h2 className="text-xl font-bold">Track List</h2>
					<div>
						<table className="table-auto">
							<tbody>
								{album.tracks.items.map((t, i) => {
									return (
										<tr key={t.id}>
											<td className="pr-4 py-2 text-zinc-700 text-sm">
												{t.track_number}
											</td>
											<td className="py-2 text-xl">
												<Link href={`/song/${t.id}`}>
													<a>{t.name}</a>
												</Link>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-bold">Release Information</h2>
					<table className="table-auto">
						<tbody>
							{releaseInformation.map(([k, v]) => {
								return (
									<tr key={k}>
										<td className="pr-4 py-2 text-zinc-700 text-sm">
											{k}
										</td>
										<td className="py-2">{v}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					<h2 className="text-xl font-bold">About the album</h2>
					<p>
						{bio}
						<a href={meta.album.url}>Learn more on Last.FM</a>
					</p>
				</div>
			</div>
			<div>
				<pre>
					<code>
						{JSON.stringify(
							omit(album, 'available_markets'),
							null,
							2
						)}
					</code>
				</pre>
			</div>
		</Layout>
	);
};

export default Album;
