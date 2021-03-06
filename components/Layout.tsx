import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FC } from 'react';
import { useAuth } from '../context/auth';
import { Footer } from './Layout/Footer';
import { Section } from './Layout/Section';
import { LayoutSidebar } from './Layout/Sidebar';

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
				<div className="h-full bg-amber-50 text-zinc-800 overflow-hidden">
					<LayoutSidebar>
						<div className="overflow-hidden whitespace-pre-wrap min-h-screen">
							{children}
						</div>
						<Footer />
					</LayoutSidebar>
				</div>
			</motion.main>
		</>
	);
};
