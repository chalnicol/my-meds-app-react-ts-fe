import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const VerifyEmail = () => {
	const {
		success,
		error,
		authLoading,
		isLoading,
		verifyEmail,
		clearMessages,
		updateCurrentPage,
	} = useAuth();

	const navigate = useNavigate();

	const [isInvalid, setIsInvalid] = useState(false);

	useEffect(() => {
		updateCurrentPage("verify-email");
		return () => {
			clearMessages();
		};
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const email = params.get("email");
		const token = params.get("token");
		if (!authLoading) {
			if (!email || !token) {
				setIsInvalid(true);
				return;
			}
			const verify = async () => {
				const response = await verifyEmail(email, token);
				if (response) {
					console.log("successful email verification.. redirecting");
					setTimeout(() => navigate("/login"), 2000);
				}
			};
			verify();
		}
	}, [location, navigate, authLoading]);

	return (
		<>
			<title>{`Email Verification | ${
				import.meta.env.VITE_APP_NAME
			}`}</title>
			<div className="w-full h-full flex flex-col justify-center max-w-md mx-auto p-4">
				<div className="border bg-white border-gray-500 px-4 py-3 rounded w-full max-w-md m-auto min-h-30 text-center shadow-lg relative overflow-hidden">
					<div>
						{isInvalid ? (
							<>
								<h2 className="font-bold text-lg">Invalid Link</h2>
								<p className="text-sm mt-2 mb-6">
									The email verification link is invalid or has
									expired. Please ensure you clicked the most recent
									link sent to your email.
								</p>
							</>
						) : (
							<>
								<h1 className="font-bold text-lg text-center">
									Email Verification
								</h1>
								<p className="text-gray-600 text-sm mt-1">
									Almost done! Just a moment while we confirm your
									details..
								</p>
								<hr className="mt-3 mb-2 border-gray-300" />
								{error && (
									<p className="text-red-600 text-sm">{error}</p>
								)}
								{success && (
									<p className="text-green-600 text-sm">{success}</p>
								)}
								{(isLoading || authLoading) && (
									<p className="text-gray-600 text-sm">
										Verifying email...
									</p>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default VerifyEmail;
