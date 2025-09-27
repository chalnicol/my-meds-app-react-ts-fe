import { useCallback, useEffect, useState } from "react";
import type { MedsInfo, OptionMenuInfo, StockInfo } from "../../types";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
	getMedications,
	updateMedicationStatus,
	deleteMedication,
} from "../../service/medicationService";
import Loader from "../../components/loader";
import Header from "../../components/header";
import StatusMessage from "../../components/statusMessage";
import useDebounce from "../../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { weekDays } from "../../data";
import OptionButton from "../../components/meds/optionButton";
import RestockModal from "../../components/restockModal";
import { getStockColorClass } from "../../utils/generators";
import { useAuth } from "../../context/AuthProvider";

const ListMeds = () => {
	const { updateCurrentPage } = useAuth();
	const navigate = useNavigate();

	const [searchParams, setSearchParams] = useSearchParams();

	const [meds, setMeds] = useState<MedsInfo[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);

	const [toRestock, setToRestock] = useState<number | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [toDelete, setToDelete] = useState<MedsInfo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const searchTerm = searchParams.get("search") || "";
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchMeds = async (page: number, term: string) => {
		setIsLoading(true);
		try {
			const response = await getMedications(page, term);
			// console.log(response);
			setMeds((prevMeds) => {
				if (page === 1) {
					return response.data;
				}

				// Step 1: Filter out any new meds that are already in the previous list.
				const newUniqueMeds = response.data.filter((newMed) => {
					return !prevMeds.some((prevMed) => prevMed.id === newMed.id);
				});

				// Step 2: Combine the old list with only the new, unique meds.
				return [...prevMeds, ...newUniqueMeds];
			});
			setCurrentPage(response.meta.current_page);
			setLastPage(response.meta.last_page);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteMedication = async () => {
		if (!toDelete) return;
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			await deleteMedication(toDelete.id);
			setMeds((prev) => prev.filter((med) => med.id !== toDelete.id));
			setToDelete(null);
			setSuccess("Medication deleted successfully!");
			// fetchMeds();
		} catch (error) {
			console.log(error);
			setError("Failed to delete medication.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());
		if (e.target.value) {
			newSearchParams.set("search", e.target.value);
		} else {
			newSearchParams.delete("search");
		}
		// Use replace: true to avoid creating new history entries for every keystroke
		setSearchParams(newSearchParams, { replace: true });
	};

	const toggleStatus = async (medId: number) => {
		try {
			setIsLoading(true);
			setError(null);
			setSuccess(null);
			await updateMedicationStatus(medId);
			setSuccess("Medication status updated successfully!");

			setMeds((prev) => {
				return prev.map((med) => {
					if (med.id === medId) {
						const newStatus =
							med.status == "Active" ? "Inactive" : "Active";
						return {
							...med,
							status: newStatus,
						};
					}
					return med;
				});
			});
		} catch (error) {
			console.log(error);
			setError("Failed to update medication status.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOptionsClick = (medId: number, optionClick: string) => {
		console.log(medId, optionClick);
		switch (optionClick) {
			case "view":
				navigate(`/medications/${medId}`);
				break;
			case "edit":
				navigate(`/medications/${medId}/edit`);
				break;
			case "delete":
				setToDelete(meds.find((med) => med.id == medId) || null);
				break;
			case "toggle":
				toggleStatus(medId);
				break;
			case "restock":
				setToRestock(medId);
				break;
			default:
			//
		}
	};

	const handleRestockClose = (stock: StockInfo | null = null) => {
		if (stock) {
			setMeds((prev) => {
				return prev.map((med) => {
					if (med.id == toRestock) {
						return {
							...med,
							remainingStock: med.remainingStock + stock.quantity,
						};
					}
					return med;
				});
			});
		}
		setToRestock(null);
	};

	const getOptions = useCallback(
		(medId: number): OptionMenuInfo[] => {
			const isMedPaused =
				meds.find((med) => med.id == medId)?.status == "Inactive";

			return [
				{ id: 1, label: "View Details", value: "view" },
				{ id: 5, label: "Add Stock", value: "restock" },
				{
					id: 4,
					label: isMedPaused ? "Resume" : "Pause",
					value: "toggle",
				},
				{ id: 2, label: "Edit", value: "edit" },
				{ id: 3, label: "Delete", value: "delete" },
			];
		},
		[meds]
	);

	const loadMoreMeds = () => {
		if (currentPage < lastPage) {
			fetchMeds(currentPage + 1, debouncedSearchTerm);
		}
	};

	useEffect(() => {
		updateCurrentPage("medications");
	}, []);

	useEffect(() => {
		fetchMeds(1, debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	return (
		<>
			<title>My Medications | Meds App</title>
			<div className="w-full relative">
				<Header>
					<h1 className="text-xl font-bold">Medications Page</h1>
				</Header>
				<div className="p-3">
					<div className="flex flex-col sm:flex-row items-baseline gap-x-2 gap-y-2 mb-3 sm:mb-2">
						<input
							type="search"
							value={searchTerm}
							onChange={handleSearchInputChange}
							className="flex-1 py-1 border-b border-gray-400 w-full focus:outline-none order-1 sm:order-2"
							placeholder="Filter search by brand name..."
						/>
						<Link
							to="/medications/create"
							className="flex-none flex items-center justify-center bg-sky-500 hover:bg-sky-400 text-center font-bold text-white text-sm cursor-pointer rounded px-2.5 py-1.5 w-full sm:w-auto order-2 sm:order-1"
						>
							<FontAwesomeIcon icon="plus" className="mr-1" size="xs" />
							NEW MEDICATION
						</Link>
					</div>

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
					{toDelete && (
						<StatusMessage
							message={`Are you sure you want to delete ${toDelete.brandName}?`}
							type="warning"
							fixed={true}
							onClose={() => setToDelete(null)}
						>
							<div className="space-x-1">
								<button
									className="bg-gray-600 hover:bg-gray-500 text-white text-xs rounded font-bold cursor-pointer px-2 py-0.5"
									onClick={() => setToDelete(null)}
								>
									CANCEL
								</button>
								<button
									className="bg-rose-500 hover:bg-rose-400 text-white text-xs rounded font-bold cursor-pointer px-2 py-0.5"
									onClick={handleDeleteMedication}
								>
									CONFIRM
								</button>
							</div>
						</StatusMessage>
					)}

					<div className="space-y-3">
						{meds.length > 0 ? (
							<>
								{meds.map((med) => (
									<div
										key={med.id}
										className="border border-gray-300 p-4 rounded shadow flex items-start"
									>
										<div className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-3">
											<div>
												<span className="text-lg font-bold me-1.5">
													{med.brandName}
												</span>
												<span className="text-gray-500 text-xs ms-0.5">
													({med.dosage})
												</span>
												<p className="text-xs text-gray-500 font-semibold">
													{med.genericName}
												</p>
											</div>
											<div>
												<p className="text-xs font-semibold">
													Remaining Stock:
												</p>
												<p
													className={`text-2xl font-bold ${getStockColorClass(
														med.remainingStock
													)}`}
												>
													{med.remainingStock}
												</p>
											</div>
											<div>
												<p className="text-xs font-semibold">
													Status:
												</p>
												<span
													className={`text-xs text-white font-bold px-2.5 rounded-full ${
														med.status === "Active"
															? "bg-green-500"
															: "bg-gray-400"
													}`}
												>
													{med.status.toString().toUpperCase()}
												</span>
											</div>
											<div>
												<p className="text-xs font-semibold">
													Frequency:
												</p>
												{med.frequency &&
												med.frequency.length > 0 ? (
													<div className="mt-1.5 flex flex-wrap gap-1">
														{med.frequency.map((day, index) => (
															<span
																key={index}
																className="text-xs font-semibold rounded-full border border-gray-400 rounded px-2.5 py-0.5 shadow"
															>
																{weekDays[day].name}
															</span>
														))}
													</div>
												) : (
													<div className="mt-1.5 flex">
														<p className="text-xs font-bold rounded-full border border-gray-400 rounded px-3 py-0.5 shadow">
															Everyday
														</p>
													</div>
												)}
											</div>
											<div>
												<p className="text-xs font-semibold">
													Time Intake Schedule:
												</p>
												<div className="mt-1.5 flex flex-wrap gap-1">
													{med.dailySchedule.map((schedule) => (
														<p
															key={schedule.id}
															className="text-xs font-bold rounded-full border border-gray-400 rounded px-3 py-0.5 shadow"
														>
															{schedule.time}
														</p>
													))}
												</div>
											</div>
										</div>
										<OptionButton
											medicationId={med.id}
											options={getOptions(med.id)}
											onMenuClick={handleOptionsClick}
										/>
									</div>
								))}
								<div>
									{currentPage < lastPage ? (
										<button
											className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 w-full rounded font-semibold cursor-pointer"
											onClick={loadMoreMeds}
										>
											LOAD MORE
										</button>
									) : (
										<p className="text-sm font-semibold text-center text-gray-400">
											- End of Medications -
										</p>
									)}
								</div>
							</>
						) : (
							<>
								{isLoading ? (
									<p className="px-3 py-2 bg-gray-200 rounded">
										Loading..
									</p>
								) : (
									<div>
										<p className="px-3 py-2 bg-gray-200 rounded">
											No medications found.
										</p>
									</div>
								)}
							</>
						)}
					</div>

					{toRestock && (
						<RestockModal
							medId={toRestock}
							onClose={handleRestockClose}
						/>
					)}

					{isLoading && <Loader />}
				</div>
			</div>
		</>
	);
};

export default ListMeds;
