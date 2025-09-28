// src/App.tsx
import { Routes, Route } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";

import {
	faCoffee,
	faCheckSquare,
	faGear,
	faCaretDown,
	faCircleInfo,
	faBasketball,
	faBars,
	faXmark,
	faCaretUp,
	faUser,
	faPlus,
	faCircleCheck,
	faXmarkCircle,
	faLock,
	faCaretRight,
	faStar,
	faAsterisk,
	faRotateRight,
	faBell,
	faTrash,
	faCircle,
	faEllipsisVertical,
	faThumbsUp,
	faThumbsDown,
	faArrowAltCircleDown,
	faQuoteLeft,
	faExternalLink,
	faEllipsis,
	faLink,
	faRectangleXmark,
	faEnvelope,
	faEnvelopeOpen,
	faCircleQuestion,
	faPlay,
	faPause,
	faHand,
	faCheck,
	faPesoSign,
	faMedkit,
	faTriangleExclamation,
	faBomb,
	faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";

import {
	faThumbsUp as farThumbsUp,
	faThumbsDown as farThumbsDown,
} from "@fortawesome/free-regular-svg-icons";

import { useAuth } from "./context/AuthProvider";
import GuestLayout from "./components/layouts/GuestLayout";
import AuthenticatedLayout from "./components/layouts/AuthenticatedLayout";
import Register from "./pages/auth/register";
import Profile from "./pages/profile";
import PublicRoutes from "./components/publicRoutes";
import CreateMeds from "./pages/meds/createMeds";
import ListMeds from "./pages/meds/listMeds";
import EditMeds from "./pages/meds/editMeds";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import Home from "./pages/home";
import About from "./pages/about";
import NotFound from "./pages/notfound";
import Login from "./pages/auth/login";
import ProtectedRoutes from "./components/protectedRoutes";
import EmailVerificationNotice from "./pages/auth/emailVerificationNotice";
import ViewMeds from "./pages/meds/viewMeds";
import AdminPage from "./pages/admin/adminPage";
import Unauthorized from "./pages/unauthorized";
import VerifyEmail from "./pages/auth/verifyEmail";
import TermsOfService from "./pages/termsOfService";
import PrivacyPolicy from "./pages/privacyPolicy";
import ListUsers from "./pages/admin/users/listUsers";
import ViewUsers from "./pages/admin/users/viewUser";

library.add(
	faCoffee,
	faCheckSquare,
	faGear,
	faCaretDown,
	faCaretUp,
	faCircleInfo,
	faBasketball,
	faBars,
	faXmark,
	faUser,
	faPlus,
	faCircleCheck,
	faXmarkCircle,
	faLock,
	faCaretRight,
	faStar,
	faAsterisk,
	faRotateRight,
	faBell,
	faTrash,
	faCircle,
	faEllipsisVertical,
	faThumbsUp,
	faThumbsDown,
	faArrowAltCircleDown,
	faQuoteLeft,
	faExternalLink,
	faEllipsis,
	faLink,
	faRectangleXmark,
	faEnvelope,
	faEnvelopeOpen,
	faCircleQuestion,
	faPlay,
	faPause,
	faBomb,
	faHand,
	faPesoSign,
	faCheck,
	faMedkit,
	faArrowTrendUp,
	faTriangleExclamation,
	farThumbsUp,
	farThumbsDown
);

const App = () => {
	const { isAuthenticated } = useAuth();

	const renderPages = (): React.ReactNode => {
		return (
			<>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/terms-of-service" element={<TermsOfService />} />
					<Route path="/privacy-policy" element={<PrivacyPolicy />} />
					<Route path="/unauthorized" element={<Unauthorized />} />

					{/* <Route path="/contact" element={<Contact />} /> */}

					<Route element={<PublicRoutes />}>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/forgot-password" element={<ForgotPassword />} />
						<Route path="/reset-password" element={<ResetPassword />} />
						<Route path="/verify" element={<VerifyEmail />} />

						<Route
							path="/email-verification-notice"
							element={<EmailVerificationNotice />}
						/>
					</Route>

					<Route element={<ProtectedRoutes />}>
						<Route path="/medications" element={<ListMeds />} />
						<Route path="/medications/:id" element={<ViewMeds />} />
						<Route path="/medications/create" element={<CreateMeds />} />
						<Route path="/medications/:id/edit" element={<EditMeds />} />

						<Route path="/profile" element={<Profile />} />

						<Route element={<ProtectedRoutes requiredRoles="admin" />}>
							<Route path="/admin" element={<AdminPage />} />

							<Route path="/admin/users" element={<ListUsers />} />
							<Route path="/admin/users/:id" element={<ViewUsers />} />
						</Route>
					</Route>

					{/* A 404 page is easy to add! */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</>
		);
	};

	if (!isAuthenticated) {
		return <GuestLayout>{renderPages()}</GuestLayout>;
	}
	return <AuthenticatedLayout>{renderPages()}</AuthenticatedLayout>;
};

export default App;
