import { IconDots, IconX } from "@tabler/icons-react";
import ModalBackDrop from "./backdrops";
import { Variant, Variants, motion } from "framer-motion";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Tide, TidesGetResponse } from "~/types/waves";
import { extractTideFromCach } from "~/utils/helpers";
import { infer } from "zod";
import Link from "next/link";
import { formatDistance, parseISO } from "date-fns";
import React, { useEffect, useRef } from "react";
import { isNotEmpty } from "@mantine/form";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface CommentModalProps {
	onClick: () => void;
	_tid: string;
}

const animation = {
	outin: {
		y: "-100vh",
		opacity: 0,
	},
	in: {
		y: "0",
		opacity: 1,
	},
	inout: {
		y: "100vh",
		opacity: 0,
	},
};

export function CommentModal({ onClick, _tid }: CommentModalProps) {
	const queryClient = useQueryClient();
	const commentRef = useRef<HTMLInputElement>(null);

	const tides = queryClient.getQueryData<InfiniteData<TidesGetResponse>>([
		"tides",
	]);

	const tide = extractTideFromCach(tides as any, _tid) as Tide;

	async function handlCommentTide(): Promise<void> {
		if (commentRef.current && isNotEmpty(commentRef.current.value)) {
			await axios
				.post(
					`/api/tides/${tide._id}/comment`,
					{
						comment: commentRef.current.value,
					},
					{ withCredentials: true }
				)
				.catch((error: AxiosError<{ message: string }>) => {
					toast.error(error.response?.data.message);
					console.log(error.response?.data.message);
				});
			queryClient.invalidateQueries(["tides"]);
			commentRef.current.value = "";
		}
	}

	useEffect(() => {
		commentRef.current?.focus();
	}, []);

	return (
		<ModalBackDrop {...{ onClick }}>
			<motion.section
				role="modal"
				onClick={(e) => e.stopPropagation()}
				variants={animation}
				initial="outin"
				animate="in"
				exit="inout"
				style={{
					width: "clamp(40%, 500px, 90%)",
				}}
				className="bg-background-500 m-auto px-8 rounded-xl flex flex-col items-center h-fit min-h-[250px] max-h-[90%]"
			>
				<header className="text-xl font-medium py-1 capitalize tracking-wider relative w-full text-center border-b border-b-dark-200">
					{tide.holder.username}'s Tide
					{/* <IconX
						{...{ onClick }}
						size={32}
						className="absolute top-1/2 right-0 -translate-y-1/2 p-2 bg-secondary-500 bg-opacity-60 rounded-full"
					/> */}
				</header>

				<section
					key={tide._id}
					role="article"
					className="w-full py-2 bg-background-500 flex flex-row items-start border border-secondary-200 hover:bg-slate-200/30 ease-in-out duration-75 cursor-pointer h-fit overflow-y-scroll"
				>
					<aside className="px-2">
						<img
							className="bg-background-500 bg-clip-content rounded-full"
							src={tide.holder.image}
							alt={`${tide.holder.username}'s profile photo`}
							width={52}
							height={52}
						/>
					</aside>

					<div className="w-full flex flex-col items-start justify-start gap-2 px-4">
						<div className="flex justify-start items-center gap-3 w-full">
							<Link
								href={`/profile/${tide.holder.username}`}
								className="font-semibold tracking-wide text-lg hover:underline capitalize"
							>
								{tide.holder.username}
							</Link>
							<span className="text-gray-500 text-xs">
								({formatDistance(parseISO(tide.createdAt), Date.now())} ago)
							</span>
						</div>

						{tide.content && (
							<section role="contentinfo" className="cursor-auto w-full">
								{tide.content}
							</section>
						)}
						{tide.image && (
							<img
								src={tide.image}
								alt=""
								width={400}
								height={510}
								className="max-w-full min-h-[260px]  max-h-[510px] w-auto object-contain rounded-md shadow-md"
							/>
						)}
					</div>
				</section>

				<div className="pt-2 pb-3 w-full flex items-center gap-4 mt-auto">
					<input
						type="text"
						ref={commentRef}
						placeholder="Comment ..."
						className="w-full py-2 px-3 rounded-lg outline outline-accent-300 outline-2 focus-within:outline-offset-4 focus:bg-secondary-400 "
					/>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handlCommentTide}
						className="px-5 py-2 bg-primary-500 rounded-md shadow-sm uppercase"
					>
						submit
					</motion.button>
				</div>
			</motion.section>
		</ModalBackDrop>
	);
}