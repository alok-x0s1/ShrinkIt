import { z } from "zod";

export const feedbackSchema = z.object({
	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters" })
		.max(50, { message: "Name must be at most 50 characters" })
		.trim(),
	email: z
		.string()
		.email({ message: "Invalid email address" })
		.max(50, { message: "Email must be at most 50 characters" }),
	message: z
		.string()
		.min(3, { message: "Message must be at least 3 characters" })
		.max(1000, { message: "Message must be at most 1000 characters" })
		.trim(),
});
