import ApiResponse from "@/types/ApiResponse";

function createErrorResponse(
	message: string,
	errorDetails: any | null = null
): ApiResponse<null> {
	return {
		success: false,
		message,
		errorDetails,
	};
}

function createSuccessResponse<T>(message: string, data?: T): ApiResponse<T> {
	return {
		success: true,
		message,
		data,
	};
}

export { createErrorResponse, createSuccessResponse };
