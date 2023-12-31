import Head from "next/head";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DesktopNavigation } from "~/components/navigation";
import { ToastContainer as Toaster } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { User } from "~/types/users";
import axios from "axios";

interface AppLayoutProps {
	children: JSX.Element | React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps): JSX.Element {
	useQuery(
		["me", "current"],
		async function (): Promise<User> {
			const { data: res } = await axios.get<User>("/api/users/me", {
				withCredentials: true,
			});

			return res;
		},
		{ staleTime: 1000 * 60 }
	);

	return (
		<>
			<>
				<Head>
					<title>ISLA</title>
					<meta name="description" content="Generated by create next app" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main className="bg-slate-50 h-screen  overflow-hidden flex ">
					<DesktopNavigation />

					{/* <div className="overflow-y-scroll w-full h-screen	 scrollbar-thin scrollbar-thumb-accent-200 scrollbar-track-primary-500"> */}
					{children}
					{/* </div> */}
					<Toaster autoClose={1500} />
				</main>
				<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
			</>
		</>
	);
}
