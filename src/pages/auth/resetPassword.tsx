import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import FormRules from "../../components/formRules";
import { userDetailsRules } from "../../data";

const resetPassword = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const {
		resetPassword,
		updateCurrentPage,
		isLoading,
		error,
		success,
		clearMessages,
	} = useAuth(); // Destructure from context

	const [email, setEmail] = useState("");
	const [token, setToken] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	const [isInvalid, setIsInvalid] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await resetPassword(email, token, password, passwordConfirmation);

		setEmail("");
		setPassword("");
		setPasswordConfirmation("");
		setTimeout(() => navigate("/login"), 2000);
	};

	useEffect(() => {
		updateCurrentPage("reset-password");
		return () => {
			clearMessages();
		};
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const urlToken = params.get("token");
		const urlEmail = params.get("email");

		console.log(urlToken, urlEmail);

		if (!urlEmail || !urlToken) {
			setIsInvalid(true);
		}
		if (urlToken) {
			setToken(urlToken);
		}
		if (urlEmail) {
			setEmail(urlEmail);
		}

		return () => {
			// clearMessages(); // Clean up messages/errors when component unmounts
		};
	}, [location.search]);

	if (isInvalid) {
		return (
			<div className="w-full h-full flex flex-col justify-center max-w-sm mx-auto p-4">
				<div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg w-full shadow-lg">
					<h2 className="text-2xl font-bold mb-4 text-gray-800">
						Invalid Link
					</h2>

					<p className="text-sm mb-6">
						The password reset link is invalid or has expired. Please
						request a new one.
					</p>

					<Link
						to="/forgot-password"
						className="block w-full text-white text-center font-bold py-2 px-4 rounded transition duration-200	bg-blue-600 hover:bg-blue-700	disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						Request New Link
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col justify-center max-w-sm mx-auto p-4">
			<div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg w-full shadow-lg">
				<h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
					Reset Password
				</h2>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 w-full"
				>
					<div>
						<p className="text-sm text-gray-500 flex items-center gap-x-1 mb-1">
							<FormRules rules={userDetailsRules.email} />
							<span>Email</span>
						</p>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							// placeholder="Email"
							placeholder="ex. john.doe@example.com"
							required
							className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
					</div>
					<div>
						<p className="text-sm text-gray-500 flex items-center gap-x-1 mb-1">
							<FormRules rules={userDetailsRules.password} />
							<span>Password</span>
						</p>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							// placeholder="Password"
							required
							className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
					</div>

					<div>
						<p className="text-sm text-gray-500 mb-1">
							<span>Confirm Password</span>
						</p>
						<input
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							// placeholder="Password Confirmation"
							required
							className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="py-1.5 bg-blue-600 text-lg text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Processing..." : "Update Password"}
					</button>
				</form>
				{success && (
					<p className="text-green-600 text-sm my-3">{success}</p>
				)}
				{error && <p className="text-red-500 text-sm my-3">{error}</p>}
			</div>
		</div>
	);
};
export default resetPassword;
