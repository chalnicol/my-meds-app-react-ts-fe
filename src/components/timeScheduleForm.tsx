import { useEffect, useState } from "react";
import type { DrugFormType, TimeScheduleInfo } from "../types";
import { isValidTime } from "../utils/validators";
import { formatTime } from "../utils/formatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { generateRandomString } from "../utils/generators";

interface TimeScheduleProps {
	timeSchedules: TimeScheduleInfo[];
	onChange: (value: TimeScheduleInfo[]) => void;
	error: string | null;
	className?: string;
	drugForm: DrugFormType;
}

const TimeScheduleForm = ({
	timeSchedules,
	error,
	className,
	drugForm,
	onChange,
}: TimeScheduleProps) => {
	const [time, setTime] = useState<string>("");
	const [quantity, setQuantity] = useState<string>("");
	// const [timeSchedules, setTimeSchedules] = useState<TimeScheduleInfo[]>([]);
	const [formError, setFormError] = useState<string | null>(null);

	useEffect(() => {
		setFormError(error ? error : null);
	}, [error]);

	const validateInputs = (): TimeScheduleInfo | null => {
		if (time == "") {
			setFormError("Please input time.");
			return null;
		}

		if (!isValidTime(time)) {
			setFormError("Invalid time format.");
			return null;
		}
		const formattedTime = formatTime(time);

		const isDuplicate = timeSchedules.some(
			(sched) => sched.schedule_time === formattedTime
		);

		if (isDuplicate) {
			setFormError("Duplicate time entry.");
			return null;
		}
		if (quantity == "") {
			setFormError("Please input quantity.");
			return null;
		}
		if (isNaN(parseFloat(quantity))) {
			setFormError("Quantity must be a number.");
			return null;
		}

		return {
			id: generateRandomString(10),
			schedule_time: formattedTime,
			quantity: parseFloat(quantity),
		};
	};

	const handleAddSchedule = () => {
		const validated = validateInputs();
		if (!validated) return;

		const newTimeSchedules = [...timeSchedules, validated];
		onChange(newTimeSchedules);

		setTime("");
		setQuantity("");
		setFormError(null);
	};

	const handleRemoveDailySchedule = (id: string) => {
		const newTimeSchedules = timeSchedules.filter((sched) => sched.id !== id);
		onChange(newTimeSchedules);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault(); // This is the crucial line to prevent form submission
			handleAddSchedule();
		}
	};

	const isCountable = drugForm === "Tablet" || drugForm === "Capsule";

	return (
		<>
			<div
				className={`border border-gray-300 shadow rounded p-2 pt-1 ${className}`}
			>
				<div className="h-35 border border-gray-300 bg-gray-50 relative overflow-y-auto mt-1">
					{timeSchedules.length > 0 ? (
						<>
							<div
								className={`grid ${
									isCountable
										? "grid-cols-[1fr_1fr_50px]"
										: "grid-cols-[1fr_50px]"
								} bg-gray-600 text-white sticky top-0 z-10 text-xs font-semibold`}
							>
								<p className="px-2 py-1">Time Intake</p>
								{isCountable && (
									<p className="px-2 py-1 border-s border-gray-300">
										Quantity Intake
									</p>
								)}
								<p className="px-2 py-1 border-s border-gray-300 text-center">
									-
								</p>
							</div>
							{timeSchedules.map((sched) => (
								<div
									key={sched.id}
									className="even:bg-gray-200 hover:bg-teal-50 select-none grid grid-cols-[1fr_1fr_50px] items-center"
								>
									<p className="px-2 py-0.5">{sched.schedule_time}</p>
									{isCountable && (
										<p className="px-2 py-0.5">{sched.quantity}</p>
									)}
									<button
										type="button"
										className="cursor-pointer text-xs hover:text-gray-400 text-gray-500 px-1 font-semibold"
										onClick={() =>
											handleRemoveDailySchedule(sched.id)
										}
									>
										<FontAwesomeIcon icon="trash" size="sm" />
									</button>
								</div>
							))}
						</>
					) : (
						<p className="px-2 py-1 text-left">
							No time intake schedule shown.
						</p>
					)}
				</div>
				<div className="flex gap-x-2 mt-2">
					<input
						type="text"
						value={time}
						className="flex-auto min-w-0 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300"
						placeholder="time"
						onChange={(e) => setTime(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					{isCountable && (
						<input
							type="text"
							value={quantity}
							className="flex-auto min-w-0 border border-gray-300 rounded  px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300"
							placeholder="quantity"
							onChange={(e) => setQuantity(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
					)}
					<button
						type="button"
						className="flex-none bg-gray-100 hover:bg-gray-50 border border-gray-300 px-3 rounded font-semibold cursor-pointer flex items-center gap-x-1"
						onClick={handleAddSchedule}
					>
						<FontAwesomeIcon icon="plus" size="sm" />
						<span className="text-sm">SCHEDULE</span>
					</button>
				</div>
			</div>
			{formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
		</>
	);
};

export default TimeScheduleForm;
