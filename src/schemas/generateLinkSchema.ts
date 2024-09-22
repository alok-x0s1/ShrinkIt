import { z } from "zod";

export const generateLinkSchema = z.object({
	originalUrl: z.string().url("Invalid URL"),
	expirationDate: z.date(),
	clickLimit: z.number(),
	password: z.string(),
	isActive: z.boolean(),
	createdBy: z.string().optional(),
});
