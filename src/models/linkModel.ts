import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface Analytics {
	clickDate: Date;
	ipAddress: string;
	country: string;
	referrer: string;
	device: string;
	browser: string;
	city: string;
	region: string;
}

interface Link extends Document {
	originalUrl: string;
	shortUrl: string;
	expirationDate: Date;
	clickLimit: number;
	clickCount: number;
	password: string;
	qrCode: string;
	createdBy: Schema.Types.ObjectId;
	isActive: boolean;
	analytics: Analytics[];

	comparePassword(candidatePassword: string): Promise<boolean>;
}

const linkSchema: Schema<Link> = new Schema({
	originalUrl: {
		type: String,
		required: true,
	},
	shortUrl: {
		type: String,
		required: true,
		unique: true,
	},
	expirationDate: {
		type: Date,
		default: Date.now() + 30 * 60 * 60 * 24 * 1000,
	},
	clickLimit: {
		type: Number,
		default: 50,
	},
	clickCount: {
		type: Number,
		default: 0,
	},
	password: {
		type: String,
	},
	qrCode: {
		type: String,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	analytics: [
		{
			clickDate: {
				type: Date,
				default: Date.now,
				required: true,
			},
			ipAddress: {
				type: String,
				required: true,
			},
			country: {
				type: String,
				required: true,
			},
			referrer: {
				type: String,
				required: true,
			},
			device: {
				type: String,
				required: true,
			},
			browser: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			region: {
				type: String,
				required: true,
			},
		},
	],
});

linkSchema.pre("save", async function (next) {
	if (!this.isModified("password") || !this.password) {
		return next();
	}

	const hashedPassword = await bcrypt.hash(this.password, 10);
	this.password = hashedPassword;
	next();
});

linkSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	if (!this.password) {
		return false;
	}
	return bcrypt.compare(candidatePassword, this.password);
};

const Link = mongoose.models.Link || mongoose.model<Link>("Link", linkSchema);
export default Link;
