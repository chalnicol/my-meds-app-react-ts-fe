import { useEffect, useState } from "react";
import { userDetailsRules } from "../../data";
import { useAuth } from "../../context/AuthProvider";
import FormRules from "../formRules";

const UpdateProfile = () => {
	const { updateProfile, user, isLoading, success, error, clearMessages } =
		useAuth();

	const [fullname, setFullname] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	// const [timezone, setTimezone] = useState<string>(currentTimezone);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateProfile(email, fullname);
	};

	const reset = () => {
		if (!user) return;
		setFullname(user.fullname);
		setEmail(user.email);
		clearMessages();
	};

	useEffect(() => {
		if (user) {
			setFullname(user.fullname);
			setEmail(user.email);
		}
		return () => {
			clearMessages();
		};
	}, [user]);

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-4 mt-1">
				<div className="space-y-1">
					<div className="text-sm text-gray-700 flex items-center gap-x-1">
						<FormRules rules={userDetailsRules.fullname} />
						<span>Full Name</span>
					</div>

					<input
						type="text"
						className="px-3 py-2 rounded border border-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
						value={fullname}
						onChange={(e) => setFullname(e.target.value)}
					/>
				</div>
				<div className="space-y-1">
					{/* <p className="text-sm font-semibold">Email</p> */}
					<div className="text-sm text-gray-700 flex items-center gap-x-1">
						<FormRules rules={userDetailsRules.email} />
						<span>Email</span>
					</div>
					<input
						type="text"
						className="px-3 py-2 rounded border border-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				{/* <div className="space-y-1">
					<p className="text-sm text-gray-700">Timezone</p>
					<input
						type="text"
						className="px-3 py-2 rounded border border-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
						value={timezone}
						readOnly
					/>

					<div className="border border-gray-400 h-28 mt-1 overflow-y-scroll">
						{timezones.map((t) => (
							<div
								key={t.id}
								className={`flex px-2 py-0.5 items-center select-none ${
									t.value == timezone
										? "bg-gray-400 text-white"
										: "odd:bg-gray-100 hover:bg-teal-50 cursor-pointer"
								}`}
								onClick={() => setTimezone(t.value)}
							>
								<p className="flex-1">{t.value}</p>

								{t.value == timezone && (
									<span className="text-xs bg-gray-500 hover:bg-green-400 cursor-pointer text-white font-bold px-2 rounded">
										SELECTED
									</span>
								)}
							</div>
						))}
					</div>
				</div> */}

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
export default UpdateProfile;
