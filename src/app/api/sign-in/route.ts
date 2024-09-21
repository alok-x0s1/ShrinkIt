import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/userModel";
import { signinSchema } from "@/schemas/signinSchema";
import { cookieOptions } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

const generateAccessAndRefreshToken = async (userId: string) => {
	const user = await User.findById(userId);

	const accessToken = await user.generateAccessToken();
	const refreshToken = await user.generateRefreshToken();
	user.refreshToken = refreshToken;
	await user.save();
	return { accessToken, refreshToken };
};

export async function POST(req: NextRequest): Promise<NextResponse> {
	await dbConnect();

	try {
		const data = await req.json();
		const result = signinSchema.safeParse(data);
		if (!result.success) {
			return NextResponse.json(
				createErrorResponse("Validation error", result.error.format()),
				{
					status: 400,
				}
			);
		}
		const { email, password } = result.data;
		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				createErrorResponse("User not found with this email."),
				{
					status: 400,
				}
			);
		}

		const isPasswordCorrect = await user.comparePassword(password);
		if (!isPasswordCorrect) {
			return NextResponse.json(
				createErrorResponse("Please enter correct password."),
				{
					status: 400,
				}
			);
		}

		const userData = user.toObject();
		delete userData.password;
		delete userData.refreshToken;

		const { accessToken, refreshToken } =
			await generateAccessAndRefreshToken(user._id as string);

		const response = NextResponse.json(
			createSuccessResponse("User signed in successfully", {
				user: userData,
			}),
			{
				status: 200,
			}
		);

		response.cookies.set("refreshToken", refreshToken, cookieOptions);
		response.cookies.set("accessToken", accessToken, cookieOptions);
		return response;
	} catch (error) {
		console.error("Sign-in error:", error);
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
