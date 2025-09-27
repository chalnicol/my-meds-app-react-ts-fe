// src/components/SocialAuthButtons.tsx

import React from "react";
import { useAuth } from "../context/AuthProvider";

const socialAuthButtons: React.FC = () => {
	const { isLoading, socialSignin } = useAuth();

	return (
		<div className="flex gap-x-2 rounded w-full">
			<button
				onClick={() => socialSignin("google")}
				className="flex-1 flex items-center justify-center px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-md  transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-default"
				disabled={isLoading}
			>
				<span className="mr-2">G</span> Google
			</button>
			<button
				onClick={() => socialSignin("facebook")}
				className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md  transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-default"
				disabled={isLoading}
			>
				<span className="mr-2">f</span> Facebook
			</button>
		</div>
	);
};

export default socialAuthButtons;
