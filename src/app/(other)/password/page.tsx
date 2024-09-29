"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import uaParser from "ua-parser-js";
import ApiResponse from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CountryInfo {
	city: string;
	region: string;
	country: string;
}

const formSchema = z.object({
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(16, "Password must be at most 16 characters"),
});

const page = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const url = searchParams.get("url");
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const getIpAddress = async (): Promise<string | null> => {
		try {
			const response = await axios.get<{ ip: string }>(
				"https://api.ipify.org?format=json"
			);
			return response.data.ip;
		} catch (error) {
			console.error("Error fetching IP address:", error);
			return null;
		}
	};

	const getDeviceType = (): string => {
		const ua = navigator.userAgent;
		if (/mobile/i.test(ua)) return "Mobile";
		if (/tablet/i.test(ua)) return "Tablet";
		return "Desktop";
	};

	const getCountryFromIP = async (
		ip: string
	): Promise<CountryInfo | null> => {
		try {
			const response = await axios.get<{
				city: string;
				region: string;
				country_name: string;
			}>(`https://ipapi.co/${ip}/json`);
			return {
				city: response.data.city,
				region: response.data.region,
				country: response.data.country_name,
			};
		} catch (error) {
			console.error("Error fetching country from IP:", error);
			return null;
		}
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsLoading(true);

		try {
			const ipAddress = await getIpAddress();
			if (!ipAddress) {
				throw new Error("Failed to retrieve IP address");
			}

			const userAgent = navigator.userAgent;
			const parsedUa = uaParser(userAgent);

			const countryInfo = await getCountryFromIP(ipAddress);
			const city = countryInfo?.city || "Unknown";
			const region = countryInfo?.region || "Unknown";
			const country = countryInfo?.country || "Unknown";
			const referrer = document.referrer || "Direct";
			const deviceType = getDeviceType();

			const res = await axios.post(`/api/get-link/${url}`, data, {
				headers: {
					"x-forwarded-for": ipAddress,
					referer: referrer,
					"x-browser-name": parsedUa.browser.name || "Unknown",
					"x-device-type": deviceType,
					"x-country": country,
					"x-city": city,
					"x-region": region,
				},
			});

			if (res.data.data?.originalUrl) {
				router.push(res.data.data.originalUrl);
			} else {
				toast({
					title: "Error",
					description: "URL not found or invalid",
					variant: "destructive",
					duration: 3000,
				});
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<string>>;
			const axiosErrorMessage = axiosError.response?.data.message;

			toast({
				title: "Error",
				description:
					axiosErrorMessage || "An unexpected error occurred",
				variant: "destructive",
				duration: 3000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full h-screen flex items-center justify-center">
			<div className="container mx-auto px-4 md:px-12 h-full flex items-center">
				<div className="w-full max-w-md mx-auto border rounded-md p-4 border-border">
					<h1 className="text-2xl font-bold mb-2 text-center">
						Enter password
					</h1>
					<p className="text-sm text-foreground/70 mb-4">
						This link is password protected. Please enter the
						password to access the content.
					</p>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center gap-2 min-w-[200px]">
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="password"
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-fit mt-4 mx-auto"
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									"Submit"
								)}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default page;
