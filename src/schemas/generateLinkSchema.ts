import { z } from "zod";

export const generateLinkSchema = z.object({
	originalUrl: z.string().url("Invalid URL").trim(),
	expirationDate: z.coerce.date(),
	clickLimit: z
		.number()
		.min(1, { message: "Click limit must be at least 1" })
		.default(100),
	password: z.string().optional(),
	isActive: z.boolean().default(true),
	createdBy: z.string().optional(),
});
