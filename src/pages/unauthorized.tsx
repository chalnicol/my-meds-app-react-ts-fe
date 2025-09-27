import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
	return (
		<>
			<title>{`UNAUTHORIZED | ${import.meta.env.VITE_APP_NAME}`}</title>
			<div className="p-3">
				<div className="border border-gray-300 bg-white rounded shadow min-h-60 flex flex-col space-y-3 items-center justify-center">
					<h1 className="text-3xl sm:text-4xl text-gray-500 font-bold flex items-center">
						<FontAwesomeIcon icon="bomb" /> <span>Unauthorized</span>
					</h1>
					<p>
						You are not authorized to access this page. Go to
						<Link
							to="/"
							className="ms-2 text-sm bg-gray-500 hover:bg-gray-400 text-white font-semibold px-3 rounded-full cursor-pointer shadow-md"
						>
							HOME
						</Link>
					</p>
				</div>
			</div>
		</>
	);
};

export default Unauthorized;
