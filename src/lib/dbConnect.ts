import mongoose from "mongoose";

type ConnectionObject = {
	isConnected: number;
};

const connection: ConnectionObject = {
	isConnected: 0,
};

export const dbConnect = async (): Promise<void> => {
	if (connection.isConnected) {
		console.log("Database connection is already established.");
		return;
	}

	try {
		const db = await mongoose.connect(process.env.MONGO_URI || "");
		connection.isConnected = db.connections[0].readyState;
		console.log(
			"DB connection established with " +
				db.connection.host +
				":" +
				db.connection.port
		);
	} catch (error) {
		console.log("Error connecting to DB:", error);
		process.exit(1);
	}
};
