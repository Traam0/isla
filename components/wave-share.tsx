import data from "@emoji-mart/data";
import Image from "next/image";
import Picker from "@emoji-mart/react";
import GifPicker from "gif-picker-react";
import { classNames } from "~/utils/classNames";
import { useSession, useToggle } from "~/hooks";
import { useEffect, useRef, useState } from "react";
import {
	IconAlertTriangle,
	IconGif,
	IconMoodSmile,
	IconPhoto,
	IconX,
} from "@tabler/icons-react";
import axios, { AxiosError } from "axios";
import { WavePostRequest, WavePostResponse } from "~/types/waves";
import { convertToBase64 } from "~/utils";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import { Spinner } from "./loaders";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface WaveShareProps {
	className?: string;
}

export function WaveShare({ className }: WaveShareProps): JSX.Element {
	const queryClient = useQueryClient();
	const { data: session } = useSession();
	const emojiPickerRef = useRef<HTMLDivElement>(null);
	const gifPickerRef = useRef<HTMLDivElement>(null);
	const [wavingTide, toggleWavingTide] = useToggle(false);
	const [emojiPickerVisible, toggleEmojiPickerVisibility] = useToggle(false);
	const [gifPickerVisible, toggleGifPickerVisibility] = useToggle(false);
	const [wave, setWave] = useState<string>("");
	const [file, setFile] = useState<{
		image: File | undefined;
		url: string | undefined;
	}>({ image: undefined, url: undefined });

	function handleCloseEmojiPicker(e: MouseEvent) {
		if (
			!emojiPickerRef.current?.contains(e.target as Node) &&
			emojiPickerVisible
		) {
			toggleEmojiPickerVisibility();
		}
	}
	function handleCloseGifPicker(e: MouseEvent) {
		if (!gifPickerRef.current?.contains(e.target as Node) && gifPickerVisible) {
			toggleGifPickerVisibility();
		}
	}
	function handleFileUpload() {
		const input = document.createElement("input");
		input.type = "file";
		input.setAttribute(
			"accept",
			"image/png, image/jpeg, image/jpg, image/webp"
		);
		input.onchange = (e: any) => {
			setFile({
				image: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
			});
		};
		input.click();
	}
	async function waveTide(): Promise<void> {
		toggleWavingTide();
		const data: WavePostRequest = {
			content: wave,
			image: undefined,
		};

		if (file.image) {
			const encoded = await convertToBase64(file.image);
			data.image = encoded;
		}

		if (!wave && (!file.image || !file.url)) return;

		const response = await axios
			.post<WavePostResponse>("/api/wave/uploadMedia", data, {
				withCredentials: true,
			})
			.catch((error: AxiosError<{ message: string }>) => {
				toast.error(error.response?.data.message ?? "oops");
			});

		if (response && response.status === StatusCodes.CREATED) {
			toast.success("tide waved successfully");
			setFile({ image: undefined, url: undefined });
			setWave("");
			// useQuery(["tides"]).refetch();
			queryClient.invalidateQueries(["tides"]);
		}
		toggleWavingTide();
	}

	useEffect(() => {
		window.addEventListener("click", handleCloseEmojiPicker, true);
		window.addEventListener("click", handleCloseGifPicker, true);
		return () => {
			window.removeEventListener("click", handleCloseGifPicker, true);
			window.removeEventListener("click", handleCloseEmojiPicker, true);
		};
	});

	return (
		<section
			role="textbox"
			className={classNames(
				className ? className : "",
				"w-[600px] py-2 bg-background-500 flex flex-row items-start border border-secondary-500 relative"
			)}
		>
			<section className="px-1">
				<img
					src={session?.image}
					alt={`${session?.username}'s profile photo`}
					width={52}
					className="rounded-full"
					height={52}
				/>
			</section>
			<div className="px-1 w-full space-y-5">
				<textarea
					className="resize-none w-full px-2 py-1 h-20 rounded-md  focus:outline focus:outline-primary-400"
					placeholder="Compose your Tide"
					value={wave}
					onChange={({ target }) => setWave(target.value)}
				></textarea>
				{file.url && file.image && (
					<div className="relative">
						<div
							onClick={() => setFile({ image: undefined, url: undefined })}
							className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 bg-dark-500 bg-opacity-60 p-1 rounded-full"
						>
							<IconX className="text-white " />
						</div>
						<Image
							src={file.url}
							alt={file.image.name}
							width={800}
							height={600}
							className="object-contain w-fit max-w-[510px] max-h-[550px] bg-black/10"
						/>
					</div>
				)}
				<div className="flex items-center justify-start gap-3 py-1 px-2">
					<div className="gif relative" ref={gifPickerRef}>
						<IconGif
							stroke={2}
							size={28}
							className="text-accent-500 cursor-pointer"
							onClick={toggleGifPickerVisibility}
						/>
						{gifPickerVisible && (
							<div className="absolute z-10">
								<GifPicker
									tenorApiKey={process.env.NEXT_PUBLIC_TenorApiKey as string}
									onGifClick={(gif) => console.log(JSON.stringify(gif))}
								/>
							</div>
						)}
					</div>

					<div className="emoji relative" ref={emojiPickerRef}>
						<IconMoodSmile
							stroke={2}
							size={28}
							className="text-accent-500 cursor-pointer"
							onClick={toggleEmojiPickerVisibility}
						/>
						{emojiPickerVisible && (
							<div className="absolute z-10">
								<Picker
									data={data}
									onEmojiSelect={(emoji: any) => setWave(wave + emoji.native)}
								/>
							</div>
						)}
					</div>

					<IconPhoto
						stroke={2}
						size={26}
						className="text-accent-500 cursor-pointer"
						onClick={handleFileUpload}
					/>

					<button
						disabled={(!wave && (!file.image || !file.url)) || wavingTide}
						onClick={waveTide}
						className={classNames(
							wave.length < 1 && !file.image
								? "bg-secondary-500/50 text-gray-500 "
								: "bg-primary-500 text-dark-500 ",
							"flex gap-1 items-center justify-center ml-auto rounded-3xl px-4 py-2 font-semibold"
						)}
					>
						Wave
					</button>
				</div>
			</div>
		</section>
	);
}
