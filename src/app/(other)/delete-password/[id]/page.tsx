"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import ApiResponse from "@/types/ApiResponse";

const DeletePassword = ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			const res = await axios.delete(`/api/add-password/${id}`);

			toast({
				title: "Success",
				description: "Password deleted successfully",
			});
			router.push(`/link/${id}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<string>>;
			toast({
				title: "Error",
				description: axiosError.response?.data.message,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold mb-2">Delete Password</h1>
			<p className="text-sm text-foreground/70 mb-4">
				Are you sure you want to delete this password?
			</p>
			<Button
				onClick={handleDelete}
				disabled={isLoading}
				variant="destructive"
			>
				{isLoading ? (
					<Loader2 className="animate-spin" />
				) : (
					"Delete Password"
				)}
			</Button>
		</div>
	);
};

export default DeletePassword;
