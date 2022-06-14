/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from '@headlessui/react';
import {
	CollectionIcon,
	HeartIcon,
	HomeIcon,
	MenuIcon,
	SearchCircleIcon,
	XIcon,
} from '@heroicons/react/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, Fragment, ReactNode, useState } from 'react';

import { useAuth } from '../../context/auth';
import { useTheme } from '../../context/theme';
import { classNames } from '../../util/classNames';

const navigation = [
	{ name: 'Home', href: '/', icon: HomeIcon, current: true },
	{ name: 'Liked Songs', href: '/likes', icon: HeartIcon, current: false },
	{
		name: 'Playlists',
		href: '/playlists',
		icon: CollectionIcon,
		current: false,
	},
	{
		name: 'Discover',
		href: '/discover',
		icon: SearchCircleIcon,
		current: false,
	},
];

interface ISidebarProps {
	children?: ReactNode;
}

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

export const LayoutSidebar: FC<ISidebarProps> = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { primary, secondary } = useTheme();
	const { user } = useAuth();
	const router = useRouter();

	const userName = user?.displayName || 'Guest';
	const userAvatar = user?.photoURL || 'https://via.placeholder.com/150';

	return (
		<div className="h-full flex">
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-40 lg:hidden"
					onClose={setSidebarOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>

					<div className="fixed inset-0 flex z-40">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel
								style={{ backgroundColor: secondary }}
								className="relative flex-1 flex flex-col max-w-xs w-full focus:outline-none"
							>
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute top-0 right-0 -mr-12 pt-2">
										<button
											type="button"
											className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
											onClick={() =>
												setSidebarOpen(false)
											}
										>
											<span className="sr-only">
												Close sidebar
											</span>
											<XIcon
												className="h-6 w-6 text-white"
												aria-hidden="true"
											/>
										</button>
									</div>
								</Transition.Child>
								<div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
									<div className="flex-shrink-0 flex items-center px-4">
										<Logo />
									</div>
									<nav aria-label="Sidebar" className="mt-5">
										<div className="px-2 space-y-1">
											{navigation.map((item) => (
												<Link
													key={item.name}
													href={item.href}
												>
													<a
														className={classNames(
															'text-xl text-zinc-700 group flex items-center px-2 py-2 font-bold rounded-md'
														)}
													>
														{item.name}
													</a>
												</Link>
											))}
										</div>
									</nav>
								</div>
								<div className="flex-shrink-0 flex border-t border-gray-200 p-4">
									<Link href={'/profile'}>
										<a className="flex-shrink-0 group block">
											<div className="flex items-center">
												<div>
													<img
														className="inline-block h-10 w-10 rounded-full"
														src={userAvatar}
														alt=""
													/>
												</div>
												<div className="ml-3">
													<p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
														{userName}
													</p>
													<p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
														View profile
													</p>
												</div>
											</div>
										</a>
									</Link>
								</div>
							</Dialog.Panel>
						</Transition.Child>
						<div className="flex-shrink-0 w-14" aria-hidden="true">
							{/* Force sidebar to shrink to fit close icon */}
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:flex lg:flex-shrink-0">
				<div className="flex flex-col w-64">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<motion.div
						animate={{
							backgroundColor: secondary,
						}}
						style={{
							backgroundColor: secondary,
						}}
						className="flex-1 flex flex-col min-h-0 drop-shadow-lg"
					>
						<div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
							<div className="flex items-center flex-shrink-0 px-4">
								<Logo />
							</div>
							<nav className="flex-1" aria-label="Sidebar">
								<div className="space-y-1 h-full flex flex-col justify-center">
									{navigation.map((item) => (
										<Link key={item.name} href={item.href}>
											<a
												className={classNames(
													'group flex items-center px-4 py-2 text-lg font-medium rounded-md'
												)}
											>
												{item.name}
											</a>
										</Link>
									))}
								</div>
							</nav>
						</div>
						<div className="flex-shrink-0 flex p-4">
							<Link href="/profile">
								<a className="flex-shrink-0 w-full group block">
									<div className="flex items-center">
										<div>
											<img
												className="inline-block h-9 w-9 rounded-full"
												src={userAvatar}
												alt=""
											/>
										</div>
										<div className="ml-3">
											<p className="text-sm font-medium text-zinc-900 group-hover:text-gray-900">
												{userName}
											</p>
											<p className="text-xs font-medium text-zinc-900 group-hover:text-gray-700">
												View profile
											</p>
										</div>
									</div>
								</a>
							</Link>
						</div>
					</motion.div>
				</div>
			</div>
			<div className="flex flex-col min-w-0 flex-1 overflow-hidden">
				<div className="lg:hidden">
					<motion.div
						animate={{ backgroundColor: primary }}
						className="flex items-center justify-between px-4 py-1.5"
					>
						<div>
							<Logo useSecondary />
						</div>
						<div>
							<button
								type="button"
								className="-mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-white"
								onClick={() => setSidebarOpen(true)}
							>
								<span className="sr-only">Open sidebar</span>
								<MenuIcon
									className="h-6 w-6"
									aria-hidden="true"
								/>
							</button>
						</div>
					</motion.div>
				</div>
				<div className="flex-1 relative z-0 flex overflow-hidden">
					<main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last min-h-screen">
						{/* Start main area*/}
						<AnimatePresence exitBeforeEnter>
							<motion.div
								key={router.asPath}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								{children}
							</motion.div>
						</AnimatePresence>
						{/* End main area */}
					</main>
				</div>
			</div>
		</div>
	);
};

{
	/* <aside className="hidden relative xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200 overflow-y-auto">
<div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
    <div className="h-full border-2 border-gray-200 border-dashed rounded-lg" />
</div>
</aside> */
}
