import { getAuth, User } from 'firebase/auth';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

import Cookies from 'universal-cookie';

interface IAuthContext {
	user: User | null;
}

export const AuthContext = createContext<IAuthContext>({ user: null });

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const auth = getAuth();

		const cookies = new Cookies();

		const unsub = auth.onIdTokenChanged(async (user) => {
			setUser(user);

			if (user) {
				const token = await user.getIdToken();
				cookies.set('token', token, { path: '/' });
			} else {
				cookies.set('token', '', { path: '/' });
			}
		});

		return () => {
			unsub();
		};
	}, []);

	// force refresh the token every 10 minutes
	useEffect(() => {
		const handle = setInterval(async () => {
			const auth = getAuth();
			const user = auth.currentUser;
			if (user) await user.getIdToken(true);
		}, 10 * 60 * 1000);

		// clean up setInterval
		return () => clearInterval(handle);
	}, []);

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within a AuthProvider');
	}

	return context;
};
