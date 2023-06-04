import axios, { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useSession } from "~/hooks/";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppLayout } from "~/layouts";
import { SearchResponse } from "~/types";
import { User } from "~/types/users";
import { Tide } from "~/types/waves";
import { inputIsEmpty } from "~/utils/helpers";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	if (!ctx.query.search || inputIsEmpty(ctx.query.search)) {
		return {
			redirect: {
				destination: "/home",
				permanent: false,
			},
		};
	}

	const response = await axios
		.get<SearchResponse>(
			`http://localhost:3000/api/users/find?search=${ctx.query.search}`,
			{
				withCredentials: true,
			}
		)
		.catch((error: AxiosError<{ message: string }>) => {
			toast.error(error.response?.data.message);
		});

	if (!response) {
		return {
			props: {
				searchResults: {
					users: [],
					tides: [],
				},
			},
		};
	}

	return {
		props: {
			searchResults: response.data,
		},
	};
};

export default function SearchPage({ searchResults }: any) {
	const { data: session } = useSession();
	const router = useRouter();
	const current = useQueryClient().getQueryData<User>(["me", "current"]);
	const [value, setValue] = useState<string>(
		(router.query.search as string) ?? ""
	);

	// const [searchResults, setSearchResult] = useState<{
	// 	users: User[];
	// 	tides: Tide[];
	// }>({ users: [], tides: [] });
	searchResults.users.sort((a, b) => {
		if (a._id === session?.id) return -1;
		if (b._id === session?.id) return 1;
		return 0;
	});
	return (
		<AppLayout>
			<main className="flex h-screen  overflow-y-scroll w-full relative ">
				<div className="w-[650px] h-full bg-white px-4 flex flex-col gap-6 pt-6">
					<form
						onSubmit={(ev) => {
							ev.preventDefault();
							if (inputIsEmpty(value)) return router.reload();
							router.push(`/search?search=${value}`);
							return setValue("");
						}}
					>
						<input
							onChange={(e) => setValue(e.target.value)}
							type="text"
							{...{ value }}
							placeholder="LookUp"
							className="w-full  px-5 py-4 outline-none rounded-3xl bg-gradient-to-r from-primary-400 to-secondary-500 "
						/>
					</form>

					<section className="overflow-x-hiddsen flex flex-col gap-1 whitespace-pre-wrap w-full break-words">
						<h1>People</h1>
						{searchResults.users.map((user) => (
							<div
								key={user._id}
								className="w-[600px] py-3 bg-background-500 flex flex-row items-start relative hover:bg-slate-50"
							>
								<div className="px-1">
									<Image
										src={user.image}
										alt={`${user.username}'s profile photo`}
										className="rounded-full"
										width={60}
										height={60}
									/>
								</div>
								<div className="px-1 w-full max-w-full flex flex-row justify-between px-2 text-base">
									<div>
										<span className="text-lg font-semibold">
											<Link
												href={`/profile/${user.username}`}
												className="flex items-baseline gap-1 text-2xl font-semibold cursor-pointer select-none hover:bg-gradient-to-l hover:from-primary-600 hover:to-accent-400 hover:bg-clip-text hover:text-transparent"
											>
												~{user.username}
											</Link>
										</span>
										<span className="text-sm">
											{user.first_name} {user.last_name}{" "}
											<span className="text-xs">
												( {format(parseISO(user.createdAt), "dd MMM yyyy")})
											</span>
										</span>
									</div>
									{user._id === session?.id ? (
										<></>
									) : current?.connections.following.some(
											(f) => f === user._id
									  ) ? (
										<button>unfollow</button>
									) : (
										<button>follow</button>
									)}
								</div>
							</div>
						))}
					</section>
				</div>
				<aside>aside</aside>
			</main>
		</AppLayout>
	);
}
