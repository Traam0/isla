/** @format */

import { UnAuthenticatedError, UnAuthorizedError } from "~/errors";
import { NextApiRequest, NextApiResponse } from "next";
import jswt from "jsonwebtoken";
import { Session } from "~/models";
import { attachCookies, signToken } from "~/utils";
import { getCookie, getCookies } from "cookies-next";

export async function authenticateUser(
	req: any,
	res: NextApiResponse,
	next: any
) {
	const { ATS } = req.cookies || getCookie("ATS");

	console.log(ATS)

	if (!ATS) {
		return UnAuthenticatedError(res, "Not Authenticated");
	}

	if (!process.env.JSWT_SECRET)
		throw Error("add JSWT_SECRET to environment variables");

	const secret = process.env.JSWT_SECRET;

	jswt.verify(
		ATS,
		secret,
		async function (
			err: jswt.VerifyErrors | null,
			decoded: jswt.JwtPayload | string | undefined
		) {
			if (!err) {
				const { id, email, username, image } = decoded as jswt.JwtPayload;
				req.user = { id, email, username, image };
				return await next();
			}

			if (err.message !== "jwt expired" && err.name !== "TokenExpiredError")
				throw UnAuthorizedError(res, "Invalide Session");

			const payload = jswt.verify(ATS, secret, {
				ignoreExpiration: true,
			}) as jswt.JwtPayload;

			const refresh = await Session.findOne({
				user_id: payload.id,
				RTS: payload.RTS,
			});

			if (!refresh) throw UnAuthenticatedError(res, "Session Expired");

			jswt.verify(
				refresh.RTS,
				secret,
				async function (
					err: jswt.VerifyErrors | null,
					decoded: jswt.JwtPayload | string | undefined
				) {
					if (!err) {
						const token = signToken(
							{
								id: payload.id,
								email: payload.email,
								image: payload.image,
								username: payload.username,
								RTS: refresh.RTS,
							},
							"30m"
						);

						req.user = {
							id: payload.id,
							email: payload.email,
							image: payload.image,
							username: payload.username,
						};
						attachCookies({ req, res, token });

						return await next();
					}

					await Session.deleteOne({
						user_id: payload.id,
						RTS: payload.RTS,
					});

					throw UnAuthenticatedError(res, "Session Expired");
				}
			);
		}
	);
}

export const authorizePermissions =
	(...roles: number[]) =>
	(req: any, res: NextApiResponse, next: any) => {
		if (!roles.includes(req.user.role)) {
			return UnAuthorizedError(res, "Unauthorized to access this route");
		}
		return next();
	};
