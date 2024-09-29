import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import Link, { LinkType } from "@/models/linkModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
		const { password } = await req.json();
		const { id } = params;

		const link: LinkType | null = await Link.findById(id);

		if (!link) {
			return NextResponse.json(createErrorResponse("Link not found"), {
				status: 404,
			});
		}
		if (link.password) {
			return NextResponse.json(
				createErrorResponse("Password already set"),
				{
					status: 400,
				}
			);
		}
		link.password = password;
		await link.save();

		return NextResponse.json(
			createSuccessResponse("Password set successfully", link._id),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error setting password: ", error);
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to set password for link.";
		return NextResponse.json(createErrorResponse(errorMessage), {
			status: 500,
		});
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
		const { oldPassword, newPassword } = await req.json();
		const { id } = params;

		const link: LinkType | null = await Link.findById(id);

		if (!link) {
			return NextResponse.json(createErrorResponse("Link not found"), {
				status: 404,
			});
		}

		if (!link.password) {
			return NextResponse.json(createErrorResponse("Password not set"), {
				status: 400,
			});
		}
		if (oldPassword === newPassword) {
			return NextResponse.json(
				createErrorResponse(
					"New password cannot be the same as old password"
				),
				{
					status: 400,
				}
			);
		}

		const isPasswordCorrect = await link.comparePassword(oldPassword);

		if (!isPasswordCorrect) {
			return NextResponse.json(
				createErrorResponse("Incorrect password"),
				{
					status: 400,
				}
			);
		}

		link.password = newPassword;
		await link.save();

		return NextResponse.json(
			createSuccessResponse("Password updated successfully", link._id),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error updating password: ", error);
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to update password.";
		return NextResponse.json(createErrorResponse(errorMessage), {
			status: 500,
		});
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

		const link: LinkType | null = await Link.findById(id);

		if (!link) {
			return NextResponse.json(createErrorResponse("Link not found"), {
				status: 404,
			});
		}

		if (!link.password) {
			return NextResponse.json(createErrorResponse("Password not set"), {
				status: 400,
			});
		}

		link.password = "";
		await link.save();

		return NextResponse.json(
			createSuccessResponse("Password removed successfully", link._id),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log("Error removing password: ", error);
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to remove password.";
		return NextResponse.json(createErrorResponse(errorMessage), {
			status: 500,
		});
	}
}
