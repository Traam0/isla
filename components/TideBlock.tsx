import Image from "next/image";
import { Tide } from "~/types/waves";
import { formatDistance, parseISO } from "date-fns";
import {
	IconBookmark,
	IconDots,
	IconHeart,
	IconHeartBroken,
	IconMessage2,
	IconShare3,
} from "@tabler/icons-react";
import { useMemo, useRef } from "react";
import { useSession, useToggle } from "~/hooks";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { classNames } from "~/utils/classNames";
import { AnimatePresence, motion } from "framer-motion";
import { CommentModal } from "./modals";

export function TideWave({
	_id,
	holder,
	content,
	image,
	createdAt,
	comments,
	votes,
}: Tide): JSX.Element {
	const { data: session } = useSession();

	return (
		<section
			key={_id}
			role="article"
			className="w-[600px] py-2 bg-background-500 flex flex-row items-start border border-secondary-200 hover:bg-slate-200/30 ease-in-out duration-75 cursor-pointer"
		>
			<aside className="px-2">
				<img
					className="bg-background-500 bg-clip-content rounded-full"
					src={holder.image}
					alt={`${holder.username}'s profile photo`}
					width={52}
					height={52}
				/>
			</aside>

			<div className="w-full flex flex-col items-start justify-start gap-2 px-4">
				<div className="flex justify-start items-center gap-3 w-full">
					<Link
						href={`/profile/${holder.username}`}
						className="font-semibold tracking-wide text-lg hover:underline capitalize"
					>
						{holder.username}
					</Link>
					<span className="text-gray-500 text-xs">
						(
						{formatDistance(parseISO(createdAt), Date.now()).replace(
							"month",
							"moon cycle"
						)}{" "}
						ago)
					</span>

					<motion.button
						whileTap={{ scale: 0.95 }}
						className="ml-auto p-0.5 flex items-end h-full"
					>
						<IconDots size={22} />
					</motion.button>
				</div>
				{content && (
					<section role="contentinfo" className="cursor-auto w-full">
						{content}
					</section>
				)}
				{image && (
					<img
						src={image}
						alt=""
						width={400}
						height={510}
						className="max-w-full min-h-[260px]  max-h-[510px] w-auto object-contain rounded-md shadow-md"
					/>
				)}

				<TideInteractionBlock {...{ comments, votes, _id }} />
			</div>
		</section>
	);
}

function TideInteractionBlock({
	_id,
	comments,
	votes,
}: Pick<Tide, "_id" | "comments" | "votes">): JSX.Element {
	const queryClient = useQueryClient();
	const { data: session } = useSession();
	const formatter = useRef(Intl.NumberFormat("en", { notation: "compact" }));
	const [commentsVisible, toggleCommnetsVisibility] = useToggle(false);

	const [upvotes, downvotes, vote] = useMemo(() => {
		const up = votes.filter((vote) => vote.vote === 1);
		const down = votes.filter((vote) => vote.vote === -1);
		const vote = votes.find((vote) => vote.holder === session?.id)?.vote;

		return [up.length, down.length, vote];
	}, [votes.length]);

	async function handleVote(value: 1 | -1 | 0): Promise<void> {
		const response = await axios
			.put<Tide>(
				`/api/tides/${_id}/vote`,
				{ vote: value },
				{
					withCredentials: true,
				}
			)
			.catch((error: AxiosError<{ message: string }>) => {
				toast.error(error.response?.data.message as string);
				console.log(error);
			});

		console.log(response && response.data.votes);
		queryClient.invalidateQueries(["tides"]);
	}

	return (
		<>
			<section
				role="group"
				className="flex items-center justify-start gap-10 px-8 w-full "
			>
				<button
					className="comments-btn flex gap-2 text-base items-center group"
					onClick={toggleCommnetsVisibility}
				>
					<IconMessage2
						stroke={1.5}
						size={26}
						className="cursor-pointer group-hover:text-green-600 group-hover:bg-green-300/40 p-1 rounded-full box-content"
					/>
					{comments.length >= 0 && (
						<Link
							href={`/tide/${_id}`}
							onClick={(e) => e.stopPropagation()}
							className="group-hover:text-green-600 hover:underline leading-9"
						>
							{/* {formatter.current.format(2659)} */}
							{formatter.current.format(comments.length)}
						</Link>
					)}
				</button>

				<button
					className="upvotes-btn flex gap-2 text-base items-center group"
					onClick={() => {
						handleVote(vote === 1 ? 0 : 1);
					}}
				>
					<IconHeart
						stroke={1.5}
						size={26}
						className={classNames(
							"cursor-pointer group-hover:text-pink-500 group-hover:bg-pink-300/40 p-1.5 rounded-full box-content",
							vote === 1 ? "fill-pink-500 text-pink-500" : ""
						)}
					/>
					{upvotes > 0 ? (
						<span
							className={classNames(
								"group-hover:text-pink-600",
								vote === 1 ? " text-pink-500" : ""
							)}
						>
							{formatter.current.format(upvotes)}
						</span>
					) : (
						<></>
					)}
				</button>

				<button
					className="downvotes-btn flex gap-2 text-base items-center group"
					onClick={() => {
						handleVote(vote === -1 ? 0 : -1);
					}}
				>
					<IconHeartBroken
						stroke={1.5}
						size={26}
						className={classNames(
							"cursor-pointer group-hover:text-red-600 group-hover:bg-red-300/40 p-1.5 rounded-full box-content",
							vote === -1 ? "fill-red-400 text-red-600" : ""
						)}
					/>
					{downvotes > 0 ? (
						<span
							className={classNames(
								"group-hover:text-red-600",
								vote === -1 ? " text-red-500" : ""
							)}
						>
							{formatter.current.format(downvotes)}
						</span>
					) : (
						<></>
					)}
				</button>

				<button>
					<IconBookmark
						stroke={1.5}
						size={26}
						className="cursor-pointer hover:text-accent-500 hover:bg-accent-300/40 p-1.5 rounded-full box-content"
					/>
				</button>

				<button>
					<IconShare3
						stroke={1.5}
						size={26}
						className="cursor-pointer hover:text-blue-600 hover:bg-blue-300/40 p-1.5 rounded-full box-content"
					/>
				</button>
			</section>
			<AnimatePresence initial={false} mode="wait">
				{commentsVisible && (
					<CommentModal _tid={_id} onClick={toggleCommnetsVisibility} />
				)}
			</AnimatePresence>
		</>
	);
}
