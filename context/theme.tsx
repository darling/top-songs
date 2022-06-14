import { createContext, useContext, useState } from 'react';
import { generatePrimaryColor, generateSecondaryColor } from '../util/color';

interface ITheme {
	value: number;
	setValue: (value: number) => void;
	primary: string;
	secondary: string;
}

export const ThemeContext = createContext<ITheme>({
	value: 0.5,
	setValue: () => {},
	primary: '#ff0000',
	secondary: '#ff0000',
});

export const ThemeProvider = ({ children }: { children: any }) => {
	const [value, setValue] = useState(0.5);

	const primary = generatePrimaryColor(value);
	const secondary = generateSecondaryColor(value);

	return (
		<ThemeContext.Provider
			value={{ value, setValue, primary, secondary }}
			children={children}
		/>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);

	return context;
};
