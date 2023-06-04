import type { Session } from "./session";
import type { User } from "./users";
import type { Tide } from "./waves";

interface SearchResponse {
	users: User[];
	tides: Tide[];
	matcher: string;
}

export type { Session. SearchResponse };
