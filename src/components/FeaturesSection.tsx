// components/FeaturesSection.js
import { motion } from "framer-motion";
import {
	ChartNoAxesCombined,
	FlaskConical,
	Link,
	LockKeyhole,
	MapPinHouse,
	MonitorSmartphone,
	QrCode,
	ScanEye,
} from "lucide-react";

export default function FeaturesSection() {
	const features = [
		{
			title: "Custom Short Links",
			description:
				"Generate short, memorable URLs with fully customizable slugs. Choose a slug that fits your brand or make it easy to remember for personal use. Custom short links are perfect for businesses looking to keep their branding consistent or individuals sharing personal content.",
			icon: <Link />,
			category: "Customization",
			tags: ["branding", "customization", "easy-to-remember"],
		},
		{
			title: "Password Protection",
			description:
				"Add an extra layer of security by applying a password to your short links. Ensure only authorized users can access your links by sharing a private password along with the link. This feature is ideal for sensitive content like private documents, photos, or exclusive deals.",
			icon: <LockKeyhole />,
			category: "Security",
			tags: ["security", "protection", "privacy"],
		},
		{
			title: "Link Expiration",
			description:
				"Set an expiration date for your short URLs to ensure they are only accessible for a limited time. Ideal for promotions, time-sensitive campaigns, or event invitations, link expiration automatically deactivates the URL after your selected time frame.",
			icon: <FlaskConical />,
			category: "Management",
			tags: ["time-sensitive", "temporary", "expiration"],
		},
		{
			title: "Analytics Dashboard",
			description:
				"Gain insights into how your short URLs are performing with our real-time analytics dashboard. Track metrics such as the number of clicks, geographic location, devices used, and referral sources to optimize your link-sharing strategy. Whether you’re a marketer or a business owner, these insights provide invaluable data to help drive engagement.",
			icon: <ChartNoAxesCombined />,
			category: "Analytics",
			tags: ["data", "tracking", "analytics"],
		},
		{
			title: "QR Code Generation",
			description:
				"Automatically generate a QR code for each of your short URLs, enabling quick and easy sharing through physical media or mobile devices. This feature is perfect for businesses that want to bridge the gap between offline and online experiences, like sharing a link at events, on product packaging, or in print ads.",
			icon: <QrCode />,
			category: "Sharing",
			tags: ["offline", "mobile", "QR code"],
		},
		{
			title: "Custom Link Previews",
			description:
				"Customize the link preview for social media sharing by defining the title, description, and image that will appear when your link is shared. Tailor the appearance of your shared URLs for a polished, professional look that matches your brand's identity.",

			icon: <ScanEye />,
			tags: ["social media", "custom preview", "branding"],
		},
		{
			title: "Device-Specific Redirects",
			description:
				"Redirect users based on their device type. You can specify different destination URLs for mobile, tablet, and desktop users. This feature is particularly useful for businesses looking to provide device-optimized experiences or promote different content depending on the user’s platform.",
			icon: <MonitorSmartphone />,
			tags: ["device-specific", "user experience", "optimization"],
		},
		{
			title: "Geolocation Targeting",
			description:
				"Redirect users to different destination URLs based on their geographic location. This is perfect for region-specific promotions, international businesses, or anyone needing to target content by country, state, or even city.",
			icon: <MapPinHouse />,
			tags: ["location", "geo-targeting", "personalization"],
		},
	];

	return (
		<section className="pb-16 min-h-screen" id="features">
			<div className="container mx-auto px-8">
				{/* Section Header */}
				<motion.h2
					className="text-center text-3xl md:text-4xl font-bold mb-24"
					initial={{ opacity: 0, y: -50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Why Choose ShortURL?
				</motion.h2>

				{/* Features Grid */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 1 }}
				>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							className="flex flex-col items-center p-6 gap-2 rounded-lg border border-border"
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.2, duration: 1 }}
						>
							{feature.icon}
							<h3 className="text-xl font-semibold mb-2">
								{feature.title}
							</h3>
							<p className="text-start text-foreground/50">
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
