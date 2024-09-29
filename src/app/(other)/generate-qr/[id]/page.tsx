"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ApiResponse from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const [isLoading, setIsLoading] = useState(false);
	const [qrCode, setQRCode] = useState<string | null>(null);
	const { toast } = useToast();
	const router = useRouter();

	const handleGenerateQRCode = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`/api/generate-qr/${id}`);

			const qrCodeData = response.data.data.qrCode;
			setQRCode(qrCodeData);

			toast({
				title: "QR Code Generated",
				description: "QR Code generated successfully",
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<string>>;
			let errorMessage = axiosError.response?.data.message;

			toast({
				title: "Generate QR Code failed.",
				description:
					errorMessage ??
					"An error occurred while generating QR Code.",
				duration: 3000,
			});
			if (errorMessage === "You are not signed in.") {
				router.push("/sign-in");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen relative">
			<h1 className="text-2xl font-bold mb-1">Generate QR Code</h1>
			<p className="text-sm text-foreground/80 mb-4">
				Click the button below to generate a QR code for this link.
			</p>
			<div className="flex flex-col items-center justify-center">
				{!qrCode && (
					<Button onClick={handleGenerateQRCode} disabled={isLoading}>
						{isLoading ? "Generating..." : "Generate QR Code"}
					</Button>
				)}
				{qrCode && (
					<img
						src={qrCode}
						alt="QR Code"
						className="mt-4 w-64 h-64"
					/>
				)}

				{qrCode && (
					<Link href={`/link/${id}`}>
						<Button className="mt-4">Back to Link</Button>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Page;
