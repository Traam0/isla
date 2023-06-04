import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";
import {
	BadRequestError,
	UnAuthorizedError,
	UnprocessableEntityError,
} from "~/errors";
import Wave from "~/models/Wave";
import { WavePostResponse, wavePostRequestValidator } from "~/types/waves";
import { cloudinary } from "~/utils/cloudinary";

export async function upload(
	req: any,
	res: NextApiResponse<WavePostResponse | { message: string }>
): Promise<void> {
	const waveInfo = wavePostRequestValidator.safeParse(req.body);

	if (!waveInfo.success)
		throw UnprocessableEntityError(res, "UNPROCESSABLE ENTITY");

	const { content, image } = waveInfo.data;
	const currentDate = new Date().setHours(0, 0, 0, 0);

	const tides = await Wave.find({
		holder: req.user.id,
		createdAt: { $gte: currentDate },
	});

	if (tides.length >= 5) throw UnAuthorizedError(res, "max tides reached");

	if (!image) {
		const wave = await Wave.create({ holder: req.user.id, content, image: "" });
		res.status(StatusCodes.CREATED).json({ ...wave._doc });
	} else {
		const uploadResponse = await cloudinary.uploader
			.upload(image, {
				upload_preset: "project-isla",
			})
			.catch((error) => {
				throw BadRequestError(res, "failed to upload media");
			});

		const wave = await Wave.create({
			holder: req.user.id,
			content: content ? content : "",
			image: uploadResponse.url,
		});
		res.status(StatusCodes.CREATED).json({ ...wave._doc });
	}
}
