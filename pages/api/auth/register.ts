import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import type { LoginResponse } from "~/types/users";
import { StatusCodes } from "http-status-codes";
import { connDB } from "~/middlewares";
import { Attempt, register } from "~/controllers/auth";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(connDB).post(register);

export default router.handler({
	onError: (err: any, req, res) => {
		console.error(err.stack);
		res
			.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
			.end(err.message);
	},
	onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
		res.status(StatusCodes.NOT_FOUND).end("Page is not found");
	},
});
