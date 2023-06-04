import mongoose, { Schema, model, models } from "mongoose";

// mongoose.deleteModel("User");
const UserSchema = new Schema(
	{
		first_name: {
			type: Schema.Types.String,
			trim: true,
			lowercase: true,
			required: true,
		},
		last_name: {
			type: Schema.Types.String,
			trim: true,
			lowercase: true,
			required: true,
		},
		username: {
			type: Schema.Types.String,
			trim: true,
			lowercase: false,
			required: true,
			unique: true,
		},
		birthdate: {
			type: Schema.Types.String,
			trim: true,
			lowercase: true,
			required: true,
		},
		email: {
			type: Schema.Types.String,
			trim: true,
			lowercase: true,
			required: true,
			unique: true,
		},
		password: {
			type: Schema.Types.String,
			required: true,
		},

		image: {
			type: Schema.Types.String,
			required: false,
			default: "profile.png",
		},
		country: {
			type: Schema.Types.String,
			required: true,
			default: "profile.png",
		},
		connections: {
			followers: {
				type: Schema.Types.Array,
				required: false,
				default: [],
			},
			following: {
				type: Schema.Types.Array,
				required: false,
				default: [],
			},
		},
		public: { type: Schema.Types.Boolean, default: true },
		xp: { type: Schema.Types.Number, default: 0 },
	},
	{ timestamps: true }
);

export default models.User || model("User", UserSchema);
