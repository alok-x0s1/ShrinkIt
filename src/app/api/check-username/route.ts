import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const usernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(req: NextRequest): Promise<NextResponse> {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const queryParam = {
			username: searchParams.get("username"),
		};
		const result = usernameQuerySchema.safeParse(queryParam);
		if (!result.success) {
			return NextResponse.json(
				createErrorResponse(
					"Validation error",
					result.error.format().username?._errors
				),
				{
					status: 400,
				}
			);
		}

		const { username } = result.data;
		const existingUser = await User.findOne({ username });

		if (existingUser) {
			return NextResponse.json(
				createErrorResponse("User exist", "User already exists."),
				{
					status: 400,
				}
			);
		}

		return NextResponse.json(createSuccessResponse("Username is unique."), {
			status: 200,
		});
	} catch (error) {
		console.error("Check username unique error:", error);
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to check username unique.";
		return NextResponse.json(createErrorResponse(errorMessage), {
			status: 500,
		});
	}
}
