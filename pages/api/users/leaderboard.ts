import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getLeaderBoard } from "~/controllers/users";
import { connDB } from "~/middlewares";
import { authenticateUser } from "~/middlewares/authMiddleware";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(connDB).use(authenticateUser).get(getLeaderBoard);

export default router.handler({
	onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
		console.error(err?.stack);
		res.status(500).end("Something broke!");
	},
	onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
		res.status(404).end("Page is not found");
	},
});
