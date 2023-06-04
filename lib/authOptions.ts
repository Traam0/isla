import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import { inputIsEmpty } from "~/utils/helpers";
import axios, { AxiosError } from "axios";
import { LoginResponse } from "~/types/users";
import { User as UserModal } from "~/models";

function extractGoogleCredentials(): {
	clientId: string;
	clientSecret: string;
} {
	if (
		!process.env.GOOGLE_CLIENT_ID ||
		inputIsEmpty(process.env.GOOGLE_CLIENT_ID as string)
	) {
		throw new Error("GOOGLE_CLIENT_ID missing in environment variables");
	}

	if (
		!process.env.GOOGLE_CLIENT_SECRET ||
		inputIsEmpty(process.env.GOOGLE_CLIENT_SECRET as string)
	) {
		throw new Error("GOOGLE_CLIENT_SECRET missing in environment variables");
	}

	const [clientId, clientSecret] = [
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
	];

	return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			token.id = user._id;
			token.username = user.username;
			token.image = user.image;
			token.email = user.email;
			
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.username = token.name!;
				session.user.email = token.email!;
				session.user.image = token.picture!;
			}

			return session;
		},
		redirect() {
			return "http://localhost:3000/home";
		},
	},
	providers: [
		Credentials({
			type: "credentials",
			credentials: {},
			async authorize(credentials, req) {
				const { emailF } = credentials as { emailF: string };
				const response = await UserModal.findOne({ emailF });
				console.log(response);
				if (response) {
					const { username, email, _id, image, createdAt, updatedAt } =
						response._doc;

					return {
						username,
						email,
						_id: String(_id),
						image,
						createdAt,
						updatedAt,
					} as User;
				}

				return null;
			},
		}),
	],

	pages: {
		signIn: "/auth/login",
	},
};
