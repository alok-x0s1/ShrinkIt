"use client";

import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
	return (
		<motion.footer
			className="bg-background/80 backdrop-blur-sm text-foreground py-12 border-t border-border"
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 1 }}
		>
			<div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
				<motion.div
					className="flex flex-col"
					initial={{ opacity: 0, x: -50 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
				>
					<h2 className="text-2xl font-semibold mb-4">ShrinkIt</h2>
					<p className="text-primary">
						Simplify your links with ShrinkIt. Manage, customize,
						and track your URLs with ease. Join millions of users
						around the globe.
					</p>
				</motion.div>

				<motion.div
					className="flex flex-col"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.8 }}
				>
					<h3 className="text-xl font-semibold mb-4">Quick Links</h3>
					<ul className="space-y-2 text-primary">
						<li>
							<Link
								href="/about"
								className="hover:text-chart-1 transition-colors"
							>
								About
							</Link>
						</li>
						<li>
							<Link
								href="/contact"
								className="hover:text-chart-1 transition-colors"
							>
								Contact
							</Link>
						</li>
						<li>
							<Link
								href="/how-to-use"
								className="hover:text-chart-1 transition-colors"
							>
								How to use
							</Link>
						</li>
						<li>
							<Link
								href="/404"
								className="hover:text-chart-1 transition-colors"
							>
								404
							</Link>
						</li>
					</ul>
				</motion.div>

				<motion.div
					className="flex flex-col"
					initial={{ opacity: 0, x: 50 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.6, duration: 0.8 }}
				>
					<h3 className="text-xl font-semibold mb-4">Follow Us</h3>
					<div className="flex space-x-6 items-center">
						<a
							href="https://github.com/alok-x0s1"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:text-chart-1 transition-colors"
							aria-label="GitHub"
						>
							<Github size={28} />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:text-chart-2 transition-colors"
							aria-label="Twitter"
						>
							<Twitter size={28} />
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:text-chart-3 transition-colors"
							aria-label="LinkedIn"
						>
							<Linkedin size={28} />
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:text-chart-1 transition-colors"
							aria-label="Instagram"
						>
							<Instagram size={28} />
						</a>
					</div>
				</motion.div>
			</div>

			<motion.div
				className="mt-8 pt-4 text-center"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: 0.8, duration: 0.8 }}
			>
				<p className="text-gray-500 text-sm">
					&copy; {new Date().getFullYear()} ShrinkIt. All rights
					reserved.
				</p>
			</motion.div>
		</motion.footer>
	);
}
