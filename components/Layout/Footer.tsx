import { motion } from 'framer-motion';
import Link from 'next/link';
import { FC } from 'react';
import { useTheme } from '../../context/theme';

const Logo: FC<{ useSecondary?: boolean }> = ({ useSecondary }) => {
	const { primary, secondary } = useTheme();

	return (
		<div className="flex h-8 w-auto items-center justify-center">
			<motion.span
				className="text-3xl font-extrabold"
				style={{ color: useSecondary ? secondary : primary }}
			>
				Flight
			</motion.span>
		</div>
	);
};

const links = [
	{ name: 'Home', href: '/' },
	{ name: 'About', href: '/about' },
	{ name: 'Contact', href: '/contact' },
];

export const Footer = () => {
	const { primary, secondary } = useTheme();

	return (
		<motion.footer
			animate={{ backgroundColor: primary }}
			className="mt-16 pt-32 pb-16"
		>
			<div className="flex flex-col items-center gap-4">
				<Logo useSecondary />
				<div className="flex flex-row gap-4">
					{links.map((link) => {
						return (
							<Link href={link.href} key={link.name}>
								<a className="text-amber-100">{link.name}</a>
							</Link>
						);
					})}
				</div>
			</div>
		</motion.footer>
	);
};
