// import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

interface ProtectedRouteProps {
	// Optional: A single role or an array of roles required
	requiredRoles?: string | string[];
	// Optional: A single permission or an array of permissions required
	requiredPermissions?: string | string[];
}

const ProtectedRoutes = ({
	requiredRoles,
	requiredPermissions,
}: ProtectedRouteProps) => {
	const { authLoading, isAuthenticated, isToVerifyEmail, hasRole, can } =
		useAuth();
	// const navigate = useNavigate();
	const location = useLocation();

	if (isToVerifyEmail) {
		return <Navigate to="/email-verification-notice" replace />;
	}

	if (!isAuthenticated) {
		// return <Navigate to="/login" replace />;
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (requiredRoles) {
		const rolesArray = Array.isArray(requiredRoles)
			? requiredRoles
			: [requiredRoles];
		const userHasRequiredRole = rolesArray.some((role) => hasRole(role));

		if (!userHasRequiredRole) {
			// Redirect to a home page, unauthorized page, or show an error
			// You could also render a specific "Access Denied" component here
			return <Navigate to="/unauthorized" replace />; // Or to a /unauthorized page
		}
	}

	if (requiredPermissions) {
		const permissionsArray = Array.isArray(requiredPermissions)
			? requiredPermissions
			: [requiredPermissions];
		const userHasRequiredPermission = permissionsArray.some((permission) =>
			can(permission)
		);

		if (!userHasRequiredPermission) {
			// Redirect to a home page, unauthorized page, or show an error
			return <Navigate to="/unauthorized" replace />; // Or to a /unauthorized page
		}
	}

	if (authLoading) {
		return null;
	}

	// useEffect(() => {
	// 	if (!isAuthenticated) {
	// 		// Redirect to the login page if not authenticated
	// 		navigate("/login", { replace: true });
	// 	}
	// }, [isAuthenticated, navigate]);

	// Render the child routes if the user is authenticated
	// return isAuthenticated ? <Outlet /> : null;
	return <Outlet />;
};

export default ProtectedRoutes;
