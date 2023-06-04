import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";
import { User } from "~/models";
import { LeaderboardResponse } from "~/types/users";

export async function getLeaderBoard(
	req: any,
	res: NextApiResponse<LeaderboardResponse>
) {
	const users = await User.find({}, { _id: 1, username: 1, xp: 1, image: 1 })
		.sort({ xp: -1, createdAt: -1 })
		.limit(10);

	res.status(StatusCodes.OK).json({ leaderboard: [...users] });
}
