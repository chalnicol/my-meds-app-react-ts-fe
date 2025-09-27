import { useEffect, useRef, useState } from "react";
// import type { StockHistoryInfo } from "../types";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addStock, updateStock } from "../service/medicationService";
import type { StockInfo } from "../types";

interface StockModalProps {
	medId: number;
	toEdit?: StockInfo;
	onClose: (stock: StockInfo | null) => void;
}

const RestockModal = ({ medId, toEdit, onClose }: StockModalProps) => {
	const [stock, setStock] = useState<{
		quantity: string;
		price: string;
		source: string;
	}>({
		quantity: toEdit ? toEdit.quantity.toString() : "",
		price: toEdit ? toEdit.price.toString() : "",
		source: toEdit ? toEdit.source : "",
	});

	const [fieldErrors, setFieldErrors] = useState<Record<
		string,
		string | null
	> | null>({
		quantity: null,
		price: null,
		source: null,
	});

	const [isLoading, setIsLoading] = useState(false);

	const contRef = useRef<HTMLDivElement>(null);

	const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setStock((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// 3. Update the stock state regardless of the error
		setIsLoading(true);
		setFieldErrors(null);
		try {
			let response: { message: string; stock: StockInfo };

			if (!toEdit) {
				response = await addStock(
					medId,
					parseInt(stock.quantity),
					parseFloat(stock.price),
					stock.source
				);
			} else {
				response = await updateStock(
					medId,
					toEdit.id,
					parseInt(stock.quantity),
					parseFloat(stock.price),
					stock.source
				);
			}
			resetForms();
			onClose(response.stock);
		} catch (error: any) {
			if (error.type == "validation") {
				setFieldErrors(error.errors);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const resetForms = () => {
		setStock({
			quantity: "",
			price: "",
			source: "",
		});
		setFieldErrors({
			quantity: null,
			price: null,
			source: null,
		});
	};

	const openAnim = () => {
		if (contRef.current) {
			gsap.fromTo(
				contRef.current,
				{
					opacity: 0,
					yPercent: -100,
				},
				{
					opacity: 1,
					yPercent: 0,
					duration: 0.8,
					ease: "elastic.out(1, 0.8)",
				}
			);
		}
	};

	const closeAnim = () => {
		if (contRef.current) {
			gsap.to(contRef.current, {
				opacity: 0,
				yPercent: -100,
				duration: 0.8,
				ease: "elastic.in(1, 0.8)",
				onComplete: () => {
					onClose(null);
				},
			});
		}
	};

	useEffect(() => {
		openAnim();
		return () => {
			if (contRef.current) {
				gsap.killTweensOf(contRef.current);
			}
		};
	}, []);

	return (
		<div className="fixed p-4 top-0 left-0 h-dvh w-full bg-gray-900/80 flex items-center justify-center overflow-y-auto">
			<div
				ref={contRef}
				className="w-full max-w-lg shadow-lg shadow-gray-600 m-auto relative"
			>
				<button
					className="absolute text-white hover:text-gray-400 font-semibold cursor-pointer rounded -top-3 -right-3"
					onClick={closeAnim}
				>
					<FontAwesomeIcon icon="xmark-circle" size="lg" />
				</button>
				<p className="px-3 py-2 bg-gray-800 text-white font-semibold rounded-t">
					{toEdit ? "Edit Restock" : "Add Stock"}
				</p>
				<div className="px-3 pt-2 pb-3 bg-white rounded-b relative">
					<form onSubmit={handleSubmit}>
						<div className="space-y-1">
							<div className="flex gap-x-4">
								<div className="flex-1">
									<label htmlFor="quantity" className="text-xs">
										Quantity
									</label>
									<input
										type="text"
										id="quantity"
										name="quantity"
										value={stock.quantity}
										onChange={handleStockChange}
										className="w-full border border-gray-400 placeholder:text-gray-500 px-2 py-1.5 rounded focus:outline-none"
										required
									/>
									{fieldErrors && fieldErrors.quantity && (
										<p className="text-red-500 text-xs">
											{fieldErrors.quantity}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label htmlFor="price" className="text-xs mt-0.5">
										Price
									</label>
									<input
										type="text"
										id="price"
										name="price"
										value={stock.price}
										onChange={handleStockChange}
										className="w-full border border-gray-400 placeholder:text-gray-500 px-2 py-1.5 rounded focus:outline-none"
										required
									/>
									{fieldErrors && fieldErrors.price && (
										<p className="text-red-500 text-xs mt-0.5">
											{fieldErrors.price}
										</p>
									)}
								</div>
							</div>
							<div>
								<label htmlFor="source" className="text-xs">
									Source Name
								</label>
								<input
									type="text"
									id="source"
									name="source"
									value={stock.source}
									onChange={handleStockChange}
									className="w-full border border-gray-400 px-2 py-1.5 rounded focus:outline-none placeholder:text-gray-400"
									required
								/>
								{fieldErrors && fieldErrors.source && (
									<p className="text-red-500 text-xs mt-0.5">
										{fieldErrors.source}
									</p>
								)}
							</div>
						</div>

						<div className="space-x-1.5 mt-3">
							<button
								type="button"
								className="bg-amber-500 font-bold text-white hover:bg-amber-400 cursor-pointer transition duration-200 rounded px-4 py-2 text-xs"
								onClick={closeAnim}
							>
								CANCEL
							</button>
							<button className="bg-sky-500 text-white hover:bg-sky-400 cursor-pointer transition duration-200 rounded px-4 py-2 text-xs font-bold">
								{toEdit ? "UPDATE" : "SUBMIT"}
							</button>
						</div>
					</form>

					{isLoading && (
						<div className="absolute w-full h-full top-0 left-0 bg-gray-900/50 flex flex-col items-center justify-center gap-y-2">
							<div className="w-8 h-auto aspect-square rounded-full border-6 border-gray-200 border-t-gray-400  animate-spin"></div>
							<div className="text-white text-sm">LOADING..</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RestockModal;
