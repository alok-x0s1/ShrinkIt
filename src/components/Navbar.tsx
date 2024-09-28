"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleChevronDown, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./DarkMode";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const offset = window.scrollY;
			if (offset > 75) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<motion.nav
			className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
				scrolled
					? "backdrop-blur-md border-b border-border"
					: "bg-background"
			}`}
			initial={{ opacity: 0, y: -80 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-12">
				<div className="text-2xl font-bold">
					<Link href="/">ShrinkIt</Link>
				</div>

				<ul
					className={`hidden md:flex space-x-8  ${
						scrolled
							? "py-2 px-4"
							: "rounded-full border border-border shadow shadow-foreground py-2 px-4"
					}`}
				>
					<li className="hover:text-chart-1 duration-200 transition-colors">
						<Link href="/me">Profile</Link>
					</li>
					<li className="hover:text-chart-1 duration-200 transition-colors">
						<Link href="/create">Product</Link>
					</li>
					<li className="hover:text-chart-1 duration-200 transition-colors">
						<Link href="/contact">Contact</Link>
					</li>
					<li className="hover:text-chart-1 duration-200 transition-colors">
						<Link href="/github">Github</Link>
					</li>
				</ul>

				<ul className="hidden md:flex space-x-4">
					<li>
						<Button variant="secondary">
							<Link href="/sign-in">Sign In</Link>
						</Button>
					</li>
					<li>
						<ThemeToggle />
					</li>
				</ul>

				<div className="md:hidden">
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="focus:outline-none"
					>
						{isOpen ? <X /> : <CircleChevronDown />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<motion.div
					className="md:hidden border border-border backdrop-blur-md bg-background/75 shadow-lg md:w-1/3 w-1/2 ml-auto rounded-md right-6 z-20 absolute top-16"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<ul className="flex flex-col items-center space-y-4 py-4">
						<li
							className="hover:text-chart-1 duration-200 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							<Link href="/">Home</Link>
						</li>
						<li
							className="hover:text-chart-1 duration-200 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							<Link href="/about">About</Link>
						</li>
						<li
							className="hover:text-chart-1 duration-200 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							<Link href="/create">Product</Link>
						</li>
						<li
							className="hover:text-chart-1 duration-200 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							<Link href="/contact">Contact</Link>
						</li>
						<li
							className="hover:text-chart-1 duration-200 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							<Link href="/github">Github</Link>
						</li>

						<div className="flex flex-col space-y-2 mt-4">
							<li>
								<Button
									variant="secondary"
									onClick={() => setIsOpen(false)}
								>
									<Link href="/sign-in">Sign in</Link>
								</Button>
							</li>
							<li onClick={() => setIsOpen(false)}>
								<ThemeToggle />
							</li>
						</div>
					</ul>
				</motion.div>
			)}
		</motion.nav>
	);
}
