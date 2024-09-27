import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import Link from "@/models/linkModel";
import UserModel, { User } from "@/models/userModel";
import { usernameValidation } from "@/schemas/signupSchema";
import { AccessTokenPayload } from "@/types/jwtTypes";
import { accessCookieOptions, refreshCookieOptions } from "@/utils/constants";
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

		const user = await UserModel.findById(decodedToken._id).select(
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

export async function PATCH(req: NextRequest) {
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

		const user: User | null = await UserModel.findById(decodedToken._id);
		if (!user) {
			return NextResponse.json(createErrorResponse("User not found."), {
				status: 404,
			});
		}

		const { username } = await req.json();
		if (!username) {
			return NextResponse.json(
				createErrorResponse("Username is required."),
				{
					status: 400,
				}
			);
		}

		const result = usernameValidation.safeParse(username);
		if (!result.success) {
			return NextResponse.json(
				createErrorResponse(
					"Username is invalid.",
					result.error.format()._errors
				),
				{
					status: 400,
				}
			);
		}

		const existingUser = await UserModel.findOne({ username });
		if (existingUser) {
			return NextResponse.json(
				createErrorResponse("Username already exists."),
				{
					status: 400,
				}
			);
		}

		user.username = username;
		await user.save();

		return NextResponse.json(
			createSuccessResponse("Username updated successfully."),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error in updateUser ", error);
		return NextResponse.json(
			createErrorResponse("An error occurred while updating user."),
			{
				status: 500,
			}
		);
	}
}

export async function DELETE(req: NextRequest) {
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

		const user: User | null = await UserModel.findById(decodedToken._id);
		if (!user) {
			return NextResponse.json(createErrorResponse("User not found."), {
				status: 404,
			});
		}

		await UserModel.findByIdAndDelete(decodedToken._id);
		const links = await Link.deleteMany({ createdBy: user._id });
		if (links.deletedCount === 0) {
			return NextResponse.json(
				createErrorResponse("Failed to delete user's links."),
				{
					status: 500,
				}
			);
		}

		const response = NextResponse.json(
			createSuccessResponse("User deleted successfully."),
			{
				status: 200,
			}
		);
		response.cookies.set("accessToken", "", accessCookieOptions);
		response.cookies.set("refreshToken", "", refreshCookieOptions);

		return response;
	} catch (error) {
		console.log("Error deleting user:", error);
		return NextResponse.json(
			createErrorResponse("Failed to delete user."),
			{
				status: 500,
			}
		);
	}
}
