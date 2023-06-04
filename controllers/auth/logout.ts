import { NextApiResponse } from "next";
import { Session } from "~/models";
import { StatusCodes } from "http-status-codes";
import { deleteCookie } from "cookies-next";

export async function logout(req: any, res: NextApiResponse): Promise<void> {
	await Session.deleteOne({ user_id: req.user.id });
	deleteCookie("ATS", { req, res });
	// res.status(StatusCodes.OK).json("logged out successfully");
	res.redirect(StatusCodes.TEMPORARY_REDIRECT, "/");
}
