import { AnimatePresence, motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { mutate } from 'swr';
import { useTheme } from '../../context/theme';
import { useNowPlaying } from '../../util/client/swr';
import { generateColor } from '../../util/color';
import { Disk } from '../Music/Disk';

const letterAnimationStates: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
	},
	exit: {
		opacity: 0,
	},
};

const containerAnimationStates: Variants = {
	hidden: {
		opacity: 1,
	},
	visible: {
		opacity: 1,
	},
	exit: {
		opacity: 1,
	},
};

export const ProfileNowPlaying: FC = () => {
	const { response, isError, isLoading } = useNowPlaying();
	const { primary, setValue } = useTheme();

	useEffect(() => {
		if (!response) {
			mutate('/api/spotify/playing');
		}

		if (response?.trackFeatures) {
			setValue(response.trackFeatures.energy);
		}
	}, [response]);

	let nowPlaying = response?.currentlyPlaying?.item;
	let currentFeatures = response?.trackFeatures;

	if (isError) {
		return (
			<div>
				<div>{JSON.stringify(isError)}</div>
			</div>
		);
	}

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (nowPlaying?.type !== 'track' || !nowPlaying || !currentFeatures) {
		return <div>You are not currently listening to a song</div>;
	}

	const artists = nowPlaying.artists.map((a) => a.name).join(', ');

	// only redraw if the nowPlaying changes or the counter changes

	return (
		<div className="relative py-8">
			<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 md:w-1/2 w-3/4 lg:w-1/4">
				<Disk imgSrc={nowPlaying.album.images[0].url} color={primary} />
			</div>
			<div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 md:w-1/2 w-3/4 lg:w-1/4 hidden lg:block">
				<Disk imgSrc={nowPlaying.album.images[0].url} color={primary} />
			</div>
			{/* <div onClick={() => handleClick()}>Debug Counter Increment</div> */}
			<AnimatePresence exitBeforeEnter>
				<motion.div
					variants={containerAnimationStates}
					initial="hidden"
					animate="visible"
					exit="hidden"
					key={nowPlaying.id}
				>
					<div className="max-w-7xl px-2 w-full mx-auto">
						<div className="lg:text-center text-left flex flex-col gap-4">
							<p className="text-xl">Currently playing</p>
							<div
								style={{ minHeight: `${4.5 * 1}rem` }}
								className="w-full text-3xl lg:text-7xl mx-auto flex flex-col justify-center align-middle drop-shadow-md"
							>
								{nowPlaying.name && (
									<motion.h2
										variants={letterAnimationStates}
										initial="hidden"
										animate="visible"
										exit="exit"
										className="break-words text-zinc-900 w-full tracking-tight font-extrabold"
									>
										<Link href={`/song/${nowPlaying.id}`}>
											<a className="hover:text-amber-400 relative">
												{nowPlaying.name}
												<motion.div
													style={{
														animation: `ping ${
															(60000 /
																currentFeatures.tempo) *
															currentFeatures.time_signature
														}ms cubic-bezier(0, 0, 0.2, 1) infinite`,
													}}
													className="absolute top-2 -right-2 h-4 w-4 rounded-full bg-red-500 animate-ping"
												/>
											</a>
										</Link>
									</motion.h2>
								)}
							</div>
							<p className="text-sm">By</p>
							<motion.h3
								variants={letterAnimationStates}
								initial="hidden"
								animate="visible"
								exit="exit"
								className="lg:text-3xl text-lg font-bold w-full"
							>
								{artists}
							</motion.h3>
							<pre className="text-left">
								<code>
									{JSON.stringify(currentFeatures, null, 2)}
								</code>
							</pre>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};
