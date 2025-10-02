import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import FormRules from "../formRules";
import { userDetailsRules } from "../../data";

const ChangePassword = () => {
	const { error, success, updatePassword, isLoading, clearMessages } =
		useAuth();

	const [currentPassword, setCurrentPassword] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await updatePassword(
			currentPassword,
			password,
			confirmPassword
		);
		if (response) {
			reset();
		}
	};

	useEffect(() => {
		return () => {
			clearMessages();
		};
	}, []);

	const reset = () => {
		setCurrentPassword("");
		setPassword("");
		setConfirmPassword("");
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="flex flex-col gap-y-2 mt-1">
				<div className="space-y-1">
					<p className="text-sm text-gray-700">Current Password</p>
					<input
						type="password"
						className="px-3 py-2 rounded border border-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-1">
					<div className="text-sm text-gray-700 flex items-center gap-x-1">
						<FormRules rules={userDetailsRules.password} />
						<span>New Password</span>
					</div>
					<input
						type="password"
						className="px-3 py-2 rounded border border-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-1">
					<p className="text-sm text-gray-700">Confirm New Password</p>
					<input
						type="password"
						className="px-3 py-2 rounded border border-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>

				<div className="space-x-2 mt-2">
					<button
						type="button"
						className="bg-sky-500 hover:bg-sky-400 text-white rounded font-semibold cursor-pointer px-4 py-1.5"
						onClick={reset}
						disabled={isLoading}
					>
						RESET
					</button>
					<button
						className="bg-green-500 hover:bg-green-400 text-white rounded font-semibold cursor-pointer px-4 py-1.5 disabled:opacity-60 disabled:cursor-default"
						disabled={isLoading}
					>
						{isLoading ? "PROCESSING..." : "SUBMIT"}
					</button>
				</div>
			</form>
			{error && <p className="text-red-500 text-sm my-4">{error}</p>}
			{success && <p className="text-green-500 text-sm my-4">{success}</p>}
		</>
	);
};
export default ChangePassword;
