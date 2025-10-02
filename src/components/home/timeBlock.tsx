import type { ScheduleInfo } from "../../types";
import { formatTime } from "../../utils/formatters";
import MedicationDose from "./medicationDose";

interface TimeBlockProps {
	time: string;
	schedules: ScheduleInfo[];
	onToggleIntake: (scheduleId: number) => void;
	togglingId: number | null;
}

const TimeBlock = ({
	time,
	schedules,
	onToggleIntake,
	togglingId,
}: TimeBlockProps) => {
	// Determine the overall status of the block
	const allTaken = schedules.every((s) => s.is_taken);
	const hasTaken = schedules.some((s) => s.is_taken);

	let statusText = "Due";
	let statusClass = "text-red-600 bg-red-100";
	if (allTaken) {
		statusText = "Completed";
		statusClass = "text-teal-600 bg-teal-100";
	} else if (hasTaken) {
		statusText = "Partial";
		statusClass = "text-amber-600 bg-amber-100";
	}

	return (
		<div className="bg-white rounded-xl shadow border border-gray-300 overflow-hidden">
			{/* Header: Time and Overall Status */}
			<div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
				<div className="text-3xl font-bold text-gray-500">
					{formatTime(time)}
				</div>
				<span
					className={`px-3 py-1 text-xs font-bold rounded-full shadow ${statusClass}`}
				>
					{statusText}
				</span>
			</div>

			{/* List of Medications */}
			<div className="divide-y divide-gray-100">
				{schedules.map((schedule) => (
					<MedicationDose
						key={schedule.schedule_id}
						schedule={schedule}
						onToggleIntake={onToggleIntake}
						isToggling={togglingId === schedule.schedule_id}
					/>
				))}
			</div>
		</div>
	);
};

export default TimeBlock;
