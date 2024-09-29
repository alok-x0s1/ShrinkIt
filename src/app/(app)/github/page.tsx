"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import img from "../../img.png";
import { BookMarked, Link, MapPinHouse } from "lucide-react";
import { motion } from "framer-motion"; // Import motion from framer-motion

interface GithubData {
	avatar_url: string;
	name: string;
	bio: string;
	location?: string;
	public_repos: number;
	followers: number;
	following: number;
	login: string;
}

const Github = () => {
	const [data, setData] = useState<GithubData | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			try {
				setLoading(true);
				const response = await fetch(
					"https://api.github.com/users/alok-x0s1"
				);
				if (!response.ok) throw new Error("Failed to fetch");

				const result = await response.json();
				const fetchedData: GithubData = {
					avatar_url: result.avatar_url,
					name: result.name,
					bio: result.bio,
					location: result.location,
					public_repos: result.public_repos,
					followers: result.followers,
					following: result.following,
					login: result.login,
				};
				setData(fetchedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div className="flex flex-col items-center py-24">
			<header className="w-full flex justify-center items-center flex-col gap-4">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Image src={img} alt="Header Image" height={320} />
					<h2 className="text-3xl font-bold">
						Ek Star hme bhi de dijiye,{" "}
						<span className="tracking-[-0.5rem] mr-4">______</span>{" "}
						ji
					</h2>
				</motion.div>
			</header>

			{loading ? (
				<div className="flex justify-center items-center h-screen">
					<div className="text-6xl text-gray-500">Loading...</div>
				</div>
			) : (
				data && (
					<section className="mt-10 flex gap-12 flex-wrap">
						<motion.div
							className="flex flex-col gap-2 border border-border p-4 shadow-sm duration-300 transition-shadow rounded hover:shadow-foreground w-80"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Image
								src={data.avatar_url}
								alt="Profile Avatar"
								width={64}
								height={64}
								className="rounded-full border-2 border-gray-300 mr-4"
							/>
							<div>
								<h1 className="text-xl font-bold">
									{data.name}
								</h1>
								<p className="text-foreground/80">
									@{data.login}
								</p>
							</div>
							<p className="text-foreground/70 my-2">
								{data.bio}
							</p>
							<div className="flex gap-12">
								<div className="flex gap-2">
									<span>
										<BookMarked />
									</span>{" "}
									<span>{data.public_repos}</span>
								</div>
								<div className="flex gap-2">
									<span>
										<MapPinHouse />
									</span>{" "}
									<span>
										{data.location || "Not specified"}
									</span>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="flex w-[40rem] h-fit border border-border rounded hover:shadow-foreground shadow-sm duration-300 transition-shadow"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Image
								src={data.avatar_url}
								alt="Profile Avatar"
								width={84}
								height={64}
								className="mr-2 object-center object-cover"
							/>
							<div className="p-1">
								<h2 className="text-xl font-bold ">ShrinkIt</h2>
								<p className="text-foreground/75 leading-snug">
									A modern URL shortener built with Next.js,
									Tailwind CSS, and Framer Motion.
								</p>
							</div>
							<div className="w-32 cursor-pointer border-l border-border flex justify-center items-center">
								<a
									href="https://github.com/alok-x0s1/ShrinkIt"
									target="_blank"
								>
									<Link />
								</a>
							</div>
						</motion.div>
					</section>
				)
			)}
		</div>
	);
};

export default Github;
