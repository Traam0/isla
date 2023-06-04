import Image from "next/image";
import { Inter } from "next/font/google";
import sk from "../public/skeleton.svg";
const inter = Inter({ subsets: ["latin"] });
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useSession } from "~/hooks";
import { signIn } from "next-auth/react";

export default function Home() {
	const router = useRouter();
	const { data: session } = useSession();
	return (
		<main
			className={`${inter.className} relative w-screen h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-accent-100 scrollbar-track-primary-500`}
		>
			{/* <div
				className="w-96 h-96 scale-[200%] bg-gradient-to-r from-cyan-300 to-pink-300 absolute -z-10 top-20 left-44"
				style={{
					clipPath:
						"polygon(11% 30%, 60% 19%, 100% 35%, 59% 86%, 65% 65%, 20% 57%, 7% 91%, 64% 45%, 0% 35%, 24% 50%)",
				}}
			/> */}
			<section className="z-10 w-full h-fit bg-transparent text-dark-500 flex flex-col md:flex-row-reverse items-center justify-center px-8 md:px-48 gap-24 md:gap-36 py-16 md:py-28 backdrop-blur-md">
				<Image
					src={sk}
					width={480}
					height={580}
					alt="app sekeleton"
					className="px-16"
				></Image>

				<div className="h-full flex flex-col gap-4 md:gap-12 justify-evenly items-center select-none">
					<h1 className=" text-4xl text-start w-full font-semibold">
						<span className="text-8xl font-bold tracking-wide bg-gradient-to-r to-primary-500 from-accent-500 font-mono text-transparent bg-clip-text ">
							ISLA
						</span>
						: Level up your social experience!
					</h1>
					<p className="tracking-wider  text-xl">
						Unlock new levels and explore the power of influence as you ascend
						through tiered islands on this innovative social media platform.
					</p>
					<div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 md:gap-16">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-9 py-4 w-full text-lg select-none bg-primary-500 rounded-md shadow-md shadow-secondary-400"
							onClick={() => {
								router.push(session ? "/home" : "/auth/login");
							}}
						>
							Get started
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-9 py-4 w-full text-lg select-none bg-secondary-500 rounded-md shadow-md shadow-primary-400"
						>
							Learn more
						</motion.button>
					</div>
				</div>
			</section>
		</main>
	);
}
