"use client";

import { useEffect } from "react";
import FeaturesSection from "@/components/FeaturesSection";
import Testimonials from "@/components/Testimonials";
import { ThreeDModel } from "@/components/ThreeDModel";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

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
				<div className="container mx-auto px-4 md:px-12 h-full flex items-center">
					<motion.div
						className="flex flex-col justify-center items-start gap-8 w-full lg:w-1/2 z-10"
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 1 }}
					>
						<motion.h1
							className="text-4xl md:text-6xl font-bold leading-tight"
							custom={0}
							initial={{ opacity: 0, y: 50 }}
							animate={controls}
						>
							Simplify Your Links with ShrinkIt
						</motion.h1>
						<motion.p
							className="text-lg md:text-xl text-muted-foreground"
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
								className="text-lg px-8 py-6"
							>
								<Link href="/create">Create Now</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="text-lg px-8 py-6"
							>
								<Link href="/sign-in">Start for Free</Link>
							</Button>
						</motion.div>
					</motion.div>
				</div>
				{/* <motion.div
					className="absolute right-0 top-0 w-full lg:w-[60%] h-full hidden lg:block"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.5 }}
				>
					<div className="w-full h-full">
						<ThreeDModel />
					</div>
				</motion.div> */}
			</section>

			<FeaturesSection />
			<Testimonials />
		</div>
	);
}
