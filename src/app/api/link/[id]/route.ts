import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import Link from "@/models/linkModel";
import UserModel, { User } from "@/models/userModel";
import { AccessTokenPayload } from "@/types/jwtTypes";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

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
		const decodedToken = verifyToken<AccessTokenPayload>(
			incomingAccessToken,
			process.env.ACCESS_TOKEN_SECRET as string
		);

		const link = await Link.findOne({
			_id: id,
			createdBy: decodedToken._id,
		});

		if (!link) {
			return NextResponse.json(createErrorResponse("Link not found."), {
				status: 404,
			});
		}

		return NextResponse.json(
			createSuccessResponse("Link fetched successfully.", link),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error in findLink ", error);
		return NextResponse.json(
			createErrorResponse("An error occurred while fetching link."),
			{
				status: 500,
			}
		);
	}
}

export async function PATCH(
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
		const { expirationDate, clickLimit, isActive } = await req.json();

		const decodedToken = verifyToken<AccessTokenPayload>(
			incomingAccessToken,
			process.env.ACCESS_TOKEN_SECRET as string
		);

		const link = await Link.findOne({
			_id: id,
			createdBy: decodedToken._id,
		});
		if (!link) {
			return NextResponse.json(createErrorResponse("Link not found."), {
				status: 404,
			});
		}

		if (expirationDate > link.expirationDate) {
			return NextResponse.json(
				createErrorResponse(
					"Link already expired.",
					"Expiration date cannot be greater than the original expiration date."
				),
				{
					status: 400,
				}
			);
		}

		const updatedLink = await Link.findByIdAndUpdate(
			id,
			{
				expirationDate,
				clickLimit,
				isActive,
			},
			{ new: true }
		);

		return NextResponse.json(
			createSuccessResponse("Link updated successfully.", updatedLink),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error in updateLink ", error);
		return NextResponse.json(
			createErrorResponse("An error occurred while updating link."),
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
		const decodedToken = verifyToken<AccessTokenPayload>(
			incomingAccessToken,
			process.env.ACCESS_TOKEN_SECRET as string
		);

		const user: User | null = await UserModel.findOne({
			_id: decodedToken._id,
		});
		if (!user) {
			return NextResponse.json(createErrorResponse("User not found."), {
				status: 404,
			});
		}

		const link = await Link.findOne({
			_id: id,
			createdBy: user._id,
		});

		if (!link) {
			return NextResponse.json(createErrorResponse("Link not found."), {
				status: 404,
			});
		}

		await Link.deleteOne({ _id: id });

		user.createdLinks = user.createdLinks.filter(
			(linkId) => linkId.toString() !== id
		);
		await user.save();

		return NextResponse.json(
			createSuccessResponse("Link has been deleted successfully."),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error in deleteLink ", error);
		return NextResponse.json(
			createErrorResponse("An error occurred while deleting link."),
			{
				status: 500,
			}
		);
	}
}
