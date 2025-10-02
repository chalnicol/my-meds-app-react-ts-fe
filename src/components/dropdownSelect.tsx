import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useOutsideClick } from "../hooks/useOutsideClick";

interface DropdownSelectProps<T> {
	value: T;
	options: { id: number; label: string; value: T }[];
	onChange: (value: T) => void;
	className?: string;
}

const DropdownSelect = <T,>({
	value,
	options,
	className,
	onChange,
}: DropdownSelectProps<T>) => {
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const optionsRef = useRef<HTMLDivElement>(null);

	const contRef = useOutsideClick<HTMLDivElement>(() => {
		setShowOptions(false);
	});

	// console.log(options);

	useEffect(() => {
		if (!showOptions) {
			setSearchTerm("");
		}

		if (showOptions && optionsRef.current) {
			gsap.fromTo(
				optionsRef.current,
				{ height: 0 },
				{
					height: "auto",
					duration: 0.6,
					transformOrigin: "top left",
					ease: "elastic.out(1, 0.5)",
				}
			);
		}
		return () => {
			if (optionsRef.current) {
				gsap.killTweensOf(optionsRef.current);
			}
		};
	}, [showOptions, optionsRef.current]);

	const handleSelectOption = (value: T) => {
		setShowOptions(false);
		setSearchTerm("");
		onChange(value);
	};

	const searchedOptions: { id: number; label: string; value: T }[] =
		useMemo(() => {
			return options.filter((option) =>
				option.label.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}, [options, searchTerm]);

	const selectedLabel = useMemo(() => {
		const selectedOption = options.find((option) => option.value === value);
		return selectedOption ? selectedOption.label : String(value);
	}, [options, value]);

	return (
		<div ref={contRef} className="relative">
			<div
				className={`flex overflow-hidden border border-gray-300 shadow rounded ${className}`}
				onClick={() => setShowOptions((prev) => !prev)}
			>
				<p className="px-3 py-1.5 flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
					{selectedLabel}
				</p>
				<button
					type="button"
					className="border-s border-gray-300 ps-3 pe-1.5 bg-gray-100 font-semibold cursor-pointer hover:bg-gray-200"
				>
					CHANGE
					<FontAwesomeIcon
						icon={showOptions ? "caret-up" : "caret-down"}
						className="ms-0.2"
					/>
				</button>
			</div>
			{showOptions && (
				<div
					ref={optionsRef}
					className="absolute z-20 overflow-hidden w-full rounded border border-gray-400 space-y-1 p-2 bg-white shadow-lg"
				>
					<input
						type="text"
						placeholder="search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="px-2 py-1 border border-gray-400 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
					/>
					<div className="w-full border border-gray-400 h-35.5 mt-1 overflow-y-scroll bg-gray-100">
						{searchedOptions.length > 0 ? (
							<>
								{searchedOptions.map((option) => (
									<div
										key={option.id}
										className={`flex px-2 py-0.5 items-center select-none ${
											option.value == value
												? "bg-gray-400 text-white"
												: "odd:bg-gray-200/50 even:bg-gray-50 hover:bg-teal-50 cursor-pointer"
										}`}
										onClick={() => handleSelectOption(option.value)}
									>
										<p className="flex-1">{option.label}</p>

										{option.value == value && (
											<span className="text-xs bg-gray-500 cursor-pointer text-white font-bold px-2 rounded">
												SELECTED
											</span>
										)}
									</div>
								))}
							</>
						) : (
							<p className="px-2 py-1">No options found.</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default DropdownSelect;
