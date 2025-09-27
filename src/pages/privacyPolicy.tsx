import { useEffect } from "react";
import Header from "../components/header";
import { useAuth } from "../context/AuthProvider";

const PrivacyPolicy = () => {
	const { updateCurrentPage } = useAuth();
	useEffect(() => {
		updateCurrentPage("privacy");
	}, [updateCurrentPage]);

	return (
		<>
			<title>{`Privacy Policy | ${import.meta.env.VITE_APP_NAME}`}</title>

			<Header>
				<h1 className="text-xl font-bold">Privacy Policy</h1>
			</Header>
			<div className="p-4 space-y-6 text-gray-700">
				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						Introduction
					</h2>
					<p className="leading-relaxed">
						Welcome to {import.meta.env.VITE_APP_NAME}. We are committed
						to protecting your privacy. This Privacy Policy explains how
						we collect, use, disclose, and safeguard your information when
						you use our application. Please read this privacy policy
						carefully. If you do not agree with the terms of this privacy
						policy, please do not access the application.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						Information We Collect
					</h2>
					<p className="leading-relaxed mb-2">
						We may collect information about you in a variety of ways. The
						information we may collect via the Application includes:
					</p>
					<ul className="list-disc list-inside space-y-2">
						<li>
							<strong>Personal Data:</strong> Personally identifiable
							information, such as your name, email address, that you
							voluntarily give to us when you register with the
							Application.
						</li>
						<li>
							<strong>Health Information:</strong> Information about your
							medications, schedules, and stock that you provide to the
							Application. This information is treated with the highest
							level of confidentiality.
						</li>
						<li>
							<strong>Derivative Data:</strong> Information our servers
							automatically collect when you access the Application, such
							as your IP address, your browser type, your operating
							system, your access times.
						</li>
					</ul>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						How We Use Your Information
					</h2>
					<p className="leading-relaxed">
						Having accurate information about you permits us to provide
						you with a smooth, efficient, and customized experience.
						Specifically, we may use information collected about you via
						the Application to: create and manage your account, manage
						your medication schedule, and monitor and analyze usage and
						trends to improve your experience with the Application.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						Data Security
					</h2>
					<p className="leading-relaxed">
						We use administrative, technical, and physical security
						measures to help protect your personal information. While we
						have taken reasonable steps to secure the personal information
						you provide to us, please be aware that despite our efforts,
						no security measures are perfect or impenetrable, and no
						method of data transmission can be guaranteed against any
						interception or other type of misuse.
					</p>
				</section>

				<section className="bg-white border border-gray-300 p-6 rounded-lg shadow">
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						Contact Us
					</h2>
					<p className="leading-relaxed">
						If you have questions or comments about this Privacy Policy,
						please contact us at: {import.meta.env.VITE_CONTACT_EMAIL}
					</p>
				</section>

				<p className="text-sm text-gray-500 mb-4">
					Last updated: {new Date().toLocaleDateString()}
				</p>
			</div>
		</>
	);
};

export default PrivacyPolicy;
