import type { Config } from "tailwindcss";
import { themeVariants, prefersLight } from "tailwindcss-theme-variants";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/icons/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		'dark:invert',
	],
	theme: {
		extend: {
			transitionProperty: {
				'width': 'width'
			},
			boxShadow: {
				spread: '0px 17px 40px 4px #7090B01C',
			},
			backgroundColor: {
				almostWhite: '#F7F7F7',
				// almostWhite: '#7090B01C',
				'background-95': 'hsl(var(--background) / 0.95)',
				'background-70': 'hsl(var(--background) / 0.7)',
				'sage-primary': '#195761',
				'dark-primary': 'white',
				'light-primary': 'rgb(229 231 235 / var(--tw-bg-opacity))',
			},
			backgroundImage: {
				'dark-teal-gradient': 'linear-gradient(153deg, #3987A8 20.44%, #44B09E 56.01%, #F9F9F9 99.69%)',
				'light-teal-gradient': 'linear-gradient(153deg, #14557B -0.31%, #7FCEC5 99.69%)'
			},
			borderColor: {
				'border-40': 'hsl(var(--border) / 0.4)',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				blink: {
					'0%': { opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
			},
			animation: {
				blink: 'blink 0.7s infinite',
			},
			width: {
				'0.5': '0.125rem',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		themeVariants({
			themes: {
				light: {
					mediaQuery: prefersLight /* "@media (prefers-color-scheme: light)" */,
				},
			}
		})
	],
};
export default config;
