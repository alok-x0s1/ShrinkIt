import {
	createErrorResponse,
	createSuccessResponse,
} from "@/helpers/ApiResponse";
import { generateUniqueString } from "@/helpers/generateString";
import { dbConnect } from "@/lib/dbConnect";
import LinkModel from "@/models/linkModel";
import User from "@/models/userModel";
import { generateLinkSchema } from "@/schemas/generateLinkSchema";
import { AccessTokenPayload } from "@/types/jwtTypes";
import { verifyToken } from "@/utils/verifyToken";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const data = await req.json();
		const result = generateLinkSchema.safeParse(data);
		if (!result.success) {
			return NextResponse.json(
				createErrorResponse(
					result.error.message,
					result.error.format()
				),
				{
					status: 400,
				}
			);
		}
		const { originalUrl, expirationDate, clickLimit, password, isActive } =
			result.data;

		const incomingToken = req.cookies.get("accessToken")?.value;
		if (!incomingToken) {
			return NextResponse.json(
				createErrorResponse("Unauthorized access"),
				{
					status: 401,
				}
			);
		}
		const decodedToken = verifyToken<AccessTokenPayload>(
			incomingToken,
			process.env.ACCESS_TOKEN_SECRET as string
		);
		const userId = decodedToken._id;
		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json(createErrorResponse("User not found"), {
				status: 404,
			});
		}

		const shortUrl = generateUniqueString();

		const link = await LinkModel.create({
			originalUrl,
			shortUrl: `${process.env.DOMAIN}/${shortUrl}`,
			expirationDate,
			clickLimit,
			password,
			isActive,
			createdBy: user._id,
		});

		if (!link) {
			return NextResponse.json(
				createErrorResponse("Failed to create short link"),
				{
					status: 500,
				}
			);
		}

		user.createdLinks.push(link._id);
		await user.save();

		return NextResponse.json(
			createSuccessResponse("Short link created successfully", {
				shortUrl: link.shortUrl,
				originalUrl: link.originalUrl,
			}),
			{
				status: 201,
			}
		);
	} catch (error) {
		console.error("Generate link error:", error);
		if (
			error instanceof JsonWebTokenError ||
			error instanceof TokenExpiredError
		) {
			return NextResponse.json(createErrorResponse("Session expired"), {
				status: 401,
			});
		}
		return NextResponse.json(
			createErrorResponse("Failed to create short link"),
			{
				status: 500,
			}
		);
	}
}
