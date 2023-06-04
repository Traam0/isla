/** @format */

import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";

export default function UnprocessableEntityError(
	res: NextApiResponse,
	message: string = "Unporocessable Entity"
) {
	return res.status(StatusCodes.UNAUTHORIZED).json({ message });
}
