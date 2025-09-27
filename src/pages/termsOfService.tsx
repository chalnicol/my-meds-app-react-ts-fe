import { useEffect } from "react";
import Header from "../components/header";
import { useAuth } from "../context/AuthProvider";

const TermsOfService = () => {
	const { updateCurrentPage } = useAuth();
	useEffect(() => {
		updateCurrentPage("terms");
	}, [updateCurrentPage]);

	return (
		<>
			<title>{`Terms of Service | ${import.meta.env.VITE_APP_NAME}`}</title>

			<Header>
				<h1 className="text-xl font-bold">Terms of Service</h1>
			</Header>
			<div className="p-4 space-y-6 text-gray-700">
				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						1. Introduction
					</h2>
					<p className="leading-relaxed">
						These Terms of Service ("Terms") govern your use of the{" "}
						{import.meta.env.VITE_APP_NAME} application ("Service")
						operated by us. By accessing or using the Service, you agree
						to be bound by these Terms. If you disagree with any part of
						the terms, then you may not access the Service.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						2. Use of Service
					</h2>
					<p className="leading-relaxed">
						{import.meta.env.VITE_APP_NAME} is a medication management
						tool. It is not a substitute for professional medical advice,
						diagnosis, or treatment. Always seek the advice of your
						physician or other qualified health provider with any
						questions you may have regarding a medical condition. Never
						disregard professional medical advice or delay in seeking it
						because of something you have read on this application.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						3. User Accounts
					</h2>
					<p className="leading-relaxed">
						When you create an account with us, you must provide us with
						information that is accurate, complete, and current at all
						times. Failure to do so constitutes a breach of the Terms,
						which may result in immediate termination of your account on
						our Service. You are responsible for safeguarding the password
						that you use to access the Service and for any activities or
						actions under your password.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						4. Limitation of Liability
					</h2>
					<p className="leading-relaxed">
						In no event shall {import.meta.env.VITE_APP_NAME}, nor its
						directors, employees, partners, agents, suppliers, or
						affiliates, be liable for any indirect, incidental, special,
						consequential or punitive damages, including without
						limitation, loss of profits, data, use, goodwill, or other
						intangible losses, resulting from your access to or use of or
						inability to access or use the Service.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						5. Changes to Terms
					</h2>
					<p className="leading-relaxed">
						We reserve the right, at our sole discretion, to modify or
						replace these Terms at any time. We will provide notice of any
						changes by posting the new Terms of Service on this page.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						6. Contact Us
					</h2>
					<p className="leading-relaxed">
						If you have any questions about these Terms, please contact us
						at: {import.meta.env.VITE_CONTACT_EMAIL}
					</p>
				</section>

				<p className="text-sm text-gray-500 mb-4">
					Last updated: {new Date().toLocaleDateString()}
				</p>
			</div>
		</>
	);
};

export default TermsOfService;
