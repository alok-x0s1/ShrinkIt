"use client";

import DashboardLinkData from "@/components/DashboardLinkData";
import { useToast } from "@/hooks/use-toast";
import { LinkType } from "@/models/linkModel";
import ApiResponse from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const [linkData, setLinkData] = useState<LinkType>();
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const fetchLinkData = async () => {
			setIsLoading(true);
			try {
				const res = await axios.get(`/api/link/${id}`);
				setLinkData(res.data.data);
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse<string>>;
				let errorMessage = axiosError.response?.data.message;

				toast({
					title: "Fetch link failed.",
					description:
						errorMessage ??
						"An error occurred while fetching link.",
					duration: 3000,
					variant: "destructive",
				});
				if (errorMessage === "You are not signed in.") {
					router.push("/sign-in");
				}
			} finally {
				setIsLoading(false);
			}
		};
		fetchLinkData();
	}, [id]);

	if (isLoading)
		return (
			<div className="flex justify-center items-start pt-32 min-h-screen">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<Loader2 className="animate-spin" /> Loading...
				</h1>
			</div>
		);

	return linkData ? <DashboardLinkData linkData={linkData} /> : null;
};

export default page;
