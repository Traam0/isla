import { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError } from "~/errors";
import { User } from "~/models";
import Wave from "~/models/Wave";

export async function find(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	if (!req.query.search) throw BadRequestError(res, "seacrh query is required");

	const patterns: Array<string> = [];
	const regexdPatterns: Array<string> = [];
	req.query.search = Array.from(new Set(req.query.search)).join("");

	for (let i = 0; i < req.query.search.length; i++) {
		const substring: string = req.query.search.slice(0, i + 1) as string;
		patterns.push(substring);
	}

	for (let i = 0; i < patterns.length; i++) {
		const patternArray = patterns[i].split("");
		var re = "(\\w*";
		for (let j = 0; j < patternArray.length; j++) {
			re += `${patternArray[j]}\\w*`;
		}
		re += ")";

		regexdPatterns.push(re);
	}

	// console.log(regexdPatterns);
	const regex = regexdPatterns.join("|");
	const matcher = new RegExp(regex, "gi");

	console.log(matcher);
	const users = await User.find(
		{ username: { $regex: matcher } },
		{ password: 0 }
	).sort({ username: 1 });

	const userIds = users.map((user) => user._id);

	//const tides = await Wave.find({ holder: { $in: userIds } });

	const tides = await Wave.find({ holder: { $in: userIds } })
		.limit(50)
		.lean()
		.sort({ createdAt: -1 });
	const tidesWithUsername = tides.map((tide) => {
		const user = users.find(
			(user) => user._id.toString() === tide.holder.toString()
		);
		return {
			...tide,
			holder: { username: user.username, image: user.image },
		};
	});
	res.status(200).json({ users, tides: tidesWithUsername, matcher: regex });
}
