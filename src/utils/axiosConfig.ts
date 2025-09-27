import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Create an Axios instance with a base URL
const apiClient = axios.create({
	baseURL: "/api",
	withCredentials: true, // This is crucial for sending cookies
	headers: {
		Accept: "application/json",
	},
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			const { status, data } = error.response;
			if (status === 401) {
				// When using httpOnly cookies, the client can't delete them.
				// A 401 response means the session is invalid. The user should be
				// considered logged out. Your app should clear its user state.
				throw {
					type: "unauthorized",
					errors: data.errors,
					message: data.message,
				};
				//window.location.href = '/login';
			} else if (status === 403) {
				// Forbidden
				throw {
					type: "forbidden",
					message: data.message,
					errors: data.errors,
				};
			} else if (status === 422) {
				// Validation Errors
				throw {
					type: "validation",
					errors: data.errors,
					message: data.message,
				};
			} else if (status >= 500) {
				// General server error (5xx errors)
				throw {
					type: "server",
					message:
						data.message ||
						"A general server error occurred. Please try again later.",
				};
			} else {
				// Other client errors (4xx like 403, 404, etc.)
				throw {
					type: "general",
					message: data.message || "An unexpected error occurred.",
				};
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;
