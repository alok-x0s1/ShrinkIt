"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import uaParser from "ua-parser-js";
import ApiResponse from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CountryInfo {
	city: string;
	region: string;
	country: string;
}

const Page = ({ params }: { params: { url: string } }) => {
	const { url } = params;
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

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

	useEffect(() => {
		const getLink = async () => {
			setLoading(true);
			setError(null);
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

				const res = await axios.get(`/api/get-link/${url}`, {
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
					setError("URL not found or invalid");
				}
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse<string>>;
				const axiosErrorMessage = axiosError.response?.data.message;
				setError(axiosErrorMessage || "An unexpected error occurred");

				if (axiosErrorMessage === "The Short URL has a password.") {
					router.push(`/password?url=${url}`);
				}
			} finally {
				setLoading(false);
			}
		};
		getLink();
	}, [url, router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
					<p className="mt-4 text-lg font-semibold text-gray-700">
						Loading...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
				<h1 className="text-2xl font-bold mb-8">
					OOPS! PAGE NOT FOUND
				</h1>
				<div className="relative">
					<div className="text-[20rem] font-extrabold leading-none tracking-tighter">
						404
					</div>
					<div className="absolute inset-0 text-[20rem] font-extrabold leading-none tracking-tighter text-foreground opacity-10 transform translate-x-1 translate-y-1">
						404
					</div>
				</div>
				<p className="text-xl font-semibold mt-8 mb-8 text-center max-w-md text-destructive">
					{error}
				</p>
				<Link href="/">
					<Button variant="outline">Go to Home</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-foreground">
					Processing...
				</h1>
				<p className="mt-4 text-foreground/60">
					Please wait while we process the request.
				</p>
			</div>
		</div>
	);
};

export default Page;
