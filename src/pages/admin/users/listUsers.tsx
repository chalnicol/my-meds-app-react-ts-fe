import { useCallback, useEffect, useState } from "react";
import Header from "../../../components/header";
import type {
	OptionMenuInfo,
	PaginatedResponse,
	UserInfo,
} from "../../../types";
import apiClient from "../../../utils/axiosConfig";
import Loader from "../../../components/loader";
import { useAuth } from "../../../context/AuthProvider";
import useDebounce from "../../../hooks/useDebounce";
import { useNavigate, useSearchParams } from "react-router-dom";
import OptionButton from "../../../components/meds/optionButton";
import BreadCrumbs from "../../../components/breadCrumbs";
import { toggleBlockUser } from "../../../service/userService";
import StatusMessage from "../../../components/statusMessage";

const ListUsers = () => {
	const {
		isAuthenticated,
		user: authUser,
		hasRole,
		updateCurrentPage,
	} = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState<UserInfo[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);

	const searchTerm = searchParams.get("search") || "";
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchUsers = async (page: number, term: string) => {
		setIsLoading(true);
		setSuccess(null);
		setError(null);
		try {
			const response = await apiClient.get<PaginatedResponse<UserInfo>>(
				`/admin/users?page=${page}&search=${term}`
			);

			const { data, meta } = response.data;
			setUsers((prev) => {
				if (page === 1) {
					return data;
				}

				// Step 1: Filter out any new meds that are already in the previous list.
				const newUniques = data.filter((newEntry) => {
					return !prev.some((prevEntry) => prevEntry.id === newEntry.id);
				});

				// Step 2: Combine the old list with only the new, unique meds.
				return [...prev, ...newUniques];
			});

			setCurrentPage(meta.current_page);
			setLastPage(meta.last_page);
			// console.log(data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		if (isAuthenticated) {
			fetchUsers(1, debouncedSearchTerm);
		}
	}, [isAuthenticated, debouncedSearchTerm]);

	useEffect(() => {
		updateCurrentPage("admin-users");
	}, []);

	const loadMoreUsers = () => {
		if (currentPage < lastPage) {
			fetchUsers(currentPage + 1, debouncedSearchTerm);
		}
	};

	const toggleBlock = async (userId: number) => {
		setIsLoading(true);
		setSuccess(null);
		setError(null);
		try {
			const response = await toggleBlockUser(userId);
			setUsers((prev) => {
				return prev.map((user) => {
					if (user.id === userId) {
						return {
							...user,
							is_blocked: !user.is_blocked,
						};
					}
					return user;
				});
			});
			setSuccess(response.message);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());
		if (e.target.value) {
			newSearchParams.set("search", e.target.value);
		} else {
			newSearchParams.delete("search");
		}
		// Use replace: true to avoid creating new history entries for every keystroke
		setSearchParams(newSearchParams, { replace: true });
	};

	const handleOptionsClick = (id: number, optionClick: string) => {
		console.log(id, optionClick);
		switch (optionClick) {
			case "view":
				navigate(`/admin/users/${id}`);
				break;
			case "toggle":
				//
				toggleBlock(id);
				break;
			default:
			//
		}
	};

	const getOptions = useCallback(
		(userId: number): OptionMenuInfo[] => {
			const isBlocked =
				users.find((user) => user.id == userId)?.is_blocked || false;

			let arr: OptionMenuInfo[] = [];

			arr.push({ id: 1, label: "View Full Details", value: "view" });
			if (authUser && authUser.id !== userId && hasRole("admin")) {
				arr.push({
					id: 2,
					label: isBlocked ? "Unblock" : "Block",
					value: "toggle",
				});
			}
			return arr;
		},
		[users]
	);

	const breadCrumbsLinks = [
		{ id: 1, label: "Admin", path: "/admin" },
		{ id: 2, label: "Users", path: null },
	];

	return (
		<>
			<title>{`Users - Admin | ${import.meta.env.VITE_APP_NAME}`}</title>
			<Header>
				<p className="text-xl font-bold">Users</p>
			</Header>
			<div className="p-3">
				<BreadCrumbs links={breadCrumbsLinks} className="mb-2" />
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

				<input
					type="search"
					value={searchTerm}
					onChange={handleSearchInputChange}
					className="flex-1 py-1 border-b border-gray-400 w-full focus:outline-none order-1 sm:order-2"
					placeholder="Filter search users..."
				/>

				<div className="mt-2">
					{users.length > 0 ? (
						users.map((user) => (
							<div
								key={user.id}
								className={`border-t last:border-b border-gray-300 p-2 flex items-start justify-between ${
									authUser && authUser.id == user.id
										? "bg-yellow-50"
										: "odd:bg-gray-100"
								}`}
							>
								<div className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-3">
									{/* <div>
										<p className="text-xs text-gray-500 font-bold">
											ID
										</p>
										<p className="text-sm text-gray-600">
											{padNumber(user.id, 4)}
										</p>
									</div> */}
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
										<p className="text-sm text-gray-600">
											{user.email}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500 font-bold">
											Meds Count
										</p>
										<p className="text-lg text-gray-600 font-bold">
											{user.medications_count}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500 font-bold">
											Account Status
										</p>
										<span
											className={`text-xs px-2 rounded-lg text-white font-semibold text-gray-600 ${
												user.is_blocked
													? "bg-red-500"
													: "bg-green-500"
											}`}
										>
											{user.is_blocked ? "BLOCKED" : "ACTIVE"}
										</span>
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
								</div>
								<div>
									<OptionButton
										medicationId={user.id}
										options={getOptions(user.id)}
										onMenuClick={handleOptionsClick}
									/>
								</div>
							</div>
						))
					) : (
						<p className="px-3 py-2 bg-gray-200 text-gray-500 rounded">
							{isLoading ? "Loading..." : "No user data found."}
						</p>
					)}
				</div>
				<div className="mt-3">
					{currentPage < lastPage ? (
						<button
							className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 w-full rounded font-semibold cursor-pointer"
							onClick={loadMoreUsers}
						>
							LOAD MORE
						</button>
					) : (
						<p className="text-sm font-semibold text-center text-gray-400">
							- End of Users -
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</>
	);
};

export default ListUsers;
