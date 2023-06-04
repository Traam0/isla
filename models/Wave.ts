import { Schema, model, models } from "mongoose";

const WaveSchema = new Schema(
	{
		holder: { type: Schema.Types.String, required: true, trim: true },
		content: {
			type: Schema.Types.String,
			required: false,
			trim: true,
			default: undefined,
		},
		image: {
			type: Schema.Types.String,
			required: false,
			trim: true,
			default: undefined,
		},
		comments: {
			type: Schema.Types.Array,
			required: false,
			default: [],
		},
		votes: {
			type: Schema.Types.Array,
			required: false,
			default: [],
		},
	},
	{ timestamps: true }
);

export default models.Wave || model("Wave", WaveSchema);

