export function pad(number: number, padding: number = 2, char = "0"): string {
	var str = "" + number;
	if (number === 0) return str;
	if (number < 10) {
		while (str.length < padding) {
			str = char + str;
		}
	}

	return str;
}
