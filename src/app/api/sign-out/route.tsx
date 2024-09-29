import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { RefreshTokenPayload } from "@/types/jwtTypes";
import { accessCookieOptions, refreshCookieOptions } from "@/utils/constants";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	await dbConnect();

	try {
		const incomingAccessToken = req.cookies.get("accessToken")?.value;
		const incomingRefreshToken = req.cookies.get("refreshToken")?.value;

		if (!incomingAccessToken || !incomingRefreshToken) {
			return NextResponse.json(
				createErrorResponse("You are already signed out."),
				{
					status: 401,
				}
			);
		}

		if (!incomingAccessToken && incomingRefreshToken) {
			return NextResponse.json(
				createErrorResponse(
					"You don't have access token. Please refresh your toekn."
				),
				{
					status: 401,
				}
			);
		}

		const decodedRefreshToken = verifyToken<RefreshTokenPayload>(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET ?? ""
		);
		const user = await User.findById(decodedRefreshToken._id);

		if (!user) {
			return NextResponse.json(createErrorResponse("User not found."), {
				status: 404,
			});
		}

		await user.updateOne({ $set: { refreshToken: "" } });

		const response = NextResponse.json(
			createSuccessResponse("Signed out successfully"),
			{
				status: 200,
			}
		);
		response.cookies.set("accessToken", "", accessCookieOptions);
		response.cookies.set("refreshToken", "", refreshCookieOptions);

		return response;
	} catch (error) {
		console.error("Sign-out error:", error);
		return NextResponse.json(
			createErrorResponse(
				"Failed to sign out",
				error instanceof Error ? error.message : "Unknown error"
			),
			{
				status: 500,
			}
		);
	}
}
