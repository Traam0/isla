import mongoose, { Schema, model, models } from "mongoose";

const ConversationSchema = new Schema(
	{
		conversation: {
			type: Schema.Types.String,
			required: true,
		},
		sender: {
			type: Schema.Types.Array,
			trim: true,
			required: true,
		},
		content: {
			message: {
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
		},
	},
	{ timestamps: true }
);

export default models.Conversation || model("Conversation", ConversationSchema);
