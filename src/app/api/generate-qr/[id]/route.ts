import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import Link, { LinkType } from "@/models/linkModel";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	await dbConnect();
	const incomingAccessToken = req.cookies.get("accessToken")?.value;
	const incomingRefreshToken = req.cookies.get("refreshToken")?.value;

	if (!incomingAccessToken || !incomingRefreshToken) {
		return NextResponse.json(
			createErrorResponse("You are not signed in."),
			{
				status: 401,
			}
		);
	}

	try {
		const { id } = params;
		const link: LinkType | null = await Link.findById(id);

		if (!link) {
			return NextResponse.json(createErrorResponse("Link not found."), {
				status: 404,
			});
		}
		if (link.qrCode) {
			return NextResponse.json(
				createErrorResponse(
					"QR code already generated. Get back to the dashboard to see it."
				),
				{
					status: 400,
				}
			);
		}

		const qrCode = await QRCode.toDataURL(link.shortUrl);
		link.qrCode = qrCode;
		await link.save();

		return NextResponse.json(
			createSuccessResponse("QR code generated successfully", {
				qrCode,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error generating QR code:", error);
		return NextResponse.json(
			createErrorResponse("Failed to generate QR code."),
			{
				status: 500,
			}
		);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	await dbConnect();

	try {
		const { id } = params;
		const link: LinkType | null = await Link.findById(id);

		if (!link) {
			return NextResponse.json(createErrorResponse("Link not found."), {
				status: 404,
			});
		}

		link.qrCode = "";
		await link.save();

		return NextResponse.json(
			createSuccessResponse("QR code deleted successfully"),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error deleting QR code:", error);
		return NextResponse.json(
			createErrorResponse("Failed to delete QR code."),
			{
				status: 500,
			}
		);
	}
}
