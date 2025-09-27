import axios from "axios";

export const getCsrfToken = async (): Promise<void> => {
	axios
		.get("/sanctum/csrf-cookie", {
			baseURL: "/",
			withCredentials: true,
		})
		.catch((error) => {
			console.error("Error fetching CSRF token:", error);
		});
};
