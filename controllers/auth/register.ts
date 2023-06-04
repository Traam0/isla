import { StatusCodes } from "http-status-codes";
import { User } from "~/models";
import { NextApiRequest, NextApiResponse } from "next";
import { UnprocessableEntityError } from "~/errors";
import { RegisterResponse, RegisterRequestValidator } from "~/types/users";
import bcryptjs from "bcryptjs";

export async function register(
	req: NextApiRequest,
	res: NextApiResponse<RegisterResponse | { message: string }>
): Promise<void> {
	const reqValidation = RegisterRequestValidator.safeParse(req.body);
	if (!reqValidation.success)
		throw UnprocessableEntityError(res, "UNPROCESSABLE ENTITY");

	const { data: userInfo } = reqValidation;
	const salt = await bcryptjs.genSalt(10);

	const hashedPassword = await bcryptjs.hash(userInfo.password, salt);

	const user = await User.create({
		...userInfo,
		password: hashedPassword,
	});

	if (!user)
		res
			.status(StatusCodes.FAILED_DEPENDENCY)
			.json({ message: "failed to craete account" });

	const { password, ...userRest } = user._doc;
	res.status(StatusCodes.CREATED).json({ ...userRest });
}
