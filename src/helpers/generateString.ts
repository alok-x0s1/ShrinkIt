import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

function generateUniqueString(length = 8) {
	return uuidv4().replace(/-/g, "").slice(0, length);
}

async function generateQrCode(shortUrl: string) {
	const qrCode = await QRCode.toDataURL(shortUrl);

	return qrCode;
}

export { generateUniqueString, generateQrCode };
