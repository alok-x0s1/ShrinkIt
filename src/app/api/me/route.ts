import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { AccessTokenPayload } from "@/types/jwtTypes";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
		const decodedToken = verifyToken<AccessTokenPayload>(
			incomingAccessToken,
			process.env.ACCESS_TOKEN_SECRET as string
		);

		const user = await User.findById(decodedToken._id).select(
			"-password -refreshToken"
		);
		if (!user) {
			return NextResponse.json(createErrorResponse("User not found."), {
				status: 404,
			});
		}

		return NextResponse.json(
			createSuccessResponse("User profile fetched successfully.", user),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error fetching user profile:", error);
		return NextResponse.json(
			createErrorResponse("Failed to fetch user profile."),
			{
				status: 500,
			}
		);
	}
}
