function getTierName(level: number): string {
	const tiers = [
		"Shadowspire Island",
		"Dragonspire Island",
		"Thunderpeak Isle",
		"Stormwind Isle",
		"Emberholme",
		"Eldoria",
		"Serpentara",
		"Dragonfall Isle",
		"Eldergrove",
		"Arcanis Isle",
	];

	if (level <= 5) {
		return tiers[0];
	}
	if (level <= 10) {
		return tiers[1];
	}
	if (level <= 20) {
		return tiers[2];
	}
	if (level <= 35) {
		return tiers[3];
	}
	if (level <= 60) {
		return tiers[4];
	}
	if (level <= 100) {
		return tiers[5];
	}
	if (level <= 280) {
		return tiers[6];
	}
	if (level <= 400) {
		return tiers[7];
	}
	if (level <= 627) {
		return tiers[8];
	}
	return tiers[9] ?? tiers[8];
}
