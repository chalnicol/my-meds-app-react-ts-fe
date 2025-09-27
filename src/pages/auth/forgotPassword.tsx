import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const {
		forgotPassword,
		updateCurrentPage,
		isLoading,
		error,
		success,
		clearMessages,
	} = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await forgotPassword(email);
		setEmail("");
	};

	useEffect(() => {
		updateCurrentPage("forgot-password");
		return () => {
			clearMessages();
		};
	}, []);

	return (
		<>
			<title>{`Forgot Password | ${import.meta.env.VITE_APP_NAME}`}</title>
			<div className="w-full h-full flex flex-col justify-center max-w-sm mx-auto">
				<div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg w-full shadow-lg">
					<h2 className="text-2xl font-bold mb-4 text-center">
						Forgot Password?
					</h2>
					<p className="text-sm leading-snug text-gray-600 mb-4">
						Enter the email associated with your account. If it's
						registered with us, we'll send a password reset link to your
						inbox.
					</p>

					<form
						onSubmit={handleSubmit}
						className="w-full flex flex-col gap-4"
					>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							required
							className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
						/>

						<button
							type="submit"
							className="w-full text-white font-semibold py-2 px-4 rounded transition duration-200 bg-blue-600 hover:bg-blue-500	disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							disabled={isLoading}
						>
							Send Reset Link
						</button>
					</form>
					{success && (
						<p className="text-green-600 text-sm my-3">{success}</p>
					)}
					{error && <p className="text-red-500 text-sm my-3">{error}</p>}
				</div>
			</div>
		</>
	);
};
export default ForgotPassword;
