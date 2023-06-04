/** @format */

import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "~/types";

export function useSession() {
	return useQuery(["session"], getSession, {
		staleTime: Infinity,
		refetchOnWindowFocus: true,
	});
}

async function getSession(): Promise<Session | null> {
	const response = await axios
		.get<Session>("/api/auth/session", {
			withCredentials: true,
		})
		.catch((error: AxiosError) => null);
	if (response) return response.data;
	return response;
}
