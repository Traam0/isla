import { number, z } from "zod";
import leaderboard from "~/pages/api/users/leaderboard";

const RegisterRequestValidator = z.object({
	username: z.string().min(3, "minimun lenght of 3"),
	first_name: z.string().min(3, "minimun lengh of 3"),
	last_name: z.string().min(3, "minimun lengh of 3"),
	email: z.string().email("invalid email"),
	password: z
		.string()
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"weak password"
		),
	country: z.string().optional(),
	birthdate: z.union([z.string(), z.date(), z.null()]),
});

const RegisterResponseValidator = z.object({
	_id: z.string(),
	username: z.string().min(3, "minimun lenght of 3"),
	first_name: z.string().min(3, "minimun lengh of 3"),
	last_name: z.string().min(3, "minimun lengh of 3"),
	email: z.string().email("invalid email"),
	gender: z.string(),
	country: z.string(),
	city: z.string(),
	birthdate: z.union([z.string(), z.date()]),
	image: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	__v: z.number(),
});

type RegisterRequest = z.infer<typeof RegisterRequestValidator>;
type RegisterResponse = z.infer<typeof RegisterResponseValidator>;

/* USAGE 
	export async function register(req:NextApiRequest, res: NextAPiRespone<RegisterResponse | {message: string}>){
		const reqValidation = RegisterRequestValidator.safeParse(req.body);
		if (!reqValidation.success)
			throw UnprocessableEntityError(res, "UNPROCESSABLE ENTITY");

		const {data: userInfo} = reqValidation
		
		... handle request

		
	}
*/

export { RegisterRequestValidator };
export type { RegisterRequest, RegisterResponse };

const LoginRequestValidator = z.object({
	email: z.string().email(),
	password: z.string(),
	remeberMe: z.boolean().optional(),
});

const LoginResponseValidator = z.object({
	_id: z.string(),
	username: z.string().min(3, "minimun lenght of 3"),
	email: z.string().email("invalid email"),
	image: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

type LoginRequest = z.infer<typeof LoginRequestValidator>;
type LoginResponse = z.infer<typeof LoginResponseValidator>;

export { LoginRequestValidator };
export type { LoginRequest, LoginResponse };

const userValidator = z.object({
	connections: z.object({
		followers: z.array(z.string()),
		following: z.array(z.string()),
	}),
	_id: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	username: z.string(),
	birthdate: z.string(),
	email: z.string(),
	image: z.string(),
	country: z.string(),
	public: z.boolean(),
	xp: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	__v: z.number(),
});

type User = z.infer<typeof userValidator>;

export { userValidator };
export type { User };

const leaderboardResponseValidator = z.object({
	leaderboard: z.array(
		z.object({
			_id: z.string(),
			xp: z.number(),
			username: z.string(),
			image: z.string(),
		})
	),
});

type LeaderboardResponse = z.infer<typeof leaderboardResponseValidator>;

export { leaderboardResponseValidator };
export type { LeaderboardResponse };
