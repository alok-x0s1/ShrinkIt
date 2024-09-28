import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";

const rubik = Rubik({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
	title: "ShrinkIt",
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
			<body className={`${rubik.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					{children}
					<Footer />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
