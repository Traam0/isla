import { useSession, useToggle } from "~/hooks";
import { useForm } from "@mantine/form";
import {
	IconMail,
	IconLock,
	IconEyeClosed,
	IconEye,
	IconLogin,
} from "@tabler/icons-react";
import axios, { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import { useRouter } from "next/router";
import { ToastContainer as Toaster, toast } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LoginResponse } from "~/types/users";
import Link from "next/link";
import { signIn } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";

export default function Login(): JSX.Element {
	const [passwordVisibility, togglePasswordVisiblity] = useToggle(false);
	const [loginDisabled, toggleLoginDisabled] = useToggle(false);
	const { data: session, ...sessionRest } = useSession();
	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},

		validate: {
			email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
			password: (val) =>
				val.length >= 3
					? null
					: "Password should include at least 6 characters",
		},
	});

	if (!sessionRest.isFetching && !sessionRest.isLoading) {
		if (session && session.id) {
			router.replace("/home");
		}
	}

	return (
		<>
			<Head>
				<title>ISLA | Register</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/logo.png" />
			</Head>
			<main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-300 from-20% via-fuchsia-700 via-70% to-purple-400 to-100% move">
				<Toaster />
				<div className="relative bg-gradient-to-br from-background-500  to-white/60 h-full w-full md:min-w-[600px] md:w-fit flex flex-col justify-center items-center ">
					{sessionRest.isFetching && (
						<div className="absolute inset-0 flex items-center justify-center z-50 bg-black/20">
							<div className="pulse-out " />
						</div>
					)}
					<div className="bg-white rounded-lg shadow-lg w-fit px-8 py-4 flex flex-col items-start gap-8">
						<h1 className="font-semibold font-mono text-3xl leading-normal">
							Welcome Back
						</h1>
						<form
							onSubmit={form.onSubmit(async () => {
								toggleLoginDisabled();

								const response = await axios
									.post<LoginResponse>("/api/auth/login", form.values)
									.catch((error: AxiosError<{ message: string }>) => {
										switch (error.response?.status) {
											case StatusCodes.NOT_FOUND:
												form.setFieldError("email", "email not Found");
												toast.error("Account Not Found", {});
												break;
											case StatusCodes.UNAUTHORIZED:
												form.setFieldError("password", "Wrong Credentiels");
												form.setFieldError("email", "Wrong Credentiels");
												toast.error("Wrong Credentiels", {});
												break;
											default:
												toast.error("Something Broke", {});
										}
									});

								if (response && response.status === 200) {
									toast.success("logged in successfully");
								}

								toggleLoginDisabled();
								sessionRest.refetch();
							})}
							className="space-y-5"
						>
							<div>
								<div className="flex items-center h-fit bg-slate-100 px-3 rounded-lg">
									<IconMail
										stroke={1.75}
										size={28}
										className="text-purple-500 bg-white p-1 rounded-md"
									/>
									<input
										type="text"
										placeholder="example@example.com"
										className="px-2 py-3 border-none focus:border-none focus:outline-none focus:ring-0 bg-transparent w-full md:min-w-[340px]"
										{...form.getInputProps("email")}
									/>
								</div>
								<div className="text-red-500 text-xs mt-1 pl-4 ">
									{form.getInputProps("email").error}
								</div>
							</div>

							<div>
								<div className="flex items-center h-fit bg-slate-300 px-3 rounded-lg">
									<IconLock
										stroke={1.75}
										size={28}
										className="text-purple-500 bg-white p-1 rounded-md"
									/>
									<input
										type={passwordVisibility ? "text" : "password"}
										placeholder="*****"
										className="px-2 py-3 border-none focus:border-none focus:outline-none focus:ring-0 bg-transparent w-full md:min-w-[340px]"
										{...form.getInputProps("password")}
									/>
									{passwordVisibility ? (
										<IconEyeClosed
											stroke={1.75}
											size={28}
											className="text-black bg-white p-1 rounded-md cursor-pointer"
											onClick={togglePasswordVisiblity}
										/>
									) : (
										<IconEye
											size={28}
											stroke={1.75}
											className="text-black bg-white p-1 rounded-md cursor-pointer"
											onClick={togglePasswordVisiblity}
										/>
									)}
								</div>
								<div className="text-red-500 text-xs mt-1 pl-4">
									{form.getInputProps("password").error}
								</div>
							</div>

							<div className="flex justify-between">
								<span>
									Don't have an account?{" "}
									<Link
										href={"/auth/register"}
										className="w-fit text-end text-sm text-purple-700 font-medium"
									>
										Register now!
									</Link>
								</span>
								<div className="w-fit text-end text-sm text-purple-700 font-medium">
									Forgot Password ?
								</div>
							</div>
							<button
								disabled={loginDisabled}
								className="w-full flex justify-center items-center gap-3 drop-shadow-lg rounded-lg py-2 border-1 border-accent-500 ring-2 ring-accent-500 bg-primary-500 hover:bg-secondary-500 ease-in-out  duration-200"
							>
								<IconLogin stroke={1.5} size={22} /> Login
							</button>
						</form>
					</div>
				</div>
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</main>
		</>
	);
}
