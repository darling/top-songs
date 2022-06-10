import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FC } from 'react';
import { useAuth } from '../context/auth';
import { Section } from './Layout/Section';

export const Layout: FC<{ children: any }> = ({ children }) => {
	const { user } = useAuth();

	return (
		<>
			<Head>
				<title>UwU</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<motion.main>
				<div className="min-h-screen bg-amber-50 text-zinc-800 overflow-hidden">
					<Section>
						<div className="py-4">
							Logo -{' '}
							<Link href={'/profile'}>
								<a>{user?.displayName || 'Sign In'}</a>
							</Link>{' '}
							- <Link href={'/'}>Home</Link>
						</div>
					</Section>

					<div className="overflow-hidden whitespace-pre-wrap pt-4">
						{children}
					</div>
				</div>
			</motion.main>
		</>
	);
};