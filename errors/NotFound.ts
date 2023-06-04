/** @format */

import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";

export default function NotFoundError(res: NextApiResponse, message: string) {
  return res.status(StatusCodes.NOT_FOUND).json({ message });
}

