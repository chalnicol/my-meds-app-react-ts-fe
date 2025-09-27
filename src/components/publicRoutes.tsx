import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PublicRoutes = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			// Redirect to the login page if not authenticated
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	// Render the child routes if the user is authenticated
	return <Outlet />;
};

export default PublicRoutes;
