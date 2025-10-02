import { useEffect, useMemo, useState } from "react";
import {
	drugForms,
	type DrugFormType,
	type FrequencyType,
	type StatusType,
	type TimeScheduleInfo,
} from "../../types";
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
import TimeScheduleForm from "../../components/timeScheduleForm";
import DropdownSelect from "../../components/dropdownSelect";
import { formatTime } from "../../utils/formatters";

const EditMeds = () => {
	const { isAuthenticated, updateCurrentPage } = useAuth();

	const { id } = useParams<{ id: string }>();

	const [brandName, setBrandName] = useState<string>("");
	const [genericName, setGenericName] = useState<string>("");
	const [dosage, setDosage] = useState<string>("");
	const [drugForm, setDrugForm] = useState<DrugFormType>("Tablet");
	const [fieldErrors, setFieldErrors] = useState<Record<
		string,
		string | null
	> | null>(null);
	const [frequencyType, setFrequencyType] =
		useState<FrequencyType>("Everyday");
	const [status, setStatus] = useState<StatusType>("Active");
	const [frequency, setFrequency] = useState<number[] | null>([]);
	const [timeSchedules, setTimeSchedules] = useState<TimeScheduleInfo[]>([]);
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// console.log("submit form");

		if (timeSchedules.length < 1) {
			setFieldErrors((prev) => {
				return {
					...prev,
					timeSchedule: "Should have at least 1 time schedule",
				};
			});
			return;
		}

		if (!id) return;

		setIsLoading(true);
		try {
			await updateMedication(
				parseInt(id),
				brandName,
				genericName,
				dosage,
				drugForm,
				status,
				frequencyType,
				frequency,
				timeSchedules
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
			setBrandName(medication.brand_name);
			setGenericName(medication.generic_name);
			setDosage(medication.dosage);
			setStatus(medication.status);
			setFrequency(medication.frequency);
			setFrequencyType(medication.frequency_type);
			setDrugForm(medication.drug_form);
			setTimeSchedules(medication.time_schedules);
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

	const drugFormOptions = drugForms.map((form, index) => ({
		id: index,
		value: form,
		label: form,
	}));

	const formattedTimeSchedules = useMemo((): TimeScheduleInfo[] => {
		return timeSchedules.map((sched) => {
			return {
				...sched,
				schedule_time: formatTime(sched.schedule_time),
			};
		});
	}, [timeSchedules]);

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
							<div className="md:grid grid-cols-2 gap-x-4 space-y-2">
								{/* drug form */}
								<div>
									<label
										htmlFor="drugForm"
										className="text-sm font-semibold"
									>
										Drug Form
									</label>
									<DropdownSelect
										value={drugForm}
										onChange={(value) => setDrugForm(value)}
										options={drugFormOptions}
										className="mt-1"
									/>
								</div>
								{/* brand name */}
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
								{/* generic name */}
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
								{/* dosage */}
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
							</div>
							<div className="md:grid grid-cols-2 gap-x-4 space-y-2">
								<div className="space-y-2">
									{/* status */}
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
											Select Days
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
										Time Schedule Intakes
									</label>
									<TimeScheduleForm
										timeSchedules={formattedTimeSchedules}
										onChange={(value) => setTimeSchedules(value)}
										error={fieldErrors && fieldErrors.timeSchedule}
										className="mt-1"
										drugForm={drugForm}
									/>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:flex space-x-2 mt-6">
							<Link
								to="/medications"
								className="border border-sky-400 bg-sky-500 hover:bg-sky-400 text-white cursor-pointer transition duration-200 rounded my-2 inline-block text-center sm:w-32 py-1.5 font-semibold shadow-md"
							>
								BACK TO LIST
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
