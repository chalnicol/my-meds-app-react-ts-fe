// src/App.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
	const navigate = useNavigate();

	const {
		isLoading,
		authLoading,
		success,
		error,
		updateCurrentPage,
		register,
		clearMessages,
	} = useAuth();

	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await register(
			fullName,
			email,
			password,
			passwordConfirmation
		);
		if (response) {
			// navigate("/email-verification-notice", { replace: true });
			resetForms();
			setTimeout(
				() => navigate("/email-verification-notice", { replace: true }),
				2000
			);
		}
	};

	const resetForms = () => {
		setEmail("");
		setFullName("");
		setPassword("");
		setPasswordConfirmation("");
	};

	useEffect(() => {
		updateCurrentPage("register");
		return () => {
			clearMessages();
		};
	}, []);

	return (
		<>
			<title>{`Register | ${import.meta.env.VITE_APP_NAME}`}</title>
			<div className="w-full h-full flex flex-col justify-center max-w-sm mx-auto p-4">
				<div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg w-full shadow-lg">
					<h2 className="text-3xl font-bold mb-6 text-gray-800">
						Register
					</h2>
					{error && (
						<p className="text-red-500 text-sm mb-4 w-full">{error}</p>
					)}
					{success && (
						<p className="text-green-500 text-sm mb-4 w-full">
							{success}
						</p>
					)}

					<form
						onSubmit={handleAuth}
						className="flex flex-col gap-4 w-full"
					>
						<input
							type="text"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							placeholder="Full Name"
							required
							className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
						/>

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
						<input
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							placeholder="Confirm Password"
							required
							className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
						/>

						<button
							type="submit"
							disabled={isLoading || authLoading}
							className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-lg text-white font-semibold rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Processing..." : "Register"}
						</button>
					</form>
					<div className="w-full mt-3 mb-4">
						<Link to="/login" className="hover:text-gray-400	text-sm">
							I already have an account?
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default Register;
