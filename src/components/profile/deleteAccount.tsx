import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import gsap from "gsap";

const DeleteAccount = () => {
	const { isLoading, deleteAccount } = useAuth();

	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

	const confirmRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (showConfirmation && confirmRef.current) {
			gsap.fromTo(
				confirmRef.current,
				{ height: 0 },
				{
					height: "auto",
					duration: 0.6,
					ease: "elastic.out(1, 0.9)",
					transformOrigin: "top left",
				}
			);
		}
		return () => {
			if (confirmRef.current) {
				gsap.killTweensOf(confirmRef.current);
			}
		};
	}, [showConfirmation, confirmRef.current]);
	return (
		<div className="space-y-3 overflow-hidden">
			<p>This action is irreversible.</p>
			{/* <hr className="mt-2 mb-3 border-gray-400" /> */}
			{showConfirmation ? (
				<div
					ref={confirmRef}
					className="space-y-4 bg-gray-50 border border-gray-400 px-3 pt-2 pb-4 rounded shadow-md overflow-hidden"
				>
					<p>Are you sure you want to delete?</p>
					<div className="space-x-2 mt-2">
						<button
							className="bg-amber-500 hover:bg-amber-400 text-white rounded font-semibold cursor-pointer px-4 py-1.5"
							onClick={() => setShowConfirmation(false)}
							disabled={isLoading}
						>
							CANCEL
						</button>
						<button
							className="bg-rose-500 hover:bg-rose-400 text-white rounded font-semibold cursor-pointer px-4 py-1.5 disabled:opacity-60 disabled:cursor-default"
							disabled={isLoading}
							onClick={deleteAccount}
						>
							CONFIRM
						</button>
					</div>
				</div>
			) : (
				<button
					className="bg-red-500 hover:bg-red-400 border border-red-400 text-white rounded font-bold cursor-pointer px-3 py-2"
					onClick={() => setShowConfirmation(true)}
				>
					DELETE ACCOUNT
				</button>
			)}
		</div>
	);
};
export default DeleteAccount;
