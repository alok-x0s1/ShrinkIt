"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ApiResponse from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const page = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleRefreshToken = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/api/refresh-token");

			toast({
				title: "Success",
				description: response.data.message,
				duration: 3000,
			});
			router.push("/create");
		} catch (error) {
			console.log("Error in refresh token ", error);
			const axiosError = error as AxiosError<ApiResponse<string>>;
			let errorMessage = axiosError.response?.data.message;

			toast({
				title: "Error",
				description: errorMessage ?? "An error occurred while signin.",
				duration: 3000,
				variant: "destructive",
			});
			router.push("/sign-in");
		}
		setIsLoading(false);
	};

	return (
		<motion.div
			className="flex justify-center items-center h-screen"
			initial={{ opacity: 0, y: -100 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 100 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				className="p-8 text-center"
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<p className="text-foreground/90 mb-1 text-lg font-semibold">
					You don't have access token to continue.
				</p>
				<p className="text-foreground/80 mb-6 text-sm">
					Click the button below to refresh your token.
				</p>
				<Button
					onClick={handleRefreshToken}
					disabled={isLoading}
					className="w-fit"
				>
					{isLoading ? (
						<Loader2 className="animate-spin" />
					) : (
						"Refresh Token"
					)}
				</Button>
			</motion.div>
		</motion.div>
	);
};

export default page;
