import { NextRequest, NextResponse } from "next/server";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { dbConnect } from "@/lib/dbConnect";
import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import Feedback from "@/models/feedbackModel";
import { verifyToken } from "@/utils/verifyToken";
import { AccessTokenPayload } from "@/types/jwtTypes";

export async function POST(req: NextRequest) {
	await dbConnect();

	const incomingAccessToken = req.cookies.get("accessToken")?.value;

	let userId: string = "";
	if (incomingAccessToken) {
		const user = verifyToken<AccessTokenPayload>(
			incomingAccessToken,
			process.env.ACCESS_TOKEN_SECRET as string
		);
		userId = user._id;
	}

	try {
		const body = await req.json();
		const result = feedbackSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				createErrorResponse(result.error.message),
				{ status: 400 }
			);
		}
		const { name, email, message } = result.data;
		const feedback = new Feedback({ name, email, message, userId });
		await feedback.save();
		return NextResponse.json(
			createSuccessResponse("Feedback submitted successfully"),
			{ status: 201 }
		);
	} catch (error) {
		console.log("Error in feedback route", error);
		return NextResponse.json(createErrorResponse("Internal Server Error"), {
			status: 500,
		});
	}
}
