import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="w-full bg-gray-800 text-white py-2.5 text-center text-sm flex flex-col md:flex-row items-center justify-center gap-x-4 gap-y-1">
			<p>
				&copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}.
				All rights reserved.
			</p>
			<div className="space-x-3">
				<Link
					to="/terms-of-service"
					className="text-teal-400 hover:text-teal-300"
				>
					Terms of Service
				</Link>
				<Link
					to="/privacy-policy"
					className="text-teal-400 hover:text-teal-300"
				>
					Privacy Policy
				</Link>
			</div>
		</footer>
	);
};

export default Footer;
