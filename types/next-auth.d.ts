import NextAuth from "next-auth/next";

declare module "next-auth" {
	interface User {
		username: string;
		email: string;
		_id: string;
		image: string;
		createdAt: string;
		updatedAt: string;
	}

	interface Session {
		user: {
			username: string;
			email: string;
			id: string;
			image: string;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		username: string;
		email: string;
		id: string;
		image: string;
	}
}
