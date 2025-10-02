import { useEffect, useState } from "react";
import { timezones } from "../../data";
import DropdownSelect from "../dropdownSelect";
import { useAuth } from "../../context/AuthProvider";

const AccountSettings = () => {
	const { isLoading, user, success, error, updateSettings, clearMessages } =
		useAuth();

	const [timezone, setTimezone] = useState<string>("");

	useEffect(() => {
		if (user) {
			setTimezone(user.timezone);
		}
		return () => {
			clearMessages();
		};
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateSettings(timezone);
	};

	const reset = () => {
		if (!user) return;
		setTimezone(user.timezone);
		clearMessages();
	};

	const mappedTimezones = timezones.map((t, i) => {
		return {
			id: i,
			label: t,
			value: t,
		};
	});

	return (
		<div>
			<form onSubmit={handleSubmit} className="mt-1">
				<div className="space-y-1">
					<p className="text-sm text-gray-700">Timezone</p>

					<DropdownSelect
						value={timezone}
						options={mappedTimezones}
						onChange={(e) => setTimezone(e)}
						className="shadow"
					/>
				</div>
				<div className="mt-3 space-x-2">
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
		</div>
	);
};
export default AccountSettings;
