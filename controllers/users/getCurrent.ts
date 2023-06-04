import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";
import { NotFoundError } from "~/errors";
import { User } from "~/models";
import type { User as USER } from "~/types/users";

export async function getCurrent(
	req: any,
	res: NextApiResponse<USER | { message: string }>
) {
	const user = await User.findById(req.user.id);

	if (!user) throw NotFoundError(res, "Account not found");

	const { passoword, ...userRest } = user._doc;

	res.status(StatusCodes.OK).json({ ...userRest });
}
