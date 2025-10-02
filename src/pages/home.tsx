import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/loader";
import { useAuth } from "../context/AuthProvider";
import {
	getTodaysMedications,
	takeMedication,
} from "../service/medicationService";
import { type MedsInfo, type MedsIntakeInfo } from "../types";
import Header from "../components/header";
import StatusMessage from "../components/statusMessage";
import { getStockColorClass } from "../utils/generators";
import { formatTime } from "../utils/formatters";

const Home = () => {
	const { isAuthenticated, user, updateCurrentPage } = useAuth();
	const [todaysMeds, setTodaysMeds] = useState<MedsInfo[]>([]);
	const [takenIntakes, setTakenIntakes] = useState<MedsIntakeInfo[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const fetchTodaysMeds = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await getTodaysMedications();
			setTodaysMeds(response.medications);
			setTakenIntakes(response.intake_records);
		} catch (err) {
			setError("Could not load today's schedule.");
			// console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	// const updateMedsIntake = async (id: number) => {
	// 	setIsLoading(true);
	// 	try {
	// 		const response = await takeMedication(id);
	// 		setSuccess(response.message);
	// 	} catch (error) {
	// 		setError("Failed to update medication scheduled intake.");
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	const handleMedsIntake = async (
		medId: number,
		timeScheduleId: number,
		quantity: number
	) => {
		if (!user) return;

		const medication = todaysMeds.find((med) => med.id == medId);
		if (!medication) {
			setError("Medication not found.");
			return;
		}
		if (medication.remaining_stock <= 0) {
			setError("Medication has no remaining stock.");
			return;
		}

		setIsLoading(true);
		try {
			const response = await takeMedication(timeScheduleId);
			setSuccess(response.message);

			//update..
			const medIsTaken = isTaken(timeScheduleId);

			setTodaysMeds((prev) => {
				return prev.map((med) => {
					if (med.id == medId) {
						const newRemainingStock = medIsTaken
							? med.remaining_stock + 1
							: med.remaining_stock - 1;

						return {
							...med,
							remaining_stock: newRemainingStock,
						};
					}
					return med;
				});
			});

			setTakenIntakes((prev) => {
				if (medIsTaken) {
					return prev.filter(
						(intake) => intake.time_schedule_id !== timeScheduleId
					);
				} else {
					return [
						...prev,
						{
							id: Date.now(),
							user_id: user.id,
							time_schedule_id: timeScheduleId,
							quantity: quantity,
						},
					];
				}
			});
		} catch (error) {
			setError("Failed to update medication scheduled intake.");
		} finally {
			setIsLoading(false);
		}

		// updateMedsIntake(timeScheduleId);
	};

	useEffect(() => {
		updateCurrentPage("home");
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			fetchTodaysMeds();
		}
	}, [isAuthenticated]);

	const isTaken = useCallback(
		(id: number) => {
			return takenIntakes.some((intake) => intake.time_schedule_id == id);
		},
		[takenIntakes]
	);

	return (
		<>
			<title>{`Home | ${import.meta.env.VITE_APP_NAME}`}</title>
			<Header>
				<p className="text-xl font-bold">Home Page</p>
			</Header>

			<div className="p-4 relative">
				{isAuthenticated ? (
					// Logged-in user dashboard
					<div>
						<div className="space-y-3">
							{/* Today's Medications - Placeholder */}
							<div className="bg-white p-4 rounded-lg border border-gray-300 shadow">
								<h2 className="text-xl font-bold">Today's Schedule</h2>
								<p className="text-gray-600 mb-4 text-sm">
									View today's medication schedule. Click on a schedule
									time to mark as taken.
								</p>

								{/* {error && <p className="text-red-500">{error}</p>} */}
								{error && (
									<StatusMessage
										message={error}
										type="error"
										onClose={() => setError(null)}
									/>
								)}
								{success && (
									<StatusMessage
										message={success}
										type="success"
										onClose={() => setSuccess(null)}
									/>
								)}

								{todaysMeds.length > 0 ? (
									<div className="space-y-3">
										{todaysMeds.map((med) => (
											<div
												key={med.id}
												className="p-3 border rounded-md bg-gray-50 border-gray-300 space-y-3"
											>
												<div className="flex flex-col sm:flex-row gap-4 justify-between">
													<div>
														<p>
															<span className="text-lg font-bold">
																{med.brand_name}
															</span>
															<span className="ms-2 text-xs">
																({med.dosage})
															</span>
														</p>
														<p className="text-xs text-gray-500 font-bold">
															{med.generic_name}
														</p>
													</div>
													<div>
														<p className="font-semibold text-xs">
															Remaining Stocks:
														</p>
														<p
															className={`text-2xl font-bold ${getStockColorClass(
																med.remaining_stock
															)}`}
														>
															{med.remaining_stock}
														</p>
													</div>
												</div>

												{/* <div className="mt-2 flex flex-wrap gap-2">
													{med.time_schedules.map((schedule) => (
														<button
															key={schedule.id}
															className="group  border border-gray-400 bg-white shadow-md cursor-pointer text-gray-500 flex items-center rounded hover:bg-gray-100 active:scale-95"
															onClick={() =>
																handleMedsIntake(
																	med.id,
																	schedule.id
																)
															}
														>
															<FontAwesomeIcon
																icon={
																	isTaken(
																		med.id,
																		schedule.schedule_time
																	)
																		? "circle-check"
																		: "circle"
																}
																className={`p-1 ${
																	isTaken(
																		med.id,
																		schedule.schedule_time
																	) && "text-green-600"
																}`}
															/>
															<p className="px-2 border-s border-gray-400 gap-x-1 flex items-center text-left">
																<span className="font-bold">
																	{formatTime(
																		schedule.schedule_time
																	)}
																</span>
																<span className="text-xs px-1 rounded-full bg-gray-400 text-white font-bold">
																	{schedule.quantity || 0}
																</span>
															</p>
														</button>
													))}
												</div> */}
												<div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
													{med.time_schedules.map((sched) => (
														<button
															key={sched.id}
															className="active:scale-95 flex items-center gap-x-2 px-2 py-1 cursor-pointer hover:bg-gray-50 border border-gray-400 rounded-full bg-white shadow-md"
															onClick={() =>
																handleMedsIntake(
																	med.id,
																	parseInt(sched.id),
																	sched.quantity || 0
																)
															}
														>
															{/* {isTaken(parseInt(sched.id)) ? (
																<FontAwesomeIcon
																	icon={[
																		"far",
																		"circle-check",
																	]}
																	// size="lg"
																	className="text-teal-600"
																/>
															) : (
																<FontAwesomeIcon
																	icon={[
																		"far",
																		"circle-xmark",
																	]}
																	// size="lg"
																	className="text-rose-600"
																/>
															)} */}

															<p
																className={`font-bold text-white text-xs px-1.5 rounded-full ${
																	isTaken(parseInt(sched.id))
																		? "bg-teal-500"
																		: "bg-rose-500"
																}`}
															>
																{sched.quantity || 0}
															</p>
															<p className="font-bold text-gray-600">
																{formatTime(
																	sched.schedule_time
																)}
															</p>
														</button>
													))}
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-600 bg-gray-200 px-3 py-1.5 rounded">
										{isLoading
											? "Loading.."
											: "No medications scheduled to display."}
									</p>
								)}
							</div>

							{/* Quick Actions */}
							<div className="bg-white p-4 rounded-lg border border-gray-300 shadow">
								<h2 className="text-xl font-bold mb-2">
									Quick Actions
								</h2>
								<div className="flex space-x-2">
									<Link
										to="/medications"
										className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 font-semibold text-center shadow-md"
									>
										View Medications
									</Link>
									<Link
										to="/medications/create"
										className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold text-center shadow-md"
									>
										Add Medication
									</Link>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="text-center p-10 bg-white rounded-lg shadow">
						<h1 className="text-4xl font-bold mb-2">{`Welcome to ${
							import.meta.env.VITE_APP_NAME
						}!`}</h1>
						<p className="text-lg text-gray-600 mb-6">
							Your personal medication management assistant.
						</p>
						<div className="flex justify-center space-x-4">
							<Link
								to="/login"
								className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded  font-semibold"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="bg-gray-200 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded  font-semibold"
							>
								Register
							</Link>
						</div>
					</div>
				)}
				{isLoading && <Loader />}
			</div>
		</>
	);
};

export default Home;
