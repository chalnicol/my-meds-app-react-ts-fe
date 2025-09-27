import { useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";

const EmailVerificationNotice = () => {
	const {
		isLoading,
		error,
		success,
		updateCurrentPage,
		sendVerificationEmail,
	} = useAuth();

	useEffect(() => {
		updateCurrentPage("email-verification-notice");
	}, []);

	return (
		<>
			<title>{`Email Verification Notice | ${
				import.meta.env.VITE_APP_NAME
			}`}</title>
			<div className="w-full h-full flex flex-col justify-center max-w-md mx-auto p-4">
				<div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg w-full shadow-lg">
					<h2 className="text-2xl font-bold mb-5 text-gray-800">
						Email Verification
					</h2>
					<p className="text-sm">
						A verification link has been sent to your email address.
						Please click the link to confirm your account{" "}
					</p>

					<hr className="w-full mt-4 mb-2 border-gray-300" />

					<p className="mb-2">Didn't receive the email?</p>

					<button
						type="submit"
						disabled={isLoading}
						onClick={sendVerificationEmail}
						className="w-full py-1.5 bg-blue-500 hover:bg-blue-400 text-lg text-white font-semibold rounded-md transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Click to resend verification link
					</button>

					{success && (
						<p className="my-4 text-green-600 text-sm">{success}</p>
					)}
					{error && <p className="my-4 text-red-600 text-sm">{error}</p>}
				</div>
			</div>
		</>
	);
};

export default EmailVerificationNotice;
