import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/api")) {
		return NextResponse.next();
	}

	const accessToken = req.cookies.get("accessToken")?.value;
	const refreshToken = req.cookies.get("refreshToken")?.value;

	if (
		pathname.startsWith("/create") ||
		pathname.startsWith("/dashboard") ||
		pathname.startsWith("/link") ||
		pathname.startsWith("/me")
	) {
		if (!accessToken) {
			if (!refreshToken) {
				return NextResponse.redirect(new URL("/sign-in", req.url));
			} else {
				return NextResponse.redirect(
					new URL("/refresh-token", req.url)
				);
			}
		} else {
			return NextResponse.next();
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/create",
		"/dashboard",
		"/sign-in",
		"/sign-up",
		"/refresh-token",
	],
};
