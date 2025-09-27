import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MedsInfo, StockInfo } from "../../types";

import { weekDays } from "../../data";
import { Link, useParams } from "react-router-dom";
import {
	deleteMedication,
	getMedicationById,
	getStocks,
	updateMedicationStatus,
} from "../../service/medicationService";
import Loader from "../../components/loader";
import Header from "../../components/header";
import StatusMessage from "../../components/statusMessage";

import { formatDate, formatPrice } from "../../utils/formatters";
import RestockModal from "../../components/restockModal";
import useDebounce from "../../hooks/useDebounce";
import { getStockColorClass } from "../../utils/generators";

const ViewMeds = () => {
	// const { isAuthenticated } = useAuth();

	const { id } = useParams<{ id: string }>();

	const [meds, setMeds] = useState<MedsInfo | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [toDelete, setToDelete] = useState<boolean>(false);
	const [toRestock, setToRestock] = useState<boolean>(false);
	const [toEditRestock, setToEditRestock] = useState<StockInfo | null>(null);

	const [stockHistory, setStockHistory] = useState<StockInfo[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);

	const [searchTerm, setSearchTerm] = useState("");

	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchMed = async (id: number) => {
		console.log("fetching meds..");
		setIsLoading(true);
		try {
			const response = await getMedicationById(id);

			const { medication } = response;
			setMeds(medication);
			// console.log(response);
		} catch (error: any) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchStockHistory = async (
		id: number,
		page: number,
		term: string = ""
	) => {
		console.log("fetching stock history..");
		setIsLoading(true);
		try {
			const response = await getStocks(id, page, term);
			// setStockHistory(response.data);
			setStockHistory((prev) => {
				if (page === 1) {
					return response.data;
				}

				// Step 1: Filter out any new meds that are already in the previous list.
				const newUniqueEntries = response.data.filter((entry) => {
					return !prev.some((prev) => prev.id === entry.id);
				});

				// Step 2: Combine the old list with only the new, unique meds.
				return [...prev, ...newUniqueEntries];
			});

			setCurrentPage(response.meta.current_page);
			setLastPage(response.meta.last_page);
			console.log(response);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleStatus = async (medId: number) => {
		try {
			setIsLoading(true);
			setError(null);
			setSuccess(null);
			await updateMedicationStatus(medId);

			setSuccess("Medication status have been updated successfully!");

			setMeds((prev) => {
				if (!prev) return null;
				const newStatus = prev.status == "Active" ? "Inactive" : "Active";
				return {
					...prev,
					status: newStatus,
				};
			});
		} catch (error) {
			console.log(error);
			setError("Failed to update status.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteMedication = async () => {
		if (!meds) return;
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			await deleteMedication(meds.id);
			setToDelete(false);
			setMeds(null);
			setSuccess("Medication deleted successfully!");
			// fetchMeds();
		} catch (error) {
			console.log(error);
			setError("Failed to delete medication.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRestockClose = (stock: StockInfo | null = null) => {
		setToRestock(false);
		if (stock) {
			setStockHistory((prev) => [stock, ...prev]);
			setMeds((prev) => {
				if (!prev) return null;

				const newQuantity = prev.totalQuantity
					? Number(prev.totalQuantity) + stock.quantity
					: stock.quantity;
				const newValue = prev.totalValue
					? prev.totalValue + stock.price * stock.quantity
					: stock.price * stock.quantity;
				return {
					...prev,
					remainingStock: prev.remainingStock + stock.quantity,
					totalQuantity: newQuantity,
					totalValue: newValue,
				};
			});
		}
	};

	const handleEditRestockClose = (stock: StockInfo | null = null) => {
		setToEditRestock(null);

		console.log("s", stock);

		if (stock) {
			const oldStockHistory = stockHistory.find(
				(history) => history.id === stock.id
			);
			const oldStockHistoryQuantity = oldStockHistory
				? oldStockHistory.quantity
				: 0;
			const oldStockHistoryValue = oldStockHistory
				? oldStockHistory.price * oldStockHistory.quantity
				: 0;

			setStockHistory((prev) => {
				return prev.map((history) => {
					if (history.id === stock.id) {
						return {
							...history,
							quantity: stock.quantity,
							price: stock.price,
							source: stock.source,
						};
					}
					return history;
				});
			});

			setMeds((prev) => {
				if (!prev) return null;

				const newQuantity = prev.totalQuantity
					? Number(prev.totalQuantity) +
					  stock.quantity -
					  oldStockHistoryQuantity
					: stock.quantity;
				const newValue = prev.totalValue
					? prev.totalValue +
					  stock.price * stock.quantity -
					  oldStockHistoryValue
					: stock.price * stock.quantity;

				const newRemainingStock =
					prev.remainingStock + stock.quantity - oldStockHistoryQuantity;

				return {
					...prev,
					remainingStock: newRemainingStock,
					totalQuantity: newQuantity,
					totalValue: newValue,
				};
			});
		}
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleLoadMore = () => {
		if (!id) return;
		if (currentPage < lastPage) {
			fetchStockHistory(parseInt(id), currentPage + 1, debouncedSearchTerm);
		}
	};

	useEffect(() => {
		if (id) {
			fetchMed(parseInt(id));
			fetchStockHistory(parseInt(id), 1, debouncedSearchTerm);
		}
	}, [id]);

	useEffect(() => {
		if (!id) return;
		fetchStockHistory(parseInt(id), 1, debouncedSearchTerm);
	}, [id, debouncedSearchTerm]);

	return (
		<div className="w-full relative">
			<Header>
				<p className="text-xl font-bold">View Medication Details</p>
			</Header>

			{meds ? (
				<div className="p-4">
					<div className="text-xs flex gap-x-1.5 gap-y-1">
						<Link
							to={`/medications/${meds.id}/edit`}
							className="px-4 py-1 bg-amber-500 hover:bg-amber-400 text-center text-white rounded font-semibold cursor-pointer"
						>
							EDIT
						</Link>
						<button
							className="px-4 py-1 bg-rose-500 hover:bg-rose-400 text-white rounded font-semibold cursor-pointer"
							onClick={() => setToDelete(true)}
						>
							DELETE
						</button>
						<button
							className="px-4 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded font-semibold cursor-pointer"
							onClick={() => setToRestock(true)}
						>
							ADD STOCK
						</button>

						<button
							className={`py-1 text-white min-w-23 rounded font-semibold cursor-pointer ${
								meds.status === "Active"
									? "bg-neutral-400 hover:bg-neutral-300 hover:text-gray-500"
									: "bg-emerald-500 hover:bg-emerald-400"
							}`}
							onClick={() => handleToggleStatus(meds.id)}
						>
							{meds.status === "Active" ? (
								<>
									<FontAwesomeIcon
										icon="pause"
										size="xs"
										className="mr-1"
									/>
									<span>PAUSE</span>
								</>
							) : (
								<>
									<FontAwesomeIcon
										icon="play"
										size="xs"
										className="mr-1"
									/>
									<span>RESUME</span>
								</>
							)}
						</button>
					</div>
					<hr className="my-3 border-gray-300" />
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
							message={`Are you sure you want to delete ${meds.brandName}?`}
							type="warning"
							fixed={true}
							onClose={() => setToDelete(false)}
						>
							<div className="space-x-1">
								<button
									className="bg-gray-600 hover:bg-gray-500 text-white text-xs rounded font-bold cursor-pointer px-2 py-0.5"
									onClick={() => setToDelete(false)}
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

					<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
						<div>
							<span className="text-xl font-bold me-1.5">
								{meds.brandName}
							</span>
							<span className="text-gray-500 text-sm ms-0.5">
								({meds.dosage})
							</span>
							<p className="text-sm text-gray-500 font-semibold">
								{meds.genericName}
							</p>
						</div>
						<div>
							<p className="text-xs font-semibold">Remaining Stock:</p>
							<p
								className={`font-bold text-2xl ${getStockColorClass(
									meds.remainingStock
								)}`}
							>
								{meds.remainingStock}
							</p>
						</div>
						<div>
							<p className="text-xs font-semibold">Status:</p>
							<div className="mt-1.5 flex">
								<p
									className={`text-xs font-bold px-3 py-0.5 rounded-full text-white ${
										meds.status === "Active"
											? "bg-green-500"
											: "bg-gray-400"
									}`}
								>
									{meds.status}
								</p>
							</div>
						</div>
						<div>
							<p className="text-xs font-semibold">Frequency:</p>
							{meds.frequency && meds.frequency.length > 0 ? (
								<div className="mt-1.5 flex flex-wrap gap-1">
									{meds.frequency.map((day, index) => (
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
								{meds.dailySchedule.map((schedule) => (
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
					<div className="mt-5">
						<div>
							<p className="text-xs font-semibold">Restock History:</p>

							<div className="mt-2 mb-3 grid md:grid-cols-2 gap-x-3 gap-y-2  text-sm">
								<div className="border border-gray-400 rounded px-3 py-2 bg-gray-100">
									<p className="font-semibold text-sm">
										Total Purchased Amount
									</p>
									<p className="font-bold text-2xl">
										{formatPrice(meds.totalValue, "en-US", "PHP")}
									</p>
								</div>
								<div className="border border-gray-400 rounded px-3 py-2 bg-gray-100">
									<p className="font-semibold text-sm">
										Total Purchased Stock
									</p>
									<p className="font-bold text-2xl">
										{meds.totalQuantity}
									</p>
								</div>
							</div>

							<input
								type="search"
								value={searchTerm}
								onChange={handleSearchInputChange}
								className="border-b border-gray-400 w-full mb-1 focus:outline-none "
								placeholder="Filter search..."
							/>

							<div className="mt-1">
								{stockHistory.length > 0 ? (
									<>
										<div>
											{stockHistory.map((history) => (
												<div
													key={history.id}
													className="border-t last:border-b border-gray-300 px-2 py-2 text-sm even:bg-gray-50 sm:flex space-y-2 sm:space-y-0"
												>
													<div className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-2 gap-y-1">
														<div className="flex flex-wrap items-center gap-x-2">
															<p className="font-semibold w-20 ps-1 bg-gray-200">
																Date
															</p>
															<p>
																{formatDate(
																	history.createdAt || ""
																)}
															</p>
														</div>
														<div className="flex flex-wrap items-center gap-x-2">
															<p className="font-semibold w-20 ps-1 bg-gray-200">
																Source
															</p>
															<p>{history.source}</p>
														</div>
														<div className="flex flex-wrap items-center gap-x-2">
															<p className="font-semibold w-20 ps-1 bg-gray-200">
																Quantity
															</p>
															<p>{history.quantity}</p>
														</div>
														<div className="flex flex-wrap items-center gap-x-2">
															<p className="font-semibold w-20 ps-1 bg-gray-200">
																Price/Unit
															</p>
															<p>
																{formatPrice(
																	history.price,
																	"en-US",
																	"PHP"
																)}
															</p>
														</div>
														<div className="flex flex-wrap items-center gap-x-2">
															<p className="font-semibold w-20 ps-1 bg-gray-200">
																Total Cost
															</p>
															<p>
																{formatPrice(
																	history.price *
																		history.quantity,
																	"en-US",
																	"PHP"
																)}
															</p>
														</div>
													</div>
													<div className="flex-none">
														<button
															className="bg-amber-500 hover:bg-amber-400 text-white text-xs rounded font-semibold cursor-pointer px-2 py-0.5"
															onClick={() =>
																setToEditRestock(history)
															}
														>
															EDIT
														</button>
													</div>
												</div>
											))}
										</div>
										<div className="mt-3 w-full sm:max-w-sm mx-auto">
											{currentPage < lastPage ? (
												<button
													className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 w-full rounded font-semibold cursor-pointer"
													onClick={handleLoadMore}
												>
													LOAD MORE RESTOCK HISTORY
												</button>
											) : (
												<p className="text-sm font-semibold text-center text-gray-400">
													- End of Restock History -
												</p>
											)}
										</div>
									</>
								) : (
									<p className="bg-gray-100 text-gray-500 rounded px-3 py-2">
										No restock history found.
									</p>
								)}
							</div>
						</div>
					</div>

					{toRestock && (
						<RestockModal medId={meds.id} onClose={handleRestockClose} />
					)}
					{toEditRestock && (
						<RestockModal
							medId={meds.id}
							toEdit={toEditRestock}
							onClose={handleEditRestockClose}
						/>
					)}

					{/* buttons */}
				</div>
			) : (
				<div className="p-4">
					{isLoading ? "Loading..." : "No medication found."}
				</div>
			)}
			{isLoading && <Loader />}
		</div>
	);
};

export default ViewMeds;
