import mongoose, { Schema, model, models } from "mongoose";

const ConversationSchema = new Schema(
	{
		participants: {
			type: Schema.Types.Array,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true }
);

export default models.Conversation || model("Conversation", ConversationSchema);
