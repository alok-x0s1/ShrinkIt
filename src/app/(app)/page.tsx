"use client";

import { useEffect } from "react";
import FeaturesSection from "@/components/FeaturesSection";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
	const controls = useAnimation();

	useEffect(() => {
		controls.start((i) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" },
		}));
	}, [controls]);

	return (
		<div className="text-foreground min-h-screen">
			<section className="w-full min-h-screen relative overflow-hidden flex items-center">
				<div className="container mx-auto px-4 md:px-12 h-full flex flex-col md:flex-row items-center">
					<motion.div
						className="flex flex-col justify-center items-start gap-8 w-full md:w-3/4 lg:w-1/2 z-10"
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 1 }}
					>
						<motion.h1
							className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
							custom={0}
							initial={{ opacity: 0, y: 50 }}
							animate={controls}
						>
							Simplify Your Links with ShrinkIt
						</motion.h1>
						<motion.p
							className="text-base sm:text-lg md:text-xl text-muted-foreground"
							custom={1}
							initial={{ opacity: 0, y: 50 }}
							animate={controls}
						>
							Create short, easy-to-share URLs with just a few
							clicks. Customize your links with passwords, set
							expiration dates, and track usage statistics
							effortlessly.
						</motion.p>
						<motion.div
							className="flex flex-col sm:flex-row gap-4"
							custom={2}
							initial={{ opacity: 0, y: 50 }}
							animate={controls}
						>
							<Button
								asChild
								size="lg"
								className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
							>
								<Link href="/create">Create Now</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
							>
								<Link href="/sign-in">Start for Free</Link>
							</Button>
						</motion.div>
					</motion.div>

					{/* Image container for larger screens */}
					<div className="hidden md:block md:absolute md:-right-10 top-32 lg:static md:w-1/3 lg:w-1/2 mt-10 md:mt-0 border border-foreground/10 rounded-xl overflow-hidden shadow-md hover:shadow-xl duration-300 transition-all hover:scale-102 hover:-translate-y-2">
						<Image
							src="/link.png"
							alt="Dashboard"
							width={800}
							height={700}
							className="object-contain"
						/>
					</div>
				</div>
			</section>

			{/* Adjusting other sections if needed */}
			<FeaturesSection />
			<Testimonials />
		</div>
	);
}
