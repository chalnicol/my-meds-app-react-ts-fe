/**
 * Formats a time string to 12-hour (H:MM AM/PM), accepting both 24-hour and 12-hour inputs,
 * and pads both single-digit hours and minutes with a leading zero.
 * @param {string} timeString - The time string to format (e.g., "14:30", "9:5 AM").
 * @returns {string} The formatted 12-hour time string (e.g., "02:30 PM", "09:05 AM").
 */
export const formatTime = (timeString: string): string => {
	if (!timeString || typeof timeString !== "string") {
		return "Invalid Time";
	}

	const trimmedTime = timeString.trim();

	// Regex to match and capture parts of a 24-hour time string
	const is24HourMatch = trimmedTime.match(
		/^(?:2[0-3]|[01]?[0-9]):[0-5]?[0-9]$/
	);

	if (is24HourMatch) {
		const [hours, minutes] = trimmedTime.split(":").map(Number);

		const period = hours >= 12 ? "PM" : "AM";
		const formattedHours = String(hours % 12 || 12).padStart(2, "0");
		const formattedMinutes = String(minutes).padStart(2, "0");

		return `${formattedHours}:${formattedMinutes} ${period}`;
	}

	// Regex to match and capture parts of a 12-hour time string
	const is12HourMatch = trimmedTime.match(
		/^(0?[1-9]|1[0-2]):([0-5]?[0-9]) ?(am|pm)$/i
	);

	if (is12HourMatch) {
		const hours = Number(is12HourMatch[1]);
		const minutes = is12HourMatch[2];
		const period = is12HourMatch[3].toUpperCase();

		if (isNaN(hours)) {
			return "Invalid Time";
		}

		const formattedHours = String(hours).padStart(2, "0");
		const formattedMinutes = String(minutes).padStart(2, "0");

		return `${formattedHours}:${formattedMinutes} ${period}`;
	}

	return "Invalid Time";
};

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return date.toLocaleDateString("en-US", options);
};

export const capitalizeFirstLetter = (str: string): string => {
	if (str.length === 0) {
		return "";
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeWords = (str: string): string => {
	if (str.length === 0) {
		return "";
	}

	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			// Return an empty string if the word is empty
			if (word.length === 0) {
				return "";
			}
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
};

/**
 * Formats a number as a locale-specific currency string.
 * @param price The number to format.
 * @param locale The BCP 47 language tag (e.g., 'en-US', 'de-DE'). Defaults to 'en-US'.
 * @param currency The currency code (e.g., 'USD', 'EUR', 'PHP'). Defaults to 'USD'.
 * @returns The formatted price string (e.g., "€100.00"), or an empty string if the input is invalid.
 */
export const formatPrice = (
	price: number | null | undefined,
	locale: string = "en-US",
	currency: string = "USD"
): string => {
	if (price === null || price === undefined || isNaN(price)) {
		return "";
	}
	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	} catch (error) {
		console.error(`Failed to format price: ${error}`);
		return "";
	}
};
