"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UrlCard from "@/components/UrlCard";
import { useToast } from "@/hooks/use-toast";
import { LinkType } from "@/models/linkModel";
import { ErrorResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnterIcon, Link2Icon } from "@radix-ui/react-icons";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion"; // Import motion from framer-motion

const formSchema = z.object({
	originalUrl: z.string().url({ message: "Please enter a valid URL" }),
	expirationDate: z.string(),
	clickLimit: z.coerce
		.number()
		.min(1, { message: "Click limit must be at least 1" })
		.default(100),
	password: z.string().optional(),
	isActive: z.boolean().default(true),
});

const page = () => {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<null | string>(null);
	const [url, setUrl] = useState<LinkType[]>([]);
	const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			originalUrl: "",
			expirationDate: new Date(
				Date.now() + 30 * 24 * 60 * 60 * 1000
			).toISOString(),
			clickLimit: 100,
			password: "",
			isActive: true,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		setError(null);
		setShowAdditionalOptions(false);
		setUrl([]);
		try {
			const res = await axios.post("/api/generate-link", {
				...values,
			});

			setUrl([...url, res.data.data]);
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;
			const axiosErrorMessage = axiosError.response?.data.message;
			setError(axiosErrorMessage || "An unexpected error occurred");

			if (
				axiosError.response?.status === 401 ||
				axiosErrorMessage === "Session expired"
			) {
				toast({
					title: "Session expired",
					description: "Please login to continue",
					variant: "destructive",
				});
				return;
			}

			if (axiosError.response?.status === 429) {
				toast({
					title: "Too many requests",
					description: axiosErrorMessage,
					variant: "destructive",
				});
				return;
			}
		} finally {
			setLoading(false);
		}
		form.reset();
	};

	return (
		<div className="flex justify-center items-start min-h-screen bg-background remove-scrollbar pt-24">
			<div className="bg-background p-6 max-w-4xl w-full">
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="header flex items-center flex-col"
				>
					<h2 className="text-7xl font-extrabold mt-8 text-center w-full">
						Transform Your Links
					</h2>
					<p className="text-lg my-4 text-center max-w-2xl">
						Shorten, customize, and track your links with ease.
						Experience the power of a sleek, user-friendly interface
						and advanced features.
					</p>
					<div className="flex gap-4">
						<Button variant="secondary" className="text-lg p-6">
							<Link href="/">Explore</Link>
						</Button>
						<Button variant="outline" className="text-lg p-6">
							<Link href="/sign-in">Start for Free</Link>
						</Button>
					</div>
				</motion.div>

				<Form {...form}>
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<FormField
							control={form.control}
							name="originalUrl"
							render={({ field }) => (
								<FormItem className="flex flex-col items-center">
									<div className="mt-12 mb-8 border border-border flex items-center w-fit rounded-md mx-auto overflow-hidden">
										<Link2Icon className="w-6 h-6 ml-2" />
										<FormControl>
											<Input
												className="border-none w-72 py-2"
												placeholder="https://github.com/alok-x0s1"
												{...field}
												onFocus={() =>
													setShowAdditionalOptions(
														true
													)
												}
											/>
										</FormControl>

										<Button
											className="bg-transparent text-foreground hover:text-background hover:bg-primary/90 px-2 duration-200 transition-colors rounded-none"
											type="submit"
											disabled={loading}
										>
											{loading ? (
												<Loader />
											) : (
												<EnterIcon className="w-6 h-6" />
											)}
										</Button>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						{showAdditionalOptions && (
							<motion.div
								className="relative flex gap-4 flex-wrap flex-col items-start border border-border p-4 pt-8 rounded-sm"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								<div className="absolute -top-4 left-8 px-4 py-1 bg-background border border-border rounded-sm">
									Additional Options
								</div>
								<FormField
									control={form.control}
									name="expirationDate"
									render={({ field }) => (
										<FormItem className="flex items-center gap-2">
											<FormLabel className="w-fit">
												Expiration Date
											</FormLabel>
											<FormControl>
												<Input
													type="datetime-local"
													{...field}
													className="w-fit"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex gap-4 flex-wrap items-center">
									<FormField
										control={form.control}
										name="clickLimit"
										render={({ field }) => (
											<FormItem className="flex items-center justify-center gap-2 w-fit">
												<FormLabel className="w-fit text-nowrap">
													Click Limit
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														className="w-full"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="isActive"
										render={({ field }) => (
											<FormItem className="flex items-center justify-center gap-2 w-fit">
												<FormLabel className="w-fit">
													Active
												</FormLabel>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
														className="w-6 h-6"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</motion.div>
						)}
					</motion.form>
				</Form>

				{error && (
					<div className="text-center text-sm text-red-500">
						{error}
					</div>
				)}

				<div className="text-center w-full flex justify-center">
					{url.length > 0 && (
						<motion.div
							className="mt-18 space-y-6 w-full max-w-md"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, staggerChildren: 0.1 }}
						>
							{url.map((url, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.5,
										delay: index * 0.1,
									}}
								>
									<UrlCard key={index} link={url} />
								</motion.div>
							))}
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default page;
