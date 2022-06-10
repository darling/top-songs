// Generate a color based on a sinlge float from 0 to 1.
export const generateColor = (value: number) => {
	// Rather than doing 360 * value, we do it this way to avoid wrapping around to red again
	// Its more like a red to blue gradient
	const hue = Math.abs((value + 0.3) * 360);

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
