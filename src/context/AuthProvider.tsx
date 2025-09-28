import React, { useContext, useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { type UserInfo } from "../types";
import {
	// onAuthStateChanged,
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	type User,
	signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import apiClient from "../utils/axiosConfig";
import { getCsrfToken } from "../utils/apit";
import AuthLoader from "../components/authLoader";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<UserInfo | null>(null);
	// const [token, setToken] = useState<string | null>(
	// 	localStorage.getItem("token")
	// );
	const [authLoading, setAuthLoading] = useState<boolean>(true); // To manage initial loading state
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<
		string,
		string[]
	> | null>(null); // To hold validation errors
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	const [isToVerifyEmail, setIsToVerifyEmail] = useState<boolean>(false);
	const [socialAuthUser, setSocialAuthUser] = useState<User | null>(null);
	const [socialAuthLoading, setSocialAuthLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<string>("");

	const fetchUser = async () => {
		if (!user) {
			try {
				const response = await apiClient.get("/user"); // Protected route to get user details
				setUser(response.data.data);
				setIsAuthenticated(true);
			} catch (error) {
				console.log(error);
				setUser(null);
				setIsAuthenticated(false);

				if (socialAuthUser) {
					await signOut(auth);
					setSocialAuthUser(null);
					setSocialAuthLoading(false);
				}
			} finally {
				setAuthLoading(false);
			}
		} else {
			setAuthLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const processErrors = async (error: any, errorMessage?: string) => {
		if (error.type === "validation") {
			setFieldErrors(error.errors);
			setError(error.message || errorMessage); // Often 'The given data was invalid.'
		} else if (
			error.type === "server" ||
			error.type === "general" ||
			error.type === "network" ||
			error.type === "client"
		) {
			setError(error.message || errorMessage);
		} else {
			// Fallback for any other unexpected error type
			setError("An unknown error occurred.");
		}
	};

	// --- Authentication Actions ---
	const socialSignin = async (socialType: "google" | "facebook") => {
		const provider =
			socialType === "google"
				? new GoogleAuthProvider()
				: new FacebookAuthProvider();

		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			await getCsrfToken();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			setSocialAuthUser(user);
			setSocialAuthLoading(false);

			const idToken = await user.getIdToken();
			const response = await apiClient.post("/social-login", {
				provider: socialType,
				idToken: idToken,
				// uid: user.uid,
				// email: user.email,
				// name: user.displayName,
				// photo_url: user.photoURL,
			});

			setUser(response.data.user);
			setIsAuthenticated(true);
			setSuccess("Social Sign in successful! Redirecting...");
		} catch (error: any) {
			console.error("Social Sign in failed:", error);
			processErrors(error, "Social Sign in failed");

			//user is blocked or unauthorsized..
			if (error.type == "unathorized" || "forbidden") {
				await signOut(auth);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (email: string, password: string): Promise<void> => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		setFieldErrors({});

		try {
			await getCsrfToken();
			const response = await apiClient.post("/login", { email, password });
			setUser(response.data.user);
			setIsAuthenticated(true);
			setSuccess("Login succesfull. Redirecting...");
		} catch (err: any) {
			processErrors(err, "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (
		fullname: string,
		email: string,
		password: string,
		password_confirmation: string
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		setFieldErrors({});
		try {
			const response = await apiClient.post("/register", {
				fullname,
				email,
				password,
				password_confirmation,
			});
			setSuccess(response.data.message || "Registration successful!");
			setError(null);
			setFieldErrors({});
			return true;
		} catch (error: any) {
			processErrors(error, "Registration failed");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const verifyEmail = async (
		email: string,
		token: string
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			const response = await apiClient.post("/email/verify", {
				email,
				token,
			});
			console.log(response.data.message);
			setSuccess(response.data.message || "Email verification successful!");
			setIsToVerifyEmail(false);
			return true;
		} catch (error: any) {
			console.log(error);
			processErrors(error, "Email verification failed");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async (): Promise<void> => {
		setIsLoading(true);
		try {
			await apiClient.post("/logout");
			if (socialAuthUser) {
				await signOut(auth);
			}
		} catch (error) {
			console.error("Logout failed on server:", error);
		} finally {
			setUser(null);
			setSocialAuthUser(null);
			setIsAuthenticated(false);
			setSuccess(null);
			setError(null);
			setFieldErrors({});
			setIsLoading(false);
		}
	};

	//--- Verify Email Actions ---
	const sendVerificationEmail = async (): Promise<void> => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			// Make a POST request to the Laravel endpoint to resend the email
			const response = await apiClient.post(
				"/email/verification-notification"
			);
			setSuccess(response.data.message || "Verification link sent!"); // Should be something like "Verification link sent!"
		} catch (error) {
			setError("Failed to resend the verification link.");
		} finally {
			setIsLoading(false);
		}
	};

	// --- Password Reset Actions ---
	const forgotPassword = async (email: string): Promise<void> => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			const response = await apiClient.post("/forgot-password", {
				email: email,
			});
			setSuccess(
				response.data.message ||
					"Password reset link sent! Check your email."
			);
		} catch (err: any) {
			processErrors(err, "Failed to send password reset link");
		} finally {
			setIsLoading(false);
		}
	};

	const resetPassword = async (
		email: string,
		token: string,
		password: string,
		password_confirmation: string
	): Promise<void> => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			const response = await apiClient.post("/reset-password", {
				email: email,
				token: token,
				password: password,
				password_confirmation: password_confirmation,
			});
			setSuccess(
				response.data.message || "Password has been reset successfully!"
			);
		} catch (err: any) {
			processErrors(err, "Failed to reset password");
		} finally {
			setIsLoading(false);
		}
	};

	const updateProfile = async (
		email: string,
		fullname: string,
		timezone: string
	): Promise<void> => {
		//..
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		setFieldErrors({});
		try {
			const response = await apiClient.put("/user/profile", {
				email,
				fullname,
				timezone,
			});
			const isEmailNew = response.data.is_email_new;
			if (isEmailNew) {
				localStorage.removeItem("token");
				setIsToVerifyEmail(true);
				setUser(null);
				setIsAuthenticated(false);
				setSuccess(
					response.data.message ||
						"Email has been updated. Please verify your new email."
				);
			}
			setUser(response.data.user);
			setSuccess(response.data.message || "Profile data has been updated.");
		} catch (err: any) {
			processErrors(err, "Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	const updatePassword = async (
		current_password: string,
		password: string,
		password_confirmation: string
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		setFieldErrors({});
		try {
			const response = await apiClient.put("/user/password", {
				current_password,
				password,
				password_confirmation,
			});
			setSuccess(response.data.message || "Password updated successfully!");
			return true;
		} catch (err: any) {
			processErrors(err, "Failed to update password");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteAccount = async (): Promise<void> => {
		setIsLoading(true); // Indicate loading for this action
		setError(null);
		setSuccess(null);
		setFieldErrors({});
		try {
			await apiClient.delete("/user");
			// localStorage.removeItem("token"); // Clear token from storage
			// setToken(null);
			setUser(null);
			setIsAuthenticated(false);
		} catch (err: any) {
			processErrors(err, "Failed to delete account");
		} finally {
			setIsLoading(false);
		}
	};

	// Check if user has a specific role
	const hasRole = (role: string): boolean => {
		if (!user) return false;
		if (user.roles.length == 0) return false;
		return user.roles.includes(role);
	};

	// Check if user has a specific permission
	const can = (permission: string): boolean => {
		return user?.permissions?.includes(permission) || false;
	};

	const clearMessages = () => {
		setError(null);
		setSuccess(null);
		setFieldErrors(null);
	};

	const updateCurrentPage = (page: string) => {
		setCurrentPage(page);
	};

	//update user
	const updateUser = (updatedUser: UserInfo) => {
		setUser(updatedUser);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				error,
				fieldErrors,
				success,
				// token,
				isAuthenticated,
				isToVerifyEmail,
				socialAuthUser,
				socialAuthLoading,
				isLoading,
				authLoading,
				currentPage,
				updateCurrentPage,
				clearMessages,
				verifyEmail,
				sendVerificationEmail,
				login,
				register,
				logout,
				forgotPassword,
				resetPassword,
				updateProfile,
				updatePassword,
				deleteAccount,
				updateUser,
				hasRole,
				can,
				socialSignin,
			}}
		>
			{authLoading ? <AuthLoader /> : children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
