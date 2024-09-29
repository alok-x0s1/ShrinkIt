"use client";

import { motion } from "framer-motion";

export default function HowToUse() {
	return (
		<div className="bg-background text-foreground min-h-screen pt-24">
			<section className="py-16 px-8">
				<motion.h1
					className="text-4xl md:text-5xl font-bold text-center mb-8"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					How to Use ?
				</motion.h1>
				<motion.p
					className="text-lg text-center text-gray-400 max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 1 }}
				>
					ShrinkIt is designed to make your life easier. Here&apos;s a
					simple guide to help you get started:
				</motion.p>
			</section>

			<section className="py-16 px-8">
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<motion.div
						className="border border-border p-6 rounded-lg shadow-lg"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 1 }}
					>
						<h3 className="text-xl font-bold mb-4">
							Step 1: Create an Account
						</h3>
						<p className="text-foreground/50">
							Sign up for a free account to start creating and
							managing your shortened URLs.
						</p>
					</motion.div>

					<motion.div
						className="border border-border p-6 rounded-lg shadow-lg"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 1 }}
					>
						<h3 className="text-xl font-bold mb-4">
							Step 2: Shorten Your URL
						</h3>
						<p className="text-foreground/50">
							Enter the long URL you want to shorten, and with
							just one click, your short URL is ready to share.
						</p>
					</motion.div>

					<motion.div
						className="border border-border p-6 rounded-lg shadow-lg"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 1 }}
					>
						<h3 className="text-xl font-bold mb-4">
							Step 3: Track Your Links
						</h3>
						<p className="text-foreground/50">
							Monitor how your links are performing with detailed
							analytics on clicks, geography, and more.
						</p>
					</motion.div>

					<motion.div
						className="border border-border p-6 rounded-lg shadow-lg"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 1 }}
					>
						<h3 className="text-xl font-bold mb-4">
							Step 4: Share Anywhere
						</h3>
						<p className="text-foreground/50">
							Share your shortened URLs via social media, email,
							or anywhere online.
						</p>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
