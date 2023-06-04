import { shuffle } from "./shuffle";
import { pad } from "./pad";
import { Tide, TidesGetResponse } from "~/types/waves";
import { InfiniteData } from "@tanstack/react-query";
import { copyToClipboard } from "./copyToClipboard";
import { calculateLevel, calculateXp } from "./calculateLevel";
import { inputIsEmpty } from "./inputIsEmpty";

function randomColor(): string {
	return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function extractTideFromCach(
	data: InfiniteData<TidesGetResponse>,
	tideId: string
): Tide | null {
	for (const page of data.pages) {
		for (const tide of page.tides) {
			if (tide._id === tideId) {
				return tide;
			}
		}
	}
	return null; // Tide with the specified ID not found
}

export {
	shuffle,
	randomColor,
	pad,
	extractTideFromCach,
	copyToClipboard,
	calculateLevel,
	calculateXp,
	inputIsEmpty,
};
