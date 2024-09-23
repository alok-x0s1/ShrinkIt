import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { AccessTokenPayload } from "@/types/jwtTypes";
import { verifyToken } from "@/utils/verifyToken";
import mongoose from "mongoose";
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
		console.log(decodedToken._id);
		const user = await User.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(decodedToken._id),
				},
			},
			{
				$lookup: {
					from: "links",
					localField: "_id",
					foreignField: "createdBy",
					as: "links",
				},
			},
			{
				$unwind: {
					path: "$links",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: "$_id",
					username: { $first: "$username" },
					email: { $first: "$email" },
					links: { $push: "$links" },
				},
			},
			{
				$project: {
					_id: 1,
					username: 1,
					email: 1,
					links: 1,
				},
			},
		]);

		if (user.length === 0) {
			return NextResponse.json(createErrorResponse("User not found."), {
				status: 404,
			});
		}

		return NextResponse.json(
			createSuccessResponse("Data fetched successfully", user[0]),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error("Error in dashboard route:", error);
		return NextResponse.json(
			createErrorResponse("Failed to fetch user profile."),
			{
				status: 500,
			}
		);
	}
}
