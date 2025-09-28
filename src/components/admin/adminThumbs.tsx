import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface AdminThumbsProps {
	resource: string;
	count: number;
	icon: IconDefinition;
	buttons?: string[];
}
const AdminThumbs = ({ resource, count, buttons, icon }: AdminThumbsProps) => {
	return (
		<div className="flex flex-col bg-gray-600 text-white min-h-28 border border-gray-200 px-2 py-3 rounded relative overflow-hidden shadow-lg">
			<FontAwesomeIcon
				icon={icon}
				size="2xl"
				className="absolute top-3 -right-1 text-gray-500 -rotate-30 scale-150"
			/>
			<div className="relative leading-4 space-y-1 flex-grow">
				<p className="font-bold text-gray-400">{resource}</p>
				<p className="text-3xl font-bold">{count}</p>
			</div>
			{buttons && buttons.length > 0 && (
				<div className="mt-3 text-right space-x-1.5">
					{buttons.includes("view") && (
						<Link
							to={`/admin/${resource.toLowerCase()}`}
							className="text-xs text-white bg-amber-500 hover:bg-amber-400 font-bold cursor-pointer px-3 py-1 rounded font-semibold shadow-md"
						>
							VIEW PAGE
						</Link>
					)}
					{buttons.includes("create") && (
						<Link
							to={`/admin/${resource.toLowerCase()}`}
							className="text-xs text-white bg-sky-500 hover:bg-sky-400 font-bold cursor-pointer px-3 py-1 rounded font-semibold shadow-md"
						>
							VIEW PAGE
						</Link>
					)}
				</div>
			)}
		</div>
	);
};

export default AdminThumbs;
