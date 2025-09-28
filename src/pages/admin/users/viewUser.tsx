import { useEffect, useState } from "react";
import Header from "../../../components/header";
import type { RoleInfo, UserInfo } from "../../../types";
import apiClient from "../../../utils/axiosConfig";
import Loader from "../../../components/loader";
import { useAuth } from "../../../context/AuthProvider";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusMessage from "../../../components/statusMessage";
import BreadCrumbs from "../../../components/breadCrumbs";
import { formatDate } from "../../../utils/formatters";
import { toggleBlockUser, updateUserRoles } from "../../../service/userService";

const ViewUsers = () => {
	const {
		isAuthenticated,
		user: authUser,
		hasRole,
		updateCurrentPage,
	} = useAuth();

	const { id } = useParams<{ id: string }>();

	const [user, setUser] = useState<UserInfo | null>(null);
	const [roles, setRoles] = useState<RoleInfo[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [isLoading, setIsLoading] = useState(false);

	const fetchUser = async (userId: number) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get(`/admin/users/${userId}`);
			setUser(response.data.user);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchRoles = async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.get("/admin/roles");
			setRoles(response.data.roles);
			// console.log(response);
			return response.data.roles;
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const updateRoles = async (role: string) => {
		if (!user) return;
		setIsLoading(true);
		setSuccess(null);
		setError(null);
		try {
			const response = await updateUserRoles(user.id, role);
			setSuccess(response.message);
			setUser((prevUser) => {
				if (prevUser) {
					if (prevUser.roles.includes(role)) {
						return {
							...prevUser,
							roles: prevUser.roles.filter((r) => r !== role),
						};
					} else {
						return {
							...prevUser,
							roles: [...prevUser.roles, role],
						};
					}
				}
				return prevUser;
			});
		} catch (error: any) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleBlock = async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const response = await toggleBlockUser(user.id);
			setUser((prevUser) => {
				if (prevUser) {
					return {
						...prevUser,
						is_blocked: !prevUser.is_blocked,
					};
				}
				return prevUser;
			});
			setSuccess(response.message);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!id || !isAuthenticated) return;
		const fetchAll = async () => {
			await fetchUser(parseInt(id));
			await fetchRoles();
		};
		fetchAll();
	}, [isAuthenticated, id]);

	useEffect(() => {
		updateCurrentPage("admin-users-details");
	}, []);

	const breadCrumbLinks = [
		{ id: 1, label: "Admin", path: "/admin" },
		{ id: 2, label: "Users", path: "/admin/users" },
		{ id: 3, label: "User Details", path: null },
	];

	return (
		<>
			<title>{`Users Details - Admin | ${
				import.meta.env.VITE_APP_NAME
			}`}</title>
			<Header>
				<p className="text-xl font-bold">Users Details</p>
			</Header>

			<div className="p-3">
				<BreadCrumbs links={breadCrumbLinks} className="mb-2" />

				{success && (
					<StatusMessage
						message={success}
						type="success"
						onClose={() => setSuccess(null)}
					/>
				)}
				{error && (
					<StatusMessage
						message={error}
						type="error"
						onClose={() => setError(null)}
					/>
				)}
				<div className="mt-3 space-y-3">
					{user ? (
						<>
							<div className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Full Name
									</p>
									<p className="text-sm text-gray-600">
										{user.fullname}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Email
									</p>
									<p className="text-sm text-gray-600">{user.email}</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Medications Count
									</p>
									<p className="text-lg text-gray-600 font-bold">
										{user.medications_count}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Date Joined
									</p>
									<p className="text-sm text-gray-600">
										{formatDate(user.created_at || "")}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Firebase ID
									</p>
									<p className="text-sm text-gray-600">
										{user.firebase_uid || "n/a"}
									</p>
								</div>
								{/* social */}
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Social User
									</p>
									<p
										className={`text-sm font-semibold text-gray-600 ${
											user.social_user
												? "text-green-600"
												: "text-red-500"
										}`}
									>
										{user.social_user ? "Yes" : "No"}
									</p>
								</div>
								{/* block status */}
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Account Status
									</p>
									{authUser &&
									authUser.id !== user.id &&
									hasRole("admin") ? (
										<button
											className={`text-xs mt-1 px-3 py-1 shadow-md rounded-full cursor-pointer text-white font-bold text-gray-600 ${
												user.is_blocked
													? "bg-green-500 hover:bg-green-400"
													: "bg-red-500 hover:bg-red-400"
											}`}
											onClick={toggleBlock}
										>
											{user.is_blocked
												? "ACTIVATE USER"
												: "BLOCK USER"}
										</button>
									) : (
										<span
											className={`text-xs px-2 rounded-lg text-white font-semibold text-gray-600 select-none ${
												user.is_blocked
													? "bg-red-500"
													: "bg-green-500"
											}`}
										>
											{user.is_blocked ? "BLOCKED" : "ACTIVE"}
										</span>
									)}
								</div>

								{/* roles*/}
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Roles
									</p>
									{roles.length > 0 ? (
										<div className="mt-1 flex flex-wrap gap-x-2 gap-y-1.5">
											{roles.map((role) => (
												<button
													key={role.id}
													className="border border-gray-400 text-xs font-bold rounded-full shadow cursor-pointer hover:bg-gray-100 flex items-center"
													onClick={() => updateRoles(role.name)}
												>
													<FontAwesomeIcon
														icon={`${
															user.roles.includes(role.name)
																? "circle-check"
																: "circle"
														}`}
														className={`p-1 ${
															user.roles.includes(role.name)
																? "text-green-600"
																: "text-gray-500"
														}`}
													/>
													<span className="border-s border-gray-400 px-2 py-1">
														{role.name.toUpperCase()}
													</span>
												</button>
											))}
										</div>
									) : (
										<p>
											{isLoading ? "Loading..." : "No roles found."}
										</p>
									)}
								</div>
							</div>
						</>
					) : (
						<p className="px-3 py-2 bg-gray-200 text-gray-500 rounded">
							{isLoading ? "Loading..." : "No user data found."}
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</>
	);
};

export default ViewUsers;
