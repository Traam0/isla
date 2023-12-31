import Head from "next/head";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useSession, useToggle } from "~/hooks";
import { useForm, isEmail, matches, isNotEmpty } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { StatusCodes } from "http-status-codes";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ToastContainer as Toaster, toast } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Select } from "~/components";
import { motion } from "framer-motion";
import { RegisterRequest, RegisterResponse } from "~/types/users";
import "react-toastify/dist/ReactToastify.css";



export const getStaticProps: GetStaticProps<{
	countries: string[];
}> = async (ctx) => {
	type countriesResponse = {
		error: boolean;
		msg: string;
		data: Array<{
			iso2: string;
			iso3: string;
			country: string;
			cities: string[];
		}>;
	};

	const response = await axios
		.get<countriesResponse>("https://countriesnow.space/api/v0.1/countries")
		.catch((error: AxiosError) => null);

	return {
		props: {
			countries: response
				? [
						"choose a country",
						...response.data.data.map((entry) => entry.country).sort(),
				  ]
				: ["no countries"],
		},
	};
};

export default function Register({
	countries,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
	const { data: session, ...sessionRest } = useSession();
	const router = useRouter();
	const [loginDisabled, toggleLoginDisabled] = useToggle(false);
	const [file, setFile] = useState<File | null>(null);
	const [cities, setCities] = useState<string[]>(["city (optional)"]);

	const form = useForm<RegisterRequest>({
		initialValues: {
			first_name: "",
			last_name: "",
			username: "",
			email: "",
			password: "",
			country: countries[0],
			birthdate: null,
		},

		validate: {
			email: isEmail(
				<div className="text-red-500 text-xs mt-1 pl-4 capitalize">
					Invalid Email
				</div>
			),
			password: matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				<div className="text-red-500 text-xs mt-1 pl-4 capitalize">
					Weak Password
				</div>
			),
			username: matches(
				/^[a-zA-Z0-9_]{3,16}$/,
				<div className="text-red-500 text-xs mt-1 pl-4 capitalize">
					Invalid username
				</div>
			),
			birthdate: isNotEmpty(
				<div className="text-red-500 text-xs mt-1 pl-4 ">required</div>
			),
			first_name: isNotEmpty(
				<div className="text-red-500 text-xs mt-1 pl-4 ">required</div>
			),
			last_name: isNotEmpty(
				<div className="text-red-500 text-xs mt-1 pl-4 ">required</div>
			),
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
				<div className="relative bg-gradient-to-br from-background-500  to-white/60 h-full w-full md:min-w-[700px] md:w-fit flex flex-col justify-center items-center md:px-16 ">
					{sessionRest.isFetching && (
						<div className="absolute inset-0 flex items-center justify-center z-50 bg-black/20">
							<div className="pulse-out " />
						</div>
					)}
					<div className="bg-white rounded-lg shadow-lg w-fit px-8 py-4 flex flex-col items-start gap-6 w-full ">
						<div>
							<h1 className="font-semibold font-mono text-3xl leading-normal">
								Welcome Back
							</h1>
							<h2>
								Already have an account?{" "}
								<Link className="text-purple-600" href={"/auth/login"}>
									Login Now
								</Link>
							</h2>
						</div>
						<form
							className="space-y-2 w-full"
							onSubmit={form.onSubmit(async () => {
								toggleLoginDisabled();

								const response = await axios
									.post<RegisterResponse>("/api/auth/register", {
										...form.values,
										country:
											form.values.country === "choose a country" ||
											form.values.country === "no countries"
												? null
												: form.values.country,
									})
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

								toggleLoginDisabled();
								if (response && response.status === 201) {
									toast.success("Account created successfully", {});
									router.push("/auth/login");
								}
							})}
						>
							<div className="flex gap-8 w-full">
								<Input
									label="first Name"
									{...form.getInputProps("first_name")}
								/>
								<Input label="last Name" {...form.getInputProps("last_name")} />
							</div>
							<div className="flex gap-8 w-full">
								<Input label="Email" {...form.getInputProps("email")} />
								<Input label="username" {...form.getInputProps("username")} />
							</div>
							<div className="flex gap-8 w-full">
								<Input
									label="Password"
									type="password"
									{...form.getInputProps("password")}
								/>
							</div>
							<div className="flex gap-8 w-full">
								<DatePickerInput
									label="Pick date"
									placeholder="Pick date"
									{...form.getInputProps("birthdate")}
									mx="auto"
									className="w-full"
								/>
							</div>
							<div className="flex gap-8 w-full">
								<Select
									label="Country"
									options={countries}
									selected={form.values.country as string}
									{...form.getInputProps("country")}
									className="w-full"
									position="TOP"
								/>
							</div>
							<div className="flex w-full">
								<motion.button
									whileTap={{ scale: 0.98 }}
									whileHover={{ scale: 1.02 }}
									className="w-full bg-primary-500 py-3 rounded-md"
									type="submit"
								>
									Register
								</motion.button>
							</div>
						</form>
					</div>
				</div>
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</main>
		</>
	);
}

interface InputProps {
	value: any;
	onChange: any;
	checked?: any;
	error?: any;
	onFocus?: any;
	onBlur?: any;
	label: string;
	type?: string;
}

function Input({ label, ...props }: InputProps) {
	return (
		<div className="relative z-0 w-full mb-6 group">
			<input
				className="block py-2.5 px-0 w-full text-sm text-dark-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				placeholder=" "
				{...props}
				name={label}
				type={props.type ?? "string"}
			/>
			<label
				htmlFor={label}
				className="peer-focus:font-medium absolute text-sm text-dark-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
			>
				{label}
			</label>
			{props.error}
		</div>
	);
}
