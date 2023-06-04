import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";
import { NotFoundError, UnprocessableEntityError } from "~/errors";
import Wave from "~/models/Wave";
import { Tide, tideCommentRequestValidator } from "~/types/waves";

export async function createComment(
	req: any,
	res: NextApiResponse<Tide | { message: string }>
) {
	const safeCheck = tideCommentRequestValidator.safeParse(req.body);

	if (!safeCheck.success) throw UnprocessableEntityError(res);
	const { comment } = safeCheck.data;

	const tide: Tide | null = await Wave.findByIdAndUpdate(
		req.query._tid,
		{
			$push: {
				comments: {
					holder: req.user.id,
					comment,
					createdAt: new Date().toISOString(),
				},
			},
		},
		{ new: true }
	).lean();

	if (!tide) throw NotFoundError(res, "Tide no Longer exists");

	res.status(StatusCodes.OK).json({ ...tide });
}
