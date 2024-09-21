import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { signupSchema } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
	await dbConnect();

	try {
		const data = await req.json();
		const result = signupSchema.safeParse(data);
		if (!result.success) {
			return NextResponse.json(
				createErrorResponse("Validation error", result.error.format()),
				{
					status: 400,
				}
			);
		}
		const { username, email, password } = result.data;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return NextResponse.json(
				createErrorResponse("User already exist."),
				{
					status: 400,
				}
			);
		}

		const user = await User.create({
			username,
			email,
			password,
		});
		if (!user) {
			return NextResponse.json(
				createErrorResponse("Failed to create user"),
				{
					status: 500,
				}
			);
		}

		return NextResponse.json(
			createSuccessResponse("User created successfully"),
			{
				status: 201,
			}
		);
	} catch (error) {
		console.error("Sign-up error:", error);
		return NextResponse.json(
			createErrorResponse(
				"Failed to create user",
				error instanceof Error ? error.message : "Unknown error"
			),
			{
				status: 500,
			}
		);
	}
}
