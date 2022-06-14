export const generatePrimaryColor = (value: number) => {
	const h = hueFromNumber(value);
	const s = 0.5;
	const l = 0.5;
	const rgb = hslToRgb(h, s, l);
	const hex = rgb.map((x) => x.toString(16).padStart(2, '0')).join('');
	return `#${hex}`;
};

export const generateSecondaryColor = (value: number) => {
	const h = hueFromNumber(value);
	const s = 0.8;
	const l = 0.9;
	const rgb = hslToRgb(h, s, l);
	const hex = rgb.map((x) => x.toString(16).padStart(2, '0')).join('');
	return `#${hex}`;
};

/**
 * Generate a hue from a given value.
 * @param value value between 0 and 1
 * @returns
 */
export const hueFromNumber = (value: number) => {
	const hue = Math.abs(value * 400) % 360;

	return hue / 360;
};

/**
 * Generate a color based on a given value between 0 and 1.
 * @param value value between 0 and 1
 * @returns color in hex format
 */
export const generateColor = (value: number) => {
	// Rather than doing 360 * value, we do it this way to avoid wrapping around to red again
	// Its more like a red to blue gradient
	const hue = hueFromNumber(value);

	// hsl formula
	const h = hue / 360;
	const s = 0.5;
	const l = 0.5;

	// convert hsl to rgb inline
	const rgb = hslToRgb(h, s, l);

	// convert rgb to hex
	const hex = rgb.map((x) => x.toString(16).padStart(2, '0')).join('');

	return `#${hex}`;
};

const hslToRgb = (h: number, s: number, l: number) => {
	let r, g, b;

	if (s == 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
