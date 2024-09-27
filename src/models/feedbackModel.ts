import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

interface FeedbackType extends Document {
	name: string;
	email: string;
	message: string;
	userId?: string;
}

const feedbackSchema = new Schema<FeedbackType>({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
		trim: true,
	},
	userId: {
		type: String,
		required: false,
	},
});

const Feedback =
	mongoose.models.Feedback ||
	mongoose.model<FeedbackType>("Feedback", feedbackSchema);

export default Feedback;
