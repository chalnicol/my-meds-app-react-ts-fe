import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ScheduleInfo } from "../../types";

interface MedicationDoseProps {
	schedule: ScheduleInfo;
	onToggleIntake: (scheduleId: number) => void;
	isToggling: boolean;
}

const MedicationDose = ({
	schedule,
	onToggleIntake,
	isToggling,
}: MedicationDoseProps) => {
	const {
		schedule_id,
		dosage_quantity,
		brand_name,
		is_taken,
		remaining_stock,
	} = schedule;

	return (
		<div className="flex items-center gap-x-9 p-3 border-b last:border-b-0">
			<div className="flex items-center space-x-3">
				{is_taken ? (
					// <CheckCircle className="w-5 h-5 text-teal-500" />
					<FontAwesomeIcon
						icon={["far", "circle-check"]}
						className="text-teal-500"
						size="lg"
					/>
				) : (
					<FontAwesomeIcon
						icon={["far", "circle-xmark"]}
						className="text-rose-500"
						size="lg"
					/>
				)}
				<div>
					<p className="font-bold text-gray-800 text-lg">{brand_name}</p>
					<div className="space-y-1">
						<p className="text-xs text-gray-500">
							Remaining Stock:{" "}
							<span
								className={`ms-1 text-sm font-bold ${
									remaining_stock < 5
										? "text-red-600"
										: "text-green-600"
								}`}
							>
								{remaining_stock}
							</span>
						</p>
						<p className="text-xs text-gray-500">
							Dose: {dosage_quantity} unit(s)
						</p>
					</div>
				</div>
			</div>

			<button
				onClick={() => onToggleIntake(schedule_id)}
				disabled={isToggling}
				className={`ms-auto px-3 py-1 text-white text-xs min-w-15 flex items-center justify-center rounded-lg shadow-sm font-semibold cursor-pointer transition-all duration-200 ${
					is_taken
						? "bg-rose-400 hover:bg-rose-300"
						: "bg-teal-500 hover:bg-teal-400"
				} disabled:opacity-60 disabled:cursor-not-allowed`}
			>
				{isToggling ? (
					<FontAwesomeIcon icon="spinner" spin size="lg" />
				) : is_taken ? (
					"UNDO"
				) : (
					"TAKE"
				)}
			</button>
		</div>
	);
};

export default MedicationDose;
