const NAME = "shrinkit";

const accessCookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24,
	expires: new Date(Date.now() + 60 * 60 * 24 * 1000).toUTCString(),
};

const refreshCookieOptions = {
	...accessCookieOptions,
	maxAge: 60 * 60 * 24 * 30,
	expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000).toUTCString(),
};

export { NAME, accessCookieOptions, refreshCookieOptions };
