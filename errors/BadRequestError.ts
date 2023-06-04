 /** @format */

import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";

export default function BadRequestError(res: NextApiResponse, message: string) {
  return res.status(StatusCodes.BAD_REQUEST).json({ message });
}

