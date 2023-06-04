/** @format */

import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";

export default function UnAuthenticatedError(res: NextApiResponse, message: string) {
  return res.status(StatusCodes.UNAUTHORIZED).json({ message });
}
