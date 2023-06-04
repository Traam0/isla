import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";
import { NotFoundError, UnprocessableEntityError } from "~/errors";
import Wave from "~/models/Wave";
import { Tide, tideVoteRequestValidator } from "~/types/waves";

export async function voteForTide(
	req: any,
	res: NextApiResponse<Tide | { message: string }>
) {
	const body = tideVoteRequestValidator.safeParse(req.body);

	if (!body.success)
		throw UnprocessableEntityError(res, "Unporocessable Entity");

	const { vote } = body.data;
	if (vote === 0) {
		const tide = (await Wave.findByIdAndUpdate(
			req.query._tid,
			{
				$pull: { votes: { holder: req.user.id } },
			},
			{ new: true }
		).lean()) satisfies Tide | null;

		if (!tide) throw NotFoundError(res, "Tide not found");

		res.status(StatusCodes.OK).json({ ...tide });
	} else {
		(await Wave.findByIdAndUpdate(
			req.query._tid,
			{
				$pull: { votes: { holder: req.user.id } },
			},
			{ new: true }
		).lean()) satisfies Tide | null;

		const tide = (await Wave.findByIdAndUpdate(
			req.query._tid,
			{
				$push: { votes: { holder: req.user.id, vote } }, // Add the new vote
			},
			{ new: true }
		).lean()) satisfies Tide | null;

		if (!tide) throw NotFoundError(res, "Tide not found");
		res.status(StatusCodes.OK).json({ ...tide });
	}
}
