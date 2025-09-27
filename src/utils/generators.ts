/**
 * Generates a random alphanumeric string of a specified length.
 * @param {number} length - The desired length of the string.
 * @returns {string} The randomly generated string.
 */
export const generateRandomString = (length: number) => {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const generateUniqueId = (length: number = 10): string => {
	// Generate a random string using base-36 (0-9, a-z)
	// `toString(36)` converts the number to a base-36 string.
	// `substring(2)` removes the "0." at the beginning.
	const randomString = Math.random()
		.toString(36)
		.substring(2, 2 + length);

	// Get the current timestamp in milliseconds
	const timestamp = Date.now().toString(36);

	// Combine the random string and timestamp
	return `${randomString}${timestamp}`;
};

/**
 * Pads a number with leading zeros to a specific length.
 *
 * @param num The number to pad.
 * @param length The total length the resulting string should have.
 * @returns The padded string.
 */
export const padNumber = (num: number, length: number): string => {
	// Convert the number to a string
	const numString = String(num);

	// Use String.prototype.padStart() for padding
	return numString.padStart(length, "0");
};

export default padNumber;

export const getStockColorClass = (remainingStock: number) => {
	if (remainingStock < 5) {
		return "text-red-500";
	} else if (remainingStock < 10) {
		return "text-yellow-500";
	} else {
		return "text-green-500";
	}
};
