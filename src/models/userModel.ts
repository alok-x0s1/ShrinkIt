import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User extends Document {
	username: string;
	password: string;
	email: string;
	refreshToken: string;
	createdLinks: Schema.Types.ObjectId[];

	comparePassword(candidatePassword: string): Promise<boolean>;
	generateAccessToken(): Promise<string>;
	generateRefreshToken(): Promise<string>;
}

const userSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: [3, "Username must be at least 3 characters long"],
		maxlength: [20, "Username must be at most 20 characters long"],
		trim: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: [8, "Password must be at least 8 characters long"],
		trim: true,
	},
	refreshToken: {
		type: String,
	},
	createdLinks: [
		{
			type: Schema.Types.ObjectId,
			ref: "Link",
		},
	],
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	const hashedPassword = await bcrypt.hash(this.password, 10);
	this.password = hashedPassword;
	next();
});

userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = async function (): Promise<string> {
	const accessToken = jwt.sign(
		{
			_id: this._id,
			username: this.username,
			email: this.email,
		},
		process.env.ACCESS_TOKEN_SECRET!,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY!,
		}
	);

	return accessToken;
};

userSchema.methods.generateRefreshToken = async function (): Promise<string> {
	const refreshToken = jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET!,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY!,
		}
	);

	return refreshToken;
};

const User = mongoose.models.User || mongoose.model<User>("User", userSchema);
export default User;
