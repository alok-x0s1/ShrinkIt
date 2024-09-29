import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const lato = Lato({
	subsets: ["latin"],
	weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
	title: "ShrinkIt | Auth",
	description:
		"ShrinkIt is a URL shortening service that allows you to create short, easy-to-share URLs with just a few clicks.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${lato.className} font-semibold antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex flex-col items-center justify-center h-screen">
						{children}
						<Toaster />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
