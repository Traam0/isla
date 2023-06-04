import fs from "fs";
import { format } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

async function log(req: any, res: NextApiResponse, next: any): Promise<void> {
	const log = `Log: ${format(Date.now(), "dd-MMM-yy HH:mm:ss")} : ${
		req.user.id
	}, ${req.user.email} requested ${req.url}. \n`;

	fs.appendFile(".log", log, (error) => {
		if (error) {
			console.log(error);
		}
		console.log("log written successfully\n");
	});

	return await next();
}
