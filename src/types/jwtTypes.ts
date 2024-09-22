import { JwtPayload } from "jsonwebtoken";

export interface RefreshTokenPayload extends JwtPayload {
	_id: string;
}

export interface AccessTokenPayload extends JwtPayload {
	_id: string;
	username: string;
	email: string;
}
