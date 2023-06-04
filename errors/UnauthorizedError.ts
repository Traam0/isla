/** @format */

import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";

export default function UnAuthorizedError(res: NextApiResponse, message: string) {
  return res.status(StatusCodes.FORBIDDEN).json({ message });
}

