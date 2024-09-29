"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { LinkType } from "@/models/linkModel";
import ApiResponse from "@/types/ApiResponse";
import {
	ArrowUpRight,
	Cable,
	CornerDownRight,
	LayoutDashboard,
	Link2,
	Loader2,
	MonitorSmartphone,
	SquareMousePointer,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardData {
	username: string;
	email: string;
	links: LinkType[];
}

const Dashboard = () => {
	const [data, setData] = useState<DashboardData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const fetchDashboardData = async () => {
			setIsLoading(true);
			try {
				const res = await axios.get("/api/dashboard");
				setData(res.data.data);
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse<string>>;
				const errorMessage = axiosError.response?.data.message;

				toast({
					title: "Fetch profile failed.",
					description:
						errorMessage ??
						"An error occurred while fetching profile.",
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
		fetchDashboardData();
	}, []);

	if (isLoading)
		return (
			<div className="flex justify-center items-start pt-32 min-h-screen">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<Loader2 className="animate-spin" /> Loading...
				</h1>
			</div>
		);

	return (
		<div className="flex flex-col items-start pt-32 px-12 min-h-screen pb-12">
			<h1 className="text-2xl font-bold mb-12 w-full flex items-center gap-2">
				<LayoutDashboard /> Dashboard
			</h1>

			<div className="flex flex-wrap gap-4">
				<div className="flex flex-col gap-3 border border-border rounded-md py-4 px-6 w-fit hover:cursor-default hover:shadow-md duration-200">
					<h1 className="text-lg font-bold flex items-center gap-1">
						<SquareMousePointer /> Total Clicks
					</h1>
					<p className="text-lg font-semibold">
						{data?.links.reduce(
							(acc, curr) => acc + curr.analytics.length,
							0
						)}
					</p>
				</div>

				<div className="flex flex-col gap-3 border border-border rounded-md py-4 px-6 w-fit hover:cursor-default hover:shadow-md duration-200">
					<h1 className="text-lg font-bold flex items-center gap-1">
						<Link2 /> Total Links
					</h1>
					<p className="text-lg font-semibold">
						{data?.links.length}
					</p>
				</div>

				<div className="flex flex-col gap-3 border border-border rounded-md py-4 px-6 w-fit hover:cursor-default hover:shadow-md duration-200">
					<h1 className="text-lg font-bold flex items-center gap-1">
						<ArrowUpRight /> Total Visits
					</h1>
					<p className="text-lg font-semibold">
						{data?.links.reduce(
							(acc, curr) => acc + curr.analytics.length,
							0
						)}
					</p>
				</div>

				<div className="flex flex-col gap-3 border border-border rounded-md py-4 px-6 w-fit hover:cursor-default hover:shadow-md duration-200">
					<h1 className="text-lg font-bold flex items-center gap-1">
						<MonitorSmartphone /> Maximum device
					</h1>
					<p className="text-lg font-semibold">Desktop</p>
				</div>
			</div>

			<div className="flex flex-col gap-4 mt-8">
				<h1 className="text-xl font-bold flex items-center gap-2">
					<Cable /> Your created links
				</h1>
				<p className="text-sm text-foreground/80 mb-4">
					*Click on a link to view its analytics.
				</p>

				<div className="flex flex-wrap gap-4 w-full">
					{data?.links.map((link, index) => (
						<div
							key={link.shortUrl}
							className="flex flex-col gap-2 border border-border rounded-md py-2 px-4 max-w-lg hover:cursor-pointer hover:bg-accent hover:shadow-md duration-200"
							onClick={() => {
								router.push(`/link/${link._id}`);
							}}
						>
							<h1 className="flex items-center gap-2">
								<span className="font-bold">{index + 1}.</span>{" "}
								{link.originalUrl.slice(0, 50)}...
							</h1>
							<p className="flex items-center gap-2">
								<CornerDownRight /> {link.shortUrl}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
