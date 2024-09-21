import { type NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Link, { Analytics } from "@/models/linkModel";
import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";

// interface AnalyticsData {
// 	clickDate: Date;
// 	ipAddress: string;
// 	country: string;
// 	referrer: string;
// 	device: string;
// 	browser: string;
// 	city: string;
// 	region: string;
// }

export async function GET(
	req: NextRequest,
	{ params }: { params: { url: string } }
): Promise<NextResponse> {
	await dbConnect();

	const forwardedFor = req.headers.get("x-forwarded-for");
	const ipAddress = forwardedFor?.split(",")[0]?? "Unknown";
	const referrer = (req.headers.get("referer") ?? "Direct").split("/c/")[0];
	const deviceType = req.headers.get("x-device-type") ?? "Unknown";
	const city = req.headers.get("x-city") ?? "Unknown";
	const region = req.headers.get("x-region") ?? "Unknown";
	const country = req.headers.get("x-country") ?? "Unknown";
	const browserName = req.headers.get("x-browser-name") ?? "Unknown";

	console.table({
		ipAddress,
		deviceType,
		city,
		region,
		country,
		browserName,
		referral: referrer,
	});

	try {
		const { url } = params;
		if (!url) {
			return NextResponse.json(
				createErrorResponse("URL parameter is missing."),
				{ status: 400 }
			);
		}

		const link = await Link.findOne({ shortUrl: url });
		if (!link) {
			return NextResponse.json(
				createErrorResponse("Short URL not found."),
				{ status: 404 }
			);
		}

		if (!link.isActive) {
			return NextResponse.json(
				createErrorResponse("Short URL is inactive now."),
				{ status: 410 }
			);
		}

		if (link.clickLimit && link.clickCount >= link.clickLimit) {
			return NextResponse.json(
				createErrorResponse(
					"Short URL reached its maximum click limit."
				),
				{ status: 429 }
			);
		}

		if (link.expirationDate && new Date() > new Date(link.expirationDate)) {
			return NextResponse.json(
				createErrorResponse("Short URL has expired."),
				{ status: 410 }
			);
		}

		const analyticsData: Analytics = {
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
