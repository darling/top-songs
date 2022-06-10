import { AnimatePresence } from 'framer-motion';
import { FC, ReactNode } from 'react';

export const Section: FC<{ children: ReactNode }> = ({ children }) => {
	return <section className="max-w-6xl w-full mx-auto">{children}</section>;
};

export const SectionContainer: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<AnimatePresence>
			<div className="flex flex-col gap-4 lg:gap-8">{children}</div>
		</AnimatePresence>
	);
};
