"use client";

import { motion } from "framer-motion";

const renderStars = (rating: number) => {
	return Array.from({ length: 5 }, (_, index) => (
		<span
			key={index}
			className={`text-yellow-500 ${
				index < rating ? "filled-star" : "empty-star"
			}`}
		>
			★
		</span>
	));
};

export default function Testimonials() {
	return (
		<section className="py-16">
			<div className="container mx-auto px-4 md:px-8">
				<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
					What Our Users Say
				</h2>

				<motion.div
					className="flex flex-wrap justify-center space-x-0 space-y-8 md:space-x-8 md:space-y-0"
					initial={{ x: "100%" }}
					animate={{ x: 0 }}
					transition={{ duration: 0.2 }}
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							className="flex flex-col p-6 border box-border rounded-lg shadow-lg w-full sm:w-80 transition-transform duration-300 hover:shadow-xl"
							whileHover={{ scale: 1.03 }}
						>
							<img
								src={testimonial.image}
								alt={testimonial.name}
								className="w-16 h-16 rounded-full border-2 border-gray-300 mb-4"
							/>
							<div className="flex mb-2">
								{renderStars(testimonial.rating)}
							</div>
							<p className="text-foreground/90 mb-4 text-sm md:text-base">
								{testimonial.feedback}
							</p>
							<h4 className="text-lg font-semibold text-foreground/80">
								{testimonial.name}
							</h4>
							<p className="text-sm text-foreground/70">
								{testimonial.role}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

const testimonials = [
	{
		name: "John Doe",
		feedback:
			"This URL shortener has completely transformed how I share links. It's fast, reliable, and the analytics are a game-changer. The ability to track link clicks in real-time has helped me adjust my marketing strategies effectively.",
		image: "/avatar.jpg",
		role: "Marketing Manager",
		rating: 5,
	},
	{
		name: "Jane Smith",
		feedback:
			"I love the ability to customize my links! It makes it so much easier to promote my brand. The user interface is incredibly intuitive, making the entire process a breeze.",
		image: "/avatar4.jpg",
		role: "Social Media Influencer",
		rating: 4,
	},
	{
		name: "Michael Lee",
		feedback:
			"Hands down, the best URL shortening service I’ve used. It’s simple, intuitive, and packed with features. The bulk link shortening feature is especially useful for my campaigns.",
		image: "/avatar3.png",
		role: "Content Creator",
		rating: 5,
	},
	{
		name: "Emily Chen",
		feedback:
			"As a small business owner, I appreciate how this service has improved my marketing efforts. Custom links help build trust with my audience, and the analytics allow me to see what’s working.",
		image: "/avatar2.jpg",
		role: "Small Business Owner",
		rating: 4,
	},
];
