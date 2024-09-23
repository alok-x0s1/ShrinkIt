import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { RefreshTokenPayload } from "@/types/jwtTypes";
import { refreshCookieOptions, accessCookieOptions } from "@/utils/constants";
import { generateAccessAndRefreshToken } from "@/utils/generateToken";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
	await dbConnect();

	try {
		const incomingToken = req.cookies.get("refreshToken")?.value;
		if (!incomingToken) {
			return NextResponse.json(
				createErrorResponse("You don't have token to refresh."),
				{
					status: 401,
				}
			);
		}

		const decodedToken = verifyToken<RefreshTokenPayload>(
			incomingToken,
			process.env.REFRESH_TOKEN_SECRET ?? ""
		);

		const user = await User.findById(decodedToken._id);
		if (!user) {
			return NextResponse.json(
				createErrorResponse("User not found.", {
					status: 404,
				})
			);
		}

		if (incomingToken !== user.refreshToken) {
			return NextResponse.json(
				createErrorResponse("Unauthorized request", {
					status: 401,
				})
			);
		}

		const { accessToken, refreshToken } =
			await generateAccessAndRefreshToken(user._id);

		const response = NextResponse.json(
			createSuccessResponse("Token refreshed successfully", {
				accessToken,
			}),
			{
				status: 200,
			}
		);

		response.cookies.set(
			"refreshToken",
			refreshToken,
			refreshCookieOptions
		);
		response.cookies.set("accessToken", accessToken, accessCookieOptions);
		return response;
	} catch (error) {
		console.error("Refresh-token error:", error);
		return NextResponse.json(
			createErrorResponse(
				"Failed to refresh token",
				error instanceof Error ? error.message : "Unknown error"
			),
			{
				status: 500,
			}
		);
	}
}
