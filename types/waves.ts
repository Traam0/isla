import { z } from "zod";

const wavePostRequestValidator = z.object({
	content: z.string().optional(),
	image: z.string().optional(),
});

const WavePostResponseValidator = z.object({
	_id: z.string(),
	content: z.union([z.string(), z.undefined()]),
	image: z.union([z.string(), z.undefined()]),
	comments: z.array(z.string()),
	votes: z.array(z.string()),
	createdAt: z.string(),
	updatedAt: z.string(),
	__v: z.number(),
});

type WavePostRequest = z.infer<typeof wavePostRequestValidator>;
type WavePostResponse = z.infer<typeof WavePostResponseValidator>;

export { wavePostRequestValidator };
export type { WavePostRequest, WavePostResponse };

const tideValidator = z.object({
	_id: z.string(),
	holder: z.object({
		username: z.string(),
		image: z.string(),
	}),
	content: z.string(),
	image: z.string(),
	comments: z.array(
		z.object({
			_id: z.string(),
			comment: z.string(),
			createdAt: z.string(),
		})
	),
	votes: z.array(
		z.object({
			vote: z.union([z.literal(1), z.literal(-1)]),
			holder: z.string(),
		})
	),
	// saved: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	__v: z.number(),
});

const tidesGetResponseValidator = z.object({
	tides: z.array(tideValidator),
	page: z.number(),
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
});

type TidesGetResponse = z.infer<typeof tidesGetResponseValidator>;
type Tide = z.infer<typeof tideValidator>;

const tideVoteRequestValidator = z.object({
	vote: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
});

type TideVoteRequest = z.infer<typeof tideVoteRequestValidator>;

export { tidesGetResponseValidator };
export { tideVoteRequestValidator };

export type { TidesGetResponse, Tide, TideVoteRequest };

const tideCommentRequestValidator = z.object({
	comment: z.string(),
});

type TideCommentRequest = z.infer<typeof tideCommentRequestValidator>;

export { tideCommentRequestValidator };
export type { TideCommentRequest };
