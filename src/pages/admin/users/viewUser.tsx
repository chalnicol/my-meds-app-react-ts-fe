import { useEffect, useState } from "react";
import Header from "../../../components/header";
import type { UserInfo } from "../../../types";
import apiClient from "../../../utils/axiosConfig";
import Loader from "../../../components/loader";
import { useAuth } from "../../../context/AuthProvider";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ViewUsers = () => {
	const { isAuthenticated, updateCurrentPage } = useAuth();

	const { id } = useParams<{ id: string }>();

	const [user, setUser] = useState<UserInfo | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const fetchUser = async (userId: number) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get(`/admin/users/${userId}`);
			setUser(response.data.user);
			console.log(response);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleRole = (role: string) => {
		if (user) {
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
		}
	};

	// const updateUserRoles = async (userId: number, roles: string[]) => {
	// 	setIsLoading(true);
	// 	try {
	// 		await apiClient.patch(`/admin/users/${userId}`, {
	// 			roles,
	// 		});
	// 		setUser((prevUser) => ({
	// 			...prevUser!,
	// 			roles: roles,
	// 		}));
	// 	} catch (error) {
	// 		console.error(error);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	useEffect(() => {
		if (isAuthenticated && id) {
			fetchUser(parseInt(id));
		}
	}, [isAuthenticated, id]);

	useEffect(() => {
		updateCurrentPage("admin-users-details");
	}, []);

	const roles = [
		{ id: 1, label: "Admin", value: "admin" },
		{ id: 2, label: "Editor", value: "editor" },
		{ id: 3, label: "Spectator", value: "spectator" },
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
				<div className="mt-2 space-y-3">
					{user ? (
						<>
							<div className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
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
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Account Status
									</p>
									<div className="mt-1">
										<button
											className={`text-xs px-3 py-1 shadow-md rounded-full cursor-pointer text-white font-bold text-gray-600 ${
												user.isBlocked
													? "bg-green-500 hover:bg-green-400"
													: "bg-red-500 hover:bg-red-400"
											}`}
										>
											{user.isBlocked
												? "ACTIVATE USER"
												: "BLOCK USER"}
										</button>
									</div>
								</div>
								<div>
									<p className="text-xs text-gray-500 font-bold">
										Roles
									</p>
									<div className="mt-1 flex flex-wrap gap-x-2 gap-y-1.5">
										{roles.map((role) => (
											<button
												key={role.id}
												className="border border-gray-400 text-xs font-bold rounded-full shadow cursor-pointer hover:bg-gray-100 flex items-center"
												onClick={() => toggleRole(role.value)}
											>
												<FontAwesomeIcon
													icon={`${
														user.roles.includes(role.value)
															? "circle-check"
															: "circle"
													}`}
													className={`p-1 ${
														user.roles.includes(role.value)
															? "text-green-600"
															: "text-gray-500"
													}`}
												/>
												<span className="border-s border-gray-400 px-2 py-1">
													{role.label.toUpperCase()}
												</span>
											</button>
										))}
									</div>
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
