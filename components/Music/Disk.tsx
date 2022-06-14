import { AnimatePresence, motion, Variants } from 'framer-motion';
import { FC } from 'react';

export const Disk: FC<{ imgSrc: string; color: string }> = ({
	imgSrc,
	color,
}) => {
	const animationStates: Variants = {
		hidden: {
			opacity: 0,
		},
		visible: {
			opacity: 1,
			backgroundColor: color,
		},
		exit: {
			opacity: 0,
		},
	};

	return (
		<AnimatePresence exitBeforeEnter>
			<motion.div
				variants={animationStates}
				initial="hidden"
				animate="visible"
				exit="exit"
				key={imgSrc}
				className="relative w-full aspect-square rounded-full overflow-hidden"
			>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 aspect-square overflow-hidden rounded-full bg-black z-10"></div>
				<div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square overflow-hidden rounded-full opacity-40">
					<div
						className="h-full w-full animate-spin"
						style={{
							animation: 'spin 49s linear infinite',
						}}
					>
						<img className="opacity-50" src={imgSrc} />
					</div>
				</div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/3 w-1/3 aspect-square overflow-hidden rounded-full">
					<div
						className="h-full w-full"
						style={{
							animation: 'spin 8.2s linear infinite',
						}}
					>
						<img src={imgSrc} />
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
