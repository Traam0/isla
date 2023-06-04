import bcryptjs from "bcryptjs";
import { Session, User } from "~/models";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { LoginRequestValidator } from "~/types/users";
import type { LoginResponse } from "~/types/users";
import {
	InternalServerError,
	NotFoundError,
	UnAuthenticatedError,
	UnprocessableEntityError,
} from "~/errors";
import { attachCookies, signToken } from "~/utils";

export async function Attempt(
	req: NextApiRequest,
	res: NextApiResponse<LoginResponse | { message: string }>
): Promise<void> {
	const reqValidation = LoginRequestValidator.safeParse(req.body);
	if (!reqValidation.success)
		throw UnprocessableEntityError(res, "UNPROCESSABLE ENTITY");

	const salt = await bcryptjs.genSalt(10);
	const { data: credentials } = reqValidation;
	const user = await User.findOne({ email: credentials.email });

	if (!user) throw NotFoundError(res, "Account does not exist");

	const passwordDoesMatch = await bcryptjs.compare(
		credentials.password,
		user.password
	);

	if (!passwordDoesMatch)
		throw UnAuthenticatedError(res, "credentials do not match");

	const refreshToken = await Session.findOne({ user_id: user._id });

	if (refreshToken) await Session.deleteOne({ user_id: user._id });

	const RTS = signToken(
		{
			id: user._id,
			email: user.email,
			username: user.username,
			image: user.image,
		},
		credentials.remeberMe ? "30d" : "7d"
	);

	try {
		await Session.create({ user_id: user._id, RTS });
	} catch (error) {
		console.log(error);
		throw InternalServerError(
			res,
			"session cannot be created --track contollers.login L31"
		);
	}

	const accessToken = signToken(
		{
			id: user._id,
			email: user.email,
			username: user.username,
			image: user.image,
			RTS,
		},
		"30m"
	);

	attachCookies({ req, res, token: accessToken });
	const { password, ...payload } = user._doc;
	res.status(StatusCodes.OK).json(payload);
}
