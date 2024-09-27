import { type NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Link, { AnalyticsType, LinkType } from "@/models/linkModel";
import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";

export async function GET(
	req: NextRequest,
	{ params }: { params: { url: string } }
): Promise<NextResponse> {
	await dbConnect();

	const forwardedFor = req.headers.get("x-forwarded-for");
	const ipAddress = forwardedFor?.split(",")[0] ?? "Unknown";
	const referrer = (req.headers.get("referer") ?? "Direct").split("/c/")[0];
	const deviceType = req.headers.get("x-device-type") ?? "Unknown";
	const city = req.headers.get("x-city") ?? "Unknown";
	const region = req.headers.get("x-region") ?? "Unknown";
	const country = req.headers.get("x-country") ?? "Unknown";
	const browserName = req.headers.get("x-browser-name") ?? "Unknown";

	try {
		const { url } = params;
		if (!url) {
			return NextResponse.json(
				createErrorResponse("URL parameter is missing."),
				{ status: 400 }
			);
		}
		const shortUrl = `${process.env.DOMAIN}/${url}`;

		const link = await Link.findOne({ shortUrl });
		if (!link) {
			return NextResponse.json(
				createErrorResponse("The short URL not found."),
				{ status: 404 }
			);
		}

		if (!link.isActive) {
			return NextResponse.json(
				createErrorResponse("The short URL is inactive now."),
				{ status: 410 }
			);
		}

		if (link.clickLimit && link.clickCount >= link.clickLimit) {
			return NextResponse.json(
				createErrorResponse(
					"The short URL reached its maximum click limit."
				),
				{ status: 429 }
			);
		}

		if (link.expirationDate && new Date() > new Date(link.expirationDate)) {
			return NextResponse.json(
				createErrorResponse("The short URL has expired."),
				{ status: 410 }
			);
		}

		if (link.password) {
			return NextResponse.json(
				createErrorResponse("The Short URL has a password."),
				{ status: 401 }
			);
		}

		const analyticsData: AnalyticsType = {
			clickDate: new Date(),
			ipAddress,
			country,
			referrer,
			device: deviceType,
			browser: browserName,
			city,
			region,
		};

		link.clickCount += 1;
		link.analytics.push(analyticsData);
		await link.save();

		return NextResponse.json(
			createSuccessResponse("Link fetched successfully.", {
				originalUrl: link.originalUrl,
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("Get link error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Failed to redirect.";
		return NextResponse.json(createErrorResponse(errorMessage), {
			status: 500,
		});
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { url: string } }
) {
	await dbConnect();

	const forwardedFor = req.headers.get("x-forwarded-for");
	const ipAddress = forwardedFor?.split(",")[0] ?? "Unknown";
	const referrer = (req.headers.get("referer") ?? "Direct").split("/c/")[0];
	const deviceType = req.headers.get("x-device-type") ?? "Unknown";
	const city = req.headers.get("x-city") ?? "Unknown";
	const region = req.headers.get("x-region") ?? "Unknown";
	const country = req.headers.get("x-country") ?? "Unknown";
	const browserName = req.headers.get("x-browser-name") ?? "Unknown";

	try {
		const { url } = params;
		const { password } = await req.json();

		if (!url || !password) {
			return NextResponse.json(
				createErrorResponse("URL or password is missing."),
				{ status: 400 }
			);
		}

		const shortUrl = `${process.env.DOMAIN}/${url}`;

		const link: LinkType | null = await Link.findOne({ shortUrl });
		if (!link) {
			return NextResponse.json(
				createErrorResponse("The short URL not found."),
				{ status: 404 }
			);
		}

		const isPasswordCorrect = await link.comparePassword(password);
		if (!isPasswordCorrect) {
			return NextResponse.json(
				createErrorResponse("Incorrect password."),
				{ status: 401 }
			);
		}

		const analyticsData: AnalyticsType = {
			clickDate: new Date(),
			ipAddress,
			country,
			referrer,
			device: deviceType,
			browser: browserName,
			city,
			region,
		};

		link.clickCount += 1;
		link.analytics.push(analyticsData);
		await link.save();

		return NextResponse.json(
			createSuccessResponse("Link fetched successfully.", {
				originalUrl: link.originalUrl,
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("Get link error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Failed to redirect.";
		return NextResponse.json(createErrorResponse(errorMessage), {
			status: 500,
		});
	}
}
