import '../styles/globals.css';

import type { AppProps } from 'next/app';

import '../util/client/firebase';
import { AuthProvider } from '../context/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from '../context/theme';

function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		<ThemeProvider>
			<AuthProvider>
				<div className="bg-amber-50 h-full">
					<Component {...pageProps} />
				</div>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default MyApp;
