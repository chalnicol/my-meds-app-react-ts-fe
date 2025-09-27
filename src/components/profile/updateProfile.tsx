import { useEffect, useState } from "react";
import { timezones } from "../../data";
import { useAuth } from "../../context/AuthProvider";

interface UpdateProfileProps {
	currentFullname: string;
	currentEmail: string;
	currentTimezone: string;
}

const UpdateProfile = ({
	currentFullname,
	currentEmail,
	currentTimezone,
}: UpdateProfileProps) => {
	const { updateProfile, isLoading, success, error, clearMessages } =
		useAuth();

	const [fullname, setFullname] = useState<string>(currentFullname);
	const [email, setEmail] = useState<string>(currentEmail);
	const [timezone, setTimezone] = useState<string>(currentTimezone);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateProfile(email, fullname, timezone);
	};

	const reset = () => {
		setFullname(currentFullname);
		setEmail(currentEmail);
		setTimezone(currentTimezone);
	};

	useEffect(() => {
		return () => {
			clearMessages();
		};
	}, []);

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-4 mt-1">
				<div className="space-y-1">
					<p className="text-sm font-semibold">Full Name</p>
					<input
						type="text"
						className="px-3 py-2 rounded border border-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
						value={fullname}
						onChange={(e) => setFullname(e.target.value)}
					/>
				</div>
				<div className="space-y-1">
					<p className="text-sm font-semibold">Email</p>
					<input
						type="text"
						className="px-3 py-2 rounded border border-gray-400 w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className="space-y-1">
					<p className="text-sm font-semibold">Timezone</p>
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
export default UpdateProfile;
