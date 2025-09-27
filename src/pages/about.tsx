import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../components/header";
import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

const About = () => {
	const { updateCurrentPage } = useAuth();
	useEffect(() => {
		updateCurrentPage("about");
	}, []);

	return (
		<>
			<title>{`About | ${import.meta.env.VITE_APP_NAME}`}</title>

			<Header>
				<h1 className="text-xl font-bold">About Page</h1>
			</Header>
			<div className="p-4 space-y-6 text-gray-700">
				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						Our Mission
					</h2>
					<p className="leading-relaxed">
						At My Meds App, our mission is to simplify medication
						management. We believe that staying on top of your health
						should be straightforward and stress-free. We provide a
						reliable, private, and easy-to-use tool to help you manage
						your medications, track your schedule, and never miss a dose.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Key Features
					</h2>
					<ul className="space-y-3">
						<li className="flex items-start">
							<FontAwesomeIcon
								icon="circle-check"
								className="text-green-500 mt-1 mr-3"
							/>
							<span>
								<strong>Comprehensive Medication Tracking:</strong>{" "}
								Easily add, view, and manage all your medications in one
								secure place.
							</span>
						</li>
						<li className="flex items-start">
							<FontAwesomeIcon
								icon="bell"
								className="text-sky-500 mt-1 mr-3"
							/>
							<span>
								<strong>Smart Scheduling:</strong> Set up daily or
								custom weekly schedules for your intake, with a clear
								view of your daily medication plan.
							</span>
						</li>
						<li className="flex items-start">
							<FontAwesomeIcon
								icon="boxes-stacked"
								className="text-amber-500 mt-1 mr-3"
							/>
							<span>
								<strong>Stock Management:</strong> Keep an eye on your
								remaining stock and view your restock history to plan
								ahead.
							</span>
						</li>
					</ul>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						Who Is This For?
					</h2>
					<p className="leading-relaxed">
						My Meds App is designed for anyone who needs a little help
						managing their health regimen. Whether you're an individual
						with multiple medications, a caregiver managing prescriptions
						for a loved one, or simply someone who wants to be more
						organized, our app is here to support you.
					</p>
				</section>

				<footer className="text-center text-sm text-gray-500 pt-4">
					<p>Thank you for choosing {import.meta.env.VITE_APP_NAME}.</p>
				</footer>
			</div>
		</>
	);
};

export default About;
