// src/context/AuthContext.tsx
import { createContext } from "react";
import type { UserInfo } from "../types";
import type { User } from "firebase/auth";

// Define the shape of your context
export interface AuthContextType {
	user: UserInfo | null;
	authLoading: boolean;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;
	success: string | null;
	fieldErrors: Record<string, string[]> | null;
	isToVerifyEmail: boolean;
	socialAuthUser: User | null;
	socialAuthLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (
		fullName: string,
		email: string,
		password: string,
		password_confirmation: string
	) => Promise<boolean>;
	socialSignin: (provider: "google" | "facebook") => Promise<void>;
	verifyEmail: (email: string, token: string) => Promise<boolean>;
	sendVerificationEmail: () => Promise<void>;
	forgotPassword: (email: string) => Promise<void>;
	resetPassword: (
		email: string,
		token: string,
		password: string,
		password_confirmation: string
	) => Promise<void>;
	updateProfile: (
		email: string,
		fullname: string,
		timezone: string
	) => Promise<void>;
	updatePassword: (
		currentPassword: string,
		newPassword: string,
		newPasswordConfirmation: string
	) => Promise<boolean>;
	deleteAccount: () => Promise<void>;
	updateUser: (updatedUser: UserInfo) => void;
	hasRole: (role: string) => boolean;
	can: (permission: string) => boolean;
	logout: () => Promise<void>;
	clearMessages: () => void;
	currentPage: string;
	updateCurrentPage: (page: string) => void;
	// resendVerificationEmail: (email: string) => Promise<void>;
	// requestPasswordReset: (email: string) => Promise<void>;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);
