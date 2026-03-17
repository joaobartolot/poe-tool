/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				palette: {
					bg: 'rgb(var(--color-bg) / <alpha-value>)',
					surface: 'rgb(var(--color-surface) / <alpha-value>)',
					surfaceElevated:
						'rgb(var(--color-surface-elevated) / <alpha-value>)',
					border: 'rgb(var(--color-border) / <alpha-value>)',
					brand: 'rgb(var(--color-brand) / <alpha-value>)',
					textStrong: 'rgb(var(--color-text-strong) / <alpha-value>)',
					textMuted: 'rgb(var(--color-text-muted) / <alpha-value>)',
					warning: 'rgb(var(--color-warning) / <alpha-value>)',
				},
			},
			boxShadow: {
				card: '0 14px 32px -20px rgba(30, 58, 138, 0.45)',
			},
		},
	},
	plugins: [],
};
