/**
 * Checks if a string is a valid time in either 24-hour (HH:MM) or 12-hour (H:MM AM/PM) format.
 * @param timeString The string to validate (e.g., "09:30", "23:59", "9:30 AM", "11:59 PM").
 * @returns {boolean} True if the time is valid, otherwise false.
 */
export const isValidTime = (timeString: string): boolean => {
	if (!timeString || typeof timeString !== "string") {
		return false;
	}

	// Regex for 24-hour format (HH:MM)
	// Ensures hours are 00-23 and minutes are 00-59
	const is24HourValid = /^(?:2[0-3]|[01]?[0-9]):[0-5]?[0-9]$/.test(timeString);
	if (is24HourValid) {
		return true;
	}

	// Regex for 12-hour format (H:MM AM/PM)
	// Ensures hours are 1-12 and minutes are 00-59
	const is12HourValid = /^(0?[1-9]|1[0-2]):[0-5][0-9] ?(am|pm)$/i.test(
		timeString
	);
	if (is12HourValid) {
		return true;
	}

	return false;
};

/**
 * Checks if a string contains only alphanumeric characters.
 * @param str The string to check.
 * @returns True if the string is alphanumeric, false otherwise.
 */
export const isAlphanumericOnly = (str: string): boolean => {
	const regex = /^[a-zA-Z0-9]+$/;
	return regex.test(str);
};

/**
 * Checks if a string contains only alphabetic characters.
 * @param str The string to check.
 * @returns True if the string is alphabetic, false otherwise.
 */
export const isAlphabeticOnly = (str: string): boolean => {
	const regex = /^[a-zA-Z]+$/;
	return regex.test(str);
};

/**
 * Checks if a string contains only numeric characters.
 * @param str The string to check.
 * @returns True if the string is numeric, false otherwise.
 */
export const isNumericOnly = (str: string): boolean => {
	const regex = /^\d+$/;
	return regex.test(str);
};

export const isFloat = (str: string): boolean => {
	// A regular expression that matches:
	// ^: Start of the string
	// -?: An optional minus sign (for negative numbers)
	// \d+: One or more digits
	// (\.\d+)?: An optional group containing a decimal point and one or more digits
	// $: End of the string
	const regex = /^-?\d+(\.\d+)?$/;
	return regex.test(str);
};
