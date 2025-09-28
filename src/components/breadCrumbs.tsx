import { Link } from "react-router-dom";
import type { BreadCrumbsInfo } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface BreadCrumbsProps {
	links: BreadCrumbsInfo[];
	className?: string;
}

const BreadCrumbs = ({ links, className }: BreadCrumbsProps) => {
	if (links.length == 0) {
		return <p>No breadcrumbs found.</p>;
	}

	return (
		<div
			className={`flex flex-wrap items-center text-sm text-gray-500 gap-x-0.5 gap-y-1 font-medium ${className}`}
		>
			{links.map((link, index) => (
				<div key={link.id}>
					{link.path ? (
						<Link to={link.path} className="hover:underline">
							{link.label}
						</Link>
					) : (
						<span key={link.id}>{link.label}</span>
					)}
					{index < links.length - 1 && (
						<FontAwesomeIcon icon="caret-right" />
					)}
				</div>
			))}
		</div>
	);
};

export default BreadCrumbs;
