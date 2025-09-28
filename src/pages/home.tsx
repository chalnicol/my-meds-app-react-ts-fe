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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusMessage from "../components/statusMessage";
import { getStockColorClass } from "../utils/generators";

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

	const updateMedsIntake = async (id: number, time: string) => {
		setIsLoading(true);
		try {
			const response = await takeMedication(id, time);
			setSuccess(response.message);
		} catch (error) {
			setError("Failed to update medication scheduled intake.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleMedsIntake = (id: number, time: string) => {
		if (!user) return;

		const medication = todaysMeds.find((med) => med.id == id);
		if (!medication) {
			setError("Medication not found.");
			return;
		}
		if (medication.remainingStock <= 0) {
			setError("Medication has no remaining stock.");
			return;
		}

		const medIsTaken = isTaken(id, time);

		setTodaysMeds((prev) => {
			const newMeds = prev.map((med) => {
				if (med.id == id) {
					const newRemainingStock = medIsTaken
						? med.remainingStock + 1
						: med.remainingStock - 1;
					return {
						...med,
						remainingStock: newRemainingStock,
					};
				}
				return med;
			});
			return newMeds;
		});

		setTakenIntakes((prev) => {
			if (medIsTaken) {
				return prev.filter(
					(intake) =>
						!(intake.medication_id == id && intake.scheduled_time == time)
				);
			} else {
				return [
					...prev,
					{
						id: Date.now(),
						user_id: user.id,
						medication_id: id,
						scheduled_time: time,
					},
				];
			}
		});

		updateMedsIntake(id, time);
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
		(id: number, time: string) => {
			return takenIntakes.some(
				(intake) =>
					intake.medication_id == id && intake.scheduled_time == time
			);
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
																{med.brandName}
															</span>
															<span className="ms-2 text-xs">
																({med.dosage})
															</span>
														</p>
														<p className="text-xs text-gray-500 font-bold">
															{med.genericName}
														</p>
													</div>
													<div>
														<p className="font-semibold text-xs">
															Remaining Stocks:
														</p>
														<p
															className={`text-2xl font-bold ${getStockColorClass(
																med.remainingStock
															)}`}
														>
															{med.remainingStock}
														</p>
													</div>
												</div>

												<p className="text-sm text-gray-600"></p>
												<div className="mt-2 flex flex-wrap gap-2">
													{med.dailySchedule.map((schedule) => (
														<button
															key={schedule.id}
															className="group  border border-gray-400 bg-white shadow-md cursor-pointer text-gray-500 flex items-center rounded hover:bg-gray-100 active:scale-95"
															onClick={() =>
																handleMedsIntake(
																	med.id,
																	schedule.time
																)
															}
														>
															<FontAwesomeIcon
																icon={
																	isTaken(
																		med.id,
																		schedule.time
																	)
																		? "circle-check"
																		: "circle"
																}
																className={`p-1 ${
																	isTaken(
																		med.id,
																		schedule.time
																	) && "text-green-600"
																}`}
															/>
															<span className="font-bold border-s border-gray-400 px-2 py-1 text-sm">
																{schedule.time}
															</span>
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
