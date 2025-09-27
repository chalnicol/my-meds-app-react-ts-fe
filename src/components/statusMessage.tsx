import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface StatusMessageProps {
	children?: React.ReactNode;
	type: "error" | "success" | "info" | "warning" | "danger";
	message: string;
	fixed?: boolean;
	onClose: () => void;
}
const StatusMessage = ({
	children,
	message,
	type,
	fixed = false,
	onClose,
}: StatusMessageProps) => {
	const contRef = useRef<HTMLDivElement>(null);

	const openAnim = () => {
		if (contRef.current) {
			gsap.fromTo(
				contRef.current,
				{ scaleY: 0 },
				{ scaleY: 1, duration: 0.8, ease: "elastic.out(1, 0.6)" }
			);
		}
	};

	const closeAnim = () => {
		if (contRef.current) {
			gsap.to(contRef.current, {
				scaleY: 0,
				duration: 0.6,
				ease: "elastic.in(1, 0.6)",
				onComplete: onClose,
			});
		}
	};

	const getBgClass = () => {
		switch (type) {
			case "error":
				return "bg-red-500 text-white";
			case "success":
				return "bg-green-500 text-white";
			case "info":
				return "bg-teal-500 text-white";
			case "warning":
				return "bg-yellow-400 text-gray-800";
			case "danger":
				return "bg-rose-500 text-white";
			default:
				return "bg-teal-500 text-white";
		}
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		openAnim();
		if (!fixed) {
			timer = setTimeout(closeAnim, 2000);
		}
		return () => {
			clearTimeout(timer);
			if (contRef.current) {
				gsap.killTweensOf(contRef.current);
			}
		};
	}, [message]);

	// return (
	// 	<div
	// 		ref={contRef}
	// 		className={`px-3 py-2 rounded flex items-start sm:items-center gap-x-2 shadow overflow-hidden ${className} ${getBgClass()}`}
	// 	>
	// 		<div
	// 			className={`flex-1 flex flex-col sm:flex-row sm:items-center items-start justify-between gap-1`}
	// 		>
	// 			<p className="text-sm font-semibold">{message}</p>
	// 			<div>{children}</div>
	// 		</div>
	// 		<button
	// 			className="hover:bg-gray-600/20 text-white cursor-pointer"
	// 			onClick={closeAnim}
	// 		>
	// 			<FontAwesomeIcon icon="xmark" size="sm" />
	// 		</button>
	// 	</div>
	// );
	return (
		<div
			ref={contRef}
			className={`w-full mb-2 relative flex justify-between gap-x-2 rounded font-semibold px-3 pt-2 ${
				children
					? "pb-3 md:pb-2 items-start md:items-center"
					: "pb-2 items-center"
			} ${getBgClass()}`}
		>
			<div className="md:flex items-center w-full space-y-1 md:space-y-0">
				<p className="flex-1 text-sm">{message}</p>
				{children}
			</div>
			<button
				className={`px-1 cursor-pointer hover:bg-white/20`}
				onClick={closeAnim}
			>
				<FontAwesomeIcon icon="xmark" />
			</button>
		</div>
	);
};
export default StatusMessage;
