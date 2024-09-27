import jwt, {
	JsonWebTokenError,
	JwtPayload,
	TokenExpiredError,
} from "jsonwebtoken";

export function verifyToken<T extends JwtPayload>(
	token: string,
	secret: string
): T {
	if (!secret) {
		throw new Error("Token secret is not set");
	}

	try {
		const data = jwt.verify(token, secret);
		return data as T;
	} catch (error) {
		if (
			error instanceof JsonWebTokenError ||
			error instanceof TokenExpiredError
		) {
			throw error;
		}
		throw error;
	}
}
