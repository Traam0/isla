import axios, { Axios, AxiosError } from "axios";
import { TideWave, WaveShare } from "~/components";
import { AppLayout } from "~/layouts";
import { useSession, useToggle } from "~/hooks";
import { useRouter } from "next/router";
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { Tide, TidesGetResponse } from "~/types/waves";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { CompassLoader, TideWaveLoader } from "~/components/loaders";
import { useInView } from "react-intersection-observer";
import { classNames } from "~/utils/classNames";
import { leaderboardResponseValidator } from "~/types/users";
import {
	calculateLevel,
	calculateXp,
	copyToClipboard,
	inputIsEmpty,
} from "~/utils/helpers";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToLocalHistory, removeFromLocalHistory } from "~/reducers/appSlice";
import type { LeaderboardResponse, User } from "~/types/users";
import type { AppDispatch, RootState } from "~/store/store";
import { IconX } from "@tabler/icons-react";

export default function Home(): JSX.Element {
	const router = useRouter();
	const { data: session, ...sessionRest } = useSession();
	const tidesObserver = useInView();

	if (!sessionRest.isFetching && !sessionRest.isLoading) {
		if (!session?.id) {
			router.replace("/auth/login");
		}
	}

	const {
		data,
		isSuccess,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery(
		["tides"],
		async ({ pageParam = 1 }) => {
			const { data: tides, status } = await axios.get<TidesGetResponse>(
				`/api/tides?page=${pageParam}`,
				{
					withCredentials: true,
				}
			);

			return tides;
		},
		{
			getPreviousPageParam: (firstPage) =>
				firstPage.hasPreviousPage ? Math.max(firstPage.page - 1, 1) : undefined,
			getNextPageParam: (lastPage) =>
				lastPage.hasNextPage ? lastPage.page + 1 : undefined,
			staleTime: 1000 * 25,
			cacheTime: 1000 * 60 * 10,
			refetchOnWindowFocus: true,
			refetchInterval: 1000 * 30,
		}
	);

	useEffect(() => {
		if (tidesObserver.inView && hasNextPage) {
			// console.log(data, isSuccess, hasNextPage, isFetchingNextPage, isLoading);
			console.log("fetching");
			fetchNextPage();
		}
	}, [tidesObserver.inView]);

	return (
		<AppLayout>
			<section className="flex h-screen  overflow-y-scroll w-full relative ">
				<div className=" h-fit w-fit relative pt-10">
					<WaveShare className="sticky top-0 mt-2 pt-6" />
					<section role="feed" className="flex flex-col gap-2 h-full">
						{isLoading && (
							<>
								<TideWaveLoader />
								<TideWaveLoader />
								<TideWaveLoader />
								<TideWaveLoader />
							</>
						)}
						{isSuccess &&
							(!isLoading || !isFetchingNextPage) &&
							data?.pages.map((page) => (
								<Fragment key={uuid()}>
									{page?.tides.map((tide: Tide) => (
										<TideWave key={tide._id} {...tide} />
									))}
								</Fragment>
							))}
						{isFetchingNextPage ? (
							<div className="w-full h-fit flex justify-center">
								<CompassLoader />
							</div>
						) : (
							!hasNextPage && (
								<div className="py-2.5 text-center">Nothing To Show</div>
							)
						)}
						<div id="Tides@observer" ref={tidesObserver.ref}></div>
					</section>
				</div>
				<SideMenu />
			</section>
		</AppLayout>
	);
}

function SideMenu(): JSX.Element {
	const dispatch = useDispatch<AppDispatch>();
	const history = useSelector((state: RootState) => state.localHistory);
	const [value, setValue] = useState<string>("");
	const router = useRouter();

	const { data: leaderboard, ...leaderboardResr } = useQuery(
		["users", "leaderboard"],
		async function () {
			const { data: res } = await axios.get<LeaderboardResponse>(
				"/api/users/leaderboard",
				{
					withCredentials: true,
				}
			);

			return leaderboardResponseValidator.safeParse(res).success
				? res.leaderboard
				: [];
		}
	);

	function handleSearch(e: FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		if (inputIsEmpty(value)) return router.reload();
		router.push(`/search?search=${value}`);
		dispatch(addToLocalHistory({ id: uuid(), value }));
		return setValue("");
	}

	return (
		<div className="sticky top-0 h-screen scrollbar-none w-full px-6 overflow-y-scroll flex flex-col gap-3 pb-6">
			<ProfileStatsCard className="pt-3" />
			<div className=" px-3 py-2.5 bg-gradient-to-br from-secondary-400 to-background-500 drop-shadow-md rounded-lg">
				<header className="font-bold text-2xl text-dark-400">
					LeaderBoard.
				</header>

				<section
					role="table"
					className="w-full relative overflow-x-auto rounded-t-lg sm:shadow-md max-h-[300px]"
				>
					<table className="w-full text-sm text-left text-dark-500 h-full">
						<thead className="text-xs text-dark-700 uppercase bg-background-500 h-full">
							<tr>
								<th scope="col" className="px-6 py-3">
									TOP
								</th>
								<th scope="col" className="px-6 py-3">
									username
								</th>
								<th scope="col" className="px-6 py-3">
									xp
								</th>
							</tr>
						</thead>
						<tbody className="h-full overflow-y-scroll">
							{leaderboard ? (
								leaderboard?.map((ranker, index) => (
									<tr
										key={index}
										className="bg-transparent even:bg-secondary-500 border-b"
									>
										<th
											scope="row"
											className="px-6 py-2 font-semibold text-gray-900 whitespace-nowrap"
										>
											{index + 1}
										</th>
										<td className="px-6 py-2">{ranker.username}</td>
										<td className="px-6 py-2">{ranker.xp.toLocaleString()}</td>
									</tr>
								))
							) : (
								<></>
							)}
						</tbody>
					</table>
				</section>
			</div>
			<form className="sticky z-50 top-0" onSubmit={handleSearch}>
				<input
					onChange={(e) => setValue(e.target.value)}
					type="text"
					{...{ value }}
					placeholder="LookUp"
					className="w-full  px-5 py-4 outline-none rounded-b-lg bg-gradient-to-r from-primary-400 to-secondary-500 "
				/>
			</form>
			<div className="min-h-[300px] bg-background-500	 drop-shadow-lg rounded-lg px-3 py-2.5">
				<header className="font-bold text-2xl text-dark-400 pb-4">
					Recently Searched.
				</header>

				<section role="list" className="flex flex-col gap-1">
					{history.length > 0 &&
						history
							.slice()
							.reverse()
							.map((one) => (
								<div
									role="listitem"
									key={one.id}
									className="bg-secondary-500 flex justify-between items-center rounded-md text-lg px-5 py-2 select-none"
								>
									{one.value}
									<IconX
										size={24}
										stroke={2}
										className="text-accent-500 cursor-pointer "
										onClick={() => dispatch(removeFromLocalHistory(one))}
									/>
								</div>
							))}
				</section>
			</div>
		</div>
	);
}

interface ProfileStatsCardProps {
	className?: string;
}

function ProfileStatsCard({ className }: ProfileStatsCardProps): JSX.Element {
	const formatter = useRef(Intl.NumberFormat("en", { notation: "compact" }));

	const me = useQueryClient().getQueryData<User>(["me", "current"]);

	const [copyAllowed, toggleCopyAllowed] = useToggle(true);

	return me ? (
		<section
			role="contentinfo"
			className={classNames(
				className ? className : "",
				"flex items-start gap-4 w-full shadow-md p-2 rounded-xl py-3"
			)}
		>
			<div className="relative">
				<img
					src={me?.image}
					alt={`${me?.username}`}
					width={90}
					height={90}
					className="rounded-lg"
				/>
				<div className="block font-mono absolute left-1/2 -translate-x-1/2 bottom-0  shadow-lg drop-shadow-xl  shadow-primary-500 select-none  translate-y-1/2 bg-background-500 text-xs flex items-center justify-center text-accent-500 p-0.5 px-1.5 h-fit rounded-full">
					{calculateLevel(me.xp)}
				</div>
			</div>
			<div className="w-full flex flex-col items-start justify-start gap-0.5">
				<motion.h2
					whileHover={{
						scale: 1.1,
					}}
					onClick={() => {
						if (copyAllowed) {
							toggleCopyAllowed();
							copyToClipboard(me.username);
						}
						setTimeout(() => {
							toggleCopyAllowed();
						}, 1000);
					}}
					className="flex items-baseline gap-1 text-2xl font-semibold cursor-pointer select-none hover:bg-gradient-to-l hover:from-primary-600 hover:to-accent-400 hover:bg-clip-text hover:text-transparent"
				>
					~{me.username}.
				</motion.h2>
				<div className="select-none group text-lg">
					<span className="group-hover:text-accent-400 hover:underline font-medium font-mono cursor-pointer">
						{me.connections.followers.length}
					</span>{" "}
					follower ,{" "}
					<span className="group-hover:text-accent-400 hover:underline font-medium font-mono cursor-pointer">
						{me.connections.following.length}
					</span>{" "}
					following
				</div>
				<section role="progressbar" className="w-full flex items-center gap-2">
					<div className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-md select-none">
						<div
							className="bg-accent-500 text-xs font-medium text-blue-100 text-center font-medium leading-none rounded-full"
							style={{
								width: `${
									(me.xp * 100) / calculateXp(calculateLevel(me.xp) + 1)
								}%`,
								padding:
									(me.xp * 100) / calculateXp(calculateLevel(me.xp) + 1) <= 0
										? "2px 0px"
										: "2px",
							}}
						>
							{Number(
								(me.xp * 100) / calculateXp(calculateLevel(me.xp) + 1)
							).toFixed(2)}
							%
						</div>
					</div>
					<span className="text-lg font-mono font-medium">
						{calculateLevel(me.xp) + 1}
					</span>
				</section>
			</div>
		</section>
	) : (
		<></>
	);
}
