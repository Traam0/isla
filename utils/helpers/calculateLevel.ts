export function calculateLevel(
	xp: number,
	xpWeight = 0.08,
	gapWeight = 1.8
): number {
	// xpWeight being the weight that affects the xp required per level
	// lower values => more xp required per level

	// gapWeight being the weight that affects how quickly the required xp per level should increase
	// higher values => bigger gaps between levels

	return Math.floor(xpWeight * Math.pow(xp + 1, 1 / gapWeight));
}

export function calculateXp(
	level: number,
	xpWeight = 0.08,
	gapWeight = 1.8
): number {
	return Math.floor(Math.pow(level / xpWeight, gapWeight));
}
