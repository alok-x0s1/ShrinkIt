import User from "@/models/userModel";

export const generateAccessAndRefreshToken = async (userId: string) => {
	const user = await User.findById(userId);

	const accessToken = await user.generateAccessToken();
	const refreshToken = await user.generateRefreshToken();
	user.refreshToken = refreshToken;
	await user.save();
	return { accessToken, refreshToken };
};
