/** @format */

import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";

export default function InternalServerError(res: NextApiResponse, message: string) {
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
}
