import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import type { OptionMenuInfo } from "../../types";

interface OptionButtonProps {
	medicationId: number;
	options: OptionMenuInfo[];
	onMenuClick: (medicationId: number, optionClick: string) => void;
}
const OptionButton = ({
	medicationId,
	options,
	onMenuClick,
}: OptionButtonProps) => {
	const [showOptions, setShowOptions] = useState<boolean>(false);

	const optionsRef = useRef<HTMLDivElement>(null);

	const containerRef = useOutsideClick<HTMLDivElement>(() => {
		setShowOptions(false);
	});

	useEffect(() => {
		if (showOptions && optionsRef.current) {
			gsap.fromTo(
				optionsRef.current,
				{ scale: 0 },
				{
					scale: 1,
					duration: 0.6,
					ease: "elastic.out(1, 0.5)",
					transformOrigin: "top right",
				}
			);
		}
		return () => {
			if (optionsRef.current) {
				gsap.killTweensOf(optionsRef.current);
			}
		};
	}, [showOptions]);

	const handleMenuClick = (option: string) => {
		setShowOptions(false);
		onMenuClick(medicationId, option);
	};

	return (
		<div ref={containerRef} className="relative">
			<button
				className="hover:bg-gray-200 cursor-pointer w-6 aspect-square rounded-full"
				onClick={() => setShowOptions((prev) => !prev)}
			>
				<FontAwesomeIcon icon="ellipsis-vertical" />
			</button>
			{showOptions && (
				<div
					ref={optionsRef}
					className="absolute min-w-32 top-0 right-full border border-gray-300 rounded bg-white shadow-md overflow-hidden"
				>
					{options.length > 0 ? (
						<>
							{options.map((option) => (
								<button
									key={option.id}
									className="w-full text-left px-2 py-1 text-sm hover:bg-gray-200 cursor-pointer"
									onClick={() => handleMenuClick(option.value)}
								>
									{option.label}
								</button>
							))}
						</>
					) : (
						<p className="w-full text-left px-2 py-1 text-sm hover:bg-gray-200 cursor-pointer">
							-no options-
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default OptionButton;
