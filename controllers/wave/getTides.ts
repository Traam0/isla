import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError } from "~/errors";
import { User } from "~/models";
import Wave from "~/models/Wave";
import { TidesGetResponse } from "~/types/waves";

export async function getTides(
	req: any,
	res: NextApiResponse<TidesGetResponse | { message: string }>
): Promise<void> {
	if (req.query.page === undefined)
		throw BadRequestError(res, "page query param is required");

	const [tidesCount, page]: [15, number] = [
		15,
		Math.max(Number(req.query.page), 1),
	];

	const totalTides = await Wave.count({
		$or: [
			{ holder: req.user.id }, // Your ID as the wave holder
			{
				holder: {
					$in: (await User.findById(req.user.id)).connections.following,
				},
			}, // Holder ID is in your following list
			// { 'user.public': true } // User's public field is true
			{
				holder: {
					$in: (
						await User.find({ public: true }, { _id: 1 })
					).map((e) => e._id),
				},
			},
		],
	});

	const tides = await Wave.find({
		$or: [
			{ holder: req.user.id }, // Your ID as the wave holder
			{
				holder: {
					$in: (await User.findById(req.user.id)).connections.following,
				},
			}, // Holder ID is in your following list
			// { 'user.public': true } // User's public field is true
			{
				holder: {
					$in: (
						await User.find({ public: true }, { _id: 1 })
					).map((e) => e._id),
				},
			},
		],
	})
		.limit(tidesCount)
		.skip((page - 1) * tidesCount)
		.sort({ createdAt: -1 })
		.lean();
	// .limit(request.query.page - 1 * 15 + 15);

	// const holderIds = tides.map((tide) => tide.holder);
	const users = await User.find(
		{ _id: { $in: tides.map((tide) => tide.holder) } },
		{ username: 1, image: 1 }
	);

	const tidesWithUsername = tides.map((tide) => {
		const user = users.find(
			(user) => user._id.toString() === tide.holder.toString()
		);
		return {
			...tide,
			holder: { username: user.username, image: user.image },
		};
	});

	res.status(StatusCodes.OK).json({
		tides: tidesWithUsername as any,
		page: page,
		hasNextPage: totalTides > tidesCount * page,
		hasPreviousPage: page > Math.max(page - 1, 1),
	});
}
