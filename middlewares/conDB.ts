/** @format */

import { connect } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export async function connDB(
	req: NextApiRequest,
	res: NextApiResponse,
	next: any
) {
	if (process.env.VERCEL) {
		if (!process.env.MONGO_URI_R)
			throw Error("Add MONGO_URI_P to environment variables.");

		await connect(process.env.MONGO_URI_R);
		return await next();
	}

	if (process.env.NODE_ENV === "production") {
		if (!process.env.MONGO_URI_R)
			throw Error("Add MONGO_URI_P to environment variables.");

		await connect(process.env.MONGO_URI_R);
		return await next();
	} else {
		if (!process.env.MONGO_URI)
			throw Error("Add MONGO_URI to environment variables.");

		await connect(process.env.MONGO_URI);
		return await next();
	}
}
