import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TimeBlock from "../components/home/timeBlock";
import type { ScheduleInfo } from "../types";
import { useEffect, useState } from "react";
import {
	getTodaysMedications,
	takeMedication,
} from "../service/medicationService";
import Header from "../components/header";
import { useAuth } from "../context/AuthProvider";

type GroupedSchedules = {
	[time: string]: ScheduleInfo[];
};

const TodaysMeds = () => {
	const { updateCurrentPage } = useAuth();

	const [schedules, setSchedules] = useState<ScheduleInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [togglingId, setTogglingId] = useState<number | null>(null);

	const fetchMeds = async () => {
		setLoading(true);
		try {
			// const data = await mockFetchSchedules();
			// setSchedules(data);
			const response = await getTodaysMedications();
			setSchedules(response.schedules);
		} catch (error) {
			console.error("Error fetching schedules:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMeds();
		updateCurrentPage("home");
	}, []);

	const groupedSchedules: GroupedSchedules = schedules.reduce(
		(acc: GroupedSchedules, schedule: ScheduleInfo) => {
			const time: string = schedule.schedule_time;

			if (!acc[time]) {
				acc[time] = [];
			}

			acc[time].push(schedule);
			return acc;
		},
		{} as GroupedSchedules // Initial value cast to the GroupedSchedules type
	);

	// Handles the toggle logic by calling the API and updating local state
	const handleToggleIntake = async (scheduleId: number) => {
		setTogglingId(scheduleId);
		try {
			// 1. Call the API endpoint (mocked)
			await takeMedication(scheduleId);

			// 2. Update local state instantly after successful API call
			setSchedules((prevSchedules) =>
				prevSchedules.map((schedule) =>
					schedule.schedule_id === scheduleId
						? {
								...schedule,
								is_taken: !schedule.is_taken,
								// In a real app, you might refresh or update stock here
						  }
						: schedule
				)
			);
		} catch (error) {
			console.error("Error toggling intake:", error);
			// Show error message to user
		} finally {
			setTogglingId(null);
		}
	};

	return (
		<>
			<title>{`Home | ${import.meta.env.VITE_APP_NAME}`}</title>
			<Header>
				<p className="text-xl font-bold">Home Page</p>
			</Header>

			<div className="p-6 md:p-10 h-full">
				<div className="flex flex-col md:flex-row md:justify-between items-start md:items-baseline mb-6 gap-y-4">
					<div className="space-y-0.5">
						<h1 className="text-2xl font-bold text-gray-600">
							Today's Medication Schedule
						</h1>
						<p className="text-gray-600">
							Scheduled blocks for {new Date().toLocaleDateString()}.
						</p>
					</div>
					<button
						onClick={fetchMeds}
						disabled={loading || togglingId !== null}
						className="text-sm font-semibold bg-teal-500 hover:bg-teal-400 rounded-lg shadow-md cursor-pointer text-white flex items-center px-3 py-1.5 transition-colors disabled:opacity-50"
					>
						<FontAwesomeIcon
							icon="rotate-right"
							size="sm"
							className="mr-2"
						/>
						REFRESH SCHEDULE
					</button>
				</div>

				{loading ? (
					<div className="flex items-center justify-center h-48 border border-gray-300 rounded text-gray-600">
						<FontAwesomeIcon
							icon="spinner"
							spin
							size="lg"
							className="mr-3"
						/>
						Loading today's schedule...
					</div>
				) : Object.keys(groupedSchedules).length === 0 ? (
					<div className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-500">
						<p>No active medications are scheduled for today.</p>
					</div>
				) : (
					<div className="space-y-6">
						{/* Iterate over the keys (time strings) of the grouped object */}
						{Object.entries(groupedSchedules).map(([time, schedules]) => (
							<TimeBlock
								key={time}
								time={time}
								schedules={schedules}
								onToggleIntake={handleToggleIntake}
								togglingId={togglingId}
							/>
						))}
					</div>
				)}

				<p className="mt-6 text-xs text-gray-600">
					Note: Stock is updated automatically by the backend when you mark
					a dose as taken or undo it.
				</p>
			</div>
		</>
	);
};

export default TodaysMeds;
