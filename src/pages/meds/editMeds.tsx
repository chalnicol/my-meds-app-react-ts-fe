import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { DailyScheduleInfo, FrequencyType, StatusType } from "../../types";
import { isValidTime } from "../../utils/validators";
import { generateRandomString } from "../../utils/generators";
import { formatTime } from "../../utils/formatters";
import { weekDays } from "../../data";
import { Link, useParams } from "react-router-dom";
import {
	getMedicationById,
	updateMedication,
} from "../../service/medicationService";
import Loader from "../../components/loader";
import Header from "../../components/header";
import StatusMessage from "../../components/statusMessage";
import { useAuth } from "../../context/AuthProvider";

const EditMeds = () => {
	const { isAuthenticated, updateCurrentPage } = useAuth();

	const { id } = useParams<{ id: string }>();

	const [brandName, setBrandName] = useState<string>("");
	const [genericName, setGenericName] = useState<string>("");
	const [dosage, setDosage] = useState<string>("");
	// const [stock, setStock] = useState<StockHistoryInfo | null>(null);

	const [timeSchedule, setTimeSchedule] = useState<string>("");
	const [fieldErrors, setFieldErrors] = useState<Record<
		string,
		string | null
	> | null>(null);

	const [frequencyType, setFrequencyType] =
		useState<FrequencyType>("Everyday");

	const [status, setStatus] = useState<StatusType>("Active");

	const [frequency, setFrequency] = useState<number[] | null>([]);

	const [dailySchedule, setDailySchedule] = useState<DailyScheduleInfo[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleFrequencyChange = (type: FrequencyType) => {
		setFrequencyType(type);
		if (type === "SpecificDays") {
			setFrequency([0]);
		}
		setFieldErrors((prev) => {
			return {
				...prev,
				frequency: null,
			};
		});
	};

	const handleToggleDay = (dayId: number) => {
		setFieldErrors((prev) => {
			return {
				...prev,
				frequency: null,
			};
		});
		setFrequency((days) => {
			if (!days) return null;

			const newDays = [...days];
			if (newDays.includes(dayId)) {
				if (newDays.length > 1) {
					return newDays
						.filter((id) => id !== dayId)
						.sort((a, b) => a - b);
				} else {
					setFieldErrors((prev) => {
						return {
							...prev,
							frequency: "Should have at least 1 set day",
						};
					});
					return newDays;
				}
			} else {
				if (newDays.length < 6) {
					return [...newDays, dayId].sort((a, b) => a - b);
				} else {
					setFieldErrors((prev) => {
						return {
							...prev,
							frequency: "Should have less than 6 set days",
						};
					});
					return newDays;
				}
			}
			return newDays;
		});
	};

	const handleAddSchedule = () => {
		if (timeSchedule == "") {
			// setTimeScheduleError("Please input time.");
			setFieldErrors((prev) => ({
				...prev,
				timeSchedule: "Please input time.",
			}));
			return;
		}
		if (!isValidTime(timeSchedule)) {
			// setTimeScheduleError("Invalid time format.");
			setFieldErrors((prev) => ({
				...prev,
				timeSchedule: "Invalid time format.",
			}));
			return;
		}

		const formattedTime = formatTime(timeSchedule);

		const isDuplicate = dailySchedule.some(
			(sched) => sched.time === formattedTime
		);

		if (isDuplicate) {
			setFieldErrors((prev) => ({
				...prev,
				timeSchedule: "Duplicate time entry.",
			}));
			return;
		}

		setDailySchedule((prev) => {
			return [
				...prev,
				{ id: generateRandomString(10), time: formattedTime },
			];
		});
		setTimeSchedule("");
		setFieldErrors(null);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault(); // This is the crucial line to prevent form submission
			handleAddSchedule();
		}
	};

	const handleRemoveDailySchedule = (id: string) => {
		setDailySchedule((prev) => {
			return prev.filter((sched) => sched.id !== id);
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("submit form");

		if (!id) return;

		setIsLoading(true);
		try {
			await updateMedication(
				parseInt(id),
				brandName,
				genericName,
				dosage,
				status,
				frequencyType,
				frequency,
				dailySchedule
			);
			setSuccess("Medication updated successfully!");
			// clearForms();
		} catch (error) {
			console.log(error);
			setError("Failed to update medication.");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchMed = async (id: number) => {
		console.log("fetching med..");
		setIsLoading(true);
		try {
			const response = await getMedicationById(id);

			const { medication } = response;
			// console.log(response);
			setBrandName(medication.brandName);
			setGenericName(medication.genericName);
			setDosage(medication.dosage);
			setStatus(medication.status);
			setFrequency(medication.frequency);
			setDailySchedule(medication.dailySchedule);
			setFrequencyType(medication.frequencyType);
		} catch (error: any) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated && id) {
			fetchMed(parseInt(id));
		}
	}, [isAuthenticated, id]);

	useEffect(() => {
		updateCurrentPage("editMedication");
	}, []);

	const medStatus: StatusType[] = ["Active", "Inactive"];

	const frequencies: FrequencyType[] = ["Everyday", "SpecificDays"];

	const isDaySelected = (dayId: number): boolean => {
		if (!frequency) return false;

		return (
			frequencyType == "SpecificDays" &&
			frequency &&
			frequency.includes(dayId)
		);
	};

	return (
		<>
			<title>{`Edit Medication | ${import.meta.env.VITE_APP_NAME}`}</title>
			<div className="w-full relative">
				<Header>
					<p className="text-xl font-bold">Edit Medication</p>
				</Header>

				<div className="p-4">
					{success && (
						<StatusMessage
							message={success}
							type="success"
							onClose={() => setSuccess(null)}
						/>
					)}
					{error && (
						<StatusMessage
							message={error}
							type="error"
							onClose={() => setError(null)}
						/>
					)}

					<form onSubmit={handleSubmit} className="max-w-5xl">
						<div className="space-y-2">
							<div className="grid md:grid-cols-2 gap-x-4 space-y-2">
								<div>
									<label
										htmlFor="brandName"
										className="text-sm font-semibold"
									>
										Brand Name
									</label>
									<input
										type="text"
										id="brandName"
										value={brandName}
										onChange={(e) => setBrandName(e.target.value)}
										className="w-full mt-1 border border-gray-300 placeholder:text-gray-500 px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 shadow"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="genericName"
										className="text-sm font-semibold"
									>
										Generic Name
									</label>
									<input
										type="text"
										id="genericName"
										value={genericName}
										onChange={(e) => setGenericName(e.target.value)}
										className="w-full mt-1 border border-gray-300 placeholder:text-gray-500 px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 shadow"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="dosage"
										className="text-sm font-semibold"
									>
										Dosage
									</label>
									<input
										type="text"
										id="dosage"
										value={dosage}
										onChange={(e) => setDosage(e.target.value)}
										className="w-full mt-1 border border-gray-300 placeholder:text-gray-500 px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 shadow"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="active"
										className="text-sm font-semibold"
									>
										Status
									</label>
									<div className="mt-1 grid grid-cols-2 font-semibold">
										{medStatus.map((s, index) => (
											<button
												key={index}
												type="button"
												className={`border first:rounded-s last:rounded-e px-2 py-1.5 ${
													s == status
														? "bg-gray-400 border-gray-300 text-white"
														: "bg-gray-100 hover:bg-gray-50 border-gray-300 cursor-pointer shadow"
												}`}
												onClick={() => setStatus(s)}
											>
												{s}
											</button>
										))}
									</div>
								</div>
							</div>
							<div className="grid md:grid-cols-2 gap-x-4 space-y-2">
								<div className="space-y-2">
									<div>
										<label
											htmlFor="timeofday"
											className="text-sm font-semibold"
										>
											Frequency
										</label>
										<div className="mt-1 grid grid-cols-2 font-semibold">
											{frequencies.map((freq, index) => (
												<button
													key={index}
													type="button"
													className={`border first:rounded-s last:rounded-e px-2 py-1.5 ${
														freq === frequencyType
															? "bg-gray-400 border-gray-300 text-white"
															: "bg-gray-100 hover:bg-gray-50 border-gray-300 cursor-pointer shadow"
													}`}
													onClick={() =>
														handleFrequencyChange(freq)
													}
												>
													{freq}
												</button>
											))}
										</div>
									</div>
									<div>
										<label
											htmlFor="weeklySchedule"
											className="text-sm font-semibold"
										>
											Frequency - Select Days
										</label>
										<div className="mt-1 grid grid-cols-4 gap-1">
											{weekDays.map((day) => (
												<button
													type="button"
													key={day.id}
													className={`border rounded font-semibold text-sm py-1 shadow cursor-pointer disabled:text-gray-500 disabled:opacity-60 disabled:cursor-default ${
														isDaySelected(day.id)
															? "bg-gray-400 border-gray-300 text-white"
															: "bg-white hover:bg-gray-50 border-gray-300"
													}`}
													onClick={() => handleToggleDay(day.id)}
													disabled={frequencyType === "Everyday"}
												>
													{day.shortcut}
												</button>
											))}
										</div>
										{fieldErrors && fieldErrors.frequency && (
											<p className="text-xs text-red-500 mt-1">
												{fieldErrors.frequency}
											</p>
										)}
									</div>
								</div>
								<div>
									<label className="text-sm font-semibold">
										Daily Intake Times
									</label>
									<div className="px-2 pt-1 pb-2 border border-gray-300 shadow rounded mt-1">
										<div className="h-33 border border-gray-300 mt-1 bg-gray-50 overflow-y-auto">
											{dailySchedule.length > 0 ? (
												<>
													{dailySchedule.map((schedule) => (
														<div
															key={schedule.id}
															className="px-2 py-1 odd:bg-white even:bg-gray-200 border-b border-gray-300 flex items-center"
														>
															<p className="flex-1">
																{schedule.time}
															</p>
															<button
																type="button"
																className="cursor-pointer hover:bg-gray-400 text-xs hover:bg-gray-400/50 px-1 font-semibold"
																onClick={() =>
																	handleRemoveDailySchedule(
																		schedule.id
																	)
																}
															>
																<FontAwesomeIcon
																	icon="xmark"
																	size="xs"
																/>
															</button>
														</div>
													))}
												</>
											) : (
												<p className="px-2 py-1">
													No time intake schedule shown...
												</p>
											)}
										</div>

										<div className="flex gap-x-2 mt-2">
											<input
												type="text"
												value={timeSchedule}
												className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300"
												placeholder="input time here.."
												onChange={(e) =>
													setTimeSchedule(e.target.value)
												}
												onKeyDown={handleKeyDown}
											/>
											<button
												type="button"
												className="bg-gray-500 hover:bg-gray-400 px-3 rounded font-semibold text-white cursor-pointer flex items-center gap-x-1"
												onClick={handleAddSchedule}
											>
												<FontAwesomeIcon icon="plus" size="sm" />
												<span className="text-sm">SCHEDULE</span>
											</button>
										</div>
										{fieldErrors && fieldErrors.timeSchedule && (
											<p className="text-xs text-red-500 mt-1">
												{fieldErrors.timeSchedule}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:flex space-x-2 mt-6">
							<Link
								to="/medications"
								className="border border-sky-400 bg-sky-500 hover:bg-sky-400 text-white cursor-pointer transition duration-200 rounded my-2 inline-block text-center sm:w-32 py-1.5 font-semibold shadow-md"
							>
								BACK
							</Link>
							<button className="border border-green-400 bg-green-500 hover:bg-green-400 text-400 text-white cursor-pointer transition duration-200 rounded my-2 sm:w-28 py-1.5 font-semibold shadow-md">
								UPDATE
							</button>
						</div>
					</form>
				</div>
				{isLoading && <Loader />}
			</div>
		</>
	);
};

export default EditMeds;
