import '../styles/globals.css';

import type { AppProps } from 'next/app';

import '../util/client/firebase';
import { AuthProvider } from '../context/auth';
import { AnimatePresence, motion } from 'framer-motion';

function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		<AuthProvider>
			<div className="bg-amber-50">
				<Component {...pageProps} />
			</div>
		</AuthProvider>
	);
}

export default MyApp;
