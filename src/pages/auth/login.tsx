// src/App.tsx

import { useEffect, useState } from "react";
import SocialAuthButtons from "../../components/socialAuthButtons";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";

const Login = () => {
	const { login, isLoading, error, updateCurrentPage, clearMessages } =
		useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		await login(email, password);
	};

	useEffect(() => {
		updateCurrentPage("login");
		return () => {
			clearMessages();
		};
	}, []);

	return (
		<>
			<title>{`Login | ${import.meta.env.VITE_APP_NAME}`}</title>
			<div className="w-full h-full flex flex-col justify-center max-w-sm mx-auto p-4">
				<div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg w-full shadow-lg">
					<h2 className="text-3xl font-bold mb-4 text-gray-800">Log in</h2>

					{error && (
						<p className="text-red-500 text-sm mb-4 w-full">{error}</p>
					)}

					<form
						onSubmit={handleAuth}
						className="flex flex-col gap-4 w-full"
					>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							required
							className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
						/>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							required
							className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
						/>
						<button
							type="submit"
							disabled={isLoading}
							className="py-1.5 bg-blue-600 hover:bg-blue-500 text-lg text-white font-semibold rounded-md  transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Processing..." : "Login"}
						</button>
					</form>
					<div className="w-full mt-2.5">
						<Link
							to="/forgot-password"
							className="hover:text-gray-400 text-sm"
						>
							Forgot password?
						</Link>
					</div>
					<hr className="w-full border-b border-gray-300 mt-8" />
					<p className="text-center bg-white py-1 px-2 -mt-4.5 mb-3">
						or use a social account
					</p>
					<SocialAuthButtons />
				</div>
			</div>
		</>
	);
};

export default Login;
