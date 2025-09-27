import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="p-4">
			<div className="bg-white border border-gray-300 rounded shadow min-h-60 flex flex-col space-y-3 items-center justify-center">
				<h1 className="text-3xl sm:text-4xl text-gray-500 font-bold flex items-center">
					<FontAwesomeIcon icon="bomb" /> <span>Page Not Found</span>
				</h1>
				<p>
					The page you are looking for does not exist. Go to
					<Link
						to="/"
						className="ms-2 bg-gray-500 text-sm hover:bg-gray-400 text-white font-semibold px-3 rounded-full cursor-pointer shadow-md"
					>
						HOME
					</Link>
				</p>
			</div>
		</div>
	);
};
export default NotFound;
