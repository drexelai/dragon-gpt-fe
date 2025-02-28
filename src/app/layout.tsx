import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { TouchProvider } from "@/components/ui/TouchProvider";
import Head from "next/head";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
});

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "DragonGPT",
	description: "Answer any Drexel question in seconds",
	icons: {
		icon: "favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content" />

			</Head>
			<body
				className={`${plusJakartaSans.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TouchProvider>{children}</TouchProvider>
				</ThemeProvider>
				<Toaster
					toastOptions={{
						className: "bg-neutral-600/50 dark:bg-neutral-500/40 backdrop-blur-lg backdrop-filter text-white dark:border-white/10 border-black/10",
						duration: 1500
					}}
					position="top-right"
				/>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
