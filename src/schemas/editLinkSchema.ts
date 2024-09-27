import { z } from "zod";

export const editLinkSchema = z.object({
	expirationDate: z.coerce.date(),
	clickLimit: z.number(),
	isActive: z.boolean(),
});
